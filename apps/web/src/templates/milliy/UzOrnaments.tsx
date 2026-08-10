import type { ReactNode } from 'react';

/**
 * O'zbek milliy naqshlari — SVG'da geometrik hisoblab chiziladi.
 * Girih (geometrik "tugun") va islimiy (o'simliksimon) uslublari.
 * Rasm emas, vektor: fayl kichik, istalgan rangda, har qanday ekranda tiniq.
 */

/** Samarqand koshini palitrasi. */
export const UZ = {
  tealDeep: '#0B4F52',
  teal: '#0E7C86',
  turquoise: '#2AA7B5',
  gold: '#B8912F',
  goldLight: '#DDBB63',
  ivory: '#FBF7EC',
  ivoryWarm: '#F5EEDC',
  ink: '#17383A',
} as const;

/** Ko'p burchakli yulduz nuqtalari (girih asosi — odatda 8 burchak). */
function starPoints(cx: number, cy: number, outer: number, inner: number, tips = 8): string {
  const step = Math.PI / tips;
  const out: string[] = [];
  for (let i = 0; i < tips * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    out.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return out.join(' ');
}

interface BackdropProps {
  readonly id: string;
  readonly className?: string;
  readonly color?: string;
  readonly opacity?: number;
}

/**
 * Girih fon — 8 burchakli yulduzlar to'ri (Registon koshinlari uslubi).
 * Uzluksiz takrorlanadi; juda past opacity bilan fon to'qimasi sifatida.
 */
export function GirihBackdrop({
  id,
  className,
  color = UZ.teal,
  opacity = 0.07,
}: BackdropProps): ReactNode {
  return (
    <svg aria-hidden className={className} width="100%" height="100%">
      <defs>
        <pattern id={id} width="112" height="112" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round">
            {/* markaziy yulduz */}
            <polygon points={starPoints(56, 56, 30, 13)} />
            {/* burchak yulduzlari — plitkalar tutashganda butun yulduz hosil bo'ladi */}
            <polygon points={starPoints(0, 0, 30, 13)} />
            <polygon points={starPoints(112, 0, 30, 13)} />
            <polygon points={starPoints(0, 112, 30, 13)} />
            <polygon points={starPoints(112, 112, 30, 13)} />
            {/* bog'lovchi to'rt burchaklar */}
            <polygon points="56,26 86,56 56,86 26,56" opacity="0.55" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}

interface OrnamentProps {
  readonly className?: string;
  readonly color?: string;
}

/** Girih yulduz medalyoni — sarlavha tepasidagi belgi. */
export function GirihStar({ className, color = UZ.gold }: OrnamentProps): ReactNode {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none" stroke={color}>
      <polygon points={starPoints(32, 32, 28, 12)} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={starPoints(32, 32, 15, 6.5)} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="3.2" fill={color} stroke="none" />
    </svg>
  );
}

/** Naqshli ajratgich — chiziq + markazda yulduz + ikki yon tomchi (bodom). */
export function OrnamentDivider({ className, color = UZ.gold }: OrnamentProps): ReactNode {
  return (
    <svg viewBox="0 0 260 26" className={className} aria-hidden fill="none" stroke={color}>
      <line x1="4" y1="13" x2="92" y2="13" strokeWidth="1" />
      <line x1="168" y1="13" x2="256" y2="13" strokeWidth="1" />
      {/* bodom (buta) tomchilari */}
      <path d="M104,13 C104,7 109,4 113,7 C117,10 113,19 104,13 Z" strokeWidth="1.1" />
      <path d="M156,13 C156,19 151,22 147,19 C143,16 147,7 156,13 Z" strokeWidth="1.1" />
      <polygon points={starPoints(130, 13, 12, 5)} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="130" cy="13" r="2" fill={color} stroke="none" />
    </svg>
  );
}

/**
 * Islimiy burchak — o'simliksimon chirmashgan novda (barg va g'unchalar bilan).
 * `flipX`/`flipY` orqali to'rt burchakka joylashtiriladi.
 */
export function IslimiCorner({
  className,
  color = UZ.gold,
  flipX = false,
  flipY = false,
}: OrnamentProps & { readonly flipX?: boolean; readonly flipY?: boolean }): ReactNode {
  const t = `${flipX ? 'scale(-1,1) ' : ''}${flipY ? 'scale(1,-1)' : ''}`.trim();
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none" stroke={color}>
      <g
        strokeWidth="1.4"
        strokeLinecap="round"
        transform={t ? `translate(60,60) ${t} translate(-60,-60)` : undefined}
      >
        {/* asosiy chirmashuvchi novda */}
        <path d="M6,114 C6,68 26,32 62,16 C84,6 104,8 114,14" />
        {/* ichki hamroh chiziq */}
        <path d="M16,114 C16,74 34,44 64,29 C82,20 98,20 108,24" opacity="0.6" />
        {/* barglar */}
        <path d="M30,74 C18,68 16,54 26,48 C34,56 36,68 30,74 Z" strokeWidth="1.2" />
        <path d="M54,40 C46,28 52,16 62,15 C64,26 60,36 54,40 Z" strokeWidth="1.2" />
        <path d="M86,20 C82,10 90,2 99,4 C98,14 92,20 86,20 Z" strokeWidth="1.2" />
        {/* g'unchalar */}
        <circle cx="42" cy="57" r="3" fill={color} stroke="none" />
        <circle cx="72" cy="25" r="2.6" fill={color} stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Mehrob (Temuriy o'tkir ravoq) ramkasi — Registon peshtoqlari uslubi.
 * Karta yoki sarlavha atrofidagi milliy belgi.
 */
export function ArchFrame({ className, color = UZ.gold }: OrnamentProps): ReactNode {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      aria-hidden
      fill="none"
      stroke={color}
      preserveAspectRatio="none"
    >
      {/* tashqi ravoq */}
      <path
        d="M8,296 L8,150 A118,118 0 0,1 100,30 A118,118 0 0,1 192,150 L192,296"
        strokeWidth="1.6"
      />
      {/* ichki nozik ravoq */}
      <path
        d="M18,296 L18,152 A106,106 0 0,1 100,42 A106,106 0 0,1 182,152 L182,296"
        strokeWidth="0.9"
        opacity="0.55"
      />
    </svg>
  );
}
