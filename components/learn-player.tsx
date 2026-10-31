"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/components/language-provider";
import { useSessionGuard } from "@/components/session-watch";
import { isCourseSlug, type CourseSlug } from "@/lib/courses";

type Lesson = { id: string; title: string; position: number };

export function LearnHome() {
  const { t } = useI18n();
  const { ended, end } = useSessionGuard();
  const [courses, setCourses] = useState<CourseSlug[] | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    fetch("/api/learn")
      .then(async (response) => {
        const data = (await response.json()) as { courses?: string[]; code?: string };
        if (data.code === "session_replaced") {
          end();
          return;
        }
        if (response.status === 401) {
          setLocked(true);
          return;
        }
        setCourses((data.courses ?? []).filter(isCourseSlug));
      })
      .catch(() => setCourses([]));
  }, [end]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-black">{t.learn.title}</h1>
      <p className="mt-3 text-sm font-semibold leading-7 text-ink/70">{t.learn.lead}</p>
      {ended ? <p className="mt-6 rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{t.login.replaced}</p> : null}
      {locked ? <p className="mt-6 font-bold">{t.learn.locked}</p> : null}
      {courses && courses.length === 0 ? <p className="mt-6 font-bold text-ink/60">{t.learn.empty}</p> : null}
      <div className="mt-6 grid gap-3">
        {courses?.map((slug) => (
          <Link key={slug} href={`/learn/${slug}`} className="rounded-[24px] border border-black/10 px-5 py-4 text-lg font-black hover:border-black/30">
            {t.courses[slug].title}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function LearnPlayer() {
  const { t } = useI18n();
  const { ended, end } = useSessionGuard();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [active, setActive] = useState<string>("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!isCourseSlug(slug)) return;
    fetch(`/api/learn/${slug}`)
      .then(async (response) => {
        const data = (await response.json()) as { lessons?: Lesson[]; code?: string };
        if (data.code === "session_replaced") {
          end();
          return;
        }
        if (response.status === 403 || response.status === 401) {
          setDenied(true);
          setLessons([]);
          return;
        }
        const rows = data.lessons ?? [];
        setLessons(rows);
        if (rows[0]) setActive(rows[0].id);
      })
      .catch(() => setLessons([]));
  }, [slug, end]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch(`/api/learn/play/${active}`)
      .then(async (response) => {
        const data = (await response.json()) as { embedUrl?: string; code?: string };
        if (cancelled) return;
        if (data.code === "session_replaced") {
          setEmbedUrl("");
          end();
          return;
        }
        if (data.code === "video_not_configured") {
          setEmbedUrl("");
          setNotice(t.learn.missingVideo);
          return;
        }
        if (!response.ok || !data.embedUrl || !isBunnyEmbed(data.embedUrl)) {
          setEmbedUrl("");
          setNotice(t.learn.locked);
          return;
        }
        setNotice("");
        setEmbedUrl(data.embedUrl);
      })
      .catch(() => {
        if (!cancelled) setNotice(t.learn.locked);
      });
    return () => {
      cancelled = true;
    };
  }, [active, end, t.learn.locked, t.learn.missingVideo]);

  if (!isCourseSlug(slug)) return null;

  const activeLesson = lessons?.find((lesson) => lesson.id === active);

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 lg:grid-cols-[280px_1fr]">
      <aside>
        <Link href="/learn" className="text-sm font-extrabold underline-offset-4 hover:underline">
          {t.learn.back}
        </Link>
        <h1 className="mt-4 text-3xl font-black">{t.courses[slug].title}</h1>
        <div className="mt-4 grid gap-2">
          {lessons?.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setActive(lesson.id)}
              className={`rounded-2xl px-4 py-3 text-start text-sm font-extrabold ${active === lesson.id ? "bg-ink text-white" : "border border-black/10"}`}
            >
              {String(lesson.position).padStart(2, "0")}. {lesson.title}
            </button>
          ))}
          {lessons && lessons.length === 0 && !denied ? <p className="text-sm font-bold text-ink/60">{t.admin.noLessons}</p> : null}
        </div>
      </aside>
      <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white p-6">
        {ended ? <p className="text-sm font-bold leading-7">{t.login.replaced}</p> : null}
        {denied ? <p className="text-sm font-bold leading-7">{t.learn.locked}</p> : null}
        {embedUrl && !ended ? (
          <>
            <h2 className="mb-4 text-2xl font-bold">{activeLesson?.title ?? t.courses[slug].title}</h2>
            <div className="relative overflow-hidden rounded-[20px] pt-[56.25%]">
              <iframe
                src={embedUrl}
                title={activeLesson?.title ?? t.courses[slug].title}
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="origin"
              />
            </div>
          </>
        ) : ended ? null : (
          <div className="grid min-h-64 place-items-center text-center text-sm font-bold leading-7 text-ink/70">{notice}</div>
        )}
      </div>
    </section>
  );
}

function isBunnyEmbed(url: string) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "iframe.mediadelivery.net" || parsed.hostname === "player.mediadelivery.net")
    );
  } catch {
    return false;
  }
}
