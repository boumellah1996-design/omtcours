import { NextResponse } from "next/server";
import { TEASER_COUNT, TEASER_SECONDS, getCourse, isCourseSlug } from "@/lib/courses";
import { listCourseTeasers } from "@/lib/teasers";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const course = getCourse(slug);

  if (!course || !isCourseSlug(slug)) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }

  let teasers;
  try {
    teasers = await listCourseTeasers(slug);
  } catch (error) {
    console.error("course teasers failed", error);
    return NextResponse.json({ ok: false, code: "db_unavailable", message: "Course teasers are unavailable." }, { status: 503 });
  }

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
