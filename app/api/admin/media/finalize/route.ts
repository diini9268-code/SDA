import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  completeMediaUpload,
  isSharedMediaDestination,
} from "@/lib/media/media-service";

export async function POST(request: Request) {
  const session = await requireAdminSession();

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
    !("path" in body) ||
    !("name" in body) ||
    !("type" in body) ||
    !("size" in body) ||
    !("destination" in body) ||
    typeof body.path !== "string" ||
    typeof body.name !== "string" ||
    typeof body.type !== "string" ||
    typeof body.size !== "number" ||
    !isSharedMediaDestination(body.destination)
  ) {
    return NextResponse.json(
      { error: "Valid uploaded file metadata and destination are required." },
      { status: 400 },
    );
  }

  try {
    const asset = await completeMediaUpload({
      path: body.path,
      name: body.name,
      type: body.type,
      size: body.size,
      altText:
        "altText" in body && typeof body.altText === "string"
          ? body.altText
          : undefined,
      destination: body.destination,
      createdById: session.sub,
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save the file.",
      },
      { status: 400 },
    );
  }
}
