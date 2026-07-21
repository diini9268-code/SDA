import { NextResponse } from "next/server";
import { requireBlogSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import { createBlogPost, listBlogPostsForActor } from "@/lib/blog/blog-service";
import { createBlogPostWithUploads } from "@/lib/blog/blog-media-workflow";

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await requireBlogSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const blog = await listBlogPostsForActor(
    { id: session.sub, role: session.role },
    prismaBlogRepository,
  );

  return NextResponse.json({ blog });
}

export async function POST(request: Request) {
  const session = await requireBlogSession();

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

  const usesManagedUploads =
    typeof body === "object" &&
    body !== null &&
    "uploads" in body;
  const result = usesManagedUploads
    ? await createBlogPostWithUploads(
        body,
        { id: session.sub, role: session.role },
        prismaBlogRepository,
      )
    : await createBlogPost(
        body,
        { id: session.sub, role: session.role },
        prismaBlogRepository,
      );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(
    {
      blog: result.data,
      ...("warnings" in result ? { warnings: result.warnings } : {}),
    },
    { status: 201 },
  );
}
