import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { extractBunnyVideoId } from "@/lib/bunny";
import { isCourseSlug } from "@/lib/courses";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }
  const course = new URL(request.url).searchParams.get("course");
  const lessons = await prisma.lesson.findMany({
    where: course && isCourseSlug(course) ? { courseSlug: course } : undefined,
    orderBy: { position: "asc" },
    select: { id: true, courseSlug: true, title: true, position: true, bunnyVideoId: true },
  });
  return NextResponse.json({ ok: true, lessons, bunnyReady: Boolean(process.env.BUNNY_LIBRARY_ID && process.env.BUNNY_TOKEN_KEY) });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 400 });
  }
  const record = body as { courseSlug?: unknown; title?: unknown; bunnyVideoId?: unknown };
  if (typeof record.courseSlug !== "string" || !isCourseSlug(record.courseSlug)) {
    return NextResponse.json({ ok: false, code: "unknown_course" }, { status: 400 });
  }
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const bunnyVideoId = typeof record.bunnyVideoId === "string" ? extractBunnyVideoId(record.bunnyVideoId) : null;
  if (title.length < 2 || title.length > 80 || !bunnyVideoId) {
    return NextResponse.json({ ok: false, code: "invalid_video" }, { status: 400 });
  }
  const count = await prisma.lesson.count({ where: { courseSlug: record.courseSlug } });
  const lesson = await prisma.lesson.create({
    data: { courseSlug: record.courseSlug, title, bunnyVideoId, position: count + 1 },
    select: { id: true, courseSlug: true, title: true, position: true, bunnyVideoId: true },
  });
  return NextResponse.json({ ok: true, lesson }, { status: 201 });
}
