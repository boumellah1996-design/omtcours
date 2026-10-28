import { NextResponse } from "next/server";
import { authDenied, resolveAuth } from "@/lib/access";
import { isCourseSlug } from "@/lib/courses";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const auth = await resolveAuth();
  const denied = authDenied(auth);
  if (denied) return denied;
  const user = auth.status === "ok" ? auth.user : null;
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });

  const { slug } = await context.params;
  if (!isCourseSlug(slug)) return NextResponse.json({ ok: false, code: "unknown_course" }, { status: 404 });

  if (user.role !== "admin") {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseSlug: slug, status: "active" },
    });
    if (!enrollment) return NextResponse.json({ ok: false, code: "not_enrolled" }, { status: 403 });
  }

  const lessons = await prisma.lesson.findMany({
    where: { courseSlug: slug },
    orderBy: { position: "asc" },
    select: { id: true, title: true, position: true },
  });
  return NextResponse.json({ ok: true, lessons });
}
