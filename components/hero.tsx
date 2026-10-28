"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { academyPhotos } from "@/lib/site";

const SLIDE_MS = 72000;
const PHOTO_GAP = 16;

export function Hero() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState<string[]>([]);
  const photos = academyPhotos.filter((photo) => !hidden.includes(photo.src));

  return (
    <section id="top" className="relative">
      <div className="hero-wash pointer-events-none absolute inset-0 z-0" />
      <div className="relative z-[2] mx-auto max-w-6xl px-5 pt-14 text-center sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold shadow-sm">
          <span className="h-2 w-2 rounded-full bg-omt" aria-hidden="true" />
          {t.hero.badge}
        </p>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.15] tracking-tight text-ink sm:text-6xl">
          {t.hero.titleBefore} <span className="mark">{t.hero.titleHighlight}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">{t.hero.subtitle}</p>
      </div>

      {photos.length > 0 ? (
        <PhotoStrip
          photos={photos}
          label={t.hero.imageTitle}
          alts={t.hero.photos}
          location={t.hero.location}
          onError={(src) => setHidden((current) => [...current, src])}
        />
      ) : (
        <div className="mx-auto mt-10 max-w-5xl px-5 pb-8">
          <div className="overflow-hidden rounded-[28px] border border-black/10 bg-[#f6f6f4]">
            <AcademySlot title={t.hero.imageTitle} hint={t.hero.imageHint} location={t.hero.location} />
          </div>
        </div>
      )}
    </section>
  );
}

function PhotoStrip({
  photos,
  label,
  alts,
  location,
  onError,
}: {
  photos: readonly (typeof academyPhotos)[number][];
  label: string;
  alts: Record<(typeof academyPhotos)[number]["key"], string>;
  location: string;
  onError: (src: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const signature = photos.map((photo) => photo.src).join("|");

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nodes = [...viewport.querySelectorAll("img")];
    const count = nodes.length / 2;
    if (count === 0) return;

    let stopped = false;
    let raf = 0;
    let progress = 0;
    let last = 0;
    let setWidth = 1;
    const offsets = new Array<number>(count);
    const widths = new Array<number>(count);

    const measure = () => {
      let acc = 0;
      for (let index = 0; index < count; index += 1) {
        const node = nodes[index];
        const box = node.getBoundingClientRect();
        const natural =
          node.naturalWidth > 0 && node.naturalHeight > 0
            ? (node.naturalWidth / node.naturalHeight) * box.height
            : 0;
        const width = box.width || natural;
        widths[index] = width;
        offsets[index] = acc;
        acc += width + PHOTO_GAP;
      }
      setWidth = acc > 1 ? acc : 1;
    };

    const place = () => {
      const travel = progress * setWidth;
      for (let index = 0; index < count; index += 1) {
        const base = offsets[index] - travel;
        nodes[index].style.transform = `translate3d(${base}px,0,0)`;
        nodes[index + count].style.transform = `translate3d(${base + setWidth}px,0,0)`;
      }
    };

    const tick = (now: number) => {
      if (stopped) return;
      const dt = last === 0 ? 0 : Math.min(now - last, 34);
      last = now;
      progress += dt / SLIDE_MS;
      if (progress >= 1) progress -= 1;
      place();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (stopped || raf) return;
      if (!nodes.every((node) => node.complete && node.naturalWidth > 0)) return;
      measure();
      place();
      nodes.forEach((node) => {
        node.style.opacity = "1";
      });
      raf = requestAnimationFrame(tick);
    };

    start();
    nodes.forEach((node) => node.addEventListener("load", start));
    const observer = new ResizeObserver(() => {
      measure();
      if (raf) place();
    });
    observer.observe(viewport);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      nodes.forEach((node) => node.removeEventListener("load", start));
    };
  }, [signature]);

  return (
    <div className="relative z-[2] mt-10 pb-8" dir="ltr" aria-label={label}>
      <div className="overflow-hidden py-6">
        <div ref={viewportRef} className="relative h-[280px] sm:h-[360px]">
          {[0, 1].map((copy) =>
            photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${photo.src}-${copy}`}
                src={photo.src}
                alt={copy === 0 ? alts[photo.key] : ""}
                aria-hidden={copy === 1}
                draggable={false}
                decoding="async"
                className="absolute top-0 left-0 h-full w-auto max-w-none rounded-[24px] opacity-0 shadow-[0_8px_24px_rgba(17,17,17,0.08)] will-change-transform select-none"
                onError={() => onError(photo.src)}
              />
            )),
          )}
        </div>
      </div>
      <p className="text-center">
        <a href="#location" className="inline-flex rounded-full bg-omt px-4 py-1.5 text-xs font-extrabold text-ink shadow-sm">
          {location}
        </a>
      </p>
    </div>
  );
}

function AcademySlot({ title, hint, location }: { title: string; hint: string; location: string }) {
  return (
    <div className="relative aspect-[16/8.4] w-full">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.05) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <span className="pointer-events-none absolute start-6 top-6 h-8 w-8 border-s-2 border-t-2 border-ink" />
      <span className="pointer-events-none absolute end-6 top-6 h-8 w-8 border-e-2 border-t-2 border-ink" />
      <span className="pointer-events-none absolute bottom-6 start-6 h-8 w-8 border-b-2 border-s-2 border-ink" />
      <span className="pointer-events-none absolute bottom-6 end-6 h-8 w-8 border-b-2 border-e-2 border-ink" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <p className="text-lg font-black text-ink sm:text-2xl">{title}</p>
        <p className="mt-1 text-sm font-semibold text-muted">{hint}</p>
      </div>
      <a
        href="#location"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-omt px-4 py-1 text-xs font-extrabold text-ink"
      >
        {location}
      </a>
    </div>
  );
}
