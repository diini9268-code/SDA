import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  ArchiveRecord,
  ArchiveRepository,
} from "@/lib/archive/archive-service";

const archiveInclude = {
  media: {
    orderBy: { displayOrder: "asc" as const },
    include: { asset: true },
  },
};

function dataWithMedia(
  data: Parameters<ArchiveRepository["create"]>[0],
) {
  const { mediaAssetIds, ...archive } = data;
  return {
    ...archive,
    media: mediaAssetIds.length
      ? {
          create: mediaAssetIds.map((assetId, displayOrder) => ({
            assetId,
            displayOrder,
          })),
        }
      : undefined,
  };
}

export const prismaArchiveRepository: ArchiveRepository = {
  async listPublic(): Promise<ArchiveRecord[]> {
    return getPrismaClient().archive.findMany({
      include: archiveInclude,
      orderBy: [{ activityDate: "desc" }, { title: "asc" }],
    });
  },

  async listAll(): Promise<ArchiveRecord[]> {
    return getPrismaClient().archive.findMany({
      include: archiveInclude,
      orderBy: [{ activityDate: "desc" }, { title: "asc" }],
    });
  },

  async findPublicBySlug(slug: string): Promise<ArchiveRecord | null> {
    return getPrismaClient().archive.findUnique({
      where: { slug },
      include: archiveInclude,
    });
  },

  async create(data): Promise<ArchiveRecord> {
    return getPrismaClient().archive.create({
      data: dataWithMedia(data),
      include: archiveInclude,
    });
  },

  async update(id, data): Promise<ArchiveRecord | null> {
    try {
      const { mediaAssetIds, ...archive } = data;
      return await getPrismaClient().archive.update({
        where: { id },
        data: {
          ...archive,
          ...(mediaAssetIds
            ? {
                media: {
                  deleteMany: {},
                  create: mediaAssetIds.map((assetId, displayOrder) => ({
                    assetId,
                    displayOrder,
                  })),
                },
              }
            : {}),
        },
        include: archiveInclude,
      });
    } catch (error) {
      if (isMissingRecordError(error)) {
        return null;
      }
      throw error;
    }
  },

  async delete(id): Promise<boolean> {
    try {
      await getPrismaClient().archive.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (isMissingRecordError(error)) {
        return false;
      }
      throw error;
    }
  },
};
