import { NextResponse } from "next/server";
import { authDenied, resolveAuth } from "@/lib/access";
import { courseCatalog, isCourseSlug } from "@/lib/courses";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await resolveAuth();
  const denied = authDenied(auth);
  if (denied) return denied;
  const user = auth.status === "ok" ? auth.user : null;
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });

  if (user.role === "admin") {
    return NextResponse.json({ ok: true, courses: courseCatalog.map((course) => course.slug) });
  }

  const rows = await prisma.enrollment.findMany({
    where: { userId: user.id, status: "active" },
    select: { courseSlug: true },
  });
  const courses = [...new Set(rows.map((row) => row.courseSlug))].filter(isCourseSlug);
  return NextResponse.json({ ok: true, courses });
}
