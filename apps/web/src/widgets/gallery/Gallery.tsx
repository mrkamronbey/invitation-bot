import type { ReactNode } from 'react';
import { Reveal } from '@/shared/ui/Reveal';

interface GalleryProps {
  readonly images: readonly string[];
}

/** Rasm galereyasi — responsive grid, yumshoq hover. */
export function Gallery({ images }: GalleryProps): ReactNode {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((src, i) => (
        <Reveal key={src} delay={i * 0.05}>
          <img
            src={src}
            alt="To'y surati"
            loading="lazy"
            className="aspect-square w-full rounded-lg object-cover shadow-sm transition-transform duration-500 hover:scale-[1.03]"
          />
        </Reveal>
      ))}
    </div>
  );
}
