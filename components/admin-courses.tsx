"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BunnyPreview } from "@/components/bunny-preview";
import { useI18n } from "@/components/language-provider";
import { TEASER_COUNT, courseCatalog, isCourseSlug, type CourseSlug } from "@/lib/courses";

type Lesson = {
  id: string;
  courseSlug: CourseSlug;
  title: string;
  position: number;
  bunnyVideoId: string;
};

function videoLabel(id: string) {
  return id.length <= 12 ? id : `…${id.slice(-10)}`;
}

export function AdminCourses() {
  const { t } = useI18n();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [bunnyReady, setBunnyReady] = useState<boolean | null>(null);
  const [notice, setNotice] = useState("");
  const [courseSlug, setCourseSlug] = useState<CourseSlug>(courseCatalog[0]?.slug ?? "beginner");
  const [lessonTitle, setLessonTitle] = useState("");
  const [video, setVideo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function reload() {
    fetch("/api/admin/lessons", { cache: "no-store", credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { lessons?: Lesson[]; bunnyReady?: boolean };
        setLessons(data.lessons ?? []);
        setBunnyReady(Boolean(data.bunnyReady));
      })
      .catch(() => {
        setLessons([]);
        setBunnyReady(false);
      });
  }

  useEffect(() => {
    const timer = window.setTimeout(reload, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function add(event: FormEvent) {
    event.preventDefault();
    if (busy || !isCourseSlug(courseSlug)) return;
    setError("");
    setBusy(true);
    const response = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ courseSlug, title: lessonTitle, bunnyVideoId: video }),
    });
    const data = (await response.json().catch(() => ({}))) as { code?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.code === "invalid_video" ? t.admin.videoInvalid : t.admin.loadError);
      return;
    }
    setLessonTitle("");
    setVideo("");
    setNotice(t.admin.videoSaved);
    reload();
  }

  return (
    <section className="relative isolate">
      <h1 className="text-4xl font-black tracking-tight">{t.admin.courses}</h1>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-muted">{t.admin.coursesLead}</p>
      <p className="mt-2 max-w-2xl text-xs font-semibold leading-5 text-muted">{t.admin.bunnyHint}</p>
      {bunnyReady === false ? (
        <p className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold leading-6">{t.admin.bunnyMissing}</p>
      ) : null}
      {bunnyReady ? <p className="mt-4 rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{t.admin.bunnyReady}</p> : null}
      {notice ? <p className="mt-4 rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{notice}</p> : null}

      <form onSubmit={(event) => void add(event)} className="relative z-0 mt-6 grid gap-3 rounded-[24px] border border-black/10 bg-white p-5">
        <h2 className="text-lg font-black">{t.admin.addLesson}</h2>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto]">
          <label className="grid min-w-0 gap-1 text-xs font-extrabold">
            {t.admin.course}
            <select
              value={courseSlug}
              onChange={(event) => {
                const next = event.target.value;
                if (isCourseSlug(next)) setCourseSlug(next);
              }}
              className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold outline-none"
            >
              {courseCatalog.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {t.courses[course.slug].title}
                </option>
              ))}
            </select>
          </label>
          <input
            value={lessonTitle}
            onChange={(event) => setLessonTitle(event.target.value)}
            placeholder={t.admin.lessonTitle}
            required
            minLength={2}
            className="min-w-0 rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
          />
          <input
            value={video}
            onChange={(event) => setVideo(event.target.value)}
            placeholder={t.admin.videoLink}
            required
            dir="ltr"
            className="min-w-0 rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
          />
          <button
            type="submit"
            disabled={busy || lessonTitle.trim().length < 2 || video.trim().length < 8}
            className="rounded-2xl bg-ink px-4 py-2 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {t.admin.addLesson}
          </button>
        </div>
        <BunnyPreview value={video} title={lessonTitle || t.admin.videoId} fallback={t.admin.videoInvalid} />
        {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
      </form>

      <div className="mt-6 grid gap-4">
        {courseCatalog.map((course) => (
          <CourseStudio
            key={course.slug}
            slug={course.slug}
            title={t.courses[course.slug].title}
            lessons={(lessons ?? []).filter((lesson) => lesson.courseSlug === course.slug)}
            loading={lessons === null}
            onChanged={reload}
            onNotice={setNotice}
          />
        ))}
      </div>
    </section>
  );
}

