import { NextResponse } from "next/server";
import { TEASER_COUNT, TEASER_SECONDS } from "@/lib/courses";
import { listCatalogTeasers } from "@/lib/teasers";

export async function GET() {
  const courses = await listCatalogTeasers();
  return NextResponse.json(
    {
      courses: courses.map((course) => ({
        slug: course.slug,
        level: course.level,
        teaserCount: TEASER_COUNT,
        teaserSeconds: TEASER_SECONDS,
        teasers: course.teasers,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
