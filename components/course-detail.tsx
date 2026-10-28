"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CourseModal } from "@/components/course-modal";
import { useI18n } from "@/components/language-provider";
import { courseCatalog, type CourseSlug } from "@/lib/courses";

export function CourseDetail({ slug }: { slug: CourseSlug }) {
  const { t } = useI18n();
  const router = useRouter();
  const course = courseCatalog.find((item) => item.slug === slug);
  const copy = t.courses[slug];
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  if (!course) return null;

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/#courses");
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-extrabold shadow-sm"
      >
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
          ←
        </span>
        {t.coursePage.back}
      </button>
      <p className="mt-6 inline-flex rounded-full bg-omt px-3 py-1 text-xs font-black">{course.level}</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{copy.title}</h1>
      <p className="mt-4 text-lg leading-8 text-ink/75">{copy.summary}</p>
      <ul className="mt-6 space-y-3">
        {copy.points.map((point) => (
          <li key={point} className="flex gap-3 text-base font-semibold">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-omt" />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white"
        >
          {t.coursePage.open}
        </button>
        <Link href={`/learn/${slug}`} className="rounded-full border border-black/10 px-6 py-3 text-sm font-extrabold">
          {t.learn.open}
        </Link>
      </div>
      {open ? <CourseModal slug={slug} onClose={close} /> : null}
    </article>
  );
}
