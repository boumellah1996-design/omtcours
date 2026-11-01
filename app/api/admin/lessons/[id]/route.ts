import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { bunnyConfigured, extractBunnyVideoId } from "@/lib/bunny";
import { ensureDatabase, prisma } from "@/lib/db";

const noStore = { "Cache-Control": "no-store" };

function fail(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status, headers: noStore });
}

async function requireLesson(id: string) {
  if (!(await requireAdmin())) return { error: fail("AUTH_REQUIRED", "Admin only.", 401) };
  await ensureDatabase();
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) return { error: fail("not_found", "Lesson not found.", 404) };
  return { lesson };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const found = await requireLesson(id);
    if ("error" in found) return found.error;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("invalid_form", "The lesson form could not be read.", 400);
    }
    const record = body as { title?: unknown; bunnyVideoId?: unknown };
    const title = typeof record.title === "string" ? record.title.trim() : "";
    const bunnyVideoId = typeof record.bunnyVideoId === "string" ? extractBunnyVideoId(record.bunnyVideoId) : null;
    if (title.length < 2 || title.length > 80) {
      return fail("invalid_title", "Enter a lesson title of at least 2 characters.", 400);
    }
    if (!bunnyVideoId) {
      return fail("invalid_video", "Paste a Bunny embed link or video ID, not a download URL.", 400);
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: { title, bunnyVideoId },
      select: { id: true, courseSlug: true, title: true, position: true, bunnyVideoId: true },
    });
    return NextResponse.json({ ok: true, lesson, bunnyReady: bunnyConfigured() }, { headers: noStore });
  } catch (error) {
    console.error("admin lesson update failed", error);
    return fail("save_failed", "The lesson could not be updated.", 500);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
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

    return NextResponse.json({ ok: true, bunnyReady: bunnyConfigured() }, { headers: noStore });
  } catch (error) {
    console.error("admin lesson delete failed", error);
    return fail("save_failed", "The lesson could not be deleted.", 500);
  }
}
