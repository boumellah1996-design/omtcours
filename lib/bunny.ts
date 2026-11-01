import { createHash } from "crypto";

const EMBED_HOST = "player.mediadelivery.net";
const BUNNY_HOST = /(^|\.)mediadelivery\.net$|(^|\.)bunnycdn\.com$/i;
const DOWNLOAD_HOST = /(^|\.)b-cdn\.net$/i;

function envValue(...keys: string[]) {
  for (const key of keys) {
    const value = (process.env[key] || "").trim();
    if (value) return value;
  }
  return "";
}

export function bunnyLibraryId() {
  return envValue("BUNNY_LIBRARY_ID", "BUNNY_STREAM_LIBRARY_ID");
}

export function bunnyTokenKey() {
  return envValue("BUNNY_TOKEN_KEY", "BUNNY_STREAM_TOKEN_AUTH_KEY", "BUNNY_TOKEN_AUTH_KEY");
}

function isBunnyVideoId(value: string) {
  return /^[A-Za-z0-9-]{8,80}$/.test(value) && !/\.(mp4|m3u8|webm)$/i.test(value);
}

function isDownloadLink(value: string) {
  if (/\.(mp4|m3u8|webm)(\?|#|$)/i.test(value) || /\/play_\d+p\b/i.test(value) || /playlist\.m3u8/i.test(value)) {
    return true;
  }
  try {
    return DOWNLOAD_HOST.test(new URL(value).hostname);
  } catch {
    return false;
  }
}

export function extractBunnyVideoId(value: string) {
  const trimmed = value.trim();
  if (!trimmed || isDownloadLink(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (!BUNNY_HOST.test(url.hostname)) return null;
      const parts = url.pathname.split("/").filter(Boolean);
      const kind = parts.findIndex((part) => part === "embed" || part === "play");
      const candidate = kind >= 0 ? (parts[kind + 2] ?? parts[kind + 1] ?? "") : (parts.at(-1) ?? "");
      const queryId = url.searchParams.get("videoId") || url.searchParams.get("video_id") || "";
      if (isBunnyVideoId(candidate)) return candidate;
      return isBunnyVideoId(queryId) ? queryId : null;
    } catch {
      return null;
    }
  }
  return isBunnyVideoId(trimmed) ? trimmed : null;
}

export function bunnyConfigured() {
  return Boolean(bunnyLibraryId() && bunnyTokenKey());
}

export function signBunnyEmbed(videoId: string, options: { ttlSeconds?: number; autoplay?: boolean } = {}) {
  const libraryId = bunnyLibraryId();
  const key = bunnyTokenKey();
  const id = extractBunnyVideoId(videoId);
  if (!libraryId || !key || !id) return null;

  const expires = Math.floor(Date.now() / 1000) + (options.ttlSeconds ?? 60 * 60 * 4);
  const token = createHash("sha256").update(`${key}${id}${expires}`).digest("hex");
  const query = new URLSearchParams({
    token,
    expires: String(expires),
    autoplay: options.autoplay ? "true" : "false",
  });
  return {
    url: `https://${EMBED_HOST}/embed/${libraryId}/${id}?${query}`,
    expiresAt: new Date(expires * 1000).toISOString(),
  };
}

export function isBunnyEmbed(url: string) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "player.mediadelivery.net" || parsed.hostname === "iframe.mediadelivery.net") &&
      parsed.pathname.startsWith("/embed/") &&
      !isDownloadLink(url)
    );
  } catch {
    return false;
  }
}
