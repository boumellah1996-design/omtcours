import { NextResponse } from "next/server";
import { ENV_ADMIN_ID, adminCredentials, ensureAdmin } from "@/lib/access";
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
    const admin = await ensureAdmin();
    const digits = identifier.replace(/\D/g, "");
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier.toLowerCase() }, ...(digits.length >= 9 ? [{ phone: digits }] : [])],
      },
    });
    const matched = user && (await passwordMatches(secret, user.passwordHash)) ? user : null;
    const envAdmin = adminCredentials();
    const useEnvAdmin =
      !matched &&
      identifier.toLowerCase() === envAdmin.email &&
      secret === envAdmin.password;

    if (!matched && !useEnvAdmin) {
      return NextResponse.json({ ok: false, code: "invalid" }, { status: 401 });
    }

    const account = matched ?? admin ?? { id: ENV_ADMIN_ID, role: "admin" as const };
    const role = account.role === "admin" ? "admin" : "student";
    let sid: string | undefined;
    if (role === "student" && matched) {
      sid = crypto.randomUUID();
      await prisma.user.update({ where: { id: matched.id }, data: { activeSessionId: sid } });
    }
    const response = NextResponse.json({
      ok: true,
      role,
      next: safeNext(next, role),
    });
    response.cookies.set(
      SESSION_COOKIE,
      await createSessionToken({ id: useEnvAdmin && !matched ? ENV_ADMIN_ID : account.id, role, sid }),
      sessionCookieOptions(),
    );
    return response;
  } catch (error) {
    console.error("login failed", error);
    const envAdmin = adminCredentials();
    if (identifier.toLowerCase() === envAdmin.email && secret === envAdmin.password) {
      const response = NextResponse.json({ ok: true, role: "admin", next: safeNext(next, "admin") });
      response.cookies.set(
        SESSION_COOKIE,
        await createSessionToken({ id: ENV_ADMIN_ID, role: "admin" }),
        sessionCookieOptions(),
      );
      return response;
    }
    return NextResponse.json({ ok: false, code: "generic" }, { status: 500 });
  }
}
