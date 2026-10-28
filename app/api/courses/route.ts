import { NextResponse } from "next/server";
import { TEASER_COUNT, TEASER_SECONDS, courseCatalog, teaserSources } from "@/lib/courses";

export async function GET() {
  return NextResponse.json({
    courses: courseCatalog.map((course) => ({
      slug: course.slug,
      level: course.level,
      teaserCount: TEASER_COUNT,
      teaserSeconds: TEASER_SECONDS,
      teasers: teaserSources[course.slug],
    })),
  });
}
