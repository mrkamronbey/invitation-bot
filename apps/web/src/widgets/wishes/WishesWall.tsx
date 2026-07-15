import type { ReactNode } from 'react';
import { getMessages } from '@invitation/i18n';
import { getWishes } from '@/shared/api/wishes-source';
import { Section } from '@/shared/ui/Section';
import { Reveal } from '@/shared/ui/Reveal';

interface WishesWallProps {
  readonly slug: string;
  readonly locale: string;
}

/**
 * Tilaklar devori — mehmonlar RSVP bilan qoldirgan tabriklar.
 * Async server component: sahifada slug bo'yicha tilaklarni o'zi yuklaydi.
 * Tilak bo'lmasa — hech narsa ko'rsatilmaydi.
 */
export async function WishesWall({ slug, locale }: WishesWallProps): Promise<ReactNode> {
  const wishes = await getWishes(slug);
  if (wishes.length === 0) return null;

  const m = getMessages(locale);
  return (
    <Section title={m.web.wishesTitle}>
      <div className="flex flex-col gap-4">
        {wishes.map((w, i) => (
          <Reveal key={`${w.name}-${i}`} delay={i * 60} variant="up">
            <figure className="rounded-2xl border border-gold/20 bg-white/40 px-5 py-4 shadow-sm backdrop-blur-sm">
              <blockquote className="font-display text-lg italic leading-relaxed opacity-90">
                “{w.message}”
              </blockquote>
              <figcaption className="mt-2 text-right text-sm uppercase tracking-wider text-gold">
                — {w.name}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
