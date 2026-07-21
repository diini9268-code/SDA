import { hashPassword } from "@/lib/auth/password";
import {
  parseAdminUserCreateInput,
  parseAdminUserPasswordInput,
  parseAdminUserUpdateInput,
} from "@/lib/auth/user-management-validation";
import type {
  AdminUserManagementRepository,
  AdminUserSummary,
} from "@/lib/auth/user-repository";
import { isUniqueConstraintError } from "@/lib/db/prisma-errors";

type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: 400 | 404 | 409; error: string };

export async function createAdminUser(
  body: unknown,
  repository: AdminUserManagementRepository,
): Promise<ServiceResult<AdminUserSummary>> {
  const input = parseAdminUserCreateInput(body);
  if (!input.ok) return { ok: false, status: 400, error: input.error };

  try {
    return {
      ok: true,
      data: await repository.createAdmin({
        fullName: input.data.fullName,
        email: input.data.email,
        role: input.data.role,
        passwordHash: await hashPassword(input.data.password),
      }),
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error: "A user account with this email already exists.",
      };
    }
    throw error;
  }
}

export async function updateAdminUser(
  id: string,
  body: unknown,
  actorId: string,
  repository: AdminUserManagementRepository,
): Promise<ServiceResult<AdminUserSummary>> {
  const input = parseAdminUserUpdateInput(body);
  if (!input.ok) return { ok: false, status: 400, error: input.error };

  if (id === actorId && input.data.role !== "ADMIN") {
    return {
      ok: false,
      status: 409,
      error: "You cannot remove your own administrator role.",
    };
  }

  try {
    const user = await repository.updateAdmin(id, input.data);
    if (user === "last_admin") {
      return {
        ok: false,
        status: 409,
        error: "The last administrator cannot be changed to Blogger.",
      };
    }
    return user
      ? { ok: true, data: user }
      : { ok: false, status: 404, error: "User account not found." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        status: 409,
        error: "A user account with this email already exists.",
      };
    }
    throw error;
  }
}

export async function resetAdminUserPassword(
  id: string,
  body: unknown,
  repository: AdminUserManagementRepository,
): Promise<ServiceResult<AdminUserSummary>> {
  const input = parseAdminUserPasswordInput(body);
  if (!input.ok) return { ok: false, status: 400, error: input.error };

  const user = await repository.updateAdminPassword(
    id,
    await hashPassword(input.data.password),
  );

  return user
    ? { ok: true, data: user }
    : { ok: false, status: 404, error: "User account not found." };
}

export async function deleteAdminUser(
  id: string,
  actorId: string,
  repository: AdminUserManagementRepository,
): Promise<ServiceResult<{ deleted: true }>> {
  if (id === actorId) {
    return {
      ok: false,
      status: 409,
      error: "You cannot delete the user account you are using.",
    };
  }

  const result = await repository.deleteAdmin(id);

  if (result === "not_found") {
    return {
      ok: false,
      status: 404,
      error: "User account not found.",
    };
  }

  if (result === "last_admin") {
    return {
      ok: false,
      status: 409,
      error: "The last administrator account cannot be deleted.",
    };
  }

  return { ok: true, data: { deleted: true } };
}
