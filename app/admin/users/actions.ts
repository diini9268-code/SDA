"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  createAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  updateAdminUser,
} from "@/lib/auth/user-management-service";
import { prismaAdminUserDirectoryRepository } from "@/lib/auth/user-repository";

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function identityPayload(formData: FormData) {
  return {
    fullName: getText(formData, "fullName"),
    email: getText(formData, "email"),
    role: getText(formData, "role"),
  };
}

function passwordPayload(formData: FormData) {
  return {
    password: getText(formData, "password"),
    confirmPassword: getText(formData, "confirmPassword"),
  };
}

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/users?${new URLSearchParams({
      [status]: message,
    }).toString()}`,
  );
}

async function requireActionAdmin() {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function createAdminUserAction(formData: FormData) {
  await requireActionAdmin();
  const result = await createAdminUser(
    { ...identityPayload(formData), ...passwordPayload(formData) },
    prismaAdminUserDirectoryRepository,
  );

  if (!result.ok) redirectWithStatus(result.error, "error");

  revalidatePath("/admin/users");
  redirectWithStatus("User account created.", "success");
}

export async function updateAdminUserAction(id: string, formData: FormData) {
  const session = await requireActionAdmin();
  const result = await updateAdminUser(
    id,
    identityPayload(formData),
    session.sub,
    prismaAdminUserDirectoryRepository,
  );

  if (!result.ok) redirectWithStatus(result.error, "error");

  revalidatePath("/admin/users");
  redirectWithStatus("User account updated.", "success");
}

export async function resetAdminUserPasswordAction(
  id: string,
  formData: FormData,
) {
  await requireActionAdmin();
  const result = await resetAdminUserPassword(
    id,
    passwordPayload(formData),
    prismaAdminUserDirectoryRepository,
  );

  if (!result.ok) redirectWithStatus(result.error, "error");

  redirectWithStatus("Administrator password reset.", "success");
}

export async function deleteAdminUserAction(id: string) {
  const session = await requireActionAdmin();
  const result = await deleteAdminUser(
    id,
    session.sub,
    prismaAdminUserDirectoryRepository,
  );

  if (!result.ok) redirectWithStatus(result.error, "error");

  revalidatePath("/admin/users");
  redirectWithStatus("User account deleted.", "success");
}
