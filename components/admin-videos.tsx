"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useI18n } from "@/components/language-provider";
import { courseCatalog, type CourseSlug } from "@/lib/courses";

type Lesson = {
  id: string;
  courseSlug: CourseSlug;
  title: string;
  position: number;
  bunnyVideoId: string;
};

export function AdminVideos() {
  const { t } = useI18n();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [notice, setNotice] = useState("");

  function reload() {
    fetch("/api/admin/lessons", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { lessons?: Lesson[] };
        setLessons(data.lessons ?? []);
      })
      .catch(() => setLessons([]));
  }

  useEffect(() => {
    const timer = window.setTimeout(reload, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section>
      <h1 className="text-4xl font-black tracking-tight">{t.admin.videos}</h1>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-muted">{t.admin.videosLead}</p>
      <p className="mt-2 max-w-2xl text-xs font-semibold leading-5 text-muted">{t.admin.bunnyHint}</p>
      {notice ? <p className="mt-4 rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{notice}</p> : null}
      <div className="mt-6 grid gap-4">
        {courseCatalog.map((course) => (
          <VideoCourse
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

function VideoCourse({
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
  const [lessonTitle, setLessonTitle] = useState("");
  const [video, setVideo] = useState("");
  const [editing, setEditing] = useState<string>("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftVideo, setDraftVideo] = useState("");
  const [pendingDelete, setPendingDelete] = useState("");
  const [error, setError] = useState("");

  async function add(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: slug, title: lessonTitle, bunnyVideoId: video }),
    });
    if (!response.ok) {
      setError(t.admin.videoInvalid);
      return;
    }
    setLessonTitle("");
    setVideo("");
    onNotice(t.admin.videoSaved);
    onChanged();
  }

  async function save(id: string) {
    setError("");
    const response = await fetch(`/api/admin/lessons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, bunnyVideoId: draftVideo }),
    });
    if (!response.ok) {
      setError(t.admin.videoInvalid);
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
    setError("");
    const response = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
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
    <article className="rounded-[24px] border border-black/10 bg-white p-5">
      <h2 className="text-xl font-black">{title}</h2>
      {loading ? <p className="mt-3 text-sm font-bold text-muted">...</p> : null}
      {!loading && lessons.length === 0 ? <p className="mt-3 text-sm font-bold text-ink/50">{t.admin.noLessons}</p> : null}
      <ul className="mt-3 grid gap-2">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="rounded-2xl border border-black/5 px-3 py-3">
            {editing === lesson.id ? (
              <div className="grid gap-2">
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  className="rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
                />
                <input
                  value={draftVideo}
                  onChange={(event) => setDraftVideo(event.target.value)}
                  dir="ltr"
                  className="rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void save(lesson.id)} className="rounded-full bg-ink px-3 py-2 text-xs font-extrabold text-white">
                    {t.admin.save}
                  </button>
                  <button type="button" onClick={() => setEditing("")} className="rounded-full border border-black/10 px-3 py-2 text-xs font-extrabold">
                    {t.admin.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black">
                    {String(lesson.position).padStart(2, "0")}. {lesson.title}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-muted" dir="ltr">
                    {lesson.bunnyVideoId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(lesson.id);
                      setDraftTitle(lesson.title);
                      setDraftVideo(lesson.bunnyVideoId);
                      setPendingDelete("");
                    }}
                    className="rounded-full border border-black/10 px-3 py-2 text-xs font-extrabold"
                  >
                    {t.admin.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(lesson.id)}
                    className="rounded-full bg-ink px-3 py-2 text-xs font-extrabold text-white"
                  >
                    {pendingDelete === lesson.id ? t.admin.confirmDelete : t.admin.remove}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={(event) => void add(event)} className="mt-4 grid gap-2 border-t border-black/5 pt-4 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={lessonTitle}
          onChange={(event) => setLessonTitle(event.target.value)}
          placeholder={t.admin.lessonTitle}
          className="rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
        />
        <input
          value={video}
          onChange={(event) => setVideo(event.target.value)}
          placeholder={t.admin.videoLink}
          dir="ltr"
          className="rounded-2xl border border-black/10 px-3 py-2 text-sm font-semibold outline-none"
        />
        <button type="submit" className="rounded-2xl bg-ink px-4 py-2 text-sm font-extrabold text-white">
          {t.admin.addLesson}
        </button>
      </form>
      {error ? <p className="mt-2 text-sm font-bold text-red-700">{error}</p> : null}
    </article>
  );
}
