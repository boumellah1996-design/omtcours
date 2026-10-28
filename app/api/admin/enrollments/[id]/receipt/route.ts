import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/db";
import { receiptType } from "@/lib/receipt";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED" }, { status: 401 });
  }
  const { id } = await context.params;
  if (!/^[\w-]{8,40}$/.test(id)) {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 404 });
  }
  const enrollment = await prisma.enrollment.findUnique({ where: { id }, select: { receiptExt: true } });
  const type = receiptType(enrollment?.receiptExt ?? "");
  if (!enrollment || !type) {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 404 });
  }
  try {
    const bytes = await readFile(path.join(process.cwd(), "data", "receipts", `${id}.${enrollment.receiptExt}`));
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": type,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, code: "generic" }, { status: 404 });
  }
}
