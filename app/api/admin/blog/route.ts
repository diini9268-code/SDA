import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { createBlogPost } from "@/lib/blog/blog-service";

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const blog = await prismaBlogRepository.listAll();

  return NextResponse.json({ blog });
}

export async function POST(request: Request) {
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

  const result = await createBlogPost(body, prismaBlogRepository);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ blog: result.data }, { status: 201 });
}
