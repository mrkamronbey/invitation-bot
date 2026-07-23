import type { ReactNode } from 'react';

interface LeafSpec {
  readonly x: number; // %
  readonly y: number; // %
  readonly s: number; // scale
  readonly r: number; // rotation deg
  readonly o: number; // opacity
  readonly d: number; // animation delay (s)
}

const LEAVES: readonly LeafSpec[] = [
  { x: 12, y: 16, s: 1.1, r: -18, o: 0.5, d: 0 },
  { x: 84, y: 12, s: 0.8, r: 34, o: 0.4, d: 1.1 },
  { x: 22, y: 70, s: 0.9, r: 120, o: 0.35, d: 2.2 },
  { x: 90, y: 58, s: 1.2, r: -54, o: 0.45, d: 0.6 },
  { x: 66, y: 82, s: 0.7, r: 20, o: 0.4, d: 1.7 },
  { x: 40, y: 90, s: 1.0, r: 200, o: 0.35, d: 2.8 },
  { x: 6, y: 44, s: 0.65, r: 76, o: 0.3, d: 3.3 },
  { x: 54, y: 30, s: 0.55, r: -28, o: 0.3, d: 0.9 },
];

/** Bitta nozik barg (currentColor bilan bo'yaladi). */
function Leaf(): ReactNode {
  return (
    <path
      d="M0 -13 C 7 -9, 8 6, 0 14 C -8 6, -7 -9, 0 -13 Z M0 -11 L0 12"
      fill="currentColor"
      stroke="rgba(0,0,0,0.12)"
      strokeWidth="0.4"
    />
  );
}

/**
 * Suzuvchi barglar qatlami — konvert foni va parallax hero uchun.
 * Rangni tashqaridan `className` (text-...) orqali beriladi (currentColor).
 */
export function Leaves({ className }: { className?: string }): ReactNode {
  return (
    <svg
      className={className ?? 'text-gold-light/60'}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {LEAVES.map((l, i) => (
        <g
          key={i}
          transform={`translate(${l.x} ${l.y})`}
          className="leaf-drift"
          style={{ animationDelay: `${l.d}s`, opacity: l.o }}
        >
          <g transform={`scale(${l.s * 0.42}) rotate(${l.r})`}>
            <Leaf />
          </g>
        </g>
      ))}
    </svg>
  );
}
