import { NextResponse } from "next/server";
import { resolveAuth } from "@/lib/access";
import { prisma } from "@/lib/db";

export async function POST() {
  const auth = await resolveAuth();
  if (auth.status !== "ok" || auth.user.role !== "student") {
    return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await prisma.user.update({
    where: { id: auth.user.id },
    data: { lastSeenAt: new Date() },
  });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
