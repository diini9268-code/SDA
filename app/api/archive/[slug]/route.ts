import { NextResponse } from "next/server";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const archive = await prismaArchiveRepository.findPublicBySlug(slug);

  if (!archive) {
    return NextResponse.json(
      { error: "Archive entry not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ archive });
}
