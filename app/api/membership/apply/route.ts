import { NextResponse } from "next/server";
import { prismaMembershipRepository } from "@/lib/membership/membership-repository";
import { submitMembershipApplication } from "@/lib/membership/membership-service";
import {
  getClientIdentifier,
  isPublicFormRateLimited,
  registerPublicFormSubmission,
} from "@/lib/security/rate-limit";

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const rateLimitIdentifier = getClientIdentifier(
    request.headers,
    "membership",
  );

  if (isPublicFormRateLimited(rateLimitIdentifier)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 },
    );
  }

  const body = await readJson(request);

  if (!body) {
    registerPublicFormSubmission(rateLimitIdentifier);
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = await submitMembershipApplication(
    body,
    prismaMembershipRepository,
  );

  if (!result.ok) {
    registerPublicFormSubmission(rateLimitIdentifier);
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  registerPublicFormSubmission(rateLimitIdentifier);

  return NextResponse.json(
    {
      application: {
        id: result.data.id,
        status: result.data.status,
        submittedAt: result.data.submittedAt,
      },
    },
    { status: 201 },
  );
}
