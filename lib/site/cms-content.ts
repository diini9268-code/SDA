import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import {
  foundedLabel,
  membershipCategories,
  membershipRequirements,
  missionAims,
  officialMission,
  officialValues,
  organizationLocation,
  organizationMotto,
  organizationName,
  organizationShortName,
  publicNavigation,
  strategicObjectives,
} from "@/lib/site/official-content";

export type CmsSectionContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  organizationName?: string;
  shortName?: string;
  motto?: string;
  founded?: string;
  location?: string;
  mission?: string;
  missionAims?: string[];
  objectives?: string[];
  values?: string[];
  valueDetails?: Array<{ title: string; description: string }>;
  membershipCategories?: Array<{ title: string; description: string }>;
  membershipRequirements?: string[];
};

export type CmsMedia = {
  id: string;
  url: string;
  originalName: string;
  altText: string | null;
  mimeType: string;
  sizeBytes: number;
};

export type CmsSection = {
  content: CmsSectionContent;
  media: Record<string, CmsMedia | undefined>;
};

export type SiteCmsContent = {
  global: CmsSection;
  home: CmsSection;
  about: CmsSection;
  blog: CmsSection;
  membership: CmsSection;
  leadership: CmsSection;
  contact: CmsSection;
  navigation: Array<{ href: string; label: string }>;
  partners: Array<{
    id?: string;
    name: string;
    website?: string | null;
    logoAsset?: CmsMedia | null;
  }>;
};

export const defaultSiteCmsContent: SiteCmsContent = {
  global: {
    content: {
      organizationName,
      shortName: organizationShortName,
      motto: organizationMotto,
      founded: foundedLabel,
      location: organizationLocation,
      mission: officialMission,
      missionAims,
      objectives: strategicObjectives,
      values: officialValues,
      valueDetails: officialValues.map((title) => ({
        title,
        description:
          {
            Respect:
              "We value dignity, mutual understanding, and professional conduct in every engagement.",
            Integrity:
              "We uphold ethical standards across our activities, partnerships, and organizational work.",
            Accountability:
              "We take responsibility for our decisions, resources, commitments, and service to members.",
            Unity:
              "We believe dialogue and cooperation create durable paths to shared progress.",
            Collaboration:
              "We build partnerships and work collectively toward shared diplomatic and social goals.",
            Innovation:
              "We support creativity, new ideas, and the talents of young Somali people.",
          }[title] ?? "",
      })),
      membershipCategories,
      membershipRequirements,
    },
    media: {},
  },
  home: {
    content: {
      eyebrow: "Diplomacy / Leadership / Unity",
      title: "Shaping Somalia's Diplomatic Future",
      description:
        "The Somali Diplomacy Association empowers Somali youth through diplomatic education, leadership development, and international engagement.",
      primaryLabel: "Join SDA",
      secondaryLabel: "Learn More",
    },
    media: {},
  },
  about: {
    content: {
      eyebrow: "Our Story",
      title: "About SDA",
      description:
        "An independent, youth-led association advancing diplomatic knowledge, leadership, and international engagement.",
    },
    media: {},
  },
  blog: {
    content: {
      eyebrow: "Insights & News",
      title: "The SDA Blog",
      description:
        "Analysis, news, organizational updates, and perspectives from the Somali Diplomacy Association.",
    },
    media: {},
  },
  membership: {
    content: {
      eyebrow: "Membership",
      title: "Join the SDA Community",
      description:
        "Submit your information for administrative review and explore SDA's diplomatic education, leadership development, research, and international engagement activities.",
      primaryLabel: "Apply Now",
    },
    media: {},
  },
  leadership: {
    content: {
      eyebrow: "Leadership",
      title: "Our Leadership",
      description:
        "Meet the people guiding SDA's work in diplomacy, research, international cooperation, and youth leadership.",
    },
    media: {},
  },
  contact: {
    content: {
      eyebrow: "Get in touch",
      title: "Contact Us",
      description:
        "Send a question about membership, activities, partnerships, or SDA activities through the official contact workflow.",
    },
    media: {},
  },
  navigation: publicNavigation,
  partners: [
    { name: "United Nations (UN Kenya / UN Youth)" },
    { name: "AIESEC" },
    { name: "Save the Children" },
    { name: "International Association for Political Science Students" },
    { name: "World Youth Forum (WYF)" },
    { name: "Best Diplomat" },
    { name: "Global Peace Chain" },
    { name: "Afro Arab Youth Council" },
  ],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function contentFromJson(value: unknown): CmsSectionContent {
  return isObject(value) ? (value as CmsSectionContent) : {};
}

function mergeSection(
  fallback: CmsSection,
  section:
    | {
        content: unknown;
        media: Array<{
          role: string;
          asset: CmsMedia;
        }>;
      }
    | undefined,
): CmsSection {
  if (!section) return fallback;

  return {
    content: { ...fallback.content, ...contentFromJson(section.content) },
    media: Object.fromEntries(
      section.media.map((item) => [item.role, item.asset]),
    ),
  };
}

export async function getSiteCmsContent(): Promise<SiteCmsContent> {
  try {
    const prisma = getPrismaClient();
    const [sections, navigation, partners] = await Promise.all([
      prisma.pageSection.findMany({
        where: { status: "PUBLISHED", isVisible: true },
        include: {
          media: {
            orderBy: { displayOrder: "asc" },
            include: { asset: true },
          },
        },
      }),
      prisma.navigationItem.findMany({
        where: { location: "header", isVisible: true },
        orderBy: [{ displayOrder: "asc" }, { label: "asc" }],
      }),
      prisma.partner.findMany({
        where: { isActive: true },
        include: { logoAsset: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
    ]);

    const byPage = new Map(sections.map((section) => [section.page, section]));

    return {
      global: mergeSection(defaultSiteCmsContent.global, byPage.get("GLOBAL")),
      home: mergeSection(defaultSiteCmsContent.home, byPage.get("HOME")),
      about: mergeSection(defaultSiteCmsContent.about, byPage.get("ABOUT")),
      blog: mergeSection(defaultSiteCmsContent.blog, byPage.get("BLOG")),
      membership: mergeSection(
        defaultSiteCmsContent.membership,
        byPage.get("MEMBERSHIP"),
      ),
      leadership: mergeSection(
        defaultSiteCmsContent.leadership,
        byPage.get("LEADERSHIP"),
      ),
      contact: mergeSection(
        defaultSiteCmsContent.contact,
        byPage.get("CONTACT"),
      ),
      navigation:
        navigation.length > 0
          ? navigation.map(({ href, label }) => ({ href, label }))
          : defaultSiteCmsContent.navigation,
      partners:
        partners.length > 0
          ? partners.map(({ id, name, website, logoAsset }) => ({
              id,
              name,
              website,
              logoAsset,
            }))
          : defaultSiteCmsContent.partners,
    };
  } catch {
    return defaultSiteCmsContent;
  }
}
