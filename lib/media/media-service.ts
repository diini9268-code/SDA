import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import {
  createSignedBlogMediaUpload,
  deleteBlogMediaPaths,
  finalizeMediaUpload,
  type MediaDestination,
} from "@/lib/blog/blog-media-storage";

export const MEDIA_DESTINATIONS = [
  "leadership",
  "archive",
  "program",
  "site",
] as const satisfies readonly MediaDestination[];

export type SharedMediaDestination = (typeof MEDIA_DESTINATIONS)[number];

export function isSharedMediaDestination(
  value: unknown,
): value is SharedMediaDestination {
  return (
    typeof value === "string" &&
    MEDIA_DESTINATIONS.includes(value as SharedMediaDestination)
  );
}

export async function prepareMediaUpload(input: {
  name: string;
  type: string;
  size: number;
}) {
  return createSignedBlogMediaUpload(input);
}

export async function completeMediaUpload(input: {
  path: string;
  name: string;
  type: string;
  size: number;
  altText?: string;
  destination: SharedMediaDestination;
  createdById: string;
}) {
  const finalized = await finalizeMediaUpload({
    path: input.path,
    name: input.name,
    type: input.type,
    size: input.size,
    destination: input.destination,
  });

  try {
    return await getPrismaClient().mediaAsset.create({
      data: {
        storagePath: finalized.path,
        url: finalized.url,
        originalName: input.name,
        altText: input.altText?.trim() || null,
        mimeType: finalized.mimeType,
        sizeBytes: finalized.sizeBytes,
        kind: finalized.mimeType === "application/pdf" ? "DOCUMENT" : "IMAGE",
        status: "READY",
        createdById: input.createdById,
      },
    });
  } catch (error) {
    await deleteBlogMediaPaths([finalized.path]).catch(() => undefined);
    throw error;
  }
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  const prisma = getPrismaClient();
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          leadership: true,
          programs: true,
          blogMedia: true,
          archiveMedia: true,
          sectionMedia: true,
          partnerLogos: true,
        },
      },
    },
  });

  if (!asset) {
    return false;
  }

  const referenceCount = Object.values(asset._count).reduce(
    (total, count) => total + count,
    0,
  );

  if (referenceCount > 0) {
    throw new Error(
      "This file is still used by website content. Remove it from that content before deleting it.",
    );
  }

  await prisma.mediaAsset.delete({ where: { id } });
  await deleteBlogMediaPaths([asset.storagePath]);
  return true;
}
