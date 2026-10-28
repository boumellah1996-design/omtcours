import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isCourseSlug } from "@/lib/courses";
import { prisma } from "@/lib/db";
import type { EnrollmentInput, EnrollmentRecord } from "@/lib/enrollment-types";
import { hashPassword, temporaryPassword } from "@/lib/password";
import { isPaymentMethod } from "@/lib/payments";
import type { ReceiptExt } from "@/lib/receipt";

export type { EnrollmentInput, EnrollmentRecord };

const PLEDGE_NOTE =
  "أنا أتعاهد بأنني لن أقوم بتسريب أي فيديو من الفيديوهات المسجلة. وإذا قمت بذلك، سوف تُحظر من هذه الدورة نهائياً.";

const LIVE_DEVICE_MS = 45_000;

function toRecord(
  row: {
    id: string;
    courseSlug: string;
    name: string;
    phone: string;
    email: string;
    note: string;
    paymentMethod: string;
    receiptExt: string;
    status: string;
    createdAt: Date;
  },
  loginCode = "",
  devices: 0 | 1 | 2 = 0,
): EnrollmentRecord {
  return {
    id: row.id,
    courseSlug: isCourseSlug(row.courseSlug) ? row.courseSlug : "beginner",
    name: row.name,
    phone: row.phone,
    email: row.email,
    note: row.note,
    paymentMethod: isPaymentMethod(row.paymentMethod) ? row.paymentMethod : "",
    receiptExt: row.receiptExt,
    status: row.status === "active" ? "active" : "pending_payment",
    createdAt: row.createdAt.toISOString(),
    loginCode,
    devices,
  };
}

export async function uniqueLoginCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const loginCode = temporaryPassword();
    const taken = await prisma.user.findFirst({ where: { loginCode }, select: { id: true } });
    if (!taken) return loginCode;
  }
  return `${temporaryPassword()}${temporaryPassword().slice(0, 2)}`;
}

export async function ensureLoginCode(userId: string, current: string) {
  if (current) return current;
  const loginCode = await uniqueLoginCode();
  await prisma.user.update({
    where: { id: userId },
    data: { loginCode, passwordHash: await hashPassword(loginCode) },
  });
  return loginCode;
}

function visibleDevices(user: { deviceCount: number; activeSessionId: string; lastSeenAt: Date | null }) {
  const live = Boolean(
    user.activeSessionId && user.lastSeenAt && Date.now() - user.lastSeenAt.getTime() < LIVE_DEVICE_MS,
  );
  if (!live) return 0 as const;
  return user.deviceCount >= 2 ? (2 as const) : (1 as const);
}

async function claimOwnStudent(enrollment: {
  id: string;
  name: string;
  phone: string;
  user: {
    id: string;
    phone: string | null;
    loginCode: string;
    deviceCount: number;
    activeSessionId: string;
    lastSeenAt: Date | null;
  } | null;
}) {
  if (!enrollment.user) return { loginCode: "", devices: 0 as const };
  const digits = enrollment.phone.replace(/\D/g, "");
  const ownerDigits = (enrollment.user.phone ?? "").replace(/\D/g, "");
  const samePerson = !digits || digits === ownerDigits;
  if (samePerson) {
    const loginCode = await ensureLoginCode(enrollment.user.id, enrollment.user.loginCode);
    return { loginCode, devices: visibleDevices(enrollment.user) };
  }

  const loginCode = await uniqueLoginCode();
  const created = await prisma.user.create({
    data: {
      email: `${digits}.${enrollment.id.slice(-6)}@students.omt.local`,
      phone: digits,
      name: enrollment.name,
      role: "student",
      passwordHash: await hashPassword(loginCode),
      loginCode,
    },
  });
  await prisma.enrollment.update({ where: { id: enrollment.id }, data: { userId: created.id } });
  return { loginCode, devices: 0 as const };
}

