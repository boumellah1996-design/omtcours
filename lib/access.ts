import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { ensureDatabase, prisma } from "@/lib/db";
import { hashPassword, passwordMatches } from "@/lib/password";
import { readSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export const ENV_ADMIN_ID = "env-admin";

export function adminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@omt.local").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "OmtAdmin5401",
  };
}

export function envAdminUser(): User {
  const { email } = adminCredentials();
  return {
    id: ENV_ADMIN_ID,
    email,
    phone: null,
    name: "OMT Admin",
    passwordHash: "",
    loginCode: "",
    deviceCount: 0,
    role: "admin",
    activeSessionId: "",
    lastSeenAt: null,
    createdAt: new Date(),
  };
}

export type AuthResult = { status: "none" } | { status: "replaced" } | { status: "ok"; user: User };

export async function resolveAuth(): Promise<AuthResult> {
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return { status: "none" };
  if (session.role === "admin" && session.sub === ENV_ADMIN_ID) {
    return { status: "ok", user: envAdminUser() };
  }
  try {
    await ensureDatabase();
    const user = await prisma.user.findUnique({ where: { id: session.sub } });
    if (!user) return { status: "none" };
    if (user.role === "student" && (!session.sid || session.sid !== user.activeSessionId)) {
      return { status: "replaced" };
    }
    return { status: "ok", user };
  } catch (error) {
    console.error("resolveAuth failed", error);
    if (session.role === "admin") return { status: "ok", user: envAdminUser() };
    return { status: "none" };
  }
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
  const { email, password } = adminCredentials();
  await ensureDatabase();
  const passwordHash = await hashPassword(password);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role === "admin" && !(await passwordMatches(password, existing.passwordHash))) {
      await prisma.user.update({ where: { id: existing.id }, data: { passwordHash } });
    }
    return existing;
  }
  return prisma.user.create({
    data: {
      email,
      name: "OMT Admin",
      role: "admin",
      passwordHash,
    },
  });
}
