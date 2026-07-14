import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type CornerPos = 'tl' | 'tr' | 'bl' | 'br';

const POS_TRANSFORM: Record<CornerPos, string> = {
  tl: 'scale(1,1)',
  tr: 'scale(-1,1)',
  bl: 'scale(1,-1)',
  br: 'scale(-1,-1)',
};

/** Stilize atirgul (konsentrik halqalar — nafis rose motivi). */
function Rose({ x, y, r }: { x: number; y: number; r: number }): ReactNode {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#efe3d8" stroke="#b08d57" strokeWidth="0.7" />
      <circle r={r * 0.62} fill="none" stroke="#b08d57" strokeWidth="0.6" opacity="0.8" />
      <circle r={r * 0.32} fill="none" stroke="#b08d57" strokeWidth="0.6" opacity="0.8" />
      <circle r={r * 0.1} fill="#b08d57" />
    </g>
  );
}

/** Eukalipt bargi (yumaloq oval). */
function Leaf({ x, y, a, s = 1 }: { x: number; y: number; a: number; s?: number }): ReactNode {
  return (
    <ellipse
      cx="0"
      cy="0"
      rx={7 * s}
      ry={4.2 * s}
      fill="#8ea67f"
      transform={`translate(${x} ${y}) rotate(${a})`}
    />
  );
}

/**
 * Botanik burchak — oq atirgul + yashil eukalipt barglari (to'y taklifnoma uslubida).
 * Original SVG, masshtablanadigan. Har burchakka aylantiriladi.
 */
export function FloralCorner({
  pos = 'tl',
  className,
}: {
  pos?: CornerPos;
  className?: string;
}): ReactNode {
  return (
    <svg
      viewBox="0 0 150 150"
      className={cn('pointer-events-none h-32 w-32 sm:h-40 sm:w-40', className)}
      aria-hidden="true"
    >
      <g transform={`translate(75 75) ${POS_TRANSFORM[pos]} translate(-75 -75)`}>
        {/* Poyalar */}
        <g fill="none" stroke="#6f8663" strokeWidth="1" strokeLinecap="round">
          <path d="M40 40 Q 78 46 116 70" />
          <path d="M40 40 Q 46 78 70 116" />
          <path d="M40 40 Q 30 62 26 84" />
        </g>

        {/* Barglar — o'ng shox */}
        <Leaf x={62} y={44} a={-28} />
        <Leaf x={78} y={48} a={-18} />
        <Leaf x={94} y={56} a={-8} />
        <Leaf x={108} y={66} a={2} />
        <Leaf x={70} y={34} a={-52} s={0.85} />
        <Leaf x={86} y={38} a={-44} s={0.85} />

        {/* Barglar — pastki shox */}
        <Leaf x={44} y={62} a={62} />
        <Leaf x={48} y={78} a={72} />
        <Leaf x={56} y={94} a={82} />
        <Leaf x={66} y={108} a={92} />
        <Leaf x={34} y={70} a={38} s={0.85} />
        <Leaf x={38} y={86} a={46} s={0.85} />

        {/* Buds */}
        <circle cx="118" cy="70" r="2" fill="#6f8663" />
        <circle cx="72" cy="118" r="2" fill="#6f8663" />

        {/* Atirgullar (burchakda klaster) */}
        <Rose x={34} y={34} r={15} />
        <Rose x={58} y={26} r={10} />
        <Rose x={28} y={56} r={9} />
      </g>
    </svg>
  );
}

/** Ikki qarama-qarshi burchakka floral naqsh (yuqori-chap + past-o'ng). */
export function FloralFrame({ className }: { className?: string }): ReactNode {
  return (
    <>
      <FloralCorner pos="tl" className={cn('absolute left-0 top-0', className)} />
      <FloralCorner pos="br" className={cn('absolute bottom-0 right-0', className)} />
    </>
  );
}
