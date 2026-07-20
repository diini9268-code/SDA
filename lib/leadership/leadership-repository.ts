import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  LeadershipProfile,
  LeadershipRepository,
} from "@/lib/leadership/leadership-service";

export const prismaLeadershipRepository: LeadershipRepository = {
  async listPublic(): Promise<LeadershipProfile[]> {
    return getPrismaClient().leadership.findMany({
      where: { isActive: true },
      include: { photoAsset: true },
      orderBy: [{ displayOrder: "asc" }, { fullName: "asc" }],
    });
  },

  async listAll(): Promise<LeadershipProfile[]> {
    return getPrismaClient().leadership.findMany({
      include: { photoAsset: true },
      orderBy: [{ displayOrder: "asc" }, { fullName: "asc" }],
    });
  },

  async create(data): Promise<LeadershipProfile> {
    return getPrismaClient().leadership.create({
      data,
      include: { photoAsset: true },
    });
  },

  async update(id, data): Promise<LeadershipProfile | null> {
    try {
      return await getPrismaClient().leadership.update({
        where: { id },
        data,
        include: { photoAsset: true },
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
      await getPrismaClient().leadership.delete({
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
