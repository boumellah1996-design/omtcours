import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/course-detail";
import { SiteFrame } from "@/components/site-frame";
import { courseCatalog, courseTitlesAr, getCourse } from "@/lib/courses";

export function generateStaticParams() {
  return courseCatalog.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "الدورة" };
  return { title: courseTitlesAr[course.slug] };
}

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <SiteFrame>
      <Suspense
        fallback={<div className="mx-auto max-w-3xl px-5 py-24"><div className="h-48 animate-pulse rounded-[28px] bg-black/5" /></div>}
      >
        <CourseContent params={params} />
      </Suspense>
    </SiteFrame>
  );
}

async function CourseContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  return <CourseDetail slug={course.slug} />;
}
