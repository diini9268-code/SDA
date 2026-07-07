import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  deleteLeadershipProfile,
  updateLeadershipProfile,
} from "@/lib/leadership/leadership-service";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session) {
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
  const result = await updateLeadershipProfile(
    id,
    body,
    prismaLeadershipRepository,
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ leadership: result.data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const result = await deleteLeadershipProfile(id, prismaLeadershipRepository);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return new Response(null, { status: 204 });
}
