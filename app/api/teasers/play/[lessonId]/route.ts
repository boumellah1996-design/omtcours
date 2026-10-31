import { NextResponse } from "next/server";
import { isBunnyEmbed } from "@/lib/bunny";
import { signPublicTeaser } from "@/lib/teasers";

export async function GET(_request: Request, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const result = await signPublicTeaser(lessonId);

  if (result.status === "missing") {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404 });
  }
  if (result.status === "unconfigured" || !isBunnyEmbed(result.signed.url)) {
    return NextResponse.json({ ok: false, code: "video_not_configured" }, { status: 503 });
  }

  return NextResponse.json(
    { ok: true, title: result.title, embedUrl: result.signed.url, expiresAt: result.signed.expiresAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
