import { createHash } from "crypto";

const EMBED_HOST = "iframe.mediadelivery.net";

const BUNNY_HOST = /(^|\.)mediadelivery\.net$|(^|\.)bunnycdn\.com$/i;

export function extractBunnyVideoId(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /\.(mp4|m3u8|webm)(\?|$)/i.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (!BUNNY_HOST.test(url.hostname)) return null;
      const segment = url.pathname.split("/").filter(Boolean).pop() ?? "";
      return /^[A-Za-z0-9-]{8,80}$/.test(segment) ? segment : null;
    } catch {
      return null;
    }
  }
  return /^[A-Za-z0-9-]{8,80}$/.test(trimmed) ? trimmed : null;
}

export function bunnyConfigured() {
  return Boolean(process.env.BUNNY_LIBRARY_ID && process.env.BUNNY_TOKEN_KEY);
}

export function signBunnyEmbed(videoId: string) {
  const libraryId = process.env.BUNNY_LIBRARY_ID;
  const key = process.env.BUNNY_TOKEN_KEY;
  if (!libraryId || !key || !/^[A-Za-z0-9-]{8,80}$/.test(videoId)) return null;

  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 4;
  const token = createHash("sha256").update(`${key}${videoId}${expires}`).digest("hex");
  const url = `https://${EMBED_HOST}/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=false`;
  return { url, expiresAt: new Date(expires * 1000).toISOString() };
}
