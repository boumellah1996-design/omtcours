import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { readSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export type AuthResult = { status: "none" } | { status: "replaced" } | { status: "ok"; user: User };

export async function resolveAuth(): Promise<AuthResult> {
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return { status: "none" };
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return { status: "none" };
  if (user.role === "student" && (!session.sid || session.sid !== user.activeSessionId)) {
    return { status: "replaced" };
  }
  return { status: "ok", user };
}

export function authDenied(auth: AuthResult) {
  if (auth.status === "ok") return null;
  const response = NextResponse.json(
    { ok: false, code: auth.status === "replaced" ? "session_replaced" : "AUTH_REQUIRED" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
  if (auth.status === "replaced") {
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  }
  return response;
}

export async function currentUser() {
  const auth = await resolveAuth();
  return auth.status === "ok" ? auth.user : null;
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@omt.local").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;
  await prisma.user.create({
    data: {
      email,
      name: "OMT Admin",
      role: "admin",
      passwordHash: await hashPassword(password),
    },
  });
}
