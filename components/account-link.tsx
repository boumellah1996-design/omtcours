"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/language-provider";

type Account = { role: "admin" | "student"; name: string } | null;

export function AccountLink({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [account, setAccount] = useState<Account>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: { user?: { role?: string; name?: string } | null }) => {
        if (cancelled) return;
        if (data.user?.role === "admin" || data.user?.role === "student") {
          setAccount({ role: data.user.role, name: data.user.name || "" });
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  if (!account) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className={compact ? "mt-1 rounded-full bg-omt px-4 py-2.5 text-center text-sm font-extrabold" : "order-2 hidden rounded-full bg-omt px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-omt-deep sm:inline-flex"}
      >
        {t.nav.login}
      </Link>
    );
  }

  const href = account.role === "admin" ? "/admin" : "/learn";
  const label = account.role === "admin" ? t.admin.overview : t.nav.learn;

  return (
    <div className={compact ? "mt-1 grid gap-1" : "hidden sm:contents"}>
      <Link href={href} onClick={onNavigate} className={`rounded-full bg-omt px-4 py-2 text-center text-sm font-extrabold text-ink ${compact ? "" : "order-2"}`}>
        {label}
      </Link>
      <button type="button" onClick={() => void logout()} className={`nav-logout rounded-full border border-black/10 px-3 py-2 text-sm font-extrabold ${compact ? "" : "order-5"}`}>
        {t.nav.logout}
      </button>
    </div>
  );
}
