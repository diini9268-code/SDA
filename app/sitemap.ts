import type { MetadataRoute } from "next";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { getAbsoluteUrl } from "@/lib/site/metadata";

type SitemapEntry = MetadataRoute.Sitemap[number];

const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: SitemapEntry["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leadership", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/archive", priority: 0.7, changeFrequency: "monthly" },
  { path: "/membership", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
];

async function getDynamicRoutes(): Promise<SitemapEntry[]> {
  try {
    const [posts, archive] = await Promise.all([
      prismaBlogRepository.listPublic(),
      prismaArchiveRepository.listPublic(),
    ]);

    return [
      ...posts.map((post) => ({
        url: getAbsoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...archive.map((entry) => ({
        url: getAbsoluteUrl(`/archive/${entry.slug}`),
        lastModified: entry.updatedAt,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = staticRoutes.map((route) => ({
    url: getAbsoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...(await getDynamicRoutes())];
}
