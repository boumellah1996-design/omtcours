import type { MetadataRoute } from "next";
import { courseCatalog } from "@/lib/courses";

const siteUrl = "https://omtcours.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const courseRoutes = courseCatalog.map((course) => ({
    url: `${siteUrl}/courses/${course.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...courseRoutes];
}
