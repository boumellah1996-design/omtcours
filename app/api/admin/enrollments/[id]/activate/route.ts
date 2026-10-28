import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { activateEnrollment } from "@/lib/enrollments";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }
  const { id } = await context.params;
  const result = await activateEnrollment(id);
  if (!result) return NextResponse.json({ ok: false, code: "generic" }, { status: 404 });
  return NextResponse.json({ ok: true, ...result });
}
