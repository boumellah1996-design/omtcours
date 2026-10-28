"use client";

import { useEffect, useRef } from "react";

type Kind = "phone" | "phoneDark" | "cracked" | "board" | "battery" | "chip" | "flex";
type Side = "left" | "right";

type Piece = {
  kind: Kind;
  side: Side;
  top: string;
  inset: string;
  size: number;
  rotate: number;
  depth: number;
  opacity: number;
};

const pieces: Piece[] = [
  { kind: "phone", side: "left", top: "2%", inset: "8px", size: 108, rotate: -22, depth: 0.1, opacity: 0.82 },
  { kind: "board", side: "right", top: "3%", inset: "4px", size: 124, rotate: 18, depth: 0.16, opacity: 0.78 },
  { kind: "cracked", side: "right", top: "12%", inset: "42px", size: 96, rotate: -16, depth: 0.12, opacity: 0.8 },
  { kind: "battery", side: "left", top: "13%", inset: "52px", size: 70, rotate: 14, depth: 0.22, opacity: 0.76 },
  { kind: "chip", side: "left", top: "22%", inset: "6px", size: 52, rotate: 10, depth: 0.28, opacity: 0.74 },
  { kind: "phoneDark", side: "right", top: "24%", inset: "10px", size: 112, rotate: 12, depth: 0.18, opacity: 0.84 },
  { kind: "flex", side: "left", top: "31%", inset: "40px", size: 88, rotate: -32, depth: 0.14, opacity: 0.7 },
  { kind: "board", side: "left", top: "39%", inset: "0px", size: 132, rotate: 9, depth: 0.24, opacity: 0.8 },
  { kind: "cracked", side: "right", top: "41%", inset: "18px", size: 102, rotate: -14, depth: 0.11, opacity: 0.82 },
  { kind: "battery", side: "right", top: "52%", inset: "6px", size: 72, rotate: 24, depth: 0.26, opacity: 0.76 },
  { kind: "phone", side: "left", top: "53%", inset: "28px", size: 94, rotate: -18, depth: 0.17, opacity: 0.83 },
  { kind: "chip", side: "right", top: "61%", inset: "56px", size: 48, rotate: -6, depth: 0.3, opacity: 0.72 },
  { kind: "phoneDark", side: "left", top: "66%", inset: "4px", size: 100, rotate: 20, depth: 0.15, opacity: 0.8 },
  { kind: "board", side: "right", top: "70%", inset: "0px", size: 128, rotate: -18, depth: 0.21, opacity: 0.78 },
  { kind: "flex", side: "right", top: "79%", inset: "44px", size: 82, rotate: 28, depth: 0.16, opacity: 0.7 },
  { kind: "cracked", side: "left", top: "80%", inset: "36px", size: 98, rotate: -12, depth: 0.2, opacity: 0.8 },
  { kind: "battery", side: "left", top: "90%", inset: "10px", size: 64, rotate: 16, depth: 0.27, opacity: 0.74 },
  { kind: "phone", side: "right", top: "88%", inset: "22px", size: 90, rotate: -20, depth: 0.13, opacity: 0.8 },
];

