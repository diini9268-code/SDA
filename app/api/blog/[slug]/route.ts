import { NextResponse } from "next/server";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const blog = await prismaBlogRepository.findPublicBySlug(slug);

  if (!blog) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  return NextResponse.json({ blog });
}
