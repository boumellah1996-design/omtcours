import { NextResponse } from "next/server";
import { authDenied, resolveAuth } from "@/lib/access";
import { bunnyConfigured, isBunnyEmbed, signBunnyEmbed } from "@/lib/bunny";
import { ensureDatabase, prisma } from "@/lib/db";

export async function GET(_request: Request, context: { params: Promise<{ lessonId: string }> }) {
  try {
    const auth = await resolveAuth();
    const denied = authDenied(auth);
    if (denied) return denied;
    const user = auth.status === "ok" ? auth.user : null;
    if (!user) return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Sign in required." }, { status: 401 });

    const { lessonId } = await context.params;
    await ensureDatabase();
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ ok: false, code: "not_found", message: "Lesson not found." }, { status: 404 });

    if (user.role !== "admin") {
      const enrollment = await prisma.enrollment.findFirst({
        where: { userId: user.id, courseSlug: lesson.courseSlug, status: "active" },
      });
      if (!enrollment) {
        return NextResponse.json({ ok: false, code: "not_enrolled", message: "This account is not enrolled in this course." }, { status: 403 });
      }
    }

    if (!bunnyConfigured()) {
      return NextResponse.json({ ok: false, code: "video_not_configured", message: "Bunny playback is not configured." }, { status: 503 });
    }

    const signed = signBunnyEmbed(lesson.bunnyVideoId);
    if (!signed || !isBunnyEmbed(signed.url)) {
      return NextResponse.json({ ok: false, code: "video_not_configured", message: "The lesson video cannot be signed." }, { status: 503 });
    }

    return NextResponse.json(
      { ok: true, embedUrl: signed.url, expiresAt: signed.expiresAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("learn play failed", error);
    return NextResponse.json({ ok: false, code: "db_unavailable", message: "Playback is temporarily unavailable." }, { status: 503 });
  }
}
