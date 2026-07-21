import { isUserRole, type UserRoleValue } from "@/lib/auth/permissions";

export type AdminUserCreateData = {
  fullName: string;
  email: string;
  password: string;
  role: UserRoleValue;
};

export type AdminUserUpdateData = {
  fullName: string;
  email: string;
  role: UserRoleValue;
};

export type AdminUserPasswordData = {
  password: string;
};

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function recordFrom(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function text(record: Record<string, unknown>, field: string): string {
  return typeof record[field] === "string" ? record[field].trim() : "";
}

function validateIdentity(
  record: Record<string, unknown>,
): ValidationResult<AdminUserUpdateData> {
  const fullName = text(record, "fullName");
  const email = text(record, "email").toLowerCase();
  const role = text(record, "role");

  if (fullName.length < 2 || fullName.length > 160) {
    return {
      ok: false,
      error: "Full name must be between 2 and 160 characters.",
    };
  }

  if (!emailPattern.test(email) || email.length > 255) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (!isUserRole(role)) {
    return {
      ok: false,
      error: "Select a valid user role.",
    };
  }

  return { ok: true, data: { fullName, email, role } };
}

function validatePassword(
  record: Record<string, unknown>,
): ValidationResult<AdminUserPasswordData> {
  const password =
    typeof record.password === "string" ? record.password : "";
  const confirmPassword =
    typeof record.confirmPassword === "string"
      ? record.confirmPassword
      : "";

  if (password.length < 12) {
    return {
      ok: false,
      error: "Password must be at least 12 characters.",
    };
  }

  if (password !== confirmPassword) {
    return { ok: false, error: "Password confirmation does not match." };
  }

  return { ok: true, data: { password } };
}

export function parseAdminUserCreateInput(
  value: unknown,
): ValidationResult<AdminUserCreateData> {
  const record = recordFrom(value);

  if (!record) {
    return { ok: false, error: "Invalid user details." };
  }

  const identity = validateIdentity(record);
  if (!identity.ok) return identity;

  const password = validatePassword(record);
  if (!password.ok) return password;

  return {
    ok: true,
    data: { ...identity.data, password: password.data.password },
  };
}

export function parseAdminUserUpdateInput(
  value: unknown,
): ValidationResult<AdminUserUpdateData> {
  const record = recordFrom(value);
  return record
    ? validateIdentity(record)
    : { ok: false, error: "Invalid user details." };
}

export function parseAdminUserPasswordInput(
  value: unknown,
): ValidationResult<AdminUserPasswordData> {
  const record = recordFrom(value);
  return record
    ? validatePassword(record)
    : { ok: false, error: "Invalid password details." };
}
