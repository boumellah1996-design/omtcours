import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { PrismaClient } from "@prisma/client";

function prepareSqliteFile(fileUrl: string) {
  const path = fileUrl.replace(/^file:(\/\/)?/, "");
  const dir = dirname(path);
  if (dir && dir !== "." && !existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(path)) writeFileSync(path, "");
}

function resolveDatabaseUrl() {
  if (process.env.VERCEL) {
    const tmp = "/tmp/omt.db";
    const seed = join(process.cwd(), "prisma", "deploy.db");
    if (!existsSync(tmp) && existsSync(seed)) copyFileSync(seed, tmp);
    else prepareSqliteFile(`file:${tmp}`);
    return `file:${tmp}`;
  }
  return process.env.DATABASE_URL || "file:../data/omt.db";
}

const datasourceUrl = resolveDatabaseUrl();
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  omtSchema?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(datasourceUrl ? { datasourceUrl } : undefined);

globalForPrisma.prisma = prisma;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "loginCode" TEXT NOT NULL DEFAULT '',
    "deviceCount" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL,
    "activeSessionId" TEXT NOT NULL DEFAULT '',
    "lastSeenAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "courseSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT '',
    "receiptExt" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" DATETIME
  )`,
  `CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bunnyVideoId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

export async function ensureDatabase() {
  if (!globalForPrisma.omtSchema) {
    globalForPrisma.omtSchema = (async () => {
      for (const statement of schemaStatements) {
        await prisma.$executeRawUnsafe(statement);
      }
    })().catch((error) => {
      globalForPrisma.omtSchema = undefined;
      throw error;
    });
  }
  await globalForPrisma.omtSchema;
}
