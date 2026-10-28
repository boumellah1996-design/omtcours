import { Suspense, type ReactNode } from "react";
import { AdminShell } from "@/components/admin-shell";

export const metadata = {
  title: "لوحة التحكم",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
