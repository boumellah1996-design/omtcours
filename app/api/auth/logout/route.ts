import { cookies } from "next/headers";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST() {
  try {
    await connection();
  } catch {
    // cookie writes still work in the route handler
  }
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (session?.role === "student" && session.sid) {
    try {
      await prisma.user.updateMany({
        where: { id: session.sub, activeSessionId: session.sid },
        data: { activeSessionId: "", lastSeenAt: null },
      });
    } catch (error) {
      console.error("logout session clear failed", error);
    }
  }
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
