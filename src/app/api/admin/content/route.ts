import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const content = await prisma.siteContent.findMany({
    orderBy: { key: "asc" },
  });
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, content } = body;

    if (!key || typeof content !== "string") {
      return NextResponse.json(
        { error: "Key and content are required" },
        { status: 400 }
      );
    }

    await prisma.siteContent.upsert({
      where: { key },
      update: { content },
      create: { key, content },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
