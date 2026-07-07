"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import { submitMembershipApplication } from "@/lib/membership/membership-service";
import {
  getClientIdentifier,
  isPublicFormRateLimited,
  registerPublicFormSubmission,
} from "@/lib/security/rate-limit";

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function redirectWithStatus(message: string, status: "success" | "error") {
  redirect(
    `/membership?${new URLSearchParams({
      [status]: message,
    }).toString()}`,
  );
}

export async function submitMembershipApplicationAction(formData: FormData) {
  const rateLimitIdentifier = getClientIdentifier(
    await headers(),
    "membership",
  );

  if (isPublicFormRateLimited(rateLimitIdentifier)) {
    redirectWithStatus("Too many submissions. Try again later.", "error");
  }

  const result = await submitMembershipApplication(
    {
      fullName: getText(formData, "fullName"),
      email: getText(formData, "email"),
      phone: getText(formData, "phone"),
      university: getText(formData, "university"),
      areaOfInterest: getText(formData, "areaOfInterest"),
    },
    prismaMembershipRepository,
  );

  if (!result.ok) {
    registerPublicFormSubmission(rateLimitIdentifier);
    redirectWithStatus(result.error, "error");
  }

  registerPublicFormSubmission(rateLimitIdentifier);
  redirectWithStatus("Membership application submitted.", "success");
}
