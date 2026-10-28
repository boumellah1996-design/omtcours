"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { useI18n } from "@/components/language-provider";

type Platform = "iphone" | "android" | "windows" | "mac";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallApi = {
  openPanel: () => void;
  installed: boolean;
};

const InstallContext = createContext<InstallApi | null>(null);
const platforms: Platform[] = ["iphone", "android", "windows", "mac"];

function currentPlatform(): Platform {
  const ua = navigator.userAgent;
  const ipad = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || ipad) return "iphone";
  if (/Android/i.test(ua)) return "android";
  if (/Win/i.test(navigator.platform) || /Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(navigator.platform) || /Macintosh/i.test(ua)) return "mac";
  return "windows";
}

function installedNow() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const titleId = useId();
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ready, setReady] = useState(false);
  const [platform, setPlatform] = useState<Platform>("windows");
  const [selected, setSelected] = useState<Platform>("windows");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
    const onPrompt = (event: Event) => {
      event.preventDefault();
      promptRef.current = event as BeforeInstallPromptEvent;
      setReady(true);
    };
    const onInstalled = () => {
      promptRef.current = null;
      setInstalled(true);
      setReady(false);
    };
    const media = window.matchMedia("(display-mode: standalone)");
    const sync = () => setInstalled(installedNow());
    sync();
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    media.addEventListener("change", sync);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      media.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openPanel() {
    const detected = currentPlatform();
    setPlatform(detected);
    setSelected(detected);
    setInstalled(installedNow());
    setOpen(true);
  }

  async function choose(id: Platform) {
    setSelected(id);
    if (id !== platform || id === "iphone" || !promptRef.current) return;
    const prompt = promptRef.current;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    promptRef.current = null;
    setReady(false);
    if (choice.outcome === "accepted") setInstalled(true);
  }

  const copy = t.install;

  return (
    <InstallContext.Provider value={{ openPanel, installed }}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 p-3 sm:items-center" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[92vh] w-full overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl sm:max-w-lg sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e7a23a]/40 bg-[#fff7ea] px-3 py-1 text-xs font-extrabold text-[#d07a12]">
                <PhoneGlyph className="h-3.5 w-3.5" />
                {copy.badge}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.nav.close}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <h2 id={titleId} className="mt-5 text-center text-2xl font-black leading-snug sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-sm font-semibold leading-7 text-ink/60">{copy.lead}</p>
            {installed ? <p className="mt-4 text-center text-sm font-extrabold">{copy.installed}</p> : null}
            {ready && !installed ? <p className="mt-4 text-center text-sm font-extrabold">{copy.ready}</p> : null}
            <div className="mt-6 grid gap-3">
              {platforms.map((id) => {
                const item = copy[id];
                const active = selected === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => void choose(id)}
                    className={`flex items-center justify-between gap-4 rounded-[22px] bg-ink px-5 py-4 text-start text-white ${active ? "ring-4 ring-omt" : ""}`}
                  >
                    <span>
                      <span className="block text-xs font-semibold text-white/70">{item.kicker}</span>
                      <span className="mt-1 block text-lg font-black">{item.title}</span>
                    </span>
                    <PlatformGlyph id={id} />
                  </button>
                );
              })}
            </div>
            <ol className="mt-4 grid gap-2 rounded-[22px] bg-[#f6f6f4] p-4 text-sm font-bold leading-6">
              {copy[selected].steps.map((step, index) => (
                <li key={step}>
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </InstallContext.Provider>
  );
}

export function InstallButton({
  compact = false,
  className = "",
  onOpen,
}: {
  compact?: boolean;
  className?: string;
  onOpen?: () => void;
}) {
  const { t } = useI18n();
  const context = useContext(InstallContext);
  if (!context || context.installed) return null;
  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.();
        context.openPanel();
      }}
      aria-label={t.install.button}
      className={`install-pill items-center gap-2 rounded-full border border-[#e7a23a] px-3 py-2 text-sm font-extrabold text-[#d07a12] transition hover:bg-[#fff7ea] ${className}`}
    >
      {compact ? <span className="sr-only">{t.install.button}</span> : t.install.button}
      <DownloadGlyph className="h-4 w-4" />
    </button>
  );
}

function DownloadGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  );
}

function PlatformGlyph({ id }: { id: Platform }) {
  if (id === "android") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 shrink-0 text-[#3ddc84]" fill="currentColor">
        <path d="M7.2 8.2h9.6v7.2a1.6 1.6 0 0 1-1.6 1.6h-.4V19a1 1 0 0 1-2 0v-2H11v2a1 1 0 0 1-2 0v-2h-.2a1.6 1.6 0 0 1-1.6-1.6V8.2Z" />
        <path d="M8.2 8.1 6.4 5.8M15.8 8.1l1.8-2.3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "windows") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0 text-[#4cc2ff]" fill="currentColor">
        <path d="M3 5.2 10.6 4.1v6.7H3V5.2Zm8.4-1.2L21 2.4v8.4h-9.6V4Zm0 8.8H21v8.4l-9.6-1.6v-6.8ZM3 13.2h7.6V20L3 18.8v-5.6Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0" fill="currentColor">
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.3c.7-1 1.2-2 1.5-3.1-3.9-1.5-3.8-5.1-3.8-5.2Z" />
      <path d="M14.7 6.6c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-.9 2.9 1 .1 2.1-.5 2.8-1.4Z" />
    </svg>
  );
}
