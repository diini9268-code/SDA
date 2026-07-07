import { NextResponse } from "next/server";
import { prismaLeadershipRepository } from "@/lib/leadership/leadership-repository";

export async function GET() {
  const leadership = await prismaLeadershipRepository.listPublic();

  return NextResponse.json({ leadership });
}
