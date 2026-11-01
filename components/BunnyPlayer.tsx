"use client";

const EMBED_HOST = "iframe.mediadelivery.net";
const BUNNY_HOST = /(^|\.)mediadelivery\.net$|(^|\.)bunnycdn\.com$/i;
const DOWNLOAD_HOST = /(^|\.)b-cdn\.net$/i;

export type BunnyPlayerProps = {
  videoId?: string;
  libraryId?: string;
  embedUrl?: string;
  title?: string;
  className?: string;
  fallback?: string;
  autoplay?: boolean;
};

function isVideoId(value: string) {
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
  if (!trimmed || isDownloadLink(trimmed)) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (!BUNNY_HOST.test(url.hostname)) return "";
      const parts = url.pathname.split("/").filter(Boolean);
      const kind = parts.findIndex((part) => part === "embed" || part === "play");
      const candidate = kind >= 0 ? (parts[kind + 2] ?? parts[kind + 1] ?? "") : (parts.at(-1) ?? "");
      const queryId = url.searchParams.get("videoId") || url.searchParams.get("video_id") || "";
      if (isVideoId(candidate)) return candidate;
      return isVideoId(queryId) ? queryId : "";
    } catch {
      return "";
    }
  }
  return isVideoId(trimmed) ? trimmed : "";
}

export function isBunnyPlayerUrl(url: string) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "iframe.mediadelivery.net" || parsed.hostname === "player.mediadelivery.net") &&
      parsed.pathname.startsWith("/embed/") &&
      !isDownloadLink(url)
    );
  } catch {
    return false;
  }
}

export function bunnyEmbedSrc({
  videoId,
  libraryId,
  embedUrl,
  autoplay = false,
}: Pick<BunnyPlayerProps, "videoId" | "libraryId" | "embedUrl" | "autoplay">) {
  if (embedUrl && isBunnyPlayerUrl(embedUrl)) return embedUrl;
  const id = extractBunnyVideoId(videoId ?? "");
  const libId = (libraryId || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "").trim();
  if (!id || !libId) return "";
  const query = new URLSearchParams({
    autoplay: autoplay ? "true" : "false",
    loop: "false",
    muted: "false",
    preload: "true",
    responsive: "true",
  });
  return `https://${EMBED_HOST}/embed/${libId}/${id}?${query}`;
}

export function BunnyPlayer({
  videoId,
  libraryId,
  embedUrl,
  title = "فيديو الدورة",
  className = "",
  fallback = "عذراً، تعذر تحميل المشغل (بيانات الفيديو غير مكتملة)",
  autoplay = false,
}: BunnyPlayerProps) {
  const src = bunnyEmbedSrc({ videoId, libraryId, embedUrl, autoplay });

  if (!src) {
    return (
      <div className={`relative z-10 isolate flex aspect-video w-full items-center justify-center rounded-xl bg-[#111] text-center text-sm font-bold text-white/70 ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative z-10 isolate aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg ${className}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="absolute inset-0 z-10 h-full w-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="origin"
      />
    </div>
  );
}

export default BunnyPlayer;
