import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sections = await prisma.technologySection.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, detail, imageUrl, imageAlt, badge, sortOrder } = body;

    if (!title || !description || !detail) {
      return NextResponse.json(
        { error: "Title, description, and detail are required" },
        { status: 400 }
      );
    }

    const section = await prisma.technologySection.create({
      data: {
        title,
        description,
        detail,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || "",
        badge: badge || null,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Technology create error:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, detail, imageUrl, imageAlt, badge, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const section = await prisma.technologySection.update({
      where: { id },
      data: {
        title,
        description,
        detail,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || "",
        badge: badge || null,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Technology update error:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.technologySection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Technology delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
