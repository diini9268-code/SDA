import type { MetadataRoute } from "next";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: getSiteUrl().origin,
  };
}
