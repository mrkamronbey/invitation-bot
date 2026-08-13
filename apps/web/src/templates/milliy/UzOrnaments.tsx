import type { ReactNode } from 'react';

/**
 * O'zbek milliy naqshlari.
 *
 * Bezaklar — freesvg.org / OpenClipart'dan olingan HAQIQIY islomiy-sharqona
 * naqshlar (litsenziya: Creative Commons 0 / Public Domain — tijoratda bepul,
 * atribut talab qilinmaydi). Fayllar: apps/web/public/images/milliy/
 *   rozetka.svg     — rangli girih rozetkasi (koshin uslubi)
 *   girih-ramka.png — 8 burchakli girih yulduz ramkasi (oltin)
 *   islimi.png      — doiraviy islimiy (arabesk) rozetka (oltin)
 *   tasma.svg       — gorizontal naqsh lentasi (oltin)
 *
 * GirihBackdrop esa uzluksiz takrorlanishi shart bo'lgani uchun geometrik
 * hisoblab chiziladi (tayyor naqshlar seamless emas).
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

/** Ko'p burchakli yulduz nuqtalari (uzluksiz girih foni uchun). */
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

/** Girih fon — 8 burchakli yulduzlar to'ri, uzluksiz takrorlanadi. */
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
            <polygon points={starPoints(56, 56, 30, 13)} />
            <polygon points={starPoints(0, 0, 30, 13)} />
            <polygon points={starPoints(112, 0, 30, 13)} />
            <polygon points={starPoints(0, 112, 30, 13)} />
            <polygon points={starPoints(112, 112, 30, 13)} />
            <polygon points="56,26 86,56 56,86 26,56" opacity="0.55" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}

interface ArtProps {
  readonly className?: string;
}

/** Rangli girih rozetkasi (koshin) — sarlavha medalyoni. */
export function Rozetka({ className }: ArtProps): ReactNode {
  return <img src="/images/milliy/rozetka.svg" alt="" aria-hidden className={className} />;
}

/** 8 burchakli girih yulduz ramkasi (oltin) — muqova markazi. */
export function GirihRamka({ className }: ArtProps): ReactNode {
  return <img src="/images/milliy/girih-ramka.png" alt="" aria-hidden className={className} />;
}

/** Doiraviy islimiy (arabesk) rozetka (oltin) — footer / urg'u. */
export function IslimiRozetka({ className }: ArtProps): ReactNode {
  return <img src="/images/milliy/islimi.png" alt="" aria-hidden className={className} />;
}

/**
 * Gorizontal naqsh lentasi (oltin) — bo'limlar ajratgichi.
 * Balandlik avtomatik: className'da faqat kenglik beriladi (nisbat buzilmaydi).
 */
export function Tasma({ className }: ArtProps): ReactNode {
  return (
    <img
      src="/images/milliy/tasma.svg"
      alt=""
      aria-hidden
      className={`h-auto ${className ?? ''}`}
    />
  );
}

/**
 * Mehrob (Temuriy o'tkir ravoq) ramkasi — Registon peshtoqlari uslubi.
 * Geometrik shakl bo'lgani uchun aniq o'lchamga moslab chiziladi.
 */
export function ArchFrame({
  className,
  color = UZ.gold,
}: ArtProps & { readonly color?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      aria-hidden
      fill="none"
      stroke={color}
      preserveAspectRatio="none"
    >
      <path
        d="M8,296 L8,150 A118,118 0 0,1 100,30 A118,118 0 0,1 192,150 L192,296"
        strokeWidth="1.6"
      />
      <path
        d="M18,296 L18,152 A106,106 0 0,1 100,42 A106,106 0 0,1 182,152 L182,296"
        strokeWidth="0.9"
        opacity="0.55"
      />
    </svg>
  );
}
