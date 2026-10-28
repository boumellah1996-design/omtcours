"use client";

import { useCallback, useState } from "react";
import { CourseModal } from "@/components/course-modal";
import { useI18n } from "@/components/language-provider";
import { courseCatalog, type CourseSlug, type CourseTone } from "@/lib/courses";

const toneClass: Record<CourseTone, { card: string; muted: string; badge: string; button: string }> = {
  light: {
    card: "border border-black/10 bg-white text-ink",
    muted: "text-ink/60",
    badge: "bg-omt text-ink",
    button: "bg-omt text-ink",
  },
  yellow: {
    card: "border border-omt bg-omt text-ink",
    muted: "text-ink/70",
    badge: "bg-ink text-omt",
    button: "bg-ink text-white",
  },
  dark: {
    card: "border border-ink bg-ink text-white",
    muted: "text-white/65",
    badge: "bg-omt text-ink",
    button: "bg-omt text-ink",
  },
};

export function CourseSection({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const { t } = useI18n();
  const [active, setActive] = useState<CourseSlug | null>(null);
  const close = useCallback(() => setActive(null), []);
  const Title = heading;

  return (
    <section id="courses" className="relative z-[2] mx-auto max-w-6xl px-5 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-extrabold text-ink/50">{t.coursesSection.kicker}</p>
        <Title className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{t.coursesSection.title}</Title>
        <p className="mt-3 text-base leading-7 text-muted">{t.coursesSection.subtitle}</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {courseCatalog.map((course) => {
          const copy = t.courses[course.slug];
          const tone = toneClass[course.tone];
          return (
            <button
              key={course.slug}
              type="button"
              onClick={() => setActive(course.slug)}
              className={`flex h-full flex-col rounded-[28px] p-6 text-start shadow-[0_16px_40px_rgba(17,17,17,0.05)] transition hover:-translate-y-1 ${tone.card}`}
            >
              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black ${tone.badge}`}>{course.level}</span>
              <span className="mt-5 text-2xl font-black leading-tight">{copy.title}</span>
              <span className={`mt-3 text-sm leading-6 ${tone.muted}`}>{copy.summary}</span>
              <ul className="mt-4 space-y-2 text-sm font-semibold">
                {copy.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${course.tone === "dark" ? "bg-omt" : "bg-ink"}`} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span className={`mt-6 inline-flex w-fit rounded-full px-4 py-2 text-sm font-extrabold ${tone.button}`}>
                {t.coursesSection.cta}
              </span>
            </button>
          );
        })}
      </div>
      {active ? <CourseModal slug={active} onClose={close} /> : null}
    </section>
  );
}
