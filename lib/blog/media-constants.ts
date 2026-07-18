export const BLOG_MEDIA_MAX_FILES = 10;
export const BLOG_MEDIA_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const BLOG_MEDIA_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;

export const BLOG_MEDIA_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.gif,.pdf,image/jpeg,image/png,image/webp,image/gif,application/pdf";

export type BlogMediaMimeType =
  (typeof BLOG_MEDIA_ALLOWED_MIME_TYPES)[number];

const allowedMimeTypes = new Set<string>(BLOG_MEDIA_ALLOWED_MIME_TYPES);

export function isAllowedBlogMediaMimeType(
  value: string,
): value is BlogMediaMimeType {
  return allowedMimeTypes.has(value);
}
