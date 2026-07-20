import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  isSharedMediaDestination,
  prepareMediaUpload,
} from "@/lib/media/media-service";

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
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
    !("destination" in body) ||
    typeof body.name !== "string" ||
    typeof body.type !== "string" ||
    typeof body.size !== "number" ||
    !isSharedMediaDestination(body.destination)
  ) {
    return NextResponse.json(
      { error: "Valid file metadata and destination are required." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(
      await prepareMediaUpload({
        name: body.name,
        type: body.type,
        size: body.size,
      }),
      { status: 201 },
    );
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
