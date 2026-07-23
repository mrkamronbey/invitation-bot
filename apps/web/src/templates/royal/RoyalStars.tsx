'use client';

import type { ReactNode } from 'react';

interface StarSpec {
  readonly x: number; // %
  readonly y: number; // %
  readonly s: number; // px
  readonly d: number; // delay (s)
  readonly dur: number; // duration (s)
}

// Deterministik (SSR/CSR mos) tarqatilgan yulduzchalar.
const STARS: readonly StarSpec[] = [
  { x: 8, y: 18, s: 10, d: 0, dur: 3.5 },
  { x: 90, y: 12, s: 7, d: 1.2, dur: 4.5 },
  { x: 70, y: 8, s: 5, d: 2.1, dur: 3.8 },
  { x: 22, y: 34, s: 6, d: 0.6, dur: 5 },
  { x: 94, y: 40, s: 9, d: 1.8, dur: 4 },
  { x: 4, y: 55, s: 6, d: 2.6, dur: 4.6 },
  { x: 84, y: 62, s: 8, d: 0.3, dur: 3.6 },
  { x: 46, y: 22, s: 5, d: 3.1, dur: 5.2 },
  { x: 60, y: 72, s: 7, d: 1.4, dur: 4.2 },
  { x: 15, y: 78, s: 9, d: 2.2, dur: 3.9 },
  { x: 92, y: 84, s: 6, d: 0.9, dur: 4.8 },
  { x: 34, y: 90, s: 5, d: 3.4, dur: 4.1 },
  { x: 74, y: 46, s: 6, d: 1.6, dur: 5.1 },
  { x: 50, y: 54, s: 4, d: 2.8, dur: 3.7 },
  { x: 26, y: 60, s: 5, d: 0.5, dur: 4.4 },
  { x: 66, y: 30, s: 4, d: 3.8, dur: 4.9 },
];

/** Bitta 4-uchli oltin uchqun (sparkle). */
function Sparkle({ size, delay, dur }: { size: number; delay: number; dur: number }): ReactNode {
  return (
    <svg
      className="royal-star absolute"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
      aria-hidden
    >
      <path
        d="M12 0 C 12.8 7.5, 16.5 11.2, 24 12 C 16.5 12.8, 12.8 16.5, 12 24 C 11.2 16.5, 7.5 12.8, 0 12 C 7.5 11.2, 11.2 7.5, 12 0 Z"
        fill="#e6cf95"
      />
    </svg>
  );
}

/** Fonda sekin miltillovchi oltin yulduzchalar qatlami (royal-v2-green uslubi). */
export function RoyalStars(): ReactNode {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {STARS.map((st, i) => (
        <span
          key={i}
          className="absolute block"
          style={{ left: `${st.x}%`, top: `${st.y}%` }}
        >
          <Sparkle size={st.s} delay={st.d} dur={st.dur} />
        </span>
      ))}
    </div>
  );
}
