import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { bunnyConfigured, extractBunnyVideoId } from "@/lib/bunny";
import { isCourseSlug } from "@/lib/courses";
import { ensureDatabase, prisma } from "@/lib/db";

const noStore = { "Cache-Control": "no-store" };

function fail(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status, headers: noStore });
}

function lessonJson(lesson: { id: string; courseSlug: string; title: string; position: number; bunnyVideoId: string }) {
  return {
    id: lesson.id,
    courseSlug: lesson.courseSlug,
    title: lesson.title,
    position: lesson.position,
    bunnyVideoId: lesson.bunnyVideoId,
  };
}

function courseLock(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
  return hash;
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return fail("AUTH_REQUIRED", "Admin only.", 401);
    }
    await ensureDatabase();
    const course = new URL(request.url).searchParams.get("course");
    const lessons = await prisma.lesson.findMany({
      where: course && isCourseSlug(course) ? { courseSlug: course } : undefined,
      orderBy: [{ courseSlug: "asc" }, { position: "asc" }],
      select: { id: true, courseSlug: true, title: true, position: true, bunnyVideoId: true },
    });
    return NextResponse.json(
      { ok: true, lessons: lessons.map(lessonJson), bunnyReady: bunnyConfigured() },
      { headers: noStore },
    );
  } catch (error) {
    console.error("admin lessons list failed", error);
    return fail("db_unavailable", "Could not load course lessons.", 503);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return fail("AUTH_REQUIRED", "Admin only.", 401);
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("invalid_form", "The lesson form could not be read.", 400);
    }
    const record = body as { courseSlug?: unknown; title?: unknown; bunnyVideoId?: unknown };
    if (typeof record.courseSlug !== "string" || !isCourseSlug(record.courseSlug)) {
      return fail("unknown_course", "Choose a valid course.", 400);
    }
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const bunnyVideoId = typeof record.bunnyVideoId === "string" ? extractBunnyVideoId(record.bunnyVideoId) : null;
    if (title.length < 2 || title.length > 80) {
      return fail("invalid_title", "Enter a lesson title of at least 2 characters.", 400);
    }
    if (!bunnyVideoId) {
      return fail("invalid_video", "Paste a Bunny embed link or video ID, not a download URL.", 400);
    }
    await ensureDatabase();
    const lesson = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${courseLock(record.courseSlug)})`;
      const last = await tx.lesson.aggregate({
        where: { courseSlug: record.courseSlug },
        _max: { position: true },
      });
      return tx.lesson.create({
        data: {
          courseSlug: record.courseSlug,
          title,
          bunnyVideoId,
          position: (last._max.position ?? 0) + 1,
        },
        select: { id: true, courseSlug: true, title: true, position: true, bunnyVideoId: true },
      });
    });
    return NextResponse.json(
      { ok: true, lesson: lessonJson(lesson), bunnyReady: bunnyConfigured() },
      { status: 201, headers: noStore },
    );
  } catch (error) {
    console.error("admin lesson create failed", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientInitializationError) {
      return fail("save_failed", "The lesson could not be saved.", 500);
    }
    return fail("save_failed", "The lesson could not be saved.", 500);
  }
}
