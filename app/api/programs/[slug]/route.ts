import { NextResponse } from "next/server";
import { prismaProgramRepository } from "@/lib/programs/program-repository";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const program = await prismaProgramRepository.findPublicBySlug(slug);

  if (!program) {
    return NextResponse.json({ error: "Program not found." }, { status: 404 });
  }

  return NextResponse.json({ program });
}
