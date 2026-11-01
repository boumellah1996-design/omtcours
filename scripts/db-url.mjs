import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  try {
    const parsed = {};
    const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      parsed[key] = value;
    }
    return parsed;
  } catch {
    return {};
  }
}

export function firstEnv(env, ...keys) {
  for (const key of keys) {
    const value = typeof env[key] === "string" ? env[key].trim() : "";
    if (value) return value;
  }
  return "";
}

function preferPostgres(fileValue, envValue) {
  const file = (fileValue || "").trim();
  const env = (envValue || "").trim();
  if (file.startsWith("postgres")) return file;
  if (env.startsWith("postgres")) return env;
  return file || env;
}

export function projectEnv(env = process.env) {
  const file = loadEnvFile();
  return {
    ...env,
    ...file,
    DATABASE_URL: preferPostgres(file.DATABASE_URL, env.DATABASE_URL),
    DIRECT_URL: preferPostgres(file.DIRECT_URL, env.DIRECT_URL),
  };
}

export function readDatabaseUrl(env = projectEnv()) {
  return firstEnv(
    env,
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
    "DIRECT_URL",
  );
}

export function toDirectUrl(url) {
  if (!url.startsWith("postgres")) return url;
  try {
    const parsed = new URL(url);
    parsed.hostname = parsed.hostname.replace("-pooler", "");
    parsed.searchParams.delete("pgbouncer");
    parsed.searchParams.delete("channel_binding");
    parsed.searchParams.set("sslmode", "require");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function toPooledUrl(url) {
  if (!url.startsWith("postgres")) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("channel_binding");
    if (parsed.hostname.includes("-pooler")) parsed.searchParams.set("pgbouncer", "true");
    parsed.searchParams.set("sslmode", "require");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function prismaEnv(env = process.env) {
  const merged = projectEnv(env);
  const raw = readDatabaseUrl(merged);
  if (!raw || raw.startsWith("file:")) {
    return {
      ...merged,
      DATABASE_URL: raw,
      DIRECT_URL: firstEnv(merged, "DIRECT_URL") || raw,
    };
  }
  const pooled = toPooledUrl(raw);
  const direct =
    toDirectUrl(firstEnv(merged, "DIRECT_URL", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING") || raw);
  return {
    ...merged,
    DATABASE_URL: pooled,
    DIRECT_URL: direct,
  };
}
