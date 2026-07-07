import type { Metadata } from "next";
import {
  getAbsoluteUrl,
  siteDescription,
  siteName,
  siteShortName,
} from "@/lib/site/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getAbsoluteUrl("/")),
  title: {
    default: siteName,
    template: `%s | ${siteShortName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: getAbsoluteUrl("/"),
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
