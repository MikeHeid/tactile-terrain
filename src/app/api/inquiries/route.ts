import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customOrderSchema } from "@/lib/validations";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      organization: (formData.get("organization") as string) || undefined,
      projectType: formData.get("projectType") as string,
      scale: (formData.get("scale") as string) || undefined,
      timeline: (formData.get("timeline") as string) || undefined,
      budgetRange: (formData.get("budgetRange") as string) || undefined,
      description: formData.get("description") as string,
    };

    const parsed = customOrderSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    // Handle file upload if present
    let fileUrl: string | undefined;
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File must be under 10MB" },
          { status: 400 }
        );
      }

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { put } = await import("@vercel/blob");
        const blob = await put(`inquiries/${Date.now()}-${file.name}`, file, {
          access: "public",
        });
        fileUrl = blob.url;
      } else {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const bytes = await file.arrayBuffer();
        await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes));
        fileUrl = `/uploads/${filename}`;
      }
    }

    await prisma.customOrderInquiry.create({
      data: {
        ...parsed.data,
        fileUrl,
      },
    });

    // TODO: Send email notification to admin

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
