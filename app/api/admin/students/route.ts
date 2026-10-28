import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { listRegisteredStudents } from "@/lib/students";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }
  const students = await listRegisteredStudents();
  return NextResponse.json({ ok: true, students }, { headers: { "Cache-Control": "no-store" } });
}
