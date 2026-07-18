import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";
import {
  deleteBlogPost,
  updateBlogPost,
} from "@/lib/blog/blog-service";
import {
  deleteStoredBlogMedia,
  updateBlogPostWithUploads,
} from "@/lib/blog/blog-media-workflow";

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
  const usesManagedUploads =
    typeof body === "object" &&
    body !== null &&
    ("uploads" in body || "retainedMedia" in body);
  const result = usesManagedUploads
    ? await updateBlogPostWithUploads(id, body, prismaBlogRepository)
    : await updateBlogPost(id, body, prismaBlogRepository);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    blog: result.data,
    ...("warnings" in result ? { warnings: result.warnings } : {}),
  });
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
  const blog = await prismaBlogRepository.findById(id);
  const result = await deleteBlogPost(id, prismaBlogRepository);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  if (blog) {
    await deleteStoredBlogMedia(blog);
  }

  return new Response(null, { status: 204 });
}