export function PhoneCascade() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = [...root.querySelectorAll<HTMLElement>("[data-depth]")];

    const place = () => {
      const y = reduce ? 0 : window.scrollY;
      for (const node of nodes) {
        const depth = Number(node.dataset.depth);
        const rotate = node.dataset.rotate ?? "0";
        node.style.transform = `translate3d(0, ${y * depth}px, 0) rotate(${rotate}deg)`;
      }
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };

    place();
    if (reduce) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="phone-cascade" aria-hidden="true">
      {pieces.map((piece, index) => (
        <div
          key={`${piece.kind}-${piece.side}-${index}`}
          className="phone-cascade-slot"
          style={{
            top: piece.top,
            [piece.side]: piece.inset,
            width: piece.size,
            opacity: piece.opacity,
          }}
        >
          <div data-depth={piece.depth} data-rotate={piece.rotate} className="phone-cascade-item">
            <Part kind={piece.kind} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Part({ kind }: { kind: Kind }) {
  switch (kind) {
    case "phone":
      return <PhoneGlyph accent />;
    case "phoneDark":
      return <PhoneGlyph />;
    case "cracked":
      return <CrackedGlyph />;
    case "board":
      return <BoardGlyph />;
    case "battery":
      return <BatteryGlyph />;
    case "chip":
      return <ChipGlyph />;
    case "flex":
      return <FlexGlyph />;
  }
}

function PhoneGlyph({ accent = false }: { accent?: boolean }) {
  return (
    <svg viewBox="0 0 72 148" className="h-auto w-full">
      <rect x="2" y="2" width="68" height="144" rx="14" fill="var(--pc-body)" />
      <rect x="7" y="10" width="58" height="118" rx="6" fill="var(--pc-screen)" />
      <rect x="26" y="14" width="20" height="5" rx="2.5" fill="var(--pc-chip)" />
      {accent ? <rect x="18" y="48" width="36" height="6" rx="2" fill="#ffe500" opacity="0.85" /> : null}
      <circle cx="36" cy="136" r="5" fill="var(--pc-chip)" />
    </svg>
  );
}

function CrackedGlyph() {
  return (
    <svg viewBox="0 0 72 148" className="h-auto w-full">
      <rect x="2" y="2" width="68" height="144" rx="14" fill="var(--pc-body)" />
      <rect x="7" y="10" width="58" height="118" rx="6" fill="var(--pc-glass)" />
      <path
        d="M28 18 L40 52 L22 70 L48 96 L30 122 M40 52 L58 44 M22 70 L12 88 M48 96 L60 80"
        fill="none"
        stroke="var(--pc-crack)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="26" y="14" width="20" height="5" rx="2.5" fill="var(--pc-chip)" />
    </svg>
  );
}

function BoardGlyph() {
  return (
    <svg viewBox="0 0 120 84" className="h-auto w-full">
      <rect x="1" y="1" width="118" height="82" rx="8" fill="var(--pc-pcb)" />
      <path
        d="M10 18 H48 M48 18 V40 H86 M18 66 H70 M70 66 V28 M96 12 V72"
        fill="none"
        stroke="var(--pc-trace)"
        strokeWidth="1.4"
      />
      <rect x="16" y="24" width="28" height="20" rx="2" fill="var(--pc-chip)" />
      <rect x="52" y="42" width="22" height="16" rx="2" fill="var(--pc-chip)" />
      <rect x="82" y="22" width="18" height="14" rx="2" fill="var(--pc-gold)" />
      <circle cx="20" cy="14" r="2.2" fill="var(--pc-gold)" />
      <circle cx="32" cy="14" r="2.2" fill="var(--pc-gold)" />
      <circle cx="104" cy="64" r="2.2" fill="var(--pc-gold)" />
      <circle cx="92" cy="64" r="2.2" fill="var(--pc-gold)" />
      <circle cx="80" cy="64" r="2.2" fill="var(--pc-gold)" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg viewBox="0 0 86 48" className="h-auto w-full">
      <rect x="2" y="8" width="74" height="32" rx="6" fill="var(--pc-glass)" stroke="var(--pc-body)" strokeWidth="2" />
      <rect x="76" y="16" width="8" height="16" rx="2" fill="var(--pc-body)" />
      <rect x="10" y="16" width="8" height="16" rx="1" fill="var(--pc-gold)" />
      <rect x="22" y="16" width="8" height="16" rx="1" fill="var(--pc-gold)" />
      <path d="M42 18 V38 M38 22 H46" stroke="var(--pc-chip)" strokeWidth="1.6" />
    </svg>
  );
}

function ChipGlyph() {
  return (
    <svg viewBox="0 0 56 56" className="h-auto w-full">
      <rect x="10" y="10" width="36" height="36" rx="3" fill="var(--pc-chip)" />
      <rect x="16" y="16" width="24" height="24" rx="1.5" fill="var(--pc-body)" />
      {Array.from({ length: 5 }, (_, index) => (
        <g key={index}>
          <rect x={14 + index * 6} y="4" width="2.4" height="8" fill="var(--pc-gold)" />
          <rect x={14 + index * 6} y="44" width="2.4" height="8" fill="var(--pc-gold)" />
          <rect x="4" y={14 + index * 6} width="8" height="2.4" fill="var(--pc-gold)" />
          <rect x="44" y={14 + index * 6} width="8" height="2.4" fill="var(--pc-gold)" />
        </g>
      ))}
    </svg>
  );
}

function FlexGlyph() {
  return (
    <svg viewBox="0 0 90 36" className="h-auto w-full">
      <path
        d="M4 18 C18 4, 30 32, 46 18 S74 4, 86 18"
        fill="none"
        stroke="var(--pc-gold)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M4 18 C18 4, 30 32, 46 18 S74 4, 86 18"
        fill="none"
        stroke="var(--pc-chip)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="1" y="10" width="10" height="16" rx="2" fill="var(--pc-body)" />
      <rect x="79" y="10" width="10" height="16" rx="2" fill="var(--pc-body)" />
    </svg>
  );
}
