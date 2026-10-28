"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LanguageMenu } from "@/components/language-menu";
import { useI18n } from "@/components/language-provider";

const links = [
  { href: "/admin", key: "overview" },
  { href: "/admin/videos", key: "videos" },
  { href: "/admin/courses", key: "courses" },
  { href: "/admin/enrollments", key: "enrollments" },
  { href: "/admin/students", key: "registered" },
] as const;

type LinkKey = (typeof links)[number]["key"];

function ManagerAvatar() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="h-9 w-9 shrink-0">
      <circle cx="20" cy="20" r="20" fill="#d7dee6" />
      <circle cx="20" cy="16" r="6" fill="#5d6b78" />
      <path d="M8 34c1.8-6 6-9 12-9s10.2 3 12 9" fill="#5d6b78" />
    </svg>
  );
}

function ChartBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 text-[#d5d8dc]" aria-hidden="true">
      <svg viewBox="0 0 120 64" className="absolute start-[8%] top-[7%] h-14 w-28">
        <path d="M4 52h112M8 52V34M24 52V22M40 52V40M56 52V16M72 52V28M88 52V36M104 52V20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 140 70" className="absolute end-[14%] top-[18%] h-16 w-36">
        <path d="M4 58C24 58 28 22 48 26c16 3 18 28 36 20 16-7 22-30 48-24" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg viewBox="0 0 120 64" className="absolute start-[22%] top-[46%] h-14 w-32">
        <path d="M4 50C22 50 26 18 46 24c18 5 16 26 38 16 14-6 18-22 28-18" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg viewBox="0 0 110 60" className="absolute end-[10%] top-[58%] h-14 w-28">
        <path d="M6 48h10V30H6zm18 0h10V18H24zm18 0h10V36H42zm18 0h10V14H60zm18 0h10V26H78z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 100 50" className="absolute start-[6%] bottom-[8%] h-12 w-24">
        <path d="M4 40C18 40 22 16 38 20c14 4 16 18 30 12 10-4 14-16 24-12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

function NavIcon({ name }: { name: LinkKey | "logout" }) {
  const common = "h-[18px] w-[18px] shrink-0";
  if (name === "overview") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  if (name === "videos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "courses") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.5 12 4l8 2.5v11L12 20l-8-2.5v-11Z" strokeLinejoin="round" />
        <path d="M12 4v16" />
      </svg>
    );
  }
  if (name === "enrollments") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "registered") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="2.4" />
        <circle cx="16" cy="9" r="2" />
        <path d="M4.5 17.5c.6-2.2 2.4-3.3 4.5-3.3s3.9 1.1 4.5 3.3" strokeLinecap="round" />
        <path d="M14 14.4c1.4-.2 2.8.4 3.6 1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h6A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 10 18.5V17" strokeLinecap="round" />
      <path d="M13 12H4m0 0 2.5-2.5M4 12l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const labels: Record<LinkKey, string> = {
    overview: t.admin.overview,
    videos: t.admin.videos,
    courses: t.admin.courses,
    enrollments: t.admin.enrollments,
    registered: t.admin.registered,
  };

  return (
    <div dir="ltr" className="admin-root min-h-screen bg-[#f3f4f6] text-ink lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col bg-[#1c2128] text-white lg:sticky lg:top-0 lg:h-screen">
        <p className="px-5 pb-2 pt-5 text-lg font-black tracking-tight">OMT</p>
        <nav className="grid gap-1 px-3 py-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-semibold ${
                  active
                    ? "border-[#3dd68c] text-[#3dd68c]"
                    : "border-transparent text-[#e6edf3] hover:bg-white/[0.06]"
                }`}
              >
                <NavIcon name={link.key} />
                <span>{labels[link.key]}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto grid gap-2 border-t border-white/10 px-3 py-4">
          <LanguageMenu tone="dark" />
          <button
            type="button"
            onClick={() => {
              void fetch("/api/auth/logout", { method: "POST" }).then(() => {
                router.push("/login");
                router.refresh();
              });
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#e6edf3] hover:bg-white/[0.06]"
          >
            <NavIcon name="logout" />
            {t.nav.logout}
          </button>
        </div>
      </aside>
      <div dir="rtl" className="relative min-w-0 overflow-hidden">
        <ChartBackdrop />
        <div className="relative flex items-center gap-2.5 px-6 pt-5">
          <ManagerAvatar />
          <span className="text-sm font-bold text-ink/80">{t.admin.manager}</span>
        </div>
        <div className="relative px-6 pb-8 pt-2">{children}</div>
      </div>
    </div>
  );
}
