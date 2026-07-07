import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";
import {
  deleteArchiveEntry,
  updateArchiveEntry,
} from "@/lib/archive/archive-service";

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
  const result = await updateArchiveEntry(id, body, prismaArchiveRepository);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ archive: result.data });
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
  const result = await deleteArchiveEntry(id, prismaArchiveRepository);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return new Response(null, { status: 204 });
}
