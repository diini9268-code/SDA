import type { Metadata } from "next";

export const siteName = "Somali Student Diplomacy Union";
export const siteShortName = "SSDU";
export const siteDescription =
  "Student-led diplomacy, leadership, programs, publications, membership, and civic engagement platform.";

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
      "Somali Student Diplomacy Union",
      "SSDU",
      "Somali diplomacy",
      "student leadership",
      "policy research",
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
