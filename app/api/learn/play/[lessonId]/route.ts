import { NextResponse } from "next/server";
import { authDenied, resolveAuth } from "@/lib/access";
import { bunnyConfigured, signBunnyEmbed } from "@/lib/bunny";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, context: { params: Promise<{ lessonId: string }> }) {
  const auth = await resolveAuth();
  const denied = authDenied(auth);
  if (denied) return denied;
  const user = auth.status === "ok" ? auth.user : null;
  if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });

  const { lessonId } = await context.params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return NextResponse.json({ ok: false, code: "generic" }, { status: 404 });

  if (user.role !== "admin") {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseSlug: lesson.courseSlug, status: "active" },
    });
    if (!enrollment) return NextResponse.json({ ok: false, code: "not_enrolled" }, { status: 403 });
  }

  if (!bunnyConfigured()) {
    return NextResponse.json({ ok: false, code: "video_not_configured" }, { status: 503 });
  }

  const signed = signBunnyEmbed(lesson.bunnyVideoId);
  if (!signed) return NextResponse.json({ ok: false, code: "video_not_configured" }, { status: 503 });

  return NextResponse.json(
    { ok: true, embedUrl: signed.url, expiresAt: signed.expiresAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
