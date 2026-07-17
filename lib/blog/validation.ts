export type BlogStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlogMediaInput = {
  url: string;
  altText: string | null;
  mimeType: string;
  sizeBytes: number | null;
  displayOrder: number;
};

export type BlogCreateData = {
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  status: BlogStatusValue;
  publishedAt: Date;
  media: BlogMediaInput[];
};

export type BlogUpdateData = Partial<BlogCreateData>;

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

const validStatuses = new Set<BlogStatusValue>([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const maxMediaSizeBytes = 10 * 1024 * 1024;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function formatPublicationDateInput(value: Date): string {
  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readRequiredString(
  source: Record<string, unknown>,
  field: string,
  maxLength: number,
): string | null {
  const value = source[field];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.length > maxLength) {
    return null;
  }

  return trimmedValue;
}

function readOptionalString(
  source: Record<string, unknown>,
  field: string,
  maxLength: number,
): string | null {
  const value = source[field];

  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.length > maxLength) {
    return null;
  }

  return trimmedValue;
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function readStatus(source: Record<string, unknown>): BlogStatusValue {
  const value = source.status;

  if (typeof value === "string" && validStatuses.has(value as BlogStatusValue)) {
    return value as BlogStatusValue;
  }

  return "DRAFT";
}

function readPublishedAt(source: Record<string, unknown>): Date | null {
  const value = source.publishedAt;

  if (typeof value !== "string" && !(value instanceof Date)) {
    return null;
  }

  if (typeof value === "string" && dateOnlyPattern.test(value)) {
    const date = new Date(`${value}T00:00:00.000Z`);

    return formatPublicationDateInput(date) === value ? date : null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function readMediaUrl(source: Record<string, unknown>): string | null {
  const url = readRequiredString(source, "url", 2048);

  if (!url || url.startsWith("data:") || !/^\/|^https:\/\//.test(url)) {
    return null;
  }

  return url;
}

function readMimeType(source: Record<string, unknown>): string | null {
  const mimeType = readRequiredString(source, "mimeType", 120);

  if (!mimeType || !allowedMimeTypes.has(mimeType)) {
    return null;
  }

  return mimeType;
}

function readSizeBytes(source: Record<string, unknown>): number | null {
  const value = source.sizeBytes;

  if (value == null || value === "") {
    return null;
  }

  const parsedValue = typeof value === "number" ? value : Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 0 ||
    parsedValue > maxMediaSizeBytes
  ) {
    return null;
  }

  return parsedValue;
}

function readDisplayOrder(
  source: Record<string, unknown>,
  fallback: number,
): number {
  const value = source.displayOrder;

  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return fallback;
  }

  return value;
}

function parseMedia(value: unknown): ValidationResult<BlogMediaInput[]> {
  if (value == null) {
    return { ok: true, data: [] };
  }

  if (!Array.isArray(value)) {
    return {
      ok: false,
      error: "Blog media must be an array of media records.",
    };
  }

  if (value.length > 10) {
    return {
      ok: false,
      error: "A blog post can have at most 10 media attachments.",
    };
  }

  const media: BlogMediaInput[] = [];

  for (const [index, item] of value.entries()) {
    if (!isRecord(item)) {
      return {
        ok: false,
        error: "Invalid blog media record.",
      };
    }

    const url = readMediaUrl(item);
    const mimeType = readMimeType(item);
    const sizeBytes = readSizeBytes(item);

    if (!url || !mimeType || sizeBytes === null && item.sizeBytes) {
      return {
        ok: false,
        error:
          "Blog media requires valid url, mimeType, and optional sizeBytes fields.",
      };
    }

    media.push({
      url,
      mimeType,
      sizeBytes,
      altText: readOptionalString(item, "altText", 220),
      displayOrder: readDisplayOrder(item, index),
    });
  }

  return { ok: true, data: media };
}

export function parseBlogCreateInput(
  value: unknown,
): ValidationResult<BlogCreateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid blog payload.",
    };
  }

  const title = readRequiredString(value, "title", 220);
  const category = readRequiredString(value, "category", 120);
  const content = readRequiredString(value, "content", 20000);
  const publishedAt = readPublishedAt(value);
  const media = parseMedia(value.media);

  if (!title || !category || !content || !publishedAt) {
    return {
      ok: false,
      error: "Blog requires valid title, category, content, and publishedAt fields.",
    };
  }

  if (!media.ok) {
    return media;
  }

  return {
    ok: true,
    data: {
      title,
      slug: createSlug(title),
      category,
      content,
      publishedAt,
      media: media.data,
      excerpt: readOptionalString(value, "excerpt", 500),
      status: readStatus(value),
    },
  };
}

export function parseBlogUpdateInput(
  value: unknown,
): ValidationResult<BlogUpdateData> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Invalid blog payload.",
    };
  }

  const data: BlogUpdateData = {};

  if ("title" in value) {
    const title = readRequiredString(value, "title", 220);
    if (!title) {
      return { ok: false, error: "Invalid title." };
    }
    data.title = title;
    data.slug = createSlug(title);
  }

  if ("category" in value) {
    const category = readRequiredString(value, "category", 120);
    if (!category) {
      return { ok: false, error: "Invalid category." };
    }
    data.category = category;
  }

  if ("excerpt" in value) {
    data.excerpt = readOptionalString(value, "excerpt", 500);
  }

  if ("content" in value) {
    const content = readRequiredString(value, "content", 20000);
    if (!content) {
      return { ok: false, error: "Invalid content." };
    }
    data.content = content;
  }

  if ("publishedAt" in value) {
    const publishedAt = readPublishedAt(value);
    if (!publishedAt) {
      return { ok: false, error: "Invalid publishedAt." };
    }
    data.publishedAt = publishedAt;
  }

  if ("status" in value) {
    if (
      typeof value.status !== "string" ||
      !validStatuses.has(value.status as BlogStatusValue)
    ) {
      return { ok: false, error: "Invalid status." };
    }
    data.status = value.status as BlogStatusValue;
  }

  if ("media" in value) {
    const media = parseMedia(value.media);
    if (!media.ok) {
      return media;
    }
    data.media = media.data;
  }

  if (Object.keys(data).length === 0) {
    return {
      ok: false,
      error: "At least one blog field is required.",
    };
  }

  return { ok: true, data };
}
