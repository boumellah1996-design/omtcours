"use client";

import { useEffect } from "react";

export function PresencePing() {
  useEffect(() => {
    let stopped = false;

    async function beat() {
      try {
        const session = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await session.json()) as { user?: { role?: string } | null };
        if (stopped || data.user?.role !== "student") return;
        await fetch("/api/presence", { method: "POST", cache: "no-store" });
      } catch {
        return;
      }
    }

    void beat();
    const timer = window.setInterval(() => void beat(), 20000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
