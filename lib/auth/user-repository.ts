import { getPrismaClient } from "@/lib/db/prisma";
import type { AdminUserRecord, AuthUserRepository } from "@/lib/auth/auth-service";

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
