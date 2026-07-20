import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  ProgramRecord,
  ProgramRepository,
} from "@/lib/programs/program-service";

export const prismaProgramRepository: ProgramRepository = {
  async listPublic(): Promise<ProgramRecord[]> {
    return getPrismaClient().program.findMany({
      where: {
        status: {
          in: ["SCHEDULED", "PUBLISHED"],
        },
      },
      include: { coverAsset: true },
      orderBy: [{ eventDate: "asc" }, { title: "asc" }],
    });
  },

  async listAll(): Promise<ProgramRecord[]> {
    return getPrismaClient().program.findMany({
      include: { coverAsset: true },
      orderBy: [{ eventDate: "desc" }, { title: "asc" }],
    });
  },

  async findPublicBySlug(slug: string): Promise<ProgramRecord | null> {
    return getPrismaClient().program.findFirst({
      where: {
        slug,
        status: {
          in: ["SCHEDULED", "PUBLISHED"],
        },
      },
      include: { coverAsset: true },
    });
  },

  async create(data): Promise<ProgramRecord> {
    return getPrismaClient().program.create({
      data,
      include: { coverAsset: true },
    });
  },

  async update(id, data): Promise<ProgramRecord | null> {
    try {
      return await getPrismaClient().program.update({
        where: { id },
        data,
        include: { coverAsset: true },
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
      await getPrismaClient().program.delete({
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
