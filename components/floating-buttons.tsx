"use client";

import { usePathname } from "next/navigation";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { site } from "@/lib/site";

export function FloatingButtons() {
  const { t } = useI18n();
  const admin = usePathname().startsWith("/admin");

  return (
    <div className={admin ? "fixed bottom-5 right-5 z-30 flex flex-row gap-3" : "fixed bottom-5 end-5 z-30 flex flex-col gap-3"}>
      <a
        href={site.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${t.floating.whatsapp}: ${site.phoneDisplay}`}
        className="contact-pulse group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(17,17,17,0.18)]"
      >
        <span className="contact-ring pointer-events-none absolute inset-0 rounded-full bg-[#25D366]" aria-hidden="true" />
        <WhatsAppIcon className="relative z-10 h-7 w-7" />
        <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-bold text-white group-hover:block">
          {t.floating.whatsapp}
          <span dir="ltr"> {site.phoneDisplay}</span>
        </span>
      </a>
      <a
        href={site.telegramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${t.floating.telegram}: ${site.telegramDisplay}`}
        className="contact-pulse contact-pulse-late group relative grid h-14 w-14 place-items-center rounded-full bg-[#229ED9] text-white shadow-[0_10px_24px_rgba(17,17,17,0.18)]"
      >
        <span className="contact-ring pointer-events-none absolute inset-0 rounded-full bg-[#229ED9]" aria-hidden="true" />
        <TelegramIcon className="relative z-10 h-7 w-7" />
        <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs font-bold text-white group-hover:block">
          {t.floating.telegram}
          <span dir="ltr"> {site.telegramDisplay}</span>
        </span>
      </a>
    </div>
  );
}
