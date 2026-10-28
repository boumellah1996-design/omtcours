"use client";

import Link from "next/link";
import { useI18n } from "@/components/language-provider";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-black/5 bg-white pb-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{t.footer.blurb}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm font-bold">
          <Link href="/#courses" className="hover:underline">
            {t.nav.courses}
          </Link>
          <Link href="/login" className="hover:underline">
            {t.nav.login}
          </Link>
          <a href="/#location" className="hover:underline">
            {t.about.mapLink}
          </a>
          <a href={site.whatsappUrl} dir="ltr" className="hover:underline">
            {site.phoneDisplay}
          </a>
        </div>
      </div>
      <p className="px-5 pb-6 text-center text-xs font-semibold text-ink/50">{t.footer.rights}</p>
    </footer>
  );
}
