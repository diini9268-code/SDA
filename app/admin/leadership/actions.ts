"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  createLeadershipProfile,
  deleteLeadershipProfile,
  updateLeadershipProfile,
} from "@/lib/leadership/leadership-service";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function getLeadershipPayload(formData: FormData) {
  return {
    fullName: getText(formData, "fullName"),
    position: getText(formData, "position"),
    biography: getText(formData, "biography"),
    photo: getText(formData, "photo"),
    photoAssetId: getText(formData, "photoAssetId"),
    displayOrder: Number(getText(formData, "displayOrder")),
    isActive: formData.get("isActive") === "on",
  };
}

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/leadership?${new URLSearchParams({
      [status]: message,
    }).toString()}`,
  );
}

async function requireActionAdmin() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin");
  }
}

export async function createLeadershipAction(formData: FormData) {
  await requireActionAdmin();

  const result = await createLeadershipProfile(
    getLeadershipPayload(formData),
    prismaLeadershipRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leadership");
  revalidatePath("/leadership");
  redirectWithStatus("Leadership profile created.", "success");
}

export async function updateLeadershipAction(id: string, formData: FormData) {
  await requireActionAdmin();

  const result = await updateLeadershipProfile(
    id,
    getLeadershipPayload(formData),
    prismaLeadershipRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leadership");
  revalidatePath("/leadership");
  redirectWithStatus("Leadership profile updated.", "success");
}

export async function deleteLeadershipAction(id: string) {
  await requireActionAdmin();

  const result = await deleteLeadershipProfile(id, prismaLeadershipRepository);

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leadership");
  revalidatePath("/leadership");
  redirectWithStatus("Leadership profile deleted.", "success");
}
