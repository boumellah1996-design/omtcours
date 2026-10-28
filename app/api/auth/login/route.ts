import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/access";
import { prisma } from "@/lib/db";
import { passwordMatches } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

function safeNext(value: unknown, role: string) {
  const fallback = role === "admin" ? "/admin" : "/learn";
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (role !== "admin" && value.startsWith("/admin")) return "/learn";
  return value;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  const { email, password, next } = body as { email?: unknown; password?: unknown; next?: unknown };
  const identifier = typeof email === "string" ? email.trim() : "";
  const secret = typeof password === "string" ? password : "";
  if (identifier.length < 3 || secret.length < 4) {
    return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
  }

  try {
    await ensureAdmin();
    const digits = identifier.replace(/\D/g, "");
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier.toLowerCase() }, ...(digits.length >= 9 ? [{ phone: digits }] : [])],
      },
    });
    if (!user || !(await passwordMatches(secret, user.passwordHash))) {
      return NextResponse.json({ ok: false, code: "invalid" }, { status: 401 });
    }

    const role = user.role === "admin" ? "admin" : "student";
    let sid: string | undefined;
    if (role === "student") {
      sid = crypto.randomUUID();
      await prisma.user.update({ where: { id: user.id }, data: { activeSessionId: sid } });
    }
    const response = NextResponse.json({
      ok: true,
      role: user.role,
      next: safeNext(next, user.role),
    });
    response.cookies.set(SESSION_COOKIE, await createSessionToken({ id: user.id, role, sid }), sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 500 });
  }
}
