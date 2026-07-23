'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Bloom } from './RoyalFlora';
import { RoyalPetals } from './RoyalPetals';

interface RoyalHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly kicker: string;
  readonly eyebrow: string;
  readonly venue?: string;
}

/**
 * Royal hero — och (fil-suyagi) fon, oltin ichki ramka, to'rt burchakda oq atirgul
 * buketlari (parallax bilan sekin siljiydi), markazda oltin serifda ismlar,
 * ustida tushuvchi atirgul barglari.
 */
export function RoyalHero({
  groom,
  bride,
  dateLine,
  kicker,
  eyebrow,
  venue,
}: RoyalHeroProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Burchak buketlari scroll'da tashqariga "ochiladi"
  const cornerOut = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const cornerOutNeg = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const off = reduce || undefined;

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white via-cream to-[#f3ead9]"
    >
      {/* nozik naqsh + zoom fon */}
      <motion.div
        aria-hidden
        style={off ? undefined : { scale: bgScale }}
        className="pattern-soft absolute inset-0 -z-0 opacity-70"
      />

      {/* oltin ichki ramka */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-[0.5rem] border border-gold/40 sm:inset-6"
      >
        <span className="absolute inset-[6px] rounded-[0.35rem] border border-gold/20" />
      </div>

      {/* Burchak buketlari (parallax) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerOutNeg, y: cornerOutNeg }}
        className="pointer-events-none absolute -left-6 -top-6 h-[52vw] max-h-[420px] min-h-[220px] w-[52vw] min-w-[220px] max-w-[420px]"
      >
        <Bloom n={1} className="h-full w-full origin-top-left animate-[sway_9s_ease-in-out_infinite]" />
      </motion.div>
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerOut, y: cornerOutNeg }}
        className="pointer-events-none absolute -right-6 -top-6 h-[46vw] max-h-[380px] min-h-[190px] w-[46vw] min-w-[190px] max-w-[380px]"
      >
        <Bloom n={1} flipX className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerOutNeg, y: cornerOut }}
        className="pointer-events-none absolute -bottom-6 -left-6 h-[46vw] max-h-[380px] min-h-[190px] w-[46vw] min-w-[190px] max-w-[380px]"
      >
        <Bloom n={2} flipX className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerOut, y: cornerOut }}
        className="pointer-events-none absolute -bottom-6 -right-6 h-[52vw] max-h-[420px] min-h-[220px] w-[52vw] min-w-[220px] max-w-[420px]"
      >
        <Bloom n={2} className="h-full w-full origin-bottom-right animate-[sway_10s_ease-in-out_infinite]" />
      </motion.div>

      {/* Markaziy matn */}
      <motion.div
        style={off ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center px-8 text-center"
      >
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-gold sm:text-xs">{eyebrow}</p>
        <span className="gold-shimmer my-4 block h-px w-10 bg-gold" />

        <div className="animate-draw-in">
          <h1 className="font-display text-6xl font-medium leading-[0.95] text-ink sm:text-8xl">
            {groom}
          </h1>
          <span className="my-1 block font-display text-4xl italic text-gold sm:text-5xl">&amp;</span>
          <h1 className="font-display text-6xl font-medium leading-[0.95] text-ink sm:text-8xl">
            {bride}
          </h1>
        </div>

        <span className="mt-6 flex items-center gap-2 text-gold/70">
          <span className="h-px w-8 bg-current" />
          <span className="text-xs">❦</span>
          <span className="h-px w-8 bg-current" />
        </span>

        <p className="mt-4 text-xs uppercase tracking-[0.32em] text-ink/70 sm:text-sm">{dateLine}</p>
        {venue ? <p className="mt-1 font-display text-lg text-gold">{venue}</p> : null}
        <p className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-ink/40">{kicker}</p>
      </motion.div>

      {/* Tushuvchi barglar */}
      <RoyalPetals />

      {/* scroll ishorasi */}
      <span className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 animate-float text-2xl text-gold/70">
        ⌄
      </span>
    </section>
  );
}
