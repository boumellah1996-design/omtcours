import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/db";
import { readReceiptFile, receiptType } from "@/lib/receipt";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "Admin only." }, { status: 401 });
  }
  const { id } = await context.params;
  if (!/^[\w-]{8,40}$/.test(id)) {
    return NextResponse.json({ ok: false, code: "not_found", message: "Receipt not found." }, { status: 404 });
  }

  let receiptExt = "";
  let receiptBytes: Uint8Array | null = null;
  try {
    const row = await prisma.enrollment.findUnique({
      where: { id },
      select: { receiptExt: true, receiptBytes: true },
    });
    receiptExt = row?.receiptExt ?? "";
    if (row?.receiptBytes) receiptBytes = row.receiptBytes;
  } catch {
    const row = await prisma.enrollment.findUnique({ where: { id }, select: { receiptExt: true } });
    receiptExt = row?.receiptExt ?? "";
  }

  const type = receiptType(receiptExt);
  if (!type) {
    return NextResponse.json({ ok: false, code: "not_found", message: "Receipt not found." }, { status: 404 });
  }

  const bytes = receiptBytes ?? (await readReceiptFile(id, receiptExt));
  if (!bytes) {
    return NextResponse.json({ ok: false, code: "not_found", message: "Receipt file is missing." }, { status: 404 });
  }

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