export async function listEnrollments() {
  const rows = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, phone: true, loginCode: true, deviceCount: true, activeSessionId: true, lastSeenAt: true },
      },
    },
  });
  const records = [];
  for (const row of rows) {
    if (row.status !== "active") {
      records.push(toRecord(row));
      continue;
    }
    const owned = await claimOwnStudent(row);
    records.push(toRecord(row, owned.loginCode, owned.devices));
  }
  return records;
}

export async function createEnrollment(input: EnrollmentInput, receipt?: { bytes: Uint8Array; ext: ReceiptExt }) {
  const row = await prisma.enrollment.create({
    data: {
      courseSlug: input.courseSlug,
      name: input.name,
      phone: input.phone,
      email: input.email,
      note: input.note,
      paymentMethod: input.paymentMethod,
      receiptExt: receipt?.ext ?? "",
      status: "pending_payment",
    },
  });
  if (receipt) {
    const dir = path.join(process.cwd(), "data", "receipts");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${row.id}.${receipt.ext}`), receipt.bytes);
  }
  return toRecord(row);
}

export async function activateEnrollment(id: string) {
  const enrollment = await prisma.enrollment.findUnique({ where: { id } });
  if (!enrollment || !isCourseSlug(enrollment.courseSlug)) return null;

  const digits = enrollment.phone.replace(/\D/g, "");
  const email = enrollment.email.trim().toLowerCase();
  let user = digits
    ? await prisma.user.findFirst({ where: { role: "student", phone: digits } })
    : null;
  if (!user && email) {
    const byEmail = await prisma.user.findFirst({ where: { role: "student", email } });
    if (byEmail && (!digits || !byEmail.phone || byEmail.phone === digits)) user = byEmail;
  }

  let issuedPassword: string | null = null;
  if (!user) {
    issuedPassword = await uniqueLoginCode();
    const taken = email ? await prisma.user.findUnique({ where: { email } }) : null;
    user = await prisma.user.create({
      data: {
        email: email && !taken ? email : `${digits || enrollment.id}@students.omt.local`,
        phone: digits || null,
        name: enrollment.name,
        role: "student",
        passwordHash: await hashPassword(issuedPassword),
        loginCode: issuedPassword,
      },
    });
  } else if (!user.loginCode) {
    issuedPassword = await ensureLoginCode(user.id, "");
    user = { ...user, loginCode: issuedPassword };
  }

  const updated = await prisma.enrollment.update({
    where: { id },
    data: {
      status: "active",
      userId: user.id,
      activatedAt: enrollment.activatedAt ?? new Date(),
    },
  });

  return {
    enrollment: toRecord(updated, user.loginCode, visibleDevices(user)),
    login: user.email,
    temporaryPassword: issuedPassword,
    loginCode: user.loginCode,
  };
}

export function validateEnrollment(
  body: unknown,
): { ok: true; value: EnrollmentInput } | { ok: false; code: string } {
  if (!body || typeof body !== "object") return { ok: false, code: "generic" };

  const record = body as Record<string, unknown>;
  const courseSlug = record.courseSlug;
  const name = record.name;
  const phone = record.phone;
  const email = record.email;

  if (record.pledge !== true) {
    return { ok: false, code: "pledge_required" };
  }

  if (typeof courseSlug !== "string" || !isCourseSlug(courseSlug)) {
    return { ok: false, code: "unknown_course" };
  }

  if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 80) {
    return { ok: false, code: "invalid_name" };
  }

  const phoneText = typeof phone === "string" ? phone.trim() : "";
  const digits = phoneText.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    return { ok: false, code: "invalid_phone" };
  }

  const emailText = typeof email === "string" ? email.trim() : "";
  if (emailText.length > 120 || (emailText && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailText))) {
    return { ok: false, code: "invalid_email" };
  }

  const paymentMethod = record.paymentMethod;
  if (typeof paymentMethod !== "string" || !isPaymentMethod(paymentMethod)) {
    return { ok: false, code: "invalid_method" };
  }

  return {
    ok: true,
    value: {
      courseSlug,
      name: name.trim(),
      phone: phoneText,
      email: emailText,
      note: PLEDGE_NOTE,
      paymentMethod,
    },
  };
}
