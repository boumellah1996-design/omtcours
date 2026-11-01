import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/db";
import { countFilledTeasers } from "@/lib/teasers";

const ONLINE_MS = 45_000;

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Admin only." }, { status: 401 });
    }
    const since = new Date(Date.now() - ONLINE_MS);
    const [students, online, teasers] = await Promise.all([
      prisma.user.count({ where: { role: "student" } }),
      prisma.user.count({
        where: { role: "student", activeSessionId: { not: "" }, lastSeenAt: { gte: since } },
      }),
      countFilledTeasers(),
    ]);
    return NextResponse.json({ ok: true, students, online, teasers }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("admin stats failed", error);
    return NextResponse.json({ ok: false, code: "db_unavailable", message: "Stats are unavailable." }, { status: 503 });
  }
}
