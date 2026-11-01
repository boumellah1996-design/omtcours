import { cookies } from "next/headers";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { CAPTCHA_COOKIE, captchaMatches, normalizeCaptcha } from "@/lib/captcha";
import { createEnrollment, EnrollmentSaveError, listEnrollments, validateEnrollment } from "@/lib/enrollments";
import { sniffReceipt } from "@/lib/receipt";

const noStore = { "Cache-Control": "no-store" };

function fail(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, code, message }, { status, headers: noStore });
}

function tokenFrom(value: unknown) {
  return typeof value === "string" && value.includes(".") ? value : "";
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return fail("AUTH_REQUIRED", "This page is for the administrator only.", 401);
    }
    const enrollments = await listEnrollments();
    return NextResponse.json({ ok: true, enrollments }, { headers: noStore });
  } catch (error) {
    console.error("enrollment list failed", error);
    return fail("db_unavailable", "Could not load enrollment requests.", 503);
  }
}

export async function POST(request: Request) {
  try {
    try {
      await connection();
    } catch {
      // Route handlers can still read cookies if prerender marks this dynamic.
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("invalid_form", "The enrollment form could not be read.", 400);
    }

    const pledge = form.get("pledge");
    const parsed = validateEnrollment({
      courseSlug: form.get("courseSlug"),
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      pledge: pledge === "true" || pledge === "on",
      paymentMethod: form.get("paymentMethod"),
    });
    if (!parsed.ok) {
      return fail(parsed.code, "The enrollment form is incomplete or invalid.", 400);
    }

    let cookieToken = "";
    try {
      cookieToken = tokenFrom((await cookies()).get(CAPTCHA_COOKIE)?.value);
    } catch (error) {
      console.error("captcha cookie read failed", error);
    }
    const formToken = tokenFrom(form.get("captchaToken"));
    const captcha = normalizeCaptcha(form.get("captcha"));
    if (!captchaMatches(formToken, captcha) && !captchaMatches(cookieToken, captcha)) {
      return fail("invalid_captcha", "The captcha code is wrong or has expired.", 400);
    }

    const file = form.get("receipt");
    const uploaded = file instanceof File && file.size > 0 ? file : null;
    if (parsed.value.paymentMethod !== "cash" && !uploaded) {
      return fail("invalid_receipt", "A payment receipt is required for this method.", 400);
    }

    let receipt: { bytes: Uint8Array; ext: "jpg" | "png" | "webp" | "pdf" } | undefined;
    if (uploaded) {
      const bytes = new Uint8Array(await uploaded.arrayBuffer());
      const ext = sniffReceipt(bytes);
      if (!ext) return fail("invalid_receipt", "The receipt must be a JPG, PNG, WEBP, or PDF file.", 400);
      receipt = { bytes, ext };
    }

    const enrollment = await createEnrollment(parsed.value, receipt);
    const response = NextResponse.json({ ok: true, enrollment }, { status: 202, headers: noStore });
    response.cookies.set(CAPTCHA_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("enrollment create failed", error);
    if (error instanceof EnrollmentSaveError) {
      return fail(error.code, error.message, error.code === "db_unavailable" ? 503 : 500);
    }
    return fail("save_failed", "The enrollment request could not be saved.", 500);
  }
}