function CourseStudio({
  slug,
  title,
  lessons,
  loading,
  onChanged,
  onNotice,
}: {
  slug: CourseSlug;
  title: string;
  lessons: Lesson[];
  loading: boolean;
  onChanged: () => void;
  onNotice: (value: string) => void;
}) {
  const { t } = useI18n();
  const [editing, setEditing] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftVideo, setDraftVideo] = useState("");
  const [pendingDelete, setPendingDelete] = useState("");
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const filled = Math.min(lessons.length, TEASER_COUNT);
  const selectedLesson = lessons.find((lesson) => lesson.id === selected);

  async function save(id: string) {
    if (busy) return;
    setError("");
    setBusy(true);
    const response = await fetch(`/api/admin/lessons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: draftTitle, bunnyVideoId: draftVideo }),
    });
    const data = (await response.json().catch(() => ({}))) as { code?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.code === "invalid_video" ? t.admin.videoInvalid : t.admin.loadError);
      return;
    }
    setEditing("");
    onNotice(t.admin.videoSaved);
    onChanged();
  }

  async function remove(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    if (busy) return;
    setError("");
    setBusy(true);
    const response = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE", credentials: "include" });
    setBusy(false);
    if (!response.ok) {
      setError(t.admin.loadError);
      return;
    }
    setPendingDelete("");
    setEditing("");
    onNotice(t.admin.videoDeleted);
    onChanged();
  }

  return (
    <article className="relative z-0 isolate overflow-visible rounded-[24px] border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="min-w-0 text-xl font-black">{title}</h2>
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-ink px-3 py-1 text-white">
            {lessons.length} {t.admin.lessons}
          </span>
          <span className="rounded-full bg-omt px-3 py-1">
            {loading ? "..." : `${filled}/${TEASER_COUNT}`} {t.admin.teaserSlots}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: TEASER_COUNT }, (_, index) => {
          const lesson = lessons[index];
          return (
            <button
              type="button"
              key={`${slug}-${index}`}
              title={lesson?.title}
              disabled={!lesson}
              onClick={() => {
                if (lesson) setSelected(lesson.id);
              }}
              className={`min-w-0 rounded-xl px-2 py-3 text-center text-xs font-bold ${lesson ? "bg-ink text-white" : "bg-[#f4f4f4] text-ink/60"}`}
            >
              {String(index + 1).padStart(2, "0")}
              <span className="mt-1 block truncate font-semibold">{lesson ? lesson.title : t.admin.waitingUpload}</span>
            </button>
          );
        })}
      </div>

      {selectedLesson && editing !== selectedLesson.id ? (
        <BunnyPreview value={selectedLesson.bunnyVideoId} title={selectedLesson.title} fallback={t.admin.videoInvalid} />
      ) : null}

      <h3 className="mt-5 text-sm font-extrabold">{t.admin.lessons}</h3>
      {loading ? <p className="mt-3 text-sm font-bold text-muted">...</p> : null}
      {!loading && lessons.length === 0 ? <p className="mt-3 text-sm font-bold text-ink/50">{t.admin.noLessons}</p> : null}
      <ul className="mt-3 grid gap-2">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="min-w-0 rounded-2xl border border-black/5 px-3 py-3">
            {editing === lesson.id ? (
              <div className="grid gap-2">
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder={t.admin.lessonTitle}
                  className="min-w-0 rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
                />
                <input
                  value={draftVideo}
                  onChange={(event) => setDraftVideo(event.target.value)}
                  placeholder={t.admin.videoLink}
                  dir="ltr"
                  className="min-w-0 rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void save(lesson.id)} className="rounded-full bg-ink px-3 py-2 text-xs font-extrabold text-white">
                    {t.admin.save}
                  </button>
                  <button type="button" onClick={() => setEditing("")} className="rounded-full border border-black/10 px-3 py-2 text-xs font-extrabold">
                    {t.admin.cancel}
                  </button>
                </div>
                <BunnyPreview value={draftVideo} title={draftTitle || lesson.title} fallback={t.admin.videoInvalid} />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <button type="button" onClick={() => setSelected(lesson.id)} className="text-start text-sm font-black">
                    {String(lesson.position).padStart(2, "0")}. {lesson.title}
                  </button>
                  <p className="mt-1 text-xs font-semibold text-muted" dir="ltr">
                    {videoLabel(lesson.bunnyVideoId)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(lesson.id);
                      setEditing(lesson.id);
                      setDraftTitle(lesson.title);
                      setDraftVideo(lesson.bunnyVideoId);
                      setPendingDelete("");
                    }}
                    className="rounded-full border border-black/10 px-3 py-2 text-xs font-extrabold"
                  >
                    {t.admin.edit}
                  </button>
                  <button type="button" onClick={() => void remove(lesson.id)} className="rounded-full bg-ink px-3 py-2 text-xs font-extrabold text-white">
                    {pendingDelete === lesson.id ? t.admin.confirmDelete : t.admin.remove}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {error ? <p className="mt-2 text-sm font-bold text-red-700">{error}</p> : null}
    </article>
  );
}
