import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { createAdminUser } from "@/lib/auth/user-management-service";
import {
  type AdminUserSort,
  prismaAdminUserDirectoryRepository,
} from "@/lib/auth/user-repository";

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const sort: AdminUserSort =
    url.searchParams.get("sort") === "newest" ? "newest" : "name";
  const users = await prismaAdminUserDirectoryRepository.listAdmins({
    search: url.searchParams.get("q") ?? "",
    sort,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 10),
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
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

  const result = await createAdminUser(
    body,
    prismaAdminUserDirectoryRepository,
  );

  return result.ok
    ? NextResponse.json({ user: result.data }, { status: 201 })
    : NextResponse.json({ error: result.error }, { status: result.status });
}
