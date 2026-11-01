"use client";

import { useEffect, useState } from "react";
import { BunnyPlayer, extractBunnyVideoId } from "@/components/BunnyPlayer";

export function BunnyPreview({
  value,
  title,
  fallback,
}: {
  value: string;
  title?: string;
  fallback?: string;
}) {
  const videoId = extractBunnyVideoId(value);
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    if (!videoId) {
      setEmbedUrl("");
      return;
    }
    const timer = window.setTimeout(() => {
      fetch(`/api/admin/lessons/preview?video=${encodeURIComponent(videoId)}`, {
        cache: "no-store",
        credentials: "include",
      })
        .then(async (response) => {
          const data = (await response.json()) as { embedUrl?: string };
          setEmbedUrl(data.embedUrl && response.ok ? data.embedUrl : "");
        })
        .catch(() => setEmbedUrl(""));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [videoId]);

  if (!videoId) return null;

  return (
    <BunnyPlayer videoId={videoId} embedUrl={embedUrl || undefined} title={title} fallback={fallback} className="mt-3" />
  );
}
