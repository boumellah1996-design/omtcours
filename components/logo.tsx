import Link from "next/link";
import { site } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/#top" className="group inline-flex flex-col leading-none text-ink">
      <span className="logo-word text-[1.7rem] font-black tracking-tight">
        <span className="me-1.5 inline-block h-2.5 w-2.5 rounded-full bg-omt align-middle" />
        {site.name}
      </span>
      <span className="logo-sub mt-1 text-[10px] font-bold tracking-[0.16em] text-ink/65">
        {site.fullName.toUpperCase()}
      </span>
    </Link>
  );
}
