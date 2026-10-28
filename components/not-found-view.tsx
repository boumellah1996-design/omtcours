"use client";

import Link from "next/link";
import { useI18n } from "@/components/language-provider";

export function NotFoundView() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-5 py-20">
      <p className="rounded-full bg-omt px-3 py-1 text-xs font-black">404</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight">{t.notFound.title}</h1>
      <p className="mt-3 leading-7 text-muted">{t.notFound.body}</p>
      <Link href="/" className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white">
        {t.notFound.back}
      </Link>
    </div>
  );
}
