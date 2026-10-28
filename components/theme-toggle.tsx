"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useI18n } from "@/components/language-provider";

const STORAGE_KEY = "omt-theme";
type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readTheme(): Theme {
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function serverTheme(): Theme {
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const { t } = useI18n();
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={dark ? t.nav.themeToLight : t.nav.themeToDark}
      onClick={() => {
        const next: Theme = dark ? "light" : "dark";
        window.localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
        listeners.forEach((listener) => listener());
      }}
      className="theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ink transition hover:border-black/30"
    >
      {dark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16.5 13.2A6.2 6.2 0 0 1 10.8 7.5 6.4 6.4 0 1 0 16.5 13.2Z" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M18 6l-1.3 1.3M7.3 16.7 6 18" strokeLinecap="round" />
    </svg>
  );
}
