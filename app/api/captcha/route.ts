import { NextResponse } from "next/server";
import { CAPTCHA_COOKIE, issueCaptcha } from "@/lib/captcha";

export async function GET() {
  const captcha = issueCaptcha();
  const response = NextResponse.json(
    { ok: true, image: captcha.image, token: captcha.token },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(CAPTCHA_COOKIE, captcha.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
    path: "/",
    maxAge: 60 * 5,
  });
  return response;
}
