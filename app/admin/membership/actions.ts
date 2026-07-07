"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import { updateMembershipApplicationStatus } from "@/lib/membership/membership-service";
import type { ApplicationStatusValue } from "@/lib/membership/validation";

const applicationStatuses: ApplicationStatusValue[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/admin/membership?${new URLSearchParams({
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

export async function updateMembershipStatusAction(
  id: string,
  formData: FormData,
) {
  await requireActionAdmin();

  const statusValue = formData.get("status");
  const status =
    typeof statusValue === "string" &&
    applicationStatuses.includes(statusValue as ApplicationStatusValue)
      ? statusValue
      : "";

  const result = await updateMembershipApplicationStatus(
    id,
    { status },
    prismaMembershipRepository,
  );

  if (!result.ok) {
    redirectWithStatus(result.error, "error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/membership");
  redirectWithStatus("Membership application updated.", "success");
}
