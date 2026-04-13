import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 401 });
  }

  // Check password against DB first, then fall back to env var
  const dbPassword = await prisma.siteContent.findUnique({
    where: { key: "admin_password" },
  });

  const validPasswords: string[] = [];

  // Primary password from DB
  if (dbPassword?.content) {
    validPasswords.push(dbPassword.content);
  }

  // Additional passwords from DB (comma-separated)
  const extraPasswords = await prisma.siteContent.findUnique({
    where: { key: "admin_extra_passwords" },
  });
  if (extraPasswords?.content) {
    const extras = extraPasswords.content
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    validPasswords.push(...extras);
  }

  // Fallback to env var
  if (validPasswords.length === 0 && process.env.ADMIN_PASSWORD) {
    validPasswords.push(process.env.ADMIN_PASSWORD);
  }

  if (!validPasswords.includes(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.isLoggedIn = true;
  await session.save();

  return response;
}
