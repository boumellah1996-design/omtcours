"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/language-provider";
import type { RegisteredStudent } from "@/lib/students";

type LoadState =
  | { kind: "loading" }
  | { kind: "locked" }
  | { kind: "error" }
  | { kind: "ready"; students: RegisteredStudent[] };

export function AdminRegistered() {
  const { t } = useI18n();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let stopped = false;
    async function load() {
      try {
        const response = await fetch("/api/admin/students", { cache: "no-store" });
        if (response.status === 401) {
          if (!stopped) setState({ kind: "locked" });
          return;
        }
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { students?: RegisteredStudent[] };
        if (!stopped) setState({ kind: "ready", students: data.students ?? [] });
      } catch {
        if (!stopped) setState({ kind: "error" });
      }
    }
    void load();
    return () => {
      stopped = true;
    };
  }, []);

  return (
    <section>
      <h1 className="text-4xl font-black tracking-tight">{t.admin.registered}</h1>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-ink/70">{t.admin.registeredLead}</p>
      <div className="mt-6">
        {state.kind === "loading" ? <p className="text-sm font-bold text-muted">...</p> : null}
        {state.kind === "locked" ? <p className="text-sm font-bold leading-6">{t.admin.locked}</p> : null}
        {state.kind === "error" ? <p className="text-sm font-bold text-red-700">{t.admin.loadError}</p> : null}
        {state.kind === "ready" && state.students.length === 0 ? (
          <p className="rounded-[24px] border border-black/10 bg-white p-5 text-sm font-bold text-muted">{t.admin.registeredEmpty}</p>
        ) : null}
        {state.kind === "ready" && state.students.length > 0 ? (
          <ul className="grid gap-3">
            {state.students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function StudentCard({ student }: { student: RegisteredStudent }) {
  const { t } = useI18n();
  const phone = displayPhone(student.phone);
  const dial = e164(student.phone);

  return (
    <li className="rounded-[24px] border border-black/10 bg-white p-5">
      <h2 className="text-lg font-black">{student.name}</h2>
      {phone ? (
        <p className="mt-1 text-base font-extrabold" dir="ltr">
          {phone}
        </p>
      ) : (
        <p className="mt-1 text-sm font-bold text-ink/50">{t.admin.noPhone}</p>
      )}
          {student.email ? <p className="mt-1 text-sm font-semibold text-ink/60">{student.email}</p> : null}
          {student.loginCode ? (
            <p className="mt-2 text-sm font-bold">
              {t.admin.secret}: <span dir="ltr" className="font-black tracking-wide">{student.loginCode}</span>
            </p>
          ) : null}
      {student.courses.length > 0 ? (
        <p className="mt-2 text-sm font-bold text-ink/70">{student.courses.map((slug) => t.courses[slug].title).join(" · ")}</p>
      ) : null}
      {dial ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:+${dial}`} className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white">
            {t.admin.call}
          </a>
          <a
            href={`https://wa.me/${dial}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-extrabold text-white"
          >
            {t.admin.whatsapp}
          </a>
        </div>
      ) : null}
    </li>
  );
}

function digitsOf(phone: string) {
  return phone.replace(/\D/g, "");
}

function displayPhone(phone: string) {
  const digits = digitsOf(phone);
  if (!digits) return "";
  if (digits.startsWith("213") && digits.length === 12) return `0${digits.slice(3)}`;
  if (digits.length === 9) return `0${digits}`;
  return digits;
}

function e164(phone: string) {
  const digits = digitsOf(phone);
  if (digits.length < 9) return "";
  if (digits.startsWith("213")) return digits;
  if (digits.startsWith("0")) return `213${digits.slice(1)}`;
  return `213${digits}`;
}
