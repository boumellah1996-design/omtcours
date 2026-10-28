import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { SiteFrame } from "@/components/site-frame";

export const metadata = {
  title: "تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <SiteFrame>
      <Suspense fallback={<div className="mx-auto max-w-md px-5 py-24" />}>
        <LoginForm />
      </Suspense>
    </SiteFrame>
  );
}
