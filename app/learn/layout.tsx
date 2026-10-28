import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { resolveAuth } from "@/lib/access";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-16" />}>
      <LearnGate>{children}</LearnGate>
    </Suspense>
  );
}

async function LearnGate({ children }: { children: ReactNode }) {
  const auth = await resolveAuth();
  if (auth.status === "replaced") redirect("/login?reason=replaced");
  if (auth.status !== "ok") redirect("/login?next=/learn");
  return children;
}
