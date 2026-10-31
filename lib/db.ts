import { PrismaClient } from "@prisma/client";

function firstEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return "";
}

export function resolveDatabaseUrl() {
  const url = firstEnv(
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
  );
  if (!url) {
    throw new Error(
      "DATABASE_URL is missing. Set the same persistent Postgres URL in local .env and in Vercel project settings.",
    );
  }
  if (url.startsWith("file:")) {
    throw new Error(
      "SQLite file URLs are not supported. Use one cloud Postgres DATABASE_URL for both local and Vercel.",
    );
  }
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("-pooler") && !parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true");
    }
    if (parsed.protocol.startsWith("postgres") && !parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

const datasourceUrl = resolveDatabaseUrl();
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  omtSchema?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl });

globalForPrisma.prisma = prisma;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "loginCode" TEXT NOT NULL DEFAULT '',
    "deviceCount" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL,
    "activeSessionId" TEXT NOT NULL DEFAULT '',
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE TABLE IF NOT EXISTS "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "courseSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT '',
    "receiptExt" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedAt" TIMESTAMP(3),
    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "Enrollment_userId_idx" ON "Enrollment"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Enrollment_courseSlug_idx" ON "Enrollment"("courseSlug")`,
  `CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bunnyVideoId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "Lesson_courseSlug_position_idx" ON "Lesson"("courseSlug", "position")`,
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
