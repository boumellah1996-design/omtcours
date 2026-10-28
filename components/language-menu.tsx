"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageMenu({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = locales.find((item) => item.id === locale) ?? locales[0];

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className={
          tone === "dark"
            ? "lang-trigger flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            : "lang-trigger inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-extrabold text-ink transition hover:border-black/30"
        }
      >
        <span className="min-w-6 text-center">{current.short}</span>
        <span className="sr-only">{current.label}</span>
        <ChevronIcon className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={current.label}
          className={
            tone === "dark"
              ? "absolute bottom-full start-0 z-50 mb-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#161b22] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
              : "absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_16px_40px_rgba(17,17,17,0.12)]"
          }
        >
          {locales.map((item) => {
            const selected = item.id === locale;
            return (
              <li key={item.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => choose(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm font-bold ${
                    tone === "dark"
                      ? selected
                        ? "bg-[#0c3b2e] text-[#3dd68c]"
                        : "text-white hover:bg-white/10"
                      : selected
                        ? "bg-omt text-ink"
                        : "text-ink hover:bg-black/[0.04]"
                  }`}
                >
                  {item.label}
                  <span className="text-[11px] font-extrabold tracking-wide">{item.short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
