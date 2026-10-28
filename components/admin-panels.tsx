"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { TEASER_COUNT, courseCatalog, teaserSources } from "@/lib/courses";
import type { EnrollmentRecord } from "@/lib/enrollment-types";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; enrollments: EnrollmentRecord[] }
  | { kind: "locked" }
  | { kind: "error" };

function useEnrollments() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  function reload() {
    fetch("/api/enrollments")
      .then(async (response) => {
        if (response.status === 401) {
          setState({ kind: "locked" });
          return;
        }
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { enrollments: EnrollmentRecord[] };
        setState({ kind: "ready", enrollments: data.enrollments });
      })
      .catch(() => setState({ kind: "error" }));
  }

  useEffect(() => {
    const timer = window.setTimeout(reload, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return { state, reload };
}

export function AdminOverview() {
  const { t } = useI18n();
  const { state, reload } = useEnrollments();
  const count = state.kind === "ready" ? state.enrollments.length : 0;
  const recent = state.kind === "ready" ? state.enrollments.slice(0, 5) : [];
  const live = useLiveStats();

  return (
    <section>
      <h1 className="text-4xl font-black tracking-tight">{t.admin.overview}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className={`omt-live-dot ${live.connected ? "is-on" : ""}`} aria-hidden="true" />
            <p className="text-3xl font-black">{live.connected ? String(live.online) : "—"}</p>
          </div>
          <p className="mt-1 text-sm font-bold text-muted">{t.admin.online}</p>
        </div>
        <div className="rounded-[24px] border border-black/10 bg-white p-5">
          <p className="text-3xl font-black">{live.connected ? String(live.students) : "—"}</p>
          <p className="mt-1 text-sm font-bold text-muted">{t.admin.totalStudents}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat value={String(courseCatalog.length)} label={t.admin.statsCourses} />
        <Stat value={String(courseCatalog.length * TEASER_COUNT)} label={t.admin.statsTeasers} tone="yellow" />
        <Stat value={state.kind === "ready" ? String(count) : "—"} label={t.admin.statsRequests} />
      </div>

      <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-5">
        <h2 className="text-lg font-black">{t.admin.routesTitle}</h2>
        <p className="mt-1 text-sm leading-6 text-muted">{t.admin.routesLead}</p>
        <ul className="mt-4 grid gap-2 text-sm font-bold" dir="ltr">
          <li>POST /api/auth/login</li>
          <li>POST /api/auth/logout</li>
          <li>GET /api/auth/session</li>
          <li>GET /api/courses</li>
          <li>POST /api/enrollments</li>
        </ul>
      </div>

      <div className="mt-6 rounded-[24px] border border-black/10 bg-white p-5">
        <h2 className="text-lg font-black">{t.admin.recent}</h2>
        <EnrollmentBody state={state} recent={recent} onChanged={reload} />
      </div>
    </section>
  );
}

export function AdminCourses() {
  const { t } = useI18n();

  return (
    <section>
      <h1 className="text-4xl font-black tracking-tight">{t.admin.courses}</h1>
      <div className="mt-6 grid gap-4">
        {courseCatalog.map((course) => {
          const filled = teaserSources[course.slug].filter(Boolean).length;
          return (
            <article key={course.slug} className="rounded-[24px] border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black">{t.courses[course.slug].title}</h2>
                <span className="rounded-full bg-omt px-3 py-1 text-xs font-black">
                  {filled}/{TEASER_COUNT}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{t.admin.teaserSlots}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {Array.from({ length: TEASER_COUNT }, (_, index) => {
                  const ready = Boolean(teaserSources[course.slug][index]);
                  return (
                    <div
                      key={index}
                      className={`rounded-xl px-2 py-3 text-center text-xs font-bold ${ready ? "bg-ink text-white" : "bg-[#f4f4f4] text-ink/60"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                      <span className="mt-1 block font-semibold">{ready ? "0:15" : t.admin.waitingUpload}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function AdminEnrollments() {
  const { t } = useI18n();
  const { state, reload } = useEnrollments();

  return (
    <section>
      <h1 className="text-4xl font-black tracking-tight">{t.admin.enrollments}</h1>
      <div className="mt-5 overflow-hidden rounded-[22px] bg-white shadow-[0_12px_40px_rgba(20,24,28,0.06)]">
        <EnrollmentBody state={state} recent={state.kind === "ready" ? state.enrollments : []} table onChanged={reload} />
      </div>
    </section>
  );
}

function EnrollmentBody({
  state,
  recent,
  table = false,
  onChanged,
}: {
  state: LoadState;
  recent: EnrollmentRecord[];
  table?: boolean;
  onChanged?: () => void;
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");

  async function activate(id: string) {
    setBusy(id);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/enrollments/${id}/activate`, { method: "POST" });
      const data = (await response.json()) as { login?: string; temporaryPassword?: string | null; loginCode?: string };
      if (!response.ok) {
        setNotice(t.admin.loadError);
        return;
      }
      const password = data.loginCode
        ? `${t.admin.activated} ${t.admin.tempPassword} ${data.loginCode}`
        : `${t.admin.activated} ${t.admin.existingAccount}`;
      setNotice(password);
      onChanged?.();
    } catch {
      setNotice(t.admin.loadError);
    } finally {
      setBusy("");
    }
  }

  if (state.kind === "loading") {
    return <p className="p-5 text-sm font-bold text-muted">...</p>;
  }
  if (state.kind === "locked") {
    return <p className="p-5 text-sm font-bold leading-6">{t.admin.locked}</p>;
  }
  if (state.kind === "error") {
    return <p className="p-5 text-sm font-bold text-red-700">{t.admin.loadError}</p>;
  }
  if (recent.length === 0) {
    return <p className="p-5 text-sm font-bold text-muted">{t.admin.empty}</p>;
  }

  const note = notice ? <p className="m-4 rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{notice}</p> : null;

  if (!table) {
    return (
      <>
        {note}
        <ul className="mt-3 divide-y divide-black/5">
        {recent.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm font-bold">
            <span>{item.name}</span>
            <span>{t.courses[item.courseSlug].title}</span>
          </li>
        ))}
      </ul>
      </>
    );
  }

  return (
    <div>
      {note}
      <table className="w-full table-fixed text-right text-xs">
        <colgroup>
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[12%]" />
          <col className="w-[11%]" />
          <col className="w-[9%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead className="bg-[#efe4cc] text-[11px] font-extrabold text-ink/70">
          <tr>
            <th className="px-2 py-3 text-right">{t.admin.name}</th>
            <th className="px-2 py-3 text-right">{t.admin.phone}</th>
            <th className="px-2 py-3 text-right">{t.admin.secret}</th>
            <th className="px-2 py-3 text-right">{t.admin.method}</th>
            <th className="px-2 py-3 text-right">{t.admin.receipt}</th>
            <th className="px-2 py-3 text-right">{t.admin.course}</th>
            <th className="px-2 py-3 text-right">{t.admin.devices}</th>
            <th className="px-2 py-3 text-right">{t.admin.status}</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((item) => (
            <tr key={item.id} className="border-t border-black/5 font-semibold">
              <td className="break-words px-2 py-2 text-right">{item.name}</td>
              <td className="break-all px-2 py-2 text-right" dir="ltr">
                {item.phone}
              </td>
              <td className="break-all px-2 py-2 text-right font-black tracking-wide" dir="ltr">
                {item.status === "active" && item.loginCode ? item.loginCode : t.admin.secretLater}
              </td>
              <td className="break-words px-2 py-2 text-right">{methodLabel(item.paymentMethod, t)}</td>
              <td className="px-2 py-2 text-right">
                {item.receiptExt ? (
                  item.receiptExt === "pdf" ? (
                    <a href={`/api/admin/enrollments/${item.id}/receipt`} target="_blank" rel="noreferrer" className="font-extrabold underline">
                      {t.admin.openReceipt}
                    </a>
                  ) : (
                    <a href={`/api/admin/enrollments/${item.id}/receipt`} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/admin/enrollments/${item.id}/receipt`} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    </a>
                  )
                ) : (
                  <span className="text-ink/50">{t.admin.noReceipt}</span>
                )}
              </td>
              <td className="break-words px-2 py-2 text-right">{t.courses[item.courseSlug].title}</td>
              <td className="px-2 py-2 text-right">
                <DeviceMark count={item.devices} />
              </td>
              <td className="px-2 py-2 text-right">
                {item.status === "active" ? (
                  <span className="rounded-full bg-omt px-2 py-1 text-[11px] font-black">{t.admin.active}</span>
                ) : (
                  <button
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => void activate(item.id)}
                    className="rounded-full bg-ink px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-60"
                  >
                    {busy === item.id ? t.admin.activating : t.admin.activate}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeviceMark({ count }: { count: 0 | 1 | 2 }) {
  const { t } = useI18n();
  const online = count > 0;
  return (
    <span dir="rtl" className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`} aria-hidden="true" />
      <span>{online ? t.admin.deviceLive : t.admin.deviceOff}</span>
      {online ? (
        <span dir="ltr" className="tabular-nums">
          {count}/2
        </span>
      ) : null}
    </span>
  );
}

function useLiveStats() {
  const [stats, setStats] = useState({ online: 0, students: 0, connected: false });

  useEffect(() => {
    let stopped = false;

    async function load() {
      try {
        const response = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { online?: number; students?: number };
        if (!stopped) setStats({ online: data.online ?? 0, students: data.students ?? 0, connected: true });
      } catch {
        if (!stopped) setStats((current) => ({ ...current, connected: false }));
      }
    }

    void load();
    const timer = window.setInterval(() => void load(), 10000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  return stats;
}

function methodLabel(method: string, t: ReturnType<typeof useI18n>["t"]) {
  if (method === "baridi") return t.modal.methodBaridi;
  if (method === "usdt") return t.modal.methodUsdt;
  if (method === "cash") return t.modal.methodCash;
  return "—";
}

function Stat({ value, label, tone = "ink" }: { value: string; label: string; tone?: "ink" | "yellow" }) {
  const yellow = tone === "yellow";
  return (
    <div className={`rounded-[24px] p-5 ${yellow ? "bg-omt text-ink" : "bg-ink text-white"}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className={`mt-1 text-sm font-bold ${yellow ? "text-ink/70" : "text-white/70"}`}>{label}</p>
    </div>
  );
}
