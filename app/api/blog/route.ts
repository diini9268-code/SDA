import { NextResponse } from "next/server";
import { prismaBlogRepository } from "@/lib/blog/blog-repository";

export async function GET() {
  const blog = await prismaBlogRepository.listPublic();

  return NextResponse.json({ blog });
}
