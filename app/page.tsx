import { AboutSection } from "@/components/about-section";
import { CourseSection } from "@/components/course-section";
import { Hero } from "@/components/hero";
import { PhoneCascade } from "@/components/phone-cascade";
import { SiteFrame } from "@/components/site-frame";

export default function HomePage() {
  return (
    <SiteFrame>
      <div className="relative isolate">
        <PhoneCascade />
        <Hero />
        <CourseSection />
        <AboutSection />
      </div>
    </SiteFrame>
  );
}
