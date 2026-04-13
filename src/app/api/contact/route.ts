import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { sendNotificationEmail, contactEmailHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.create({
      data: parsed.data,
    });

    // Send email notification
    sendNotificationEmail({
      subject: `Contact: ${parsed.data.subject} — from ${parsed.data.name}`,
      html: contactEmailHtml(parsed.data),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
  }
}
