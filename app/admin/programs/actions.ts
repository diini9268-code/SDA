"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  createProgram,
  deleteProgram,
  updateProgram,
} from "@/lib/programs/program-service";
import { prismaProgramRepository } from "@/lib/programs/program-repository";
import type { ProgramStatusValue } from "@/lib/programs/validation";

const programStatuses: ProgramStatusValue[] = [
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
  "CANCELLED",
];

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function getProgramPayload(formData: FormData) {
  const status = getText(formData, "status");

  return {
    title: getText(formData, "title"),
    description: getText(formData, "description"),
    eventDate: getText(formData, "eventDate"),
    location: getText(formData, "location"),
    status: programStatuses.includes(status as ProgramStatusValue)
      ? status
      : "DRAFT",
  };
}

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/programs?${new URLSearchParams({
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

export async function createProgramAction(formData: FormData) {
  await requireActionAdmin();

  const result = await createProgram(getProgramPayload(formData), prismaProgramRepository);

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  redirectWithStatus("Program created.", "success");
}

export async function updateProgramAction(id: string, formData: FormData) {
  await requireActionAdmin();

  const result = await updateProgram(
    id,
    getProgramPayload(formData),
    prismaProgramRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  redirectWithStatus("Program updated.", "success");
}

export async function deleteProgramAction(id: string) {
  await requireActionAdmin();

  const result = await deleteProgram(id, prismaProgramRepository);

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  redirectWithStatus("Program deleted.", "success");
}
