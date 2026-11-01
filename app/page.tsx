import { AboutSection } from "@/components/about-section";
import { CourseSection } from "@/components/course-section";
import { Hero } from "@/components/hero";
import { SiteFrame } from "@/components/site-frame";

export default function HomePage() {
  return (
    <SiteFrame>
      <Hero />
      <CourseSection />
      <AboutSection />
    </SiteFrame>
  );
}
