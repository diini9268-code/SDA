import { describe, expect, it, vi } from "vitest";
import {
  createAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  updateAdminUser,
} from "@/lib/auth/user-management-service";
import type {
  AdminDeleteResult,
  AdminUserManagementRepository,
  AdminUserSummary,
} from "@/lib/auth/user-repository";
import { verifyPassword } from "@/lib/auth/password";

const now = new Date("2026-07-17T12:00:00.000Z");

function user(overrides: Partial<AdminUserSummary> = {}): AdminUserSummary {
  return {
    id: "34dcdcb9-2df1-4994-8bf1-bd9f568c1f3a",
    fullName: "SDA Administrator",
    email: "admin@example.com",
    role: "ADMIN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function repository(
  overrides: Partial<AdminUserManagementRepository> = {},
): AdminUserManagementRepository {
  return {
    listAdmins: vi.fn(async () => ({
      users: [user()],
      total: 1,
      adminTotal: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    })),
    findAdminById: vi.fn(async () => user()),
    createAdmin: vi.fn(async (data) =>
      user({ fullName: data.fullName, email: data.email, role: data.role }),
    ),
    updateAdmin: vi.fn(async (_id, data) =>
      user({ fullName: data.fullName, email: data.email }),
    ),
    updateAdminPassword: vi.fn(async () => user()),
    deleteAdmin: vi.fn(async (): Promise<AdminDeleteResult> => "deleted"),
    ...overrides,
  };
}

describe("administrator user management", () => {
  it("creates an administrator with normalized email and a hashed password", async () => {
    let capturedPasswordHash = "";
    const store = repository({
      createAdmin: vi.fn(async (data) => {
        capturedPasswordHash = data.passwordHash;
        expect(data.email).toBe("new.admin@example.com");
        return user({ fullName: data.fullName, email: data.email });
      }),
    });

    const result = await createAdminUser(
      {
        fullName: "New Administrator",
        email: "NEW.ADMIN@EXAMPLE.COM",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
        role: "ADMIN",
      },
      store,
    );

    expect(result.ok).toBe(true);
    expect(capturedPasswordHash).not.toContain("SecurePassword123");
    expect(
      await verifyPassword("SecurePassword123", capturedPasswordHash),
    ).toBe(true);
  });

  it("rejects mismatched passwords and unsupported roles", async () => {
    const store = repository();
    const mismatched = await createAdminUser(
      {
        fullName: "New Administrator",
        email: "new.admin@example.com",
        password: "SecurePassword123",
        confirmPassword: "DifferentPassword123",
        role: "ADMIN",
      },
      store,
    );
    const unsupportedRole = await createAdminUser(
      {
        fullName: "Member User",
        email: "member@example.com",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
        role: "MEMBER",
      },
      store,
    );

    expect(mismatched).toMatchObject({
      ok: false,
      status: 400,
      error: "Password confirmation does not match.",
    });
    expect(unsupportedRole).toMatchObject({
      ok: false,
      status: 400,
      error: "Select a valid user role.",
    });
  });

  it("creates a Blogger account", async () => {
    const result = await createAdminUser(
      {
        fullName: "SDA Writer",
        email: "writer@example.com",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
        role: "BLOGGER",
      },
      repository(),
    );

    expect(result).toMatchObject({
      ok: true,
      data: { email: "writer@example.com", role: "BLOGGER" },
    });
  });

  it("returns a conflict for duplicate email addresses", async () => {
    const store = repository({
      createAdmin: vi.fn(async () => {
        throw { code: "P2002" };
      }),
    });

    const result = await createAdminUser(
      {
        fullName: "Duplicate Administrator",
        email: "admin@example.com",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
        role: "ADMIN",
      },
      store,
    );

    expect(result).toMatchObject({
      ok: false,
      status: 409,
      error: "A user account with this email already exists.",
    });
  });

  it("updates identity fields and resets passwords", async () => {
    let capturedPasswordHash = "";
    const store = repository({
      updateAdminPassword: vi.fn(async (_id, passwordHash) => {
        capturedPasswordHash = passwordHash;
        return user();
      }),
    });

    const updated = await updateAdminUser(
      "34dcdcb9-2df1-4994-8bf1-bd9f568c1f3a",
      {
        fullName: "Updated Administrator",
        email: "UPDATED@EXAMPLE.COM",
        role: "ADMIN",
      },
      "actor-admin-id",
      store,
    );
    const reset = await resetAdminUserPassword(
      "34dcdcb9-2df1-4994-8bf1-bd9f568c1f3a",
      {
        password: "ReplacementPassword123",
        confirmPassword: "ReplacementPassword123",
      },
      store,
    );

    expect(updated).toMatchObject({
      ok: true,
      data: {
        fullName: "Updated Administrator",
        email: "updated@example.com",
      },
    });
    expect(reset.ok).toBe(true);
    expect(
      await verifyPassword("ReplacementPassword123", capturedPasswordHash),
    ).toBe(true);
  });

  it("blocks self-deletion and deletion of the last administrator", async () => {
    const actorId = "34dcdcb9-2df1-4994-8bf1-bd9f568c1f3a";
    const deleteAdmin = vi.fn(async (): Promise<AdminDeleteResult> => "deleted");
    const selfResult = await deleteAdminUser(
      actorId,
      actorId,
      repository({ deleteAdmin }),
    );
    const lastResult = await deleteAdminUser(
      "ec25c246-b894-4539-84de-55e05d3b2f4c",
      actorId,
      repository({
        deleteAdmin: vi.fn(
          async (): Promise<AdminDeleteResult> => "last_admin",
        ),
      }),
    );

    expect(selfResult).toMatchObject({ ok: false, status: 409 });
    expect(deleteAdmin).not.toHaveBeenCalled();
    expect(lastResult).toMatchObject({
      ok: false,
      status: 409,
      error: "The last administrator account cannot be deleted.",
    });
  });
});
