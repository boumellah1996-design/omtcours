import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession, SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const jar = await cookies();
  const session = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (session?.role === "student" && session.sid) {
    await prisma.user.updateMany({
      where: { id: session.sub, activeSessionId: session.sid },
      data: { activeSessionId: "", lastSeenAt: null },
    });
  }
  jar.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
