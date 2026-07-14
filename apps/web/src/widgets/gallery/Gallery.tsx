'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Reveal } from '@/shared/ui/Reveal';

interface GalleryProps {
  readonly images: readonly string[];
}

/** Rasm galereyasi — responsive grid + bosilganda lightbox. */
export function Gallery({ images }: GalleryProps): ReactNode {
  const [active, setActive] = useState<string | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <Reveal key={src} delay={i * 0.05}>
            <button type="button" onClick={() => setActive(src)} className="block w-full">
              <img
                src={src}
                alt="To'y surati"
                loading="lazy"
                className="aspect-square w-full rounded-lg object-cover shadow-sm transition-transform duration-500 hover:scale-[1.03]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <img
            src={active}
            alt="To'y surati"
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
          />
        </div>
      ) : null}
    </>
  );
}
