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

vi.mock("@/lib/programs/program-repository", () => ({
  prismaProgramRepository: {
    listPublic: vi.fn(async () => []),
  },
}));

describe("SEO metadata", () => {
  it("builds absolute URLs from NEXT_PUBLIC_APP_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://ssdu.example");

    expect(getSiteUrl().origin).toBe("https://ssdu.example");
    expect(getAbsoluteUrl("/blog")).toBe("https://ssdu.example/blog");

    vi.unstubAllEnvs();
  });

  it("creates canonical page metadata", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://ssdu.example");

    const metadata = createPageMetadata({
      title: "Programs",
      description: "SSDU programs.",
      path: "/programs",
    });

    expect(metadata.title).toBe("Programs | SSDU");
    expect(metadata.description).toBe("SSDU programs.");
    expect(metadata.alternates).toEqual({
      canonical: "https://ssdu.example/programs",
    });

    vi.unstubAllEnvs();
  });

  it("generates robots rules that block admin routes", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://ssdu.example");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
      sitemap: "https://ssdu.example/sitemap.xml",
      host: "https://ssdu.example",
    });

    vi.unstubAllEnvs();
  });

  it("generates public sitemap entries", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://ssdu.example");

    const entries = await sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "https://ssdu.example/" }),
        expect.objectContaining({ url: "https://ssdu.example/about" }),
        expect.objectContaining({ url: "https://ssdu.example/blog" }),
        expect.objectContaining({ url: "https://ssdu.example/contact" }),
      ]),
    );

    vi.unstubAllEnvs();
  });
});
