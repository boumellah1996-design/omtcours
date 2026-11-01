import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prismaEnv } from "./db-url.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = join(root, "node_modules", ".prisma", "client");
const engineName = "query_engine-windows.dll.node";
const node = process.execPath;
const prismaCli = join(root, "node_modules", "prisma", "build", "index.js");

function cleanTmpEngines() {
  if (!existsSync(clientDir)) return;
  for (const name of readdirSync(clientDir)) {
    if (name.startsWith(`${engineName}.tmp`) || name.endsWith(".tmp")) {
      try {
        unlinkSync(join(clientDir, name));
      } catch {
        // another process still holds the temp file
      }
    }
  }
}

function unlockEngine() {
  const engine = join(clientDir, engineName);
  if (!existsSync(engine)) return false;
  try {
    unlinkSync(engine);
    return true;
  } catch {
    return false;
  }
}

function projectLockerPids() {
  const marker = root.replace(/'/g, "''");
  try {
    const text = execFileSync(
      "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `$root='${marker}'.ToLower(); Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.ToLower().Contains($root) -and $_.CommandLine -match 'next|start-server|turbopack|prisma' } | ForEach-Object { $_.ProcessId }`,
      ],
      { encoding: "utf8", windowsHide: true },
    );
    return text
      .split(/\r?\n/)
      .map((line) => Number(line.trim()))
      .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);
  } catch {
    return [];
  }
}

function stopLockers() {
  const pids = projectLockerPids();
  for (const pid of pids) {
    try {
      process.kill(pid);
    } catch {
      try {
        execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
      } catch {
        // process already gone
      }
    }
  }
  return pids;
}

function generate() {
  if (!existsSync(prismaCli)) {
    throw new Error("Local Prisma CLI is missing. Run npm install first.");
  }
  const env = {
    ...prismaEnv(),
    PATH: `${dirname(node)};${process.env.PATH || ""}`,
  };
  execFileSync(node, [prismaCli, "generate"], {
    stdio: "inherit",
    env,
    cwd: root,
    windowsHide: true,
  });
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

cleanTmpEngines();

let lastError = null;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    generate();
    lastError = null;
    break;
  } catch (error) {
    lastError = error;
    const message = error instanceof Error ? error.message : String(error);
    const locked = /EPERM|EACCES|EBUSY|operation not permitted/i.test(message);
    if (!locked || attempt === 3) break;
    stopLockers();
    sleep(800);
    unlockEngine();
    cleanTmpEngines();
  }
}

if (lastError) {
  stopLockers();
  sleep(800);
  unlockEngine();
  cleanTmpEngines();
  generate();
}
