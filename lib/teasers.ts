import { bunnyConfigured, signBunnyEmbed } from "@/lib/bunny";
import { TEASER_COUNT, courseCatalog, isCourseSlug, type CourseSlug } from "@/lib/courses";
import { ensureDatabase, prisma } from "@/lib/db";

export type TeaserLesson = {
  id: string;
  title: string;
  position: number;
};

export async function listCourseTeasers(slug: CourseSlug): Promise<TeaserLesson[]> {
  await ensureDatabase();
  return prisma.lesson.findMany({
    where: { courseSlug: slug },
    orderBy: { position: "asc" },
    take: TEASER_COUNT,
    select: { id: true, title: true, position: true },
  });
}

export async function listCatalogTeasers() {
  const grouped = await Promise.all(
    courseCatalog.map(async (course) => ({
      slug: course.slug,
      level: course.level,
      teasers: await listCourseTeasers(course.slug),
    })),
  );
  return grouped;
}

export async function countFilledTeasers() {
  await ensureDatabase();
  return prisma.lesson.count({ where: { position: { lte: TEASER_COUNT } } });
}

export async function signPublicTeaser(lessonId: string) {
  await ensureDatabase();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, title: true, bunnyVideoId: true, position: true, courseSlug: true },
  });
  if (!lesson || lesson.position > TEASER_COUNT || !isCourseSlug(lesson.courseSlug)) {
    return { status: "missing" as const };
  }
  if (!bunnyConfigured()) {
    return { status: "unconfigured" as const };
  }
  const signed = signBunnyEmbed(lesson.bunnyVideoId, { ttlSeconds: 60 * 30, autoplay: true });
  if (!signed) return { status: "unconfigured" as const };
  return { status: "ok" as const, title: lesson.title, signed };
}
