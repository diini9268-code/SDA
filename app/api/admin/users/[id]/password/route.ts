import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { resetAdminUserPassword } from "@/lib/auth/user-management-service";
import { prismaAdminUserDirectoryRepository } from "@/lib/auth/user-repository";

type UserPasswordRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: UserPasswordRouteContext,
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  const result = await resetAdminUserPassword(
    id,
    body,
    prismaAdminUserDirectoryRepository,
  );

  return result.ok
    ? NextResponse.json({ user: result.data })
    : NextResponse.json({ error: result.error }, { status: result.status });
}
