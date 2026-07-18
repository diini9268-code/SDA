import { getPrismaClient } from "@/lib/db/prisma";
import { isMissingRecordError } from "@/lib/db/prisma-errors";
import type {
  BlogRecord,
  BlogRepository,
} from "@/lib/blog/blog-service";
import type { BlogUpdateData } from "@/lib/blog/validation";

const includeMedia = {
  media: {
    orderBy: [{ displayOrder: "asc" as const }, { createdAt: "asc" as const }],
  },
};

function toUpdateData(data: BlogUpdateData) {
  const { media, ...blogData } = data;

  return {
    ...blogData,
    ...(media
      ? {
          media: {
            deleteMany: {},
            create: media,
          },
        }
      : {}),
  };
}

export const prismaBlogRepository: BlogRepository = {
  async listPublic(): Promise<BlogRecord[]> {
    return getPrismaClient().blog.findMany({
      where: { status: "PUBLISHED" },
      include: includeMedia,
      orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
    });
  },

  async listAll(): Promise<BlogRecord[]> {
    return getPrismaClient().blog.findMany({
      include: includeMedia,
      orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
    });
  },

  async findById(id: string): Promise<BlogRecord | null> {
    return getPrismaClient().blog.findUnique({
      where: { id },
      include: includeMedia,
    });
  },

  async findPublicBySlug(slug: string): Promise<BlogRecord | null> {
    return getPrismaClient().blog.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: includeMedia,
    });
  },

  async create(data): Promise<BlogRecord> {
    const { media, ...blogData } = data;

    return getPrismaClient().blog.create({
      data: {
        ...blogData,
        media: {
          create: media,
        },
      },
      include: includeMedia,
    });
  },

  async update(id, data): Promise<BlogRecord | null> {
    try {
      return await getPrismaClient().blog.update({
        where: { id },
        data: toUpdateData(data),
        include: includeMedia,
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
      await getPrismaClient().blog.delete({
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
