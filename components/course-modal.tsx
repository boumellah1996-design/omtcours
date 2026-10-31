"use client";

import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { CartIcon, CloseIcon, PlayIcon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { TEASER_COUNT, TEASER_SECONDS, type CourseSlug } from "@/lib/courses";
import { isPaymentMethod, type PaymentMethod } from "@/lib/payments";
import { site, whatsappLink } from "@/lib/site";

type TeaserLesson = { id: string; title: string; position: number };

type View = "choose" | "pay" | "teasers";
type FormStatus =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; id: string }
  | { kind: "error"; code: string };

export function CourseModal({
  slug,
  start = "choose",
  onClose,
}: {
  slug: CourseSlug;
  start?: View;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const course = t.courses[slug];
  const titleId = useId();
  const [view, setView] = useState<View>(start);
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pledged, setPledged] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [teasers, setTeasers] = useState<TeaserLesson[]>([]);
  const [teasersReady, setTeasersReady] = useState(false);
  const [activeTeaser, setActiveTeaser] = useState("");
  const playTeaser = useCallback((id: string) => setActiveTeaser(id), []);
  const stopTeaser = useCallback((id: string) => {
    setActiveTeaser((current) => (current === id ? "" : current));
  }, []);

  async function loadCaptcha() {
    const response = await fetch("/api/captcha");
    const data = (await response.json()) as { image?: string };
    setCaptchaImage(data.image ?? "");
    setCaptchaAnswer("");
  }

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/courses/${slug}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { course?: { teasers?: TeaserLesson[] } };
        if (!cancelled) setTeasers(data.course?.teasers ?? []);
      })
      .catch(() => {
        if (!cancelled) setTeasers([]);
      })
      .finally(() => {
        if (!cancelled) setTeasersReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const errorText =
    status.kind === "error"
      ? t.modal.errors[status.code as keyof typeof t.modal.errors] ?? t.modal.errors.generic
      : "";

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) {
      setStatus({ kind: "error", code: "invalid_name" });
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setStatus({ kind: "error", code: "invalid_phone" });
      return;
    }
    if (!isPaymentMethod(method)) {
      setStatus({ kind: "error", code: "invalid_method" });
      return;
    }
    if (method !== "cash" && !receipt) {
      setStatus({ kind: "error", code: "invalid_receipt" });
      return;
    }
    if (!pledged) {
      setStatus({ kind: "error", code: "pledge_required" });
      return;
    }
    if (captchaAnswer.trim().length < 5) {
      setStatus({ kind: "error", code: "invalid_captcha" });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const form = new FormData();
      form.set("courseSlug", slug);
      form.set("name", name);
      form.set("phone", phone);
      form.set("email", email);
      form.set("pledge", "true");
      form.set("paymentMethod", method);
      form.set("captcha", captchaAnswer);
      if (receipt) form.set("receipt", receipt);
      const response = await fetch("/api/enrollments", { method: "POST", body: form });
      const data = (await response.json()) as { enrollment?: { id: string }; code?: string };
      if (!response.ok || !data.enrollment) {
        setStatus({ kind: "error", code: data.code ?? "generic" });
        if (data.code === "invalid_captcha") void loadCaptcha();
        return;
      }
      setStatus({ kind: "success", id: data.enrollment.id.slice(0, 8).toUpperCase() });
    } catch {
      setStatus({ kind: "error", code: "generic" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label={t.modal.close} className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7 ${
          view === "teasers" ? "sm:max-w-5xl" : "sm:max-w-3xl"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm font-extrabold"
            >
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
                ←
              </span>
              {t.coursePage.back}
            </button>
            <p className="text-xs font-extrabold tracking-wide text-ink/50">{t.modal.eyebrow}</p>
            <h2 id={titleId} className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              {course.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.modal.close}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {view === "choose" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setView("pay");
                void loadCaptcha();
              }}
              className="flex min-h-40 flex-col items-start rounded-[24px] bg-omt p-5 text-start transition hover:-translate-y-0.5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-omt">
                <CartIcon className="h-6 w-6" />
              </span>
              <span className="mt-4 text-xl font-black leading-snug">{t.modal.pay}</span>
              <span className="mt-2 text-sm font-semibold leading-6 text-ink/70">{t.modal.payHint}</span>
            </button>
            <button
              type="button"
              onClick={() => setView("teasers")}
              className="flex min-h-40 flex-col items-start rounded-[24px] border border-black/10 bg-white p-5 text-start transition hover:-translate-y-0.5 hover:border-black/30"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-omt text-ink">
                <PlayIcon className="h-6 w-6" />
              </span>
              <span className="mt-4 text-xl font-black leading-snug">{t.modal.watch}</span>
              <span className="mt-2 text-sm font-semibold leading-6 text-muted">{t.modal.watchHint}</span>
            </button>
          </div>
        ) : null}

        {view === "teasers" ? (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">{t.modal.teaserTitle}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{t.modal.teaserNote}</p>
              </div>
              <button
                type="button"
                onClick={() => setView("choose")}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm font-extrabold"
              >
                <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
                  ←
                </span>
                {t.modal.back}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: TEASER_COUNT }, (_, index) => {
                const lesson = teasers[index] ?? null;
                return (
                  <TeaserTile
                    key={lesson?.id ?? index}
                    lesson={lesson}
                    label={lesson?.title || `${t.modal.teaserLabel} ${String(index + 1).padStart(2, "0")}`}
                    waiting={teasersReady ? t.modal.waiting : "..."}
                    duration={t.modal.duration}
                    seconds={TEASER_SECONDS}
                    playing={Boolean(lesson && activeTeaser === lesson.id)}
                    onPlay={playTeaser}
                    onStop={stopTeaser}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        {view === "pay" ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setView("choose")}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm font-extrabold"
            >
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
                ←
              </span>
              {t.modal.back}
            </button>
            {status.kind === "success" ? (
              <div className="mt-4 rounded-[24px] bg-omt p-6">
                <h3 className="text-2xl font-black">{t.modal.successTitle}</h3>
                <p className="mt-2 leading-7">{t.modal.successBody}</p>
                <p className="mt-4 text-sm font-extrabold">
                  {t.modal.requestId}: <span dir="ltr">{status.id}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-4 grid gap-3">
                <h3 className="text-lg font-black">{t.modal.enrollTitle}</h3>
                <p className="text-sm leading-6 text-muted">{t.modal.enrollLead}</p>
                <fieldset className="grid gap-2">
                  <legend className="text-sm font-bold">{t.modal.method}</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(
                      [
                        ["baridi", t.modal.methodBaridi],
                        ["usdt", t.modal.methodUsdt],
                        ["cash", t.modal.methodCash],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-extrabold ${method === value ? "border-ink bg-omt" : "border-black/10"}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={value}
                          checked={method === value}
                          onChange={() => setMethod(value)}
                          className="accent-ink"
                        />
                        {value === "baridi" ? <img src="/payments/baridimob-logo.png" alt="" className="h-10 w-10 rounded-full object-contain" /> : null}
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="grid gap-1 text-sm font-bold">
                  {t.modal.receipt}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
                    className="rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold"
                  />
                  <span className="text-xs font-semibold leading-5 text-muted">{t.modal.receiptHint}</span>
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  {t.modal.name}
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                    className="rounded-2xl border border-black/10 px-4 py-3 font-semibold outline-none focus:border-ink"
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  {t.modal.phone}
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    required
                    className="rounded-2xl border border-black/10 px-4 py-3 text-start font-semibold outline-none focus:border-ink"
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  {t.modal.email}
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    dir="ltr"
                    className="rounded-2xl border border-black/10 px-4 py-3 text-start font-semibold outline-none focus:border-ink"
                  />
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-black/10 p-4 text-sm font-bold leading-7">
                  <input
                    type="checkbox"
                    checked={pledged}
                    onChange={(event) => setPledged(event.target.checked)}
                    required
                    className="mt-1.5 h-5 w-5 shrink-0 accent-ink"
                  />
                  <span>{t.modal.pledge}</span>
                </label>
                <div className="grid gap-2 rounded-2xl border border-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold">{t.modal.captcha}</p>
                    <button
                      type="button"
                      onClick={() => void loadCaptcha()}
                      className="rounded-full bg-omt px-3 py-1.5 text-xs font-extrabold text-ink"
                    >
                      {t.modal.captcha}
                    </button>
                  </div>
                  {captchaImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={captchaImage} alt="" className="h-16 w-full rounded-2xl object-contain" />
                  ) : (
                    <div className="h-16 rounded-2xl bg-[#f6f6f4]" />
                  )}
                  <label className="grid gap-1 text-sm font-bold">
                    {t.modal.captchaHint}
                    <input
                      value={captchaAnswer}
                      onChange={(event) => setCaptchaAnswer(event.target.value)}
                      autoComplete="off"
                      dir="ltr"
                      required
                      className="rounded-2xl border border-black/10 px-4 py-3 text-start font-semibold tracking-[0.3em] outline-none focus:border-ink"
                    />
                  </label>
                </div>
                {errorText ? <p className="text-sm font-bold text-red-700">{errorText}</p> : null}
                <button
                  type="submit"
                  disabled={status.kind === "sending" || !pledged || !method || captchaAnswer.trim().length < 5}
                  className="rounded-2xl bg-ink px-4 py-3.5 text-sm font-extrabold text-white disabled:opacity-60"
                >
                  {status.kind === "sending" ? t.modal.sending : t.modal.submit}
                </button>
              </form>
            )}
            <a
              href={whatsappLink(t.modal.prefill.replace("{course}", course.title))}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-extrabold hover:bg-black/[0.03]"
            >
              {t.modal.whatsapp}
              <span dir="ltr" className="ms-2 font-bold">
                {site.phoneDisplay}
              </span>
            </a>
          </div>
        ) : null}

        <div className="mt-5 text-end">
          <Link href={`/courses/${slug}`} onClick={onClose} className="text-sm font-extrabold text-ink/70 underline-offset-4 hover:text-ink hover:underline">
            {t.modal.details}
          </Link>
        </div>
      </div>
    </div>
  );
}

function TeaserTile({
  lesson,
  label,
  waiting,
  duration,
  seconds,
  playing,
  onPlay,
  onStop,
}: {
  lesson: TeaserLesson | null;
  label: string;
  waiting: string;
  duration: string;
  seconds: number;
  playing: boolean;
  onPlay: (id: string) => void;
  onStop: (id: string) => void;
}) {
  const [embedUrl, setEmbedUrl] = useState("");
  const lessonId = lesson?.id ?? "";

  useEffect(() => {
    if (!playing || !lessonId) {
      setEmbedUrl("");
      return;
    }
    let cancelled = false;
    fetch(`/api/teasers/play/${lessonId}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { embedUrl?: string };
        if (cancelled) return;
        if (!response.ok || !data.embedUrl || !isBunnyEmbed(data.embedUrl)) {
          onStop(lessonId);
          return;
        }
        setEmbedUrl(data.embedUrl);
      })
      .catch(() => {
        if (!cancelled) onStop(lessonId);
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId, playing, onStop]);

  useEffect(() => {
    if (!playing || !lessonId) return;
    const timer = window.setTimeout(() => onStop(lessonId), seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [lessonId, onStop, playing, seconds]);

  return (
    <figure className="overflow-hidden rounded-2xl bg-ink text-white">
      <div className="relative aspect-video">
        {playing && embedUrl ? (
          <iframe
            src={embedUrl}
            title={label}
            className="h-full w-full border-0 bg-black"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="origin"
          />
        ) : lesson ? (
          <button
            type="button"
            onClick={() => {
              if (lesson) onPlay(lesson.id);
            }}
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#161616]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-omt text-ink">
              <PlayIcon className="h-5 w-5" />
            </span>
          </button>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#161616]">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-omt text-ink">
              <PlayIcon className="h-5 w-5" />
            </span>
            <span className="px-2 text-center text-[11px] font-bold text-white/70">{waiting}</span>
          </div>
        )}
        <span className="absolute bottom-2 end-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-bold">{duration}</span>
      </div>
      <figcaption className="px-3 py-2 text-sm font-bold">{label}</figcaption>
    </figure>
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
