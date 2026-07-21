import "server-only";

import {
  createBlogPost,
  updateBlogPost,
  type BlogRecord,
  type BlogRepository,
  type BlogActor,
} from "@/lib/blog/blog-service";
import {
  deleteBlogMediaPaths,
  finalizeBlogMediaUpload,
  getBlogMediaPathFromUrl,
} from "@/lib/blog/blog-media-storage";
import { BLOG_MEDIA_MAX_FILES } from "@/lib/blog/media-constants";

type PendingMediaUpload = {
  path: string;
  name: string;
  type: string;
  size: number;
  altText?: string | null;
};

type MediaMutation = {
  uploads?: PendingMediaUpload[];
  retainedMedia?: Array<{
    id: string;
    altText?: string | null;
  }>;
};

type WorkflowResult =
  | { ok: true; data: BlogRecord; warnings: string[] }
  | {
      ok: false;
      status: 400 | 403 | 404 | 409 | 500;
      error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseUploads(value: unknown): PendingMediaUpload[] | null {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const uploads: PendingMediaUpload[] = [];

  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.path !== "string" ||
      typeof item.name !== "string" ||
      typeof item.type !== "string" ||
      typeof item.size !== "number"
    ) {
      return null;
    }

    uploads.push({
      path: item.path,
      name: item.name,
      type: item.type,
      size: item.size,
      altText: typeof item.altText === "string" ? item.altText : null,
    });
  }

  return uploads;
}

function parseRetainedMedia(
  value: unknown,
): Array<{ id: string; altText: string | null }> | null {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const retained: Array<{ id: string; altText: string | null }> = [];

  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== "string") {
      return null;
    }

    retained.push({
      id: item.id,
      altText: typeof item.altText === "string" ? item.altText : null,
    });
  }

  return retained;
}

async function cleanupPaths(paths: string[]): Promise<string[]> {
  try {
    await deleteBlogMediaPaths(paths);
    return [];
  } catch (error) {
    console.error("Blog media cleanup failed.", error);
    return ["Some unused media could not be removed from storage."];
  }
}

export async function createBlogPostWithUploads(
  body: unknown,
  actor: BlogActor,
  repository: BlogRepository,
): Promise<WorkflowResult> {
  if (!isRecord(body)) {
    return { ok: false, status: 400, error: "Invalid blog payload." };
  }

  const uploads = parseUploads((body as MediaMutation).uploads);

  if (!uploads || uploads.length > BLOG_MEDIA_MAX_FILES) {
    return {
      ok: false,
      status: 400,
      error: `A blog post can have at most ${BLOG_MEDIA_MAX_FILES} media attachments.`,
    };
  }

  const pendingPaths = uploads.map((upload) => upload.path);
  const finalized = [];

  try {
    for (const upload of uploads) {
      const media = await finalizeBlogMediaUpload(upload);
      finalized.push({
        ...media,
        altText: upload.altText?.trim() || null,
      });
    }
  } catch (error) {
    await cleanupPaths([
      ...pendingPaths,
      ...finalized.map((media) => media.path),
    ]);
    return {
      ok: false,
      status: 400,
      error:
        error instanceof Error
          ? error.message
          : "The uploaded media could not be verified.",
    };
  }

  try {
    const result = await createBlogPost(
      {
        ...body,
        media: finalized.map((media, index) => ({
          url: media.url,
          altText: media.altText,
          mimeType: media.mimeType,
          sizeBytes: media.sizeBytes,
          displayOrder: index,
        })),
      },
      actor,
      repository,
    );

    if (!result.ok) {
      await cleanupPaths(finalized.map((media) => media.path));
      return result;
    }

    return { ...result, warnings: [] };
  } catch (error) {
    await cleanupPaths(finalized.map((media) => media.path));
    throw error;
  }
}

export async function updateBlogPostWithUploads(
  id: string,
  body: unknown,
  actor: BlogActor,
  repository: BlogRepository,
): Promise<WorkflowResult> {
  if (!isRecord(body)) {
    return { ok: false, status: 400, error: "Invalid blog payload." };
  }

  const current = await repository.findById(id);

  if (!current) {
    return { ok: false, status: 404, error: "Blog post not found." };
  }

  if (actor.role === "BLOGGER" && current.authorId !== actor.id) {
    return {
      ok: false,
      status: 403,
      error: "You can only edit media on your own blog drafts.",
    };
  }

  if (actor.role === "BLOGGER" && current.status !== "DRAFT") {
    return {
      ok: false,
      status: 403,
      error: "Published or archived posts can only be changed by an administrator.",
    };
  }

  const uploads = parseUploads((body as MediaMutation).uploads);
  const retained = parseRetainedMedia((body as MediaMutation).retainedMedia);

  if (!uploads || !retained) {
    return { ok: false, status: 400, error: "Invalid blog media payload." };
  }

  if (
    actor.role === "BLOGGER" &&
    uploads.some((upload) => !upload.path.startsWith(`pending/${actor.id}/`))
  ) {
    return { ok: false, status: 403, error: "Invalid media upload owner." };
  }

  if (uploads.length + retained.length > BLOG_MEDIA_MAX_FILES) {
    return {
      ok: false,
      status: 400,
      error: `A blog post can have at most ${BLOG_MEDIA_MAX_FILES} media attachments.`,
    };
  }

  const retainedIds = new Set(retained.map((media) => media.id));
  const currentById = new Map(current.media.map((media) => [media.id, media]));

  if (
    retainedIds.size !== retained.length ||
    retained.some((media) => !currentById.has(media.id))
  ) {
    return {
      ok: false,
      status: 400,
      error: "One or more retained media records are invalid.",
    };
  }

  const finalized = [];

  try {
    for (const upload of uploads) {
      const media = await finalizeBlogMediaUpload(upload);
      finalized.push({
        ...media,
        altText: upload.altText?.trim() || null,
      });
    }
  } catch (error) {
    await cleanupPaths([
      ...uploads.map((upload) => upload.path),
      ...finalized.map((media) => media.path),
    ]);
    return {
      ok: false,
      status: 400,
      error:
        error instanceof Error
          ? error.message
          : "The uploaded media could not be verified.",
    };
  }

  const retainedInputs = retained.map((media, index) => {
    const currentMedia = currentById.get(media.id)!;
    return {
      url: currentMedia.url,
      altText: media.altText?.trim() || null,
      mimeType: currentMedia.mimeType,
      sizeBytes: currentMedia.sizeBytes,
      displayOrder: index,
    };
  });

  try {
    const result = await updateBlogPost(
      id,
      {
        ...body,
        media: [
          ...retainedInputs,
          ...finalized.map((media, index) => ({
            url: media.url,
            altText: media.altText,
            mimeType: media.mimeType,
            sizeBytes: media.sizeBytes,
            displayOrder: retainedInputs.length + index,
          })),
        ],
      },
      actor,
      repository,
    );

    if (!result.ok) {
      await cleanupPaths(finalized.map((media) => media.path));
      return result;
    }

    const removedPaths = current.media
      .filter((media) => !retainedIds.has(media.id))
      .map((media) => getBlogMediaPathFromUrl(media.url))
      .filter((path): path is string => Boolean(path));
    const warnings = await cleanupPaths(removedPaths);

    return { ...result, warnings };
  } catch (error) {
    await cleanupPaths(finalized.map((media) => media.path));
    throw error;
  }
}

export async function deleteStoredBlogMedia(
  blog: BlogRecord,
): Promise<string[]> {
  const paths = blog.media
    .map((media) => getBlogMediaPathFromUrl(media.url))
    .filter((path): path is string => Boolean(path));

  return cleanupPaths(paths);
}
