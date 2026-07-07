import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  ArchiveRecord,
  ArchiveRepository,
} from "@/lib/archive/archive-service";

export const prismaArchiveRepository: ArchiveRepository = {
  async listPublic(): Promise<ArchiveRecord[]> {
    return getPrismaClient().archive.findMany({
      orderBy: [{ activityDate: "desc" }, { title: "asc" }],
    });
  },

  async listAll(): Promise<ArchiveRecord[]> {
    return getPrismaClient().archive.findMany({
      orderBy: [{ activityDate: "desc" }, { title: "asc" }],
    });
  },

  async findPublicBySlug(slug: string): Promise<ArchiveRecord | null> {
    return getPrismaClient().archive.findUnique({
      where: { slug },
    });
  },

  async create(data): Promise<ArchiveRecord> {
    return getPrismaClient().archive.create({ data });
  },

  async update(id, data): Promise<ArchiveRecord | null> {
    try {
      return await getPrismaClient().archive.update({
        where: { id },
        data,
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
