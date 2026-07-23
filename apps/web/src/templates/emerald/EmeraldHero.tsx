'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Leaves } from '@/shared/ui/Leaves';

interface EmeraldHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly kicker: string;
}

/** Canva'da tayyorlangan real zumrad+oltin gulli ramka. */
const EMERALD_FRAME = '/images/emerald-frame-real.png';

/**
 * Emerald hero — real zumrad gulli ramka (sekin parallax + zoom),
 * ustida oltin serifda ustma-ust ismlar, oldida suzuvchi barglar (tez).
 */
export function EmeraldHero({ groom, bride, dateLine, kicker }: EmeraldHeroProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const frameY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const frameScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const leafY = useTransform(scrollYProgress, [0, 1], ['0%', '46%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

  const off = reduce || undefined;

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-emerald-deep">
      {/* Qatlam 0 — real zumrad gulli ramka */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: frameY, scale: frameScale }}
        className="absolute inset-0 -z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${EMERALD_FRAME})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,32,25,0.35)_25%,rgba(8,32,25,0.7)_100%)]" />
      </motion.div>

      {/* Qatlam 1 — matn (oltin serif, ustma-ust ismlar) */}
      <motion.div
        style={off ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold-light/90">{kicker}</p>
        <div className="mt-6 animate-draw-in">
          <h1 className="font-display text-6xl font-medium leading-[1.02] text-ivory drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-8xl">
            {groom}
          </h1>
          <span className="my-1 block font-display text-4xl text-gold-light sm:text-5xl">&amp;</span>
          <h1 className="font-display text-6xl font-medium leading-[1.02] text-ivory drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-8xl">
            {bride}
          </h1>
        </div>
        <span className="gold-shimmer mt-7 block h-px w-24 bg-gold-light" />
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-ivory/85 sm:text-sm">
          {dateLine}
        </p>
      </motion.div>

      {/* Qatlam 2 — suzuvchi barglar (tez) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: leafY }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <Leaves className="h-full w-full text-gold-light/50" />
      </motion.div>

      <span className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-2xl text-gold-light/70">
        ⌄
      </span>
    </section>
  );
}
