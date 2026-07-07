"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import {
  createArchiveEntry,
  deleteArchiveEntry,
  updateArchiveEntry,
} from "@/lib/archive/archive-service";

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function parseImages(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getArchivePayload(formData: FormData) {
  return {
    title: getText(formData, "title"),
    summary: getText(formData, "summary"),
    activityDate: getText(formData, "activityDate"),
    images: parseImages(getText(formData, "images")),
  };
}

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/archive?${new URLSearchParams({
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

export async function createArchiveAction(formData: FormData) {
  await requireActionAdmin();

  const result = await createArchiveEntry(
    getArchivePayload(formData),
    prismaArchiveRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  redirectWithStatus("Archive entry created.", "success");
}

export async function updateArchiveAction(id: string, formData: FormData) {
  await requireActionAdmin();

  const result = await updateArchiveEntry(
    id,
    getArchivePayload(formData),
    prismaArchiveRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  redirectWithStatus("Archive entry updated.", "success");
}

export async function deleteArchiveAction(id: string) {
  await requireActionAdmin();

  const result = await deleteArchiveEntry(id, prismaArchiveRepository);

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/archive");
  revalidatePath("/archive");
  redirectWithStatus("Archive entry deleted.", "success");
}
