import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  ContactMessageRecord,
  ContactRepository,
} from "@/lib/contact/contact-service";

export const prismaContactRepository: ContactRepository = {
  async listAll(): Promise<ContactMessageRecord[]> {
    return getPrismaClient().contactMessage.findMany({
      orderBy: [{ createdAt: "desc" }, { subject: "asc" }],
    });
  },

  async create(data): Promise<ContactMessageRecord> {
    return getPrismaClient().contactMessage.create({ data });
  },

  async updateStatus(id, data): Promise<ContactMessageRecord | null> {
    try {
      return await getPrismaClient().contactMessage.update({
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
