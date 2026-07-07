import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  MembershipApplicationRecord,
  MembershipRepository,
} from "@/lib/membership/membership-service";

export const prismaMembershipRepository: MembershipRepository = {
  async listAll(): Promise<MembershipApplicationRecord[]> {
    return getPrismaClient().membershipApplication.findMany({
      orderBy: [{ submittedAt: "desc" }, { fullName: "asc" }],
    });
  },

  async create(data): Promise<MembershipApplicationRecord> {
    return getPrismaClient().membershipApplication.create({ data });
  },

  async updateStatus(id, data): Promise<MembershipApplicationRecord | null> {
    try {
      return await getPrismaClient().membershipApplication.update({
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
};
