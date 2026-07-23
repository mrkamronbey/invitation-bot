import type { ReactNode } from 'react';

interface Petal {
  readonly x: number; // %
  readonly y: number; // %
  readonly s: number; // scale
  readonly r: number; // rotation deg
  readonly o: number; // opacity
}

const PETALS: readonly Petal[] = [
  { x: 8, y: 14, s: 1.1, r: -20, o: 0.85 },
  { x: 82, y: 10, s: 0.8, r: 40, o: 0.7 },
  { x: 20, y: 62, s: 0.9, r: 120, o: 0.6 },
  { x: 90, y: 55, s: 1.2, r: -60, o: 0.8 },
  { x: 66, y: 78, s: 0.7, r: 25, o: 0.6 },
  { x: 40, y: 88, s: 1.0, r: 200, o: 0.7 },
  { x: 5, y: 40, s: 0.65, r: 80, o: 0.5 },
  { x: 55, y: 30, s: 0.55, r: -30, o: 0.45 },
];

/** Bitta nafis gul bargi (petal) — oltin qirrali, yumshoq to'ldirishli. */
function Petal({ s, r, o }: { s: number; r: number; o: number }): ReactNode {
  return (
    <g transform={`scale(${s}) rotate(${r})`} opacity={o}>
      <path
        d="M0 -16 C 9 -10, 9 8, 0 16 C -9 8, -9 -10, 0 -16 Z"
        fill="#efe3d8"
        stroke="#b08d57"
        strokeWidth="0.8"
      />
      <path d="M0 -13 L0 13" stroke="#b08d57" strokeWidth="0.5" opacity="0.6" />
    </g>
  );
}

/**
 * Suzuvchi gul barglari qatlami (parallax old plan uchun).
 * Shaffof SVG — istalgan fon ustiga qo'yiladi. Yengil "float" animatsiyasi.
 */
export function Petals(): ReactNode {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {PETALS.map((p, i) => (
        <g
          key={i}
          transform={`translate(${p.x} ${p.y})`}
          className="petal-float"
          style={{ animationDelay: `${i * 0.7}s` }}
        >
          <Petal s={p.s * 0.5} r={p.r} o={p.o} />
        </g>
      ))}
    </svg>
  );
}
