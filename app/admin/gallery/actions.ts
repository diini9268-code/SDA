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

function value(formData: FormData, name: string): string {
  const item = formData.get(name);
  return typeof item === "string" ? item.trim() : "";
}

function payload(formData: FormData) {
  const imageUrl = value(formData, "imageUrl");
  const mediaAssetId = value(formData, "mediaAssetId");
  return {
    title: value(formData, "title"),
    summary: value(formData, "summary"),
    activityDate: value(formData, "activityDate"),
    images: imageUrl ? [imageUrl] : [],
    mediaAssetIds: mediaAssetId ? [mediaAssetId] : [],
  };
}

async function requireAdmin() {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");
}

function resultRedirect(message: string, kind: "success" | "error") {
  redirect(`/admin/gallery?${new URLSearchParams({ [kind]: message })}`);
}

export async function createGalleryItemAction(formData: FormData) {
  await requireAdmin();
  const result = await createArchiveEntry(payload(formData), prismaArchiveRepository);
  if (!result.ok) resultRedirect(result.error, "error");
  revalidatePath("/about");
  resultRedirect("Gallery item created.", "success");
}

export async function updateGalleryItemAction(id: string, formData: FormData) {
  await requireAdmin();
  const result = await updateArchiveEntry(
    id,
    payload(formData),
    prismaArchiveRepository,
  );
  if (!result.ok) resultRedirect(result.error, "error");
  revalidatePath("/about");
  resultRedirect("Gallery item updated.", "success");
}

export async function deleteGalleryItemAction(id: string) {
  await requireAdmin();
  const result = await deleteArchiveEntry(id, prismaArchiveRepository);
  if (!result.ok) resultRedirect(result.error, "error");
  revalidatePath("/about");
  resultRedirect("Gallery item deleted.", "success");
}
