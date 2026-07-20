import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  BLOG_MEDIA_ALLOWED_MIME_TYPES,
  BLOG_MEDIA_MAX_SIZE_BYTES,
  type BlogMediaMimeType,
} from "@/lib/blog/media-constants";
import {
  matchesDeclaredFileType,
  validateUploadMetadata,
} from "@/lib/blog/media-file-validation";

const PENDING_PREFIX = "pending/";
const STORED_PREFIXES = ["blog/", "leadership/", "archive/", "program/", "site/"] as const;
const STALE_PENDING_AGE_MS = 24 * 60 * 60 * 1000;

export type MediaDestination = "blog" | "leadership" | "archive" | "program" | "site";

export type SignedBlogMediaUpload = {
  path: string;
  signedUrl: string;
};

export type FinalizedBlogMedia = {
  path: string;
  url: string;
  mimeType: BlogMediaMimeType;
  sizeBytes: number;
};

type StorageConfiguration = {
  url: string;
  serviceRoleKey: string;
  bucket: string;
};

function getStorageConfiguration(): StorageConfiguration {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim();

  if (!url || !serviceRoleKey || !bucket) {
    throw new Error(
      "Blog media storage is not configured. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET are required.",
    );
  }

  return { url, serviceRoleKey, bucket };
}

let cachedClient: SupabaseClient | null = null;
let cachedClientKey = "";

function getStorageClient(): SupabaseClient {
  const config = getStorageConfiguration();
  const key = `${config.url}:${config.serviceRoleKey}`;

  if (!cachedClient || cachedClientKey !== key) {
    cachedClient = createClient(config.url, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    cachedClientKey = key;
  }

  return cachedClient;
}

function sanitizeFileName(value: string): string {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-120);

  return normalized || "upload";
}

function isPendingPath(path: string): boolean {
  return (
    path.startsWith(PENDING_PREFIX) &&
    !path.includes("..") &&
    !path.includes("\\")
  );
}

function isOwnedPath(path: string): boolean {
  return (
    (path.startsWith(PENDING_PREFIX) ||
      STORED_PREFIXES.some((prefix) => path.startsWith(prefix))) &&
    !path.includes("..") &&
    !path.includes("\\")
  );
}

async function ensureBucket(): Promise<void> {
  const client = getStorageClient();
  const { bucket } = getStorageConfiguration();
  const { data, error } = await client.storage.getBucket(bucket);

  if (error && error.statusCode !== "404") {
    throw new Error(`Unable to inspect the blog media bucket: ${error.message}`);
  }

  if (!data) {
    const { error: createError } = await client.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: BLOG_MEDIA_MAX_SIZE_BYTES,
      allowedMimeTypes: [...BLOG_MEDIA_ALLOWED_MIME_TYPES],
    });

    if (createError) {
      throw new Error(
        `Unable to create the blog media bucket: ${createError.message}`,
      );
    }
    return;
  }

  const needsUpdate =
    !data.public ||
    data.file_size_limit !== BLOG_MEDIA_MAX_SIZE_BYTES ||
    JSON.stringify([...(data.allowed_mime_types ?? [])].sort()) !==
      JSON.stringify([...BLOG_MEDIA_ALLOWED_MIME_TYPES].sort());

  if (needsUpdate) {
    const { error: updateError } = await client.storage.updateBucket(bucket, {
      public: true,
      fileSizeLimit: BLOG_MEDIA_MAX_SIZE_BYTES,
      allowedMimeTypes: [...BLOG_MEDIA_ALLOWED_MIME_TYPES],
    });

    if (updateError) {
      throw new Error(
        `Unable to configure the blog media bucket: ${updateError.message}`,
      );
    }
  }
}

async function cleanupStalePendingUploads(): Promise<void> {
  const client = getStorageClient();
  const { bucket } = getStorageConfiguration();
  const { data, error } = await client.storage.from(bucket).list("pending", {
    limit: 100,
    sortBy: { column: "created_at", order: "asc" },
  });

  if (error || !data) {
    return;
  }

  const cutoff = Date.now() - STALE_PENDING_AGE_MS;
  const stalePaths = data
    .filter((item) => {
      const createdAt = item.created_at
        ? new Date(item.created_at).getTime()
        : Number.NaN;
      return Number.isFinite(createdAt) && createdAt < cutoff;
    })
    .map((item) => `${PENDING_PREFIX}${item.name}`);

  if (stalePaths.length > 0) {
    await client.storage.from(bucket).remove(stalePaths);
  }
}

