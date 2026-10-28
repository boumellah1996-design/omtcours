import { CourseSection } from "@/components/course-section";
import { SiteFrame } from "@/components/site-frame";

export const metadata = {
  title: "الدورات",
};

export default function CoursesPage() {
  return (
    <SiteFrame>
      <CourseSection heading="h1" />
    </SiteFrame>
  );
}
