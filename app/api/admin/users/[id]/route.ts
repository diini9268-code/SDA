import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  deleteAdminUser,
  updateAdminUser,
} from "@/lib/auth/user-management-service";
import { prismaAdminUserDirectoryRepository } from "@/lib/auth/user-repository";

type UserRouteContext = {
  params: Promise<{ id: string }>;
};

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: UserRouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const user = await prismaAdminUserDirectoryRepository.findAdminById(id);

  return user
    ? NextResponse.json({ user })
    : NextResponse.json(
        { error: "Administrator account not found." },
        { status: 404 },
      );
}

export async function PATCH(request: Request, context: UserRouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const body = await readJson(request);
  if (!body) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  const result = await updateAdminUser(
    id,
    body,
    prismaAdminUserDirectoryRepository,
  );

  return result.ok
    ? NextResponse.json({ user: result.data })
    : NextResponse.json({ error: result.error }, { status: result.status });
}

export async function DELETE(_request: Request, context: UserRouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const result = await deleteAdminUser(
    id,
    session.sub,
    prismaAdminUserDirectoryRepository,
  );

  return result.ok
    ? new Response(null, { status: 204 })
    : NextResponse.json({ error: result.error }, { status: result.status });
}
