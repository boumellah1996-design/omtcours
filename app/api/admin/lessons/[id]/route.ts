import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { extractBunnyVideoId } from "@/lib/bunny";
import { prisma } from "@/lib/db";

async function requireLesson(id: string) {
  if (!(await requireAdmin())) return { error: NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 }) };
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) return { error: NextResponse.json({ ok: false, code: "generic" }, { status: 404 }) };
  return { lesson };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const found = await requireLesson(id);
  if ("error" in found) return found.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 400 });
  }
  const record = body as { title?: unknown; bunnyVideoId?: unknown };
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const bunnyVideoId = typeof record.bunnyVideoId === "string" ? extractBunnyVideoId(record.bunnyVideoId) : null;
  if (title.length < 2 || title.length > 80 || !bunnyVideoId) {
    return NextResponse.json({ ok: false, code: "invalid_video" }, { status: 400 });
  }

  const lesson = await prisma.lesson.update({
    where: { id },
    data: { title, bunnyVideoId },
    select: { id: true, courseSlug: true, title: true, position: true, bunnyVideoId: true },
  });
  return NextResponse.json({ ok: true, lesson });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const found = await requireLesson(id);
  if ("error" in found) return found.error;

  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({ where: { id } });
    const rest = await tx.lesson.findMany({
      where: { courseSlug: found.lesson.courseSlug },
      orderBy: { position: "asc" },
    });
    for (let index = 0; index < rest.length; index += 1) {
      const position = index + 1;
      if (rest[index].position !== position) {
        await tx.lesson.update({ where: { id: rest[index].id }, data: { position } });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
