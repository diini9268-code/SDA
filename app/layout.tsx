import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import {
  getAbsoluteUrl,
  siteDescription,
  siteName,
  siteShortName,
} from "@/lib/site/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
