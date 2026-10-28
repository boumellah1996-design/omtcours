import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TTL_MS = 5 * 60 * 1000;
const WIDTH = 168;
const HEIGHT = 64;

export const CAPTCHA_COOKIE = "omt_captcha";

const FONT: Record<string, number[]> = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01111, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b01111],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01111, 0b10000, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  "2": [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  "3": [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  "5": [0b11111, 0b10000, 0b10000, 0b11110, 0b00001, 0b00001, 0b11110],
  "6": [0b01110, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b01110],
};

function secret() {
  return process.env.CAPTCHA_SECRET || "omt-captcha-local";
}

function mac(payload: string, answer: string) {
  return createHmac("sha256", secret()).update(`${payload}:${answer}`).digest("base64url");
}

function normalize(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer) {
  const body = Buffer.concat([Buffer.from(type), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}

function png(width: number, height: number, rgba: Uint8Array) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(raw, row + 1);
  }

  const blocks: Buffer[] = [];
  let offset = 0;
  while (offset < raw.length) {
    const size = Math.min(65535, raw.length - offset);
    const header = Buffer.alloc(5);
    header[0] = offset + size === raw.length ? 1 : 0;
    header.writeUInt16LE(size, 1);
    header.writeUInt16LE(size ^ 0xffff, 3);
    blocks.push(header, raw.subarray(offset, offset + size));
    offset += size;
  }
  const deflate = Buffer.concat(blocks);
  const zlen = deflate.length;
  const zlib = Buffer.alloc(2 + zlen + 4);
  zlib[0] = 0x78;
  zlib[1] = 0x01;
  deflate.copy(zlib, 2);
  const adler = adler32(raw);
  zlib.writeUInt32BE(adler, 2 + zlen);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function adler32(data: Buffer) {
  let a = 1;
  let b = 0;
  for (const byte of data) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function setPixel(pixels: Uint8Array, x: number, y: number, color: [number, number, number]) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const index = (y * WIDTH + x) * 4;
  pixels[index] = color[0];
  pixels[index + 1] = color[1];
  pixels[index + 2] = color[2];
  pixels[index + 3] = 255;
}

function line(pixels: Uint8Array, x0: number, y0: number, x1: number, y1: number, color: [number, number, number]) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let step = 0; step <= steps; step += 1) {
    const t = steps === 0 ? 0 : step / steps;
    setPixel(pixels, Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), color);
  }
}

function image(answer: string) {
  const pixels = new Uint8Array(WIDTH * HEIGHT * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 246;
    pixels[i + 1] = 246;
    pixels[i + 2] = 244;
    pixels[i + 3] = 255;
  }
  const noise = randomBytes(18);
  for (let i = 0; i < 6; i += 1) {
    line(
      pixels,
      noise[i * 3] % WIDTH,
      noise[i * 3 + 1] % HEIGHT,
      noise[(i * 3 + 2) % 18] % WIDTH,
      noise[(i * 3 + 4) % 18] % HEIGHT,
      [20, 20, 20],
    );
  }
  [...answer].forEach((char, index) => {
    const glyph = FONT[char];
    const originX = 10 + index * 31 + (noise[index] % 5);
    const originY = 16 + (noise[index + 5] % 7);
    glyph.forEach((row, y) => {
      for (let x = 0; x < 5; x += 1) {
        if ((row & (1 << (4 - x))) === 0) continue;
        for (let sy = 0; sy < 3; sy += 1) {
          for (let sx = 0; sx < 3; sx += 1) {
            setPixel(pixels, originX + x * 3 + sx, originY + y * 3 + sy, [17, 17, 17]);
          }
        }
      }
    });
  });
  return `data:image/png;base64,${png(WIDTH, HEIGHT, pixels).toString("base64")}`;
}

export function issueCaptcha() {
  const answer = [...randomBytes(5)].map((byte) => ALPHABET[byte % ALPHABET.length]).join("");
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TTL_MS, n: randomBytes(8).toString("base64url") }),
  ).toString("base64url");
  return {
    token: `${payload}.${mac(payload, answer)}`,
    image: image(answer),
  };
}

export function captchaMatches(token: string | undefined, guess: unknown) {
  if (!token || typeof guess !== "string") return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let exp = 0;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    exp = typeof parsed.exp === "number" ? parsed.exp : 0;
  } catch {
    return false;
  }
  if (exp < Date.now()) return false;

  const expected = mac(payload, normalize(guess));
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
