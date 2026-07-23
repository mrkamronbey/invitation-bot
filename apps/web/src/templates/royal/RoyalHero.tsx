'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Bloom } from './RoyalFlora';
import { RoyalStars } from './RoyalStars';

interface RoyalHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly kicker: string;
  readonly eyebrow: string;
  readonly weekday: string;
  readonly day: string;
  readonly month: string;
  readonly year: string;
  readonly venue?: string;
}

/**
 * Royal hero — to'q zumrad fon, oltin ichki ramka, to'rt burchakda oq atirgul
 * buketlari (parallax bilan sekin siljiydi), markazda fil-suyagi serifda ismlar,
 * fonda miltillovchi oltin yulduzchalar (royal-v2-green uslubi).
 */
export function RoyalHero({
  groom,
  bride,
  kicker,
  eyebrow,
  weekday,
  day,
  month,
  year,
  venue,
}: RoyalHeroProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const cornerOut = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const cornerOutNeg = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const off = reduce || undefined;

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-emerald-deep"
    >
      {/* to'q zumrad fon + markaziy yorug'lik */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,#12402e_0%,#0b241a_60%,#071710_100%)]"
      />
      <div aria-hidden className="pattern-soft-dark absolute inset-0 -z-0 opacity-40" />

      {/* miltillovchi yulduzchalar */}
      <RoyalStars />

      {/* oltin ichki ramka */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-[0.5rem] border border-gold-light/45 sm:inset-6"
      >
        <span className="absolute inset-[6px] rounded-[0.35rem] border border-gold-light/20" />
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
        className="pointer-events-none absolute -right-6 -top-6 h-[42vw] max-h-[340px] min-h-[170px] w-[42vw] min-w-[170px] max-w-[340px]"
      >
        <Bloom n={2} flipX className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerOutNeg, y: cornerOut }}
        className="pointer-events-none absolute -bottom-6 -left-6 h-[42vw] max-h-[340px] min-h-[170px] w-[42vw] min-w-[170px] max-w-[340px]"
      >
        <Bloom n={2} flipX flipY className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerOut, y: cornerOut }}
        className="pointer-events-none absolute -bottom-6 -right-6 h-[52vw] max-h-[420px] min-h-[220px] w-[52vw] min-w-[220px] max-w-[420px]"
      >
        <Bloom n={1} flipX flipY className="h-full w-full origin-bottom-right animate-[sway_10s_ease-in-out_infinite]" />
      </motion.div>

      {/* Markaziy matn */}
      <motion.div
        style={off ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center px-8 text-center"
      >
        <p className="max-w-[15rem] text-[0.6rem] uppercase leading-relaxed tracking-[0.4em] text-gold-light/90 sm:text-xs">
          {eyebrow}
        </p>
        <span className="gold-shimmer my-5 block h-px w-10 bg-gold-light" />

        <div className="animate-draw-in">
          <h1 className="font-display text-6xl font-medium leading-[0.95] text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-8xl">
            {groom}
          </h1>
          <span className="my-1 block font-display text-4xl italic text-gold-light sm:text-5xl">
            &amp;
          </span>
          <h1 className="font-display text-6xl font-medium leading-[0.95] text-ivory drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-8xl">
            {bride}
          </h1>
        </div>

        <span className="mt-6 flex items-center gap-2 text-gold-light/70">
          <span className="h-px w-8 bg-current" />
          <span className="text-xs">❦</span>
          <span className="h-px w-8 bg-current" />
        </span>

        {/* Sana bloki — SHANBA | 16 | MAY / 2026 */}
        <div className="mt-6 flex items-center gap-4 text-ivory/90">
          <span className="text-[0.6rem] uppercase tracking-[0.3em] sm:text-xs">{weekday}</span>
          <span className="h-8 w-px bg-gold-light/50" />
          <span className="font-display text-4xl text-gold-light">{day}</span>
          <span className="h-8 w-px bg-gold-light/50" />
          <span className="text-[0.6rem] uppercase tracking-[0.3em] sm:text-xs">{month}</span>
        </div>
        <p className="mt-1 text-sm tracking-[0.3em] text-ivory/70">{year}</p>

        {venue ? <p className="mt-3 font-display text-lg text-gold-light">{venue}</p> : null}
        <p className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] text-ivory/40">{kicker}</p>
      </motion.div>

      {/* scroll ishorasi */}
      <span className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 animate-float text-2xl text-gold-light/70">
        ⌄
      </span>
    </section>
  );
}
