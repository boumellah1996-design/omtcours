import { NextResponse } from "next/server";
import { TEASER_COUNT, TEASER_SECONDS, getCourse, isCourseSlug } from "@/lib/courses";
import { listCourseTeasers } from "@/lib/teasers";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const course = getCourse(slug);

  if (!course || !isCourseSlug(slug)) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }

  const teasers = await listCourseTeasers(slug);

  return NextResponse.json(
    {
      course: {
        slug: course.slug,
        level: course.level,
        teaserCount: TEASER_COUNT,
        teaserSeconds: TEASER_SECONDS,
        teasers,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
