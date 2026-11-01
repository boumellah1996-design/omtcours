import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

function envFileValue(key: string) {
  try {
    const path = join(process.cwd(), ".env");
    if (!existsSync(path)) return "";
    const line = readFileSync(path, "utf8")
      .split(/\r?\n/)
      .find((item) => item.trim().startsWith(`${key}=`));
    if (!line) return "";
    let value = line.slice(line.indexOf("=") + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value.trim();
  } catch {
    return "";
  }
}

function firstEnv(...keys: string[]) {
  const values = keys.map((key) => (envFileValue(key) || process.env[key] || "").trim());
  return values.find((value) => value.startsWith("postgres")) || values.find(Boolean) || "";
}

function normalizePostgresUrl(url: string, kind: "pooled" | "direct") {
  const parsed = new URL(url);
  if (kind === "direct") parsed.hostname = parsed.hostname.replace("-pooler", "");
  parsed.searchParams.delete("channel_binding");
  if (kind === "direct") parsed.searchParams.delete("pgbouncer");
  if (kind === "pooled" && parsed.hostname.includes("-pooler")) {
    parsed.searchParams.set("pgbouncer", "true");
  }
  if (kind === "pooled") {
    if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "5");
    if (!parsed.searchParams.has("pool_timeout")) parsed.searchParams.set("pool_timeout", "20");
    if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "15");
  }
  parsed.searchParams.set("sslmode", "require");
  return parsed.toString();
}

export function resolveDatabaseUrl() {
  const url = firstEnv(
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
    "DIRECT_URL",
  );
  if (!url) {
    throw new Error(
      "DATABASE_URL is missing. Set the same Neon Postgres URL in local .env and in Vercel project settings.",
    );
  }
  if (url.startsWith("file:")) {
    throw new Error(
      "SQLite file URLs are not supported. Use one Neon Postgres DATABASE_URL for both local and Vercel.",
    );
  }
  try {
    return normalizePostgresUrl(url, "pooled");
  } catch {
    return url;
  }
}

export function resolveDirectUrl() {
  const url = firstEnv("DIRECT_URL", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING", "DATABASE_URL");
  if (!url) return resolveDatabaseUrl();
  try {
    return normalizePostgresUrl(url, "direct");
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

export async function ensureDatabase() {
  if (!globalForPrisma.omtSchema) {
    globalForPrisma.omtSchema = prisma.$queryRaw`SELECT 1`.then(() => undefined).catch((error) => {
      globalForPrisma.omtSchema = undefined;
      throw error;
    });
  }
  await globalForPrisma.omtSchema;
}
