import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const url = process.env.DATABASE_URL || "";
if (!url || url.startsWith("file:")) {
  throw new Error("Set DATABASE_URL to the same cloud Postgres URL used on Vercel before seeding.");
}

const scryptAsync = promisify(scrypt);
const prisma = new PrismaClient({ datasourceUrl: url });
const email = (process.env.ADMIN_EMAIL || "admin@omt.local").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "OmtAdmin5401";

const salt = randomBytes(16).toString("base64url");
const hash = await scryptAsync(password, salt, 32);
const passwordHash = `scrypt$${salt}$${hash.toString("base64url")}`;

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  await prisma.user.update({
    where: { email },
    data: { role: "admin", passwordHash, name: existing.name || "OMT Admin" },
  });
  console.log(`Updated admin ${email}`);
} else {
  await prisma.user.create({
    data: { email, name: "OMT Admin", role: "admin", passwordHash },
  });
  console.log(`Created admin ${email}`);
}

await prisma.$disconnect();
