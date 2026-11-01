import { NextResponse } from "next/server";
import { isBunnyEmbed } from "@/lib/bunny";
import { signPublicTeaser } from "@/lib/teasers";

export async function GET(_request: Request, context: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await context.params;
    const result = await signPublicTeaser(lessonId);

    if (result.status === "missing") {
      return NextResponse.json({ ok: false, code: "not_found", message: "Teaser not found." }, { status: 404 });
    }
    if (result.status !== "ok" || !isBunnyEmbed(result.signed.url)) {
      return NextResponse.json({ ok: false, code: "video_not_configured", message: "Teaser playback is not configured." }, { status: 503 });
    }

    return NextResponse.json(
      { ok: true, title: result.title, embedUrl: result.signed.url, expiresAt: result.signed.expiresAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("teaser play failed", error);
    return NextResponse.json({ ok: false, code: "db_unavailable", message: "Teaser playback is unavailable." }, { status: 503 });
  }
}
