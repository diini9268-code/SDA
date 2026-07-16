import { getPrismaClient } from "@/lib/db/prisma";
import type { AdminUserRecord, AuthUserRepository } from "@/lib/auth/auth-service";

export type AdminUserSummary = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserDirectoryRepository = {
  listAdmins(): Promise<AdminUserSummary[]>;
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

export const prismaAdminUserDirectoryRepository: AdminUserDirectoryRepository = {
  async listAdmins(): Promise<AdminUserSummary[]> {
    return getPrismaClient().user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ fullName: "asc" }, { email: "asc" }],
    });
  },
};
