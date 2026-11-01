import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prismaEnv } from "./db-url.mjs";

const args = process.argv.slice(2);
if (args.length === 0) {
  throw new Error("Usage: node scripts/run-prisma.mjs <prisma args>");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const node = process.execPath;
const prismaCli = join(root, "node_modules", "prisma", "build", "index.js");
if (!existsSync(prismaCli)) {
  throw new Error("Local Prisma CLI is missing. Run npm install first.");
}

execFileSync(node, [prismaCli, ...args], {
  stdio: "inherit",
  env: {
    ...prismaEnv(),
    PATH: `${dirname(node)};${process.env.PATH || ""}`,
  },
  cwd: root,
  windowsHide: true,
});
