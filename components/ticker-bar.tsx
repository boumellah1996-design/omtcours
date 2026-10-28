"use client";

import { StarIcon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { site } from "@/lib/site";

function TickerRow({ hidden = false }: { hidden?: boolean }) {
  const { t } = useI18n();

  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {Array.from({ length: 8 }, (_, index) => (
        <a
          key={index}
          href={site.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          tabIndex={hidden || index > 0 ? -1 : 0}
          className="inline-flex items-center gap-3 px-8 text-sm font-bold text-ink"
        >
          <StarIcon className="h-3.5 w-3.5" />
          <span>{t.ticker}</span>
        </a>
      ))}
    </div>
  );
}

export function TickerBar() {
  const { t } = useI18n();

  return (
    <div className="ticker overflow-hidden bg-omt text-ink" dir="ltr" role="region" aria-label={t.ticker}>
      <div className="ticker-track flex w-max py-2.5">
        <TickerRow />
        <TickerRow hidden />
      </div>
    </div>
  );
}
