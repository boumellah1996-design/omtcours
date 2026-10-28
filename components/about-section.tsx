"use client";

import { useI18n } from "@/components/language-provider";
import { site } from "@/lib/site";

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative z-[2] mx-auto max-w-6xl px-5 py-8 pb-20">
      <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr] md:items-stretch">
        <div className="rounded-[28px] border border-black/10 p-7 sm:p-10">
          <p className="text-sm font-extrabold text-ink/50">{t.about.kicker}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t.about.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-ink/80">{t.about.body}</p>
        </div>
        <aside className="flex flex-col justify-between rounded-[28px] bg-omt p-7 sm:p-8">
          <div>
            <p className="text-sm font-extrabold text-ink/60">{t.about.placeLabel}</p>
            <a href="#location" className="mt-1 block text-2xl font-black leading-9">
              {t.about.place}
            </a>
            <p className="mt-6 text-sm font-extrabold text-ink/60">{t.about.phoneLabel}</p>
            <a href={site.whatsappUrl} className="mt-1 block text-2xl font-black" dir="ltr">
              {site.phoneDisplay}
            </a>
          </div>
          <p className="mt-8 text-sm font-bold leading-6">{t.about.recorded}</p>
        </aside>
      </div>

      <div id="location" className="mt-6 overflow-hidden rounded-[28px] border border-black/10 bg-white">
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-ink/50">{t.about.placeLabel}</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight">{t.about.mapTitle}</h3>
            <p className="mt-1 text-sm font-bold text-muted">{t.about.place}</p>
          </div>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit rounded-full bg-omt px-5 py-2.5 text-sm font-extrabold text-ink"
          >
            {t.about.mapAction}
          </a>
        </div>
        <iframe
          title={t.about.mapTitle}
          src={site.mapsEmbed}
          className="h-[320px] w-full border-0 sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
