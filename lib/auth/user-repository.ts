import { getPrismaClient } from "@/lib/db/prisma";
import type { AdminUserRecord, AuthUserRepository } from "@/lib/auth/auth-service";
import { isMissingRecordError } from "@/lib/db/prisma-errors";

export type AdminUserSummary = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserDirectoryRepository = {
  listAdmins(options?: AdminUserListOptions): Promise<AdminUserPage>;
  findAdminById(id: string): Promise<AdminUserSummary | null>;
};

export type AdminUserSort = "newest" | "name";

export type AdminUserListOptions = {
  search?: string;
  sort?: AdminUserSort;
  page?: number;
  pageSize?: number;
};

export type AdminUserPage = {
  users: AdminUserSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminUserWriteData = {
  fullName: string;
  email: string;
};

export type AdminUserCreateRecord = AdminUserWriteData & {
  passwordHash: string;
};

export type AdminDeleteResult = "deleted" | "not_found" | "last_admin";

export type AdminUserManagementRepository = AdminUserDirectoryRepository & {
  createAdmin(data: AdminUserCreateRecord): Promise<AdminUserSummary>;
  updateAdmin(
    id: string,
    data: AdminUserWriteData,
  ): Promise<AdminUserSummary | null>;
  updateAdminPassword(
    id: string,
    passwordHash: string,
  ): Promise<AdminUserSummary | null>;
  deleteAdmin(id: string): Promise<AdminDeleteResult>;
};

export const prismaAuthUserRepository: AuthUserRepository = {
  async findAdminByEmail(email: string): Promise<AdminUserRecord | null> {
    const user = await getPrismaClient().user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      role: user.role,
    };
  },
};

const adminUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const prismaAdminUserDirectoryRepository: AdminUserManagementRepository = {
  async listAdmins(options = {}): Promise<AdminUserPage> {
    const search = options.search?.trim() ?? "";
    const requestedPageSize = Number.isInteger(options.pageSize)
      ? (options.pageSize ?? 10)
      : 10;
    const pageSize = [10, 25, 50].includes(requestedPageSize)
      ? requestedPageSize
      : 10;
    const requestedPage = Number.isInteger(options.page)
      ? (options.page ?? 1)
      : 1;
    const where = {
      role: "ADMIN" as const,
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const prisma = getPrismaClient();
    const total = await prisma.user.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, requestedPage), totalPages);
    const users = await prisma.user.findMany({
      where,
      select: adminUserSelect,
      orderBy:
        options.sort === "newest"
          ? [{ createdAt: "desc" }, { fullName: "asc" }]
          : [{ fullName: "asc" }, { email: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      users,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  async findAdminById(id): Promise<AdminUserSummary | null> {
    return getPrismaClient().user.findFirst({
      where: { id, role: "ADMIN" },
      select: adminUserSelect,
    });
  },

  async createAdmin(data): Promise<AdminUserSummary> {
    return getPrismaClient().user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        role: "ADMIN",
      },
      select: adminUserSelect,
    });
  },

  async updateAdmin(id, data): Promise<AdminUserSummary | null> {
    try {
      return await getPrismaClient().user.update({
        where: { id, role: "ADMIN" },
        data,
        select: adminUserSelect,
      });
    } catch (error) {
      if (isMissingRecordError(error)) return null;
      throw error;
    }
  },

  async updateAdminPassword(id, passwordHash): Promise<AdminUserSummary | null> {
    try {
      return await getPrismaClient().user.update({
        where: { id, role: "ADMIN" },
        data: { passwordHash },
        select: adminUserSelect,
      });
    } catch (error) {
      if (isMissingRecordError(error)) return null;
      throw error;
    }
  },

  async deleteAdmin(id): Promise<AdminDeleteResult> {
    return getPrismaClient().$transaction(async (transaction) => {
      const user = await transaction.user.findFirst({
        where: { id, role: "ADMIN" },
        select: { id: true },
      });
      if (!user) return "not_found";

      const adminCount = await transaction.user.count({
        where: { role: "ADMIN" },
      });
      if (adminCount <= 1) return "last_admin";

      await transaction.user.delete({ where: { id } });
      return "deleted";
    });
  },
};
