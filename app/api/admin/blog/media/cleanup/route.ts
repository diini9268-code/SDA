import { NextResponse } from "next/server";
import { requireBlogSession } from "@/lib/auth/require-admin";
import { deletePendingBlogMediaPaths } from "@/lib/blog/blog-media-storage";

export async function DELETE(request: Request) {
  const session = await requireBlogSession();
  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const paths =
    body &&
    typeof body === "object" &&
    "paths" in body &&
    Array.isArray(body.paths) &&
    body.paths.every((path) => typeof path === "string")
      ? body.paths.filter((path) =>
          path.startsWith(`pending/${session.sub}/`),
        )
      : null;

  if (!paths) {
    return NextResponse.json(
      { error: "A valid paths array is required." },
      { status: 400 },
    );
  }

  try {
    await deletePendingBlogMediaPaths(paths);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to clean up uploaded media.",
      },
      { status: 500 },
    );
  }
}
