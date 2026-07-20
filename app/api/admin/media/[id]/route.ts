import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteMediaAsset } from "@/lib/media/media-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  try {
    const deleted = await deleteMediaAsset((await context.params).id);
    return deleted
      ? NextResponse.json({ deleted: true })
      : NextResponse.json({ error: "Media asset not found." }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to delete the file.",
      },
      { status: 409 },
    );
  }
}
