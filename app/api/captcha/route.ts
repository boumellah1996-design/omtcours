import { NextResponse } from "next/server";
import { CAPTCHA_COOKIE, issueCaptcha } from "@/lib/captcha";

export async function GET() {
  const captcha = issueCaptcha();
  const response = NextResponse.json({ ok: true, image: captcha.image });
  response.cookies.set(CAPTCHA_COOKIE, captcha.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 5,
  });
  return response;
}
