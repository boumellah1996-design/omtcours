export const SESSION_COOKIE = "omt_session";

export type SessionPayload = {
  sub: string;
  role: "admin" | "student";
  exp: number;
  sid?: string;
};

const encoder = new TextEncoder();

function secret() {
  return process.env.AUTH_SECRET || "omt-auth-local";
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

function same(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return diff === 0;
}

export async function createSessionToken(user: { id: string; role: "admin" | "student"; sid?: string }) {
  const body: SessionPayload = {
    sub: user.id,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  if (user.sid) body.sid = user.sid;
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(body)));
  return `${payload}.${await sign(payload)}`;
}

export async function readSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !same(signature, await sign(payload))) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as Partial<SessionPayload>;
    if (parsed.role !== "admin" && parsed.role !== "student") return null;
    if (typeof parsed.sub !== "string" || typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    const sid = typeof parsed.sid === "string" && /^[0-9a-f-]{36}$/i.test(parsed.sid) ? parsed.sid : undefined;
    return { sub: parsed.sub, role: parsed.role, exp: parsed.exp, sid };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
