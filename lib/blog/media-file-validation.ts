import {
  BLOG_MEDIA_MAX_SIZE_BYTES,
  isAllowedBlogMediaMimeType,
  type BlogMediaMimeType,
} from "@/lib/blog/media-constants";

export type UploadFileMetadata = {
  name: string;
  type: string;
  size: number;
};

export type ValidatedUploadMetadata = UploadFileMetadata & {
  type: BlogMediaMimeType;
};

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function validateUploadMetadata(
  value: UploadFileMetadata,
): ValidationResult<ValidatedUploadMetadata> {
  if (!value.name.trim()) {
    return { ok: false, error: "The selected file must have a name." };
  }

  if (!isAllowedBlogMediaMimeType(value.type)) {
    return {
      ok: false,
      error: `${value.name} is not a supported file type. Use JPG, PNG, WebP, GIF, or PDF.`,
    };
  }

  if (!Number.isInteger(value.size) || value.size <= 0) {
    return { ok: false, error: `${value.name} is empty or unreadable.` };
  }

  if (value.size > BLOG_MEDIA_MAX_SIZE_BYTES) {
    return {
      ok: false,
      error: `${value.name} is larger than the 10 MB limit.`,
    };
  }

  return {
    ok: true,
    data: {
      ...value,
      name: value.name.trim(),
      type: value.type,
    },
  };
}

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end));
}

export function matchesDeclaredFileType(
  bytes: Uint8Array,
  mimeType: BlogMediaMimeType,
): boolean {
  if (mimeType === "image/jpeg") {
    return startsWith(bytes, [0xff, 0xd8, 0xff]);
  }

  if (mimeType === "image/png") {
    return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }

  if (mimeType === "image/webp") {
    return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP";
  }

  if (mimeType === "image/gif") {
    const header = ascii(bytes, 0, 6);
    return header === "GIF87a" || header === "GIF89a";
  }

  return ascii(bytes, 0, 5) === "%PDF-";
}
