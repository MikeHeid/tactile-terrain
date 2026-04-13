import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { galleryItemSchema } from "@/lib/validations";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, ...itemData } = body;

    const parsed = galleryItemSchema.safeParse(itemData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        ...parsed.data,
        images: {
          create: (images || []).map((img: { url: string; alt: string }, i: number) => ({
            url: img.url,
            alt: img.alt || "",
            sortOrder: i,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
