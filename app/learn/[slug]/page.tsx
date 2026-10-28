import { LearnPlayer } from "@/components/learn-player";
import { SiteFrame } from "@/components/site-frame";
import { courseCatalog, courseTitlesAr, getCourse } from "@/lib/courses";

export function generateStaticParams() {
  return courseCatalog.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  return { title: course ? courseTitlesAr[course.slug] : "الدورة" };
}

export default function LearnCoursePage() {
  return (
    <SiteFrame>
      <LearnPlayer />
    </SiteFrame>
  );
}
