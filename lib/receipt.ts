import { mkdir, readFile, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

export const RECEIPT_MAX_BYTES = 4 * 1024 * 1024;

export type ReceiptExt = "jpg" | "png" | "webp" | "pdf";

export function sniffReceipt(bytes: Uint8Array): ReceiptExt | null {
  if (bytes.length < 32 || bytes.length > RECEIPT_MAX_BYTES) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "pdf";
  return null;
}

export function receiptType(ext: string) {
  if (ext === "jpg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "pdf") return "application/pdf";
  return "";
}

function receiptDirs() {
  return [path.join(process.cwd(), "data", "receipts"), path.join(tmpdir(), "omt-receipts")];
}

export async function saveReceiptFile(id: string, receipt: { bytes: Uint8Array; ext: ReceiptExt }) {
  for (const dir of receiptDirs()) {
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, `${id}.${receipt.ext}`), receipt.bytes);
      return true;
    } catch {
      // Vercel and other hosts may block the app directory; try the next location.
    }
  }
  return false;
}

export async function readReceiptFile(id: string, ext: string) {
  for (const dir of receiptDirs()) {
    try {
      return await readFile(path.join(dir, `${id}.${ext}`));
    } catch {
      // keep looking
    }
  }
  return null;
}
