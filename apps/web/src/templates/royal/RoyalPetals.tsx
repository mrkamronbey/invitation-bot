'use client';

import type { ReactNode } from 'react';

interface PetalSpec {
  readonly left: number; // % chapdan
  readonly size: number; // px
  readonly delay: number; // s
  readonly duration: number; // s
  readonly drift: number; // px (o'ngga siljish)
  readonly opacity: number;
}

// Deterministik (SSR/CSR mos) taqsimlangan barglar — Math.random ishlatilmaydi.
const PETALS: readonly PetalSpec[] = [
  { left: 6, size: 22, delay: 0, duration: 13, drift: 40, opacity: 0.9 },
  { left: 15, size: 14, delay: 3.5, duration: 16, drift: -30, opacity: 0.7 },
  { left: 24, size: 18, delay: 6.5, duration: 12, drift: 55, opacity: 0.85 },
  { left: 33, size: 12, delay: 1.5, duration: 18, drift: 20, opacity: 0.6 },
  { left: 42, size: 20, delay: 8, duration: 14, drift: -45, opacity: 0.8 },
  { left: 51, size: 15, delay: 4.5, duration: 17, drift: 35, opacity: 0.7 },
  { left: 60, size: 24, delay: 2, duration: 12, drift: -25, opacity: 0.9 },
  { left: 69, size: 13, delay: 9.5, duration: 19, drift: 50, opacity: 0.6 },
  { left: 78, size: 19, delay: 5.5, duration: 13, drift: -40, opacity: 0.85 },
  { left: 87, size: 16, delay: 7.5, duration: 15, drift: 30, opacity: 0.75 },
  { left: 94, size: 12, delay: 0.8, duration: 18, drift: -20, opacity: 0.6 },
];

/** Bitta nafis atirgul bargi — yumshoq fil-suyagi, oltin qirrali. */
function PetalShape({ size, opacity }: { size: number; opacity: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id="royalPetal" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f7efe0" />
          <stop offset="100%" stopColor="#e7d3ad" />
        </radialGradient>
      </defs>
      <path
        d="M16 2 C 24 6, 29 15, 24 25 C 21 30, 11 30, 8 25 C 3 15, 8 6, 16 2 Z"
        fill="url(#royalPetal)"
        stroke="#cDA96a"
        strokeWidth="0.8"
      />
      <path d="M16 6 C 15 14, 15 20, 16 26" stroke="#c8a25f" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

/**
 * Tushuvchi atirgul barglari qatlami — hero ustida sekin yog'iladi.
 * Faqat CSS animatsiya (petal-fall); reduced-motion'da to'xtaydi (globals.css).
 */
export function RoyalPetals(): ReactNode {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="royal-petal absolute -top-10 block"
          style={{
            left: `${p.left}%`,
            // @ts-expect-error — CSS custom property
            '--drift': `${p.drift}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <PetalShape size={p.size} opacity={p.opacity} />
        </span>
      ))}
    </div>
  );
}
