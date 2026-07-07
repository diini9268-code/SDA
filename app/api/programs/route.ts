import { NextResponse } from "next/server";
import { prismaProgramRepository } from "@/lib/programs/program-repository";

export async function GET() {
  const programs = await prismaProgramRepository.listPublic();

  return NextResponse.json({ programs });
}
