import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { galleryItemSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { images, ...itemData } = body;

    const parsed = galleryItemSchema.safeParse(itemData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Delete existing images and recreate
    await prisma.galleryImage.deleteMany({ where: { galleryItemId: id } });

    const item = await prisma.galleryItem.update({
      where: { id },
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
    console.error("Gallery update error:", error);
    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
