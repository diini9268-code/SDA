import type { Metadata } from "next";

export const siteName = "Somali Diplomacy Association";
export const siteShortName = "SDA";
export const siteDescription =
  "An independent, youth-led organization empowering Somali youth through diplomatic education, leadership development, and international engagement.";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return new URL(configuredUrl);
  }

  return new URL("http://localhost:3000");
}

export function getAbsoluteUrl(path = "/"): string {
  return new URL(path, getSiteUrl()).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteShortName}` : siteName;
  const url = getAbsoluteUrl(path);

  return {
    title: pageTitle,
    description,
    keywords: [
      "Somali Diplomacy Association",
      "SDA",
      "Somali diplomacy",
      "youth leadership",
      "diplomatic education",
      "international relations",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
    },
  };
}
