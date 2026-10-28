import { NextResponse } from "next/server";
import { TEASER_COUNT, TEASER_SECONDS, getCourse, teaserSources } from "@/lib/courses";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const course = getCourse(slug);

  if (!course) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    course: {
      slug: course.slug,
      level: course.level,
      teaserCount: TEASER_COUNT,
      teaserSeconds: TEASER_SECONDS,
      teasers: teaserSources[course.slug],
    },
  });
}
