import { describe, expect, it } from "vitest";
import {
  matchesDeclaredFileType,
  validateUploadMetadata,
} from "@/lib/blog/media-file-validation";

describe("blog media file validation", () => {
  it("accepts supported files within the configured limit", () => {
    expect(
      validateUploadMetadata({
        name: "program-photo.webp",
        type: "image/webp",
        size: 250_000,
      }),
    ).toEqual({
      ok: true,
      data: {
        name: "program-photo.webp",
        type: "image/webp",
        size: 250_000,
      },
    });
  });

  it("rejects unsupported file types and files over 10 MB", () => {
    expect(
      validateUploadMetadata({
        name: "script.svg",
        type: "image/svg+xml",
        size: 100,
      }),
    ).toMatchObject({ ok: false });

    expect(
      validateUploadMetadata({
        name: "large-photo.jpg",
        type: "image/jpeg",
        size: 10 * 1024 * 1024 + 1,
      }),
    ).toEqual({
      ok: false,
      error: "large-photo.jpg is larger than the 10 MB limit.",
    });
  });

  it("verifies file signatures instead of trusting extensions", () => {
    expect(
      matchesDeclaredFileType(
        Uint8Array.from([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        ]),
        "image/png",
      ),
    ).toBe(true);
    expect(
      matchesDeclaredFileType(
        Uint8Array.from([0x3c, 0x73, 0x76, 0x67]),
        "image/png",
      ),
    ).toBe(false);
    expect(
      matchesDeclaredFileType(
        Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d]),
        "application/pdf",
      ),
    ).toBe(true);
  });
});
