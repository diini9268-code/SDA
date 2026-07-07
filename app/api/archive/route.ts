import { NextResponse } from "next/server";
import { prismaArchiveRepository } from "@/lib/archive/archive-repository";

export async function GET() {
  const archive = await prismaArchiveRepository.listPublic();

  return NextResponse.json({ archive });
}
