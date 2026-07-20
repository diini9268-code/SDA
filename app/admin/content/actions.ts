"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getPrismaClient } from "@/lib/db/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pairs(value: string): Array<{ title: string; description: string }> {
  return lines(value)
    .map((line) => {
      const separator = line.indexOf("|");
      return separator < 0
        ? { title: line, description: "" }
        : {
            title: line.slice(0, separator).trim(),
            description: line.slice(separator + 1).trim(),
          };
    })
    .filter((item) => item.title);
}

function safeHref(value: string): string | null {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function sectionContent(formData: FormData, prefix: string) {
  return {
    eyebrow: text(formData, `${prefix}Eyebrow`),
    title: text(formData, `${prefix}Title`),
    description: text(formData, `${prefix}Description`),
    primaryLabel: text(formData, `${prefix}PrimaryLabel`) || undefined,
    secondaryLabel: text(formData, `${prefix}SecondaryLabel`) || undefined,
  };
}

async function requireAdmin() {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function saveWebsiteContentAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getPrismaClient();
  const valueDetails = pairs(text(formData, "values"));
  const globalContent = {
    organizationName: text(formData, "organizationName"),
    shortName: text(formData, "shortName"),
    motto: text(formData, "motto"),
    founded: text(formData, "founded"),
    location: text(formData, "location"),
    mission: text(formData, "mission"),
    missionAims: lines(text(formData, "missionAims")),
    objectives: lines(text(formData, "objectives")),
    values: valueDetails.map((value) => value.title),
    valueDetails,
    membershipCategories: pairs(text(formData, "membershipCategories")),
    membershipRequirements: lines(text(formData, "membershipRequirements")),
  };
  const sectionInputs = [
    {
      page: "GLOBAL" as const,
      key: "organization",
      content: globalContent,
      media: [{ role: "hero", field: "globalHeroAssetId" }],
    },
    {
      page: "HOME" as const,
      key: "main",
      content: sectionContent(formData, "home"),
      media: [
        { role: "hero", field: "homeHeroAssetId" },
        { role: "feature", field: "homeFeatureAssetId" },
      ],
    },
    {
      page: "ABOUT" as const,
      key: "main",
      content: sectionContent(formData, "about"),
      media: [
        { role: "hero", field: "aboutHeroAssetId" },
        { role: "feature", field: "aboutFeatureAssetId" },
      ],
    },
    {
      page: "BLOG" as const,
      key: "main",
      content: sectionContent(formData, "blog"),
      media: [],
    },
    {
      page: "MEMBERSHIP" as const,
      key: "main",
      content: sectionContent(formData, "membership"),
      media: [{ role: "hero", field: "membershipHeroAssetId" }],
    },
    {
      page: "LEADERSHIP" as const,
      key: "main",
      content: sectionContent(formData, "leadership"),
      media: [],
    },
    {
      page: "CONTACT" as const,
      key: "main",
      content: sectionContent(formData, "contact"),
      media: [{ role: "hero", field: "contactHeroAssetId" }],
    },
  ];

  const navigation = lines(text(formData, "navigation")).map((line, index) => {
    const separator = line.indexOf("|");
    const label = (separator < 0 ? line : line.slice(0, separator)).trim();
    const href = safeHref(
      (separator < 0 ? "" : line.slice(separator + 1)).trim(),
    );
    return { label, href, displayOrder: index };
  });

  if (
    !globalContent.organizationName ||
    !globalContent.shortName ||
    !globalContent.mission ||
    navigation.some((item) => !item.label || !item.href)
  ) {
    redirect("/admin/content?error=Required+fields+or+navigation+links+are+invalid.");
  }

  const partners = lines(text(formData, "partners")).map((line, index) => {
    const separator = line.indexOf("|");
    const name = (separator < 0 ? line : line.slice(0, separator)).trim();
    const rawWebsite = separator < 0 ? "" : line.slice(separator + 1).trim();
    const website = rawWebsite ? safeHref(rawWebsite) : null;
    return { name, website, displayOrder: index };
  });

  if (partners.some((partner) => !partner.name || (partner.website === null && lineHasWebsite(text(formData, "partners"), partner.name)))) {
    redirect("/admin/content?error=A+partner+website+must+use+HTTPS.");
  }

  await prisma.$transaction(async (transaction) => {
    for (const input of sectionInputs) {
      const { media: mediaInputs, ...sectionInput } = input;
      const previous = await transaction.pageSection.findUnique({
        where: {
          page_key: { page: sectionInput.page, key: sectionInput.key },
        },
      });
      if (previous) {
        await transaction.contentRevision.create({
          data: {
            entityType: "PageSection",
            entityId: previous.id,
            snapshot: previous.content as Prisma.InputJsonValue,
            changedById: session.sub,
          },
        });
      }
      const section = await transaction.pageSection.upsert({
        where: {
          page_key: { page: sectionInput.page, key: sectionInput.key },
        },
        create: {
          ...sectionInput,
          updatedById: session.sub,
          status: "PUBLISHED",
          isVisible: true,
        },
        update: {
          content: sectionInput.content,
          updatedById: session.sub,
          status: "PUBLISHED",
          isVisible: true,
        },
      });
      for (const media of mediaInputs) {
        const assetId = text(formData, media.field);
        await transaction.pageSectionMedia.deleteMany({
          where: { sectionId: section.id, role: media.role },
        });
        if (assetId) {
          await transaction.pageSectionMedia.create({
            data: { sectionId: section.id, assetId, role: media.role },
          });
        }
      }
    }

    await transaction.navigationItem.deleteMany({ where: { location: "header" } });
    await transaction.navigationItem.createMany({
      data: navigation.map((item) => ({
        label: item.label,
        href: item.href!,
        displayOrder: item.displayOrder,
        location: "header",
      })),
    });
    const retainedPartnerNames = partners.map((partner) => partner.name);
    await transaction.partner.deleteMany({
      where: {
        name: { notIn: retainedPartnerNames },
      },
    });
    for (const partner of partners) {
      await transaction.partner.upsert({
        where: { name: partner.name },
        create: {
          name: partner.name,
          website: partner.website,
          displayOrder: partner.displayOrder,
        },
        update: {
          website: partner.website,
          displayOrder: partner.displayOrder,
          isActive: true,
        },
      });
    }
  });

  revalidatePath("/", "layout");
  redirect("/admin/content?success=Website+content+published.");
}

export async function savePartnerLogoAction(
  partnerId: string,
  formData: FormData,
) {
  await requireAdmin();
  const logoAssetId = text(formData, "logoAssetId");
  const prisma = getPrismaClient();

  const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
  if (!partner) {
    redirect("/admin/content?error=Partner+not+found.");
  }

  if (logoAssetId) {
    const asset = await prisma.mediaAsset.findFirst({
      where: { id: logoAssetId, kind: "IMAGE", status: "READY" },
      select: { id: true },
    });
    if (!asset) {
      redirect("/admin/content?error=Select+a+valid+uploaded+partner+logo.");
    }
  }

  await prisma.partner.update({
    where: { id: partnerId },
    data: { logoAssetId: logoAssetId || null },
  });
  revalidatePath("/", "layout");
  redirect("/admin/content?success=Partner+logo+saved.");
}

function lineHasWebsite(raw: string, partnerName: string): boolean {
  return lines(raw).some(
    (line) => line.startsWith(`${partnerName}|`) && line.split("|")[1]?.trim(),
  );
}
