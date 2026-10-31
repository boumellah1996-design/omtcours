import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sqlitePath = process.env.SQLITE_PATH || join(root, "data", "omt.db");

if (!existsSync(sqlitePath)) {
  throw new Error(`Local SQLite file not found: ${sqlitePath}`);
}

const { DatabaseSync } = await import("node:sqlite");
const sqlite = new DatabaseSync(sqlitePath);
const prisma = new PrismaClient();

function asDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function asString(value, fallback = "") {
  return value == null ? fallback : String(value);
}

function asInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

try {
  const users = sqlite.prepare("SELECT * FROM User").all();
  const lessons = sqlite.prepare("SELECT * FROM Lesson").all();
  const enrollments = sqlite.prepare("SELECT * FROM Enrollment").all();

  for (const row of users) {
    const data = {
      email: asString(row.email).trim().toLowerCase(),
      phone: row.phone ? asString(row.phone) : null,
      name: asString(row.name, "User"),
      passwordHash: asString(row.passwordHash),
      loginCode: asString(row.loginCode),
      deviceCount: asInt(row.deviceCount),
      role: asString(row.role, "student"),
      activeSessionId: asString(row.activeSessionId),
      lastSeenAt: asDate(row.lastSeenAt),
      createdAt: asDate(row.createdAt) ?? new Date(),
    };
    await prisma.user.upsert({
      where: { id: asString(row.id) },
      create: { id: asString(row.id), ...data },
      update: data,
    });
  }

  for (const row of lessons) {
    const data = {
      courseSlug: asString(row.courseSlug),
      title: asString(row.title),
      bunnyVideoId: asString(row.bunnyVideoId),
      position: asInt(row.position, 1),
      createdAt: asDate(row.createdAt) ?? new Date(),
    };
    await prisma.lesson.upsert({
      where: { id: asString(row.id) },
      create: { id: asString(row.id), ...data },
      update: data,
    });
  }

  const userIds = new Set(users.map((row) => asString(row.id)));

  for (const row of enrollments) {
    const userId = row.userId ? asString(row.userId) : "";
    const data = {
      userId: userId && userIds.has(userId) ? userId : null,
      courseSlug: asString(row.courseSlug),
      name: asString(row.name),
      phone: asString(row.phone),
      email: asString(row.email),
      note: asString(row.note),
      paymentMethod: asString(row.paymentMethod),
      receiptExt: asString(row.receiptExt),
      status: asString(row.status, "pending_payment"),
      createdAt: asDate(row.createdAt) ?? new Date(),
      activatedAt: asDate(row.activatedAt),
    };
    await prisma.enrollment.upsert({
      where: { id: asString(row.id) },
      create: { id: asString(row.id), ...data },
      update: data,
    });
  }

  console.log(
    `Imported ${users.length} users, ${enrollments.length} enrollments, ${lessons.length} lessons from ${sqlitePath}`,
  );
} finally {
  sqlite.close();
  await prisma.$disconnect();
}
