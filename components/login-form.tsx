"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/language-provider";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next");
  const replaced = search.get("reason") === "replaced";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setMessage(t.login.invalid);
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next: nextPath }),
      });
      const data = (await response.json()) as { code?: string; next?: string };
      if (!response.ok) {
        setMessage(data.code === "invalid" ? t.login.failed : t.login.notConfigured);
        return;
      }
      router.push(data.next || "/learn");
      router.refresh();
    } catch {
      setMessage(t.login.notConfigured);
    } finally {
      setSending(false);
      setPassword("");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="rounded-[28px] border border-black/10 p-7 shadow-[0_20px_50px_rgba(17,17,17,0.05)]">
        <p className="text-sm font-black tracking-wide">OMT</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{t.login.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{t.login.subtitle}</p>
        <p className="mt-3 text-sm font-bold leading-6">{t.login.singleDevice}</p>
        {replaced ? <p className="mt-4 rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{t.login.replaced}</p> : null}
        <form onSubmit={submit} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm font-bold">
            {t.login.email}
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              inputMode="email"
              dir="ltr"
              className="rounded-2xl border border-black/10 px-4 py-3 font-semibold outline-none focus:border-ink"
            />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            {t.login.password}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="rounded-2xl border border-black/10 px-4 py-3 font-semibold outline-none focus:border-ink"
            />
          </label>
          {message ? <p className="rounded-2xl bg-omt px-4 py-3 text-sm font-bold leading-6">{message}</p> : null}
          <button
            type="submit"
            disabled={sending}
            className="theme-solid rounded-2xl bg-ink px-4 py-3.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {sending ? t.login.sending : t.login.submit}
          </button>
        </form>
        <Link href="/" className="mt-4 inline-block text-sm font-extrabold underline-offset-4 hover:underline">
          {t.login.back}
        </Link>
      </div>
    </div>
  );
}
