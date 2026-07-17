import { describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  createPageMetadata,
  getAbsoluteUrl,
  getSiteUrl,
} from "@/lib/site/metadata";

vi.mock("@/lib/archive/archive-repository", () => ({
  prismaArchiveRepository: {
    listPublic: vi.fn(async () => []),
  },
}));

vi.mock("@/lib/blog/blog-repository", () => ({
  prismaBlogRepository: {
    listPublic: vi.fn(async () => []),
  },
}));

describe("SEO metadata", () => {
  it("builds absolute URLs from NEXT_PUBLIC_APP_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://sda.example");

    expect(getSiteUrl().origin).toBe("https://sda.example");
    expect(getAbsoluteUrl("/blog")).toBe("https://sda.example/blog");

    vi.unstubAllEnvs();
  });

  it("creates canonical page metadata", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://sda.example");

    const metadata = createPageMetadata({
      title: "About",
      description: "About SDA.",
      path: "/about",
    });

    expect(metadata.title).toBe("About | SDA");
    expect(metadata.description).toBe("About SDA.");
    expect(metadata.alternates).toEqual({
      canonical: "https://sda.example/about",
    });

    vi.unstubAllEnvs();
  });

  it("generates robots rules that block admin routes", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://sda.example");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
      sitemap: "https://sda.example/sitemap.xml",
      host: "https://sda.example",
    });

    vi.unstubAllEnvs();
  });

  it("generates public sitemap entries", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://sda.example");

    const entries = await sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "https://sda.example/" }),
        expect.objectContaining({ url: "https://sda.example/about" }),
        expect.objectContaining({ url: "https://sda.example/blog" }),
        expect.objectContaining({ url: "https://sda.example/contact" }),
      ]),
    );

    vi.unstubAllEnvs();
  });
});
