import { NextResponse } from "next/server";
import { requireBlogSession } from "@/lib/auth/require-admin";
import { createSignedBlogMediaUpload } from "@/lib/blog/blog-media-storage";

export async function POST(request: Request) {
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

  if (
    !body ||
    typeof body !== "object" ||
    !("name" in body) ||
    !("type" in body) ||
    !("size" in body) ||
    typeof body.name !== "string" ||
    typeof body.type !== "string" ||
    typeof body.size !== "number"
  ) {
    return NextResponse.json(
      { error: "Valid file name, type, and size fields are required." },
      { status: 400 },
    );
  }

  try {
    const upload = await createSignedBlogMediaUpload({
      name: body.name as string,
      type: body.type as string,
      size: body.size as number,
      createdById: session.sub,
    });
    return NextResponse.json(upload, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to prepare the media upload.",
      },
      { status: 400 },
    );
  }
}
