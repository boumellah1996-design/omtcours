import { execSync } from "node:child_process";

const current = process.env.DATABASE_URL || "";
const generateUrl = current.startsWith("postgres")
  ? current
  : "postgresql://postgres:postgres@localhost:5432/postgres";

execSync("npx prisma generate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: generateUrl },
});
