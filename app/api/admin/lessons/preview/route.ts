import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { extractBunnyVideoId, isBunnyEmbed, signBunnyEmbed } from "@/lib/bunny";

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Admin only." }, { status: 401 });
  }

  const video = new URL(request.url).searchParams.get("video") ?? "";
  const videoId = extractBunnyVideoId(video);
  if (!videoId) {
    return NextResponse.json({ ok: false, code: "invalid_video", message: "Paste a Bunny embed link or video ID." }, { status: 400 });
  }

  const signed = signBunnyEmbed(videoId, { ttlSeconds: 60 * 20 });
  if (!signed || !isBunnyEmbed(signed.url)) {
    return NextResponse.json({
      ok: true,
      videoId,
      embedUrl: "",
      bunnyReady: false,
    });
  }

  return NextResponse.json(
    { ok: true, videoId, embedUrl: signed.url, bunnyReady: true, expiresAt: signed.expiresAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
