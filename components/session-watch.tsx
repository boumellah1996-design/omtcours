"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useSessionGuard() {
  const router = useRouter();
  const [ended, setEnded] = useState(false);

  const end = useCallback(() => {
    setEnded(true);
    router.replace("/login?reason=replaced");
  }, [router]);

  useEffect(() => {
    let stopped = false;

    async function tick() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await response.json()) as { code?: string };
        if (!stopped && data.code === "session_replaced") end();
      } catch {
        return;
      }
    }

    void tick();
    const timer = window.setInterval(() => void tick(), 5000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [end]);

  return { ended, end };
}
