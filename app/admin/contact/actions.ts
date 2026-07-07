"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { updateContactMessageStatus } from "@/lib/contact/contact-service";
import type { ContactMessageStatusValue } from "@/lib/contact/validation";

const contactStatuses: ContactMessageStatusValue[] = [
  "UNREAD",
  "READ",
  "ARCHIVED",
];

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/contact?${new URLSearchParams({
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

export async function updateContactStatusAction(
  id: string,
  formData: FormData,
) {
  await requireActionAdmin();

  const statusValue = formData.get("status");
  const status =
    typeof statusValue === "string" &&
    contactStatuses.includes(statusValue as ContactMessageStatusValue)
      ? statusValue
      : "";

  const result = await updateContactMessageStatus(
    id,
    { status },
    prismaContactRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/contact");
  redirectWithStatus("Contact message updated.", "success");
}
