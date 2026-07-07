import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { prismaContactRepository } from "@/lib/contact/contact-repository";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: "Administrator authentication required." },
      { status: 401 },
    );
  }

  const messages = await prismaContactRepository.listAll();

  return NextResponse.json({ messages });
}
