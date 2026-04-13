import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { homepageContentSchema } from "@/lib/validations";

export async function GET() {
  const content = await prisma.homepageContent.findUnique({
    where: { id: "singleton" },
  });
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { featuredIds, ...contentData } = body;

    const parsed = homepageContentSchema.safeParse(contentData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Update homepage content
    await prisma.homepageContent.upsert({
      where: { id: "singleton" },
      update: parsed.data,
      create: { id: "singleton", ...parsed.data },
    });

    // Update featured flags
    if (Array.isArray(featuredIds)) {
      await prisma.galleryItem.updateMany({
        data: { featured: false },
      });
      if (featuredIds.length > 0) {
        await prisma.galleryItem.updateMany({
          where: { id: { in: featuredIds } },
          data: { featured: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Homepage update error:", error);
    return NextResponse.json(
      { error: "Failed to update homepage" },
      { status: 500 }
    );
  }
}
