import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { CAPTCHA_COOKIE, captchaMatches } from "@/lib/captcha";
import { createEnrollment, listEnrollments, validateEnrollment } from "@/lib/enrollments";
import { sniffReceipt } from "@/lib/receipt";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }
  const enrollments = await listEnrollments();
  return NextResponse.json({ ok: true, enrollments });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 400 });
  }

  const pledge = form.get("pledge");
  const body = {
    courseSlug: form.get("courseSlug"),
    name: form.get("name"),
    phone: form.get("phone"),
    email: form.get("email"),
    pledge: pledge === "true" || pledge === "on",
    paymentMethod: form.get("paymentMethod"),
  };
  const parsed = validateEnrollment(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, code: parsed.code }, { status: 400 });
  }

  const jar = await cookies();
  if (!captchaMatches(jar.get(CAPTCHA_COOKIE)?.value, form.get("captcha"))) {
    return NextResponse.json({ ok: false, code: "invalid_captcha" }, { status: 400 });
  }

  const file = form.get("receipt");
  const uploaded = file instanceof File && file.size > 0 ? file : null;
  if (parsed.value.paymentMethod !== "cash" && !uploaded) {
    return NextResponse.json({ ok: false, code: "invalid_receipt" }, { status: 400 });
  }

  let receipt: { bytes: Uint8Array; ext: "jpg" | "png" | "webp" | "pdf" } | undefined;
  if (uploaded) {
    const bytes = new Uint8Array(await uploaded.arrayBuffer());
    const ext = sniffReceipt(bytes);
    if (!ext) return NextResponse.json({ ok: false, code: "invalid_receipt" }, { status: 400 });
    receipt = { bytes, ext };
  }

  try {
    const enrollment = await createEnrollment(parsed.value, receipt);
    const response = NextResponse.json({ ok: true, enrollment }, { status: 202 });
    response.cookies.set(CAPTCHA_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 500 });
  }
}
