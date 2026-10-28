"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AccountLink } from "@/components/account-link";
import { CloseIcon } from "@/components/icons";
import { InstallButton } from "@/components/install-app";
import { LanguageMenu } from "@/components/language-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/language-provider";
import { Logo } from "@/components/logo";

const linkClass = "rounded-full px-3 py-2 text-sm font-extrabold transition lg:px-4";

export function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const homeActive = pathname === "/";
  const coursesActive = pathname.startsWith("/courses");

  const links = [
    { href: "/#top", label: t.nav.home, active: homeActive },
    { href: "/#courses", label: t.nav.courses, active: coursesActive },
    { href: "/#about", label: t.nav.about, active: false },
    { href: "/#location", label: t.nav.location, active: false },
  ];

  return (
    <header
      className="site-nav border-b border-black/5 bg-white/95 backdrop-blur"
      onMouseMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        const shift = ((event.clientX - box.left) / box.width - 0.5) * 24;
        event.currentTarget.style.setProperty("--nav-shift", `${shift.toFixed(1)}px`);
      }}
    >
      <div className="site-nav-bg" aria-hidden="true" />
      <div className="relative z-[1] mx-auto flex h-[76px] w-full items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-1 lg:gap-2">
          <Logo />
          <nav className="hidden items-center md:flex" aria-label={t.nav.menu}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${linkClass} ${link.active ? "is-active bg-omt text-ink" : "text-[#243044] hover:bg-black/[0.04]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <InstallButton compact className="order-1 inline-flex lg:hidden" />
          <InstallButton className="order-1 hidden lg:inline-flex" />
          <div className="order-3">
            <LanguageMenu />
          </div>
          <div className="order-4">
            <ThemeToggle />
          </div>
          <AccountLink />
          <button
            type="button"
            className="order-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-ink md:hidden"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <span className="flex w-4 flex-col gap-1" aria-hidden="true">
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-3 bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>
      {open ? (
        <div className="relative z-[1] border-t border-black/5 px-5 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label={t.nav.menu}>
            <InstallButton className="inline-flex justify-center" onOpen={() => setOpen(false)} />
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`nav-link ${linkClass} ${link.active ? "is-active bg-omt" : "hover:bg-black/[0.04]"}`}
              >
                {link.label}
              </Link>
            ))}
            <AccountLink compact onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      ) : null}
    </header>
  );
}
