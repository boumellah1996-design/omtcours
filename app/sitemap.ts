import type { MetadataRoute } from "next";
import { courseCatalog } from "@/lib/courses";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "",
    "/courses",
    ...courseCatalog.map((course) => `/courses/${course.slug}`),
  ];

  return routes.map((route) => ({
    url: `https://omtcours.com${route}`,
    lastModified,
  }));
}
