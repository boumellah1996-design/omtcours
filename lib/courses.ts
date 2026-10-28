export const courseCatalog = [
  { slug: "beginner", level: "01", tone: "light" },
  { slug: "intermediate", level: "02", tone: "yellow" },
  { slug: "professional", level: "03", tone: "dark" },
] as const;

export type CourseSlug = (typeof courseCatalog)[number]["slug"];
export type CourseTone = (typeof courseCatalog)[number]["tone"];

export const TEASER_COUNT = 15;
export const TEASER_SECONDS = 15;

/** ضع روابط المقتطفات هنا لاحقاً، بحد أقصى مقطع واحد لكل خانة. */
export const teaserSources: Record<CourseSlug, string[]> = {
  beginner: [],
  intermediate: [],
  professional: [],
};

export const courseTitlesAr: Record<CourseSlug, string> = {
  beginner: "دورة مبتدئ",
  intermediate: "دورة متوسط متقدم",
  professional: "دورة محترف",
};

export function getCourse(slug: string) {
  return courseCatalog.find((course) => course.slug === slug);
}

export function isCourseSlug(slug: string): slug is CourseSlug {
  return courseCatalog.some((course) => course.slug === slug);
}
