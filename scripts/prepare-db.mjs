import { execSync } from "node:child_process";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  "";

if (!url) {
  throw new Error(
    "DATABASE_URL is missing. Add the same persistent Postgres URL in Vercel → Settings → Environment Variables.",
  );
}

if (url.startsWith("file:")) {
  throw new Error(
    "SQLite file URLs cannot persist on Vercel. Set DATABASE_URL to a cloud Postgres connection string.",
  );
}

execSync("npx prisma db push --skip-generate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: url },
});