export async function createSignedBlogMediaUpload(input: {
  name: string;
  type: string;
  size: number;
}): Promise<SignedBlogMediaUpload> {
  const validated = validateUploadMetadata(input);

  if (!validated.ok) {
    throw new Error(validated.error);
  }

  await ensureBucket();
  void cleanupStalePendingUploads();

  const client = getStorageClient();
  const { bucket } = getStorageConfiguration();
  const path = `${PENDING_PREFIX}${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(validated.data.name)}`;
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(`Unable to prepare the upload: ${error?.message ?? "Unknown storage error."}`);
  }

  return {
    path,
    signedUrl: data.signedUrl,
  };
}

export async function finalizeMediaUpload(input: {
  path: string;
  name: string;
  type: string;
  size: number;
  destination: MediaDestination;
}): Promise<FinalizedBlogMedia> {
  const validated = validateUploadMetadata(input);

  if (!validated.ok) {
    throw new Error(validated.error);
  }

  if (!isPendingPath(input.path)) {
    throw new Error("The uploaded file path is invalid.");
  }

  const client = getStorageClient();
  const { bucket } = getStorageConfiguration();
  const storage = client.storage.from(bucket);
  const { data: info, error: infoError } = await storage.info(input.path);

  if (infoError || !info) {
    throw new Error(
      `The uploaded file could not be verified: ${infoError?.message ?? "File not found."}`,
    );
  }

  const actualSize = Number(info.size);
  const actualType =
    typeof info.metadata?.mimetype === "string"
      ? info.metadata.mimetype
      : validated.data.type;
  const actualMetadata = validateUploadMetadata({
    name: validated.data.name,
    type: actualType,
    size: actualSize,
  });

  if (
    !actualMetadata.ok ||
    actualMetadata.data.type !== validated.data.type ||
    actualMetadata.data.size !== validated.data.size
  ) {
    await storage.remove([input.path]);
    throw new Error(
      actualMetadata.ok
        ? "The uploaded file metadata does not match the selected file."
        : actualMetadata.error,
    );
  }

  const { data: blob, error: downloadError } = await storage.download(input.path);

  if (downloadError || !blob) {
    await storage.remove([input.path]);
    throw new Error(
      `The uploaded file could not be inspected: ${downloadError?.message ?? "Download failed."}`,
    );
  }

  const signature = new Uint8Array(await blob.slice(0, 16).arrayBuffer());

  if (!matchesDeclaredFileType(signature, actualMetadata.data.type)) {
    await storage.remove([input.path]);
    throw new Error(
      `${validated.data.name} does not match its declared file type.`,
    );
  }

  const finalPath = `${input.destination}/${crypto.randomUUID()}-${sanitizeFileName(validated.data.name)}`;
  const { error: moveError } = await storage.move(input.path, finalPath);

  if (moveError) {
    await storage.remove([input.path]);
    throw new Error(`Unable to finalize the upload: ${moveError.message}`);
  }

  const { data: publicUrl } = storage.getPublicUrl(finalPath);

  return {
    path: finalPath,
    url: publicUrl.publicUrl,
    mimeType: actualMetadata.data.type,
    sizeBytes: actualMetadata.data.size,
  };
}

export async function finalizeBlogMediaUpload(
  input: Omit<Parameters<typeof finalizeMediaUpload>[0], "destination">,
): Promise<FinalizedBlogMedia> {
  return finalizeMediaUpload({ ...input, destination: "blog" });
}

export async function deleteBlogMediaPaths(paths: string[]): Promise<void> {
  const ownedPaths = Array.from(new Set(paths.filter(isOwnedPath)));

  if (ownedPaths.length === 0) {
    return;
  }

  const client = getStorageClient();
  const { bucket } = getStorageConfiguration();
  const { error } = await client.storage.from(bucket).remove(ownedPaths);

  if (error) {
    throw new Error(`Unable to remove blog media: ${error.message}`);
  }
}

export async function deletePendingBlogMediaPaths(
  paths: string[],
): Promise<void> {
  await deleteBlogMediaPaths(paths.filter(isPendingPath));
}

export function getBlogMediaPathFromUrl(url: string): string | null {
  const { url: projectUrl, bucket } = getStorageConfiguration();

  try {
    const publicUrl = new URL(url);
    const expectedOrigin = new URL(projectUrl).origin;
    const prefix = `/storage/v1/object/public/${encodeURIComponent(bucket)}/`;

    if (
      publicUrl.origin !== expectedOrigin ||
      !publicUrl.pathname.startsWith(prefix)
    ) {
      return null;
    }

    const path = decodeURIComponent(publicUrl.pathname.slice(prefix.length));
    return isOwnedPath(path) ? path : null;
  } catch {
    return null;
  }
}
