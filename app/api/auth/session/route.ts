import { NextResponse } from "next/server";
import { authDenied, resolveAuth } from "@/lib/access";

export async function GET() {
  const auth = await resolveAuth();
  if (auth.status === "replaced") return authDenied(auth);
  if (auth.status !== "ok") return NextResponse.json({ ok: true, user: null }, { headers: { "Cache-Control": "no-store" } });
  return NextResponse.json(
    { ok: true, user: { id: auth.user.id, name: auth.user.name, email: auth.user.email, role: auth.user.role } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
