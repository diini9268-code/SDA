"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prismaContactRepository } from "@/lib/contact/contact-repository";
import { submitContactMessage } from "@/lib/contact/contact-service";
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
    `/contact?${new URLSearchParams({
      [status]: message,
    }).toString()}`,
  );
}

export async function submitContactMessageAction(formData: FormData) {
  const rateLimitIdentifier = getClientIdentifier(await headers(), "contact");

  if (isPublicFormRateLimited(rateLimitIdentifier)) {
    redirectWithStatus("Too many submissions. Try again later.", "error");
  }

  const result = await submitContactMessage(
    {
      fullName: getText(formData, "fullName"),
      email: getText(formData, "email"),
      subject: getText(formData, "subject"),
      message: getText(formData, "message"),
    },
    prismaContactRepository,
  );

  if (!result.ok) {
    registerPublicFormSubmission(rateLimitIdentifier);
    redirectWithStatus(result.error, "error");
  }

  registerPublicFormSubmission(rateLimitIdentifier);
  redirectWithStatus("Contact message sent.", "success");
}
