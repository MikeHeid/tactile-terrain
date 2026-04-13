import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, imageUrl } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.teamMember.aggregate({
      _max: { sortOrder: true },
    });

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        company: company || null,
        imageUrl: imageUrl || null,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Team create error:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
