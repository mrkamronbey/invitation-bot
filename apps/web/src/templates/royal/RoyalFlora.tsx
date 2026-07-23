import type { CSSProperties, ReactNode } from 'react';

/**
 * Royal shablon — gul bezaklari (oq atirgul + oltin barg).
 *
 * Rasm fayllari shu papkaga tashlanadi:
 *   apps/web/public/images/royal/flower-1.png … flower-7.png
 *
 * Har bir raqamning roli (chungdoi royal-v2-green anatomiyasi):
 *   1 — hero yuqori-chap burchak buketi (katta)
 *   2 — hero pastki-o'ng burchak buketi (katta, boshqa shakl)
 *   3 — gorizontal gulli ajratgich (simmetrik, kalta) — bo'limlar orasida
 *   4 — keng lavr-gulchambar (footer / sarlavha ostida)
 *   5 — baland vertikal shox (bo'lim chetidagi urg'u)
 *   6 — oltin barg shoxchasi (sarlavha tepasidagi kichik aksent)
 *   7 — oltin fleur-ajratgich (ikkinchi xil bo'lim ajratgichi)
 *
 * Fayl bo'lmasa — background-image hech narsa chizmaydi; render/build buzilmaydi
 * (broken-image ikonkasi chiqmaydi, chunki <img> emas, background ishlatiladi).
 */
const DIR = '/images/royal';

export function royalFlower(n: number): string {
  return `${DIR}/flower-${n}.png`;
}

interface BloomProps {
  readonly n: number;
  readonly className?: string;
  readonly style?: CSSProperties;
  /** Gorizontal aks ettirish (burchakni qarama-qarshi tomonga ko'chirish uchun). */
  readonly flipX?: boolean;
  readonly flipY?: boolean;
}

/**
 * Bitta gul bezak qatlami — background-image sifatida (shaffof PNG).
 * O'lcham/joylashuv `className` (Tailwind) orqali beriladi.
 */
export function Bloom({ n, className, style, flipX, flipY }: BloomProps): ReactNode {
  const scaleX = flipX ? -1 : 1;
  const scaleY = flipY ? -1 : 1;
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url(${royalFlower(n)})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transform: flipX || flipY ? `scale(${scaleX}, ${scaleY})` : undefined,
        ...style,
      }}
    />
  );
}
