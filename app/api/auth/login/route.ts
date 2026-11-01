import { NextResponse } from "next/server";
import { connection } from "next/server";
import { ENV_ADMIN_ID, adminCredentials, ensureAdmin } from "@/lib/access";
import { ensureDatabase, prisma } from "@/lib/db";
import { passwordMatches } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

function safeNext(value: unknown, role: string) {
  const fallback = role === "admin" ? "/admin" : "/learn";
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (role !== "admin" && value.startsWith("/admin")) return "/learn";
  return value;
}

async function adminResponse(next: unknown) {
  const response = NextResponse.json(
    { ok: true, role: "admin", next: safeNext(next, "admin") },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(SESSION_COOKIE, await createSessionToken({ id: ENV_ADMIN_ID, role: "admin" }), sessionCookieOptions());
  return response;
}

function isEnvAdmin(identifier: string, secret: string) {
  const admin = adminCredentials();
  return identifier.toLowerCase() === admin.email && secret === admin.password;
}

export async function POST(request: Request) {
  try {
    await connection();
  } catch {
    // login remains request-time even if prerender marks it static
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid", message: "Invalid login payload." }, { status: 400 });
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

  if (isEnvAdmin(identifier, secret)) {
    try {
      await ensureAdmin();
    } catch (error) {
      console.error("ensureAdmin failed", error);
    }
    return adminResponse(next);
  }

  try {
    await ensureDatabase();
    const digits = identifier.replace(/\D/g, "");
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { loginCode: identifier },
          ...(digits.length >= 9 ? [{ phone: digits }] : []),
        ],
      },
    });
    const matched = user && (await passwordMatches(secret, user.passwordHash)) ? user : null;
    if (!matched) {
      return NextResponse.json({ ok: false, code: "invalid" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    if (matched.role === "admin") {
      return adminResponse(next);
    }

    const sid = crypto.randomUUID();
    await prisma.user.update({ where: { id: matched.id }, data: { activeSessionId: sid } });
    const response = NextResponse.json(
      { ok: true, role: "student", next: safeNext(next, "student") },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(
      SESSION_COOKIE,
      await createSessionToken({ id: matched.id, role: "student", sid }),
      sessionCookieOptions(),
    );
    return response;
  } catch (error) {
    console.error("login failed", error);
    if (isEnvAdmin(identifier, secret)) return adminResponse(next);
    return NextResponse.json(
      { ok: false, code: "db_unavailable", message: "The login database is unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
