import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TickerBar } from "@/components/ticker-bar";
import { SkipLink } from "@/components/skip-link";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <div className="sticky top-0 z-40 isolate">
        <TickerBar />
        <Suspense fallback={<div className="h-[72px] border-b border-black/5 bg-white" />}>
          <Navbar />
        </Suspense>
      </div>
      <main id="main" className="relative overflow-x-clip">{children}</main>
      <Footer />
    </>
  );
}
