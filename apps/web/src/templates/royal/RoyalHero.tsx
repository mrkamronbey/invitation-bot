'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Bloom } from './RoyalFlora';
import { RoyalStars } from './RoyalStars';

interface RoyalHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly eyebrow: string;
}

/**
 * Royal hero — royal-v2-green demoga aynan moslangan:
 * to'q zumrad fon, bitta ingichka oltin ramka, DIAGONAL ikki oq atirgul buketi
 * (yuqori-chap + pastki-o'ng, ramkadan oshib chiqadi), markazda "taklif" matni,
 * ismlar tepasi va pastida oltin fleur-ajratgich (flower-7).
 */
export function RoyalHero({ groom, bride, eyebrow }: RoyalHeroProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const cornerTL = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const cornerBR = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const off = reduce || undefined;

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-emerald-deep"
    >
      {/* to'q zumrad fon + markaziy yorug'lik */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,#12402e_0%,#0b241a_58%,#071710_100%)]"
      />
      <div aria-hidden className="pattern-soft-dark absolute inset-0 -z-0 opacity-30" />

      {/* miltillovchi yulduzchalar */}
      <RoyalStars />

      {/* bitta ingichka oltin ramka */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-5 z-0 border border-gold-light/55 sm:inset-8"
      />

      {/* Diagonal ikki buket (ramka ustidan oshadi) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerTL, y: cornerTL }}
        className="pointer-events-none absolute -left-8 -top-8 z-10 h-[60vw] max-h-[460px] min-h-[240px] w-[60vw] min-w-[240px] max-w-[460px]"
      >
        <Bloom n={1} className="h-full w-full origin-top-left animate-[sway_9s_ease-in-out_infinite]" />
      </motion.div>
      <motion.div
        aria-hidden
        style={off ? undefined : { x: cornerBR, y: cornerBR }}
        className="pointer-events-none absolute -bottom-8 -right-8 z-10 h-[62vw] max-h-[480px] min-h-[250px] w-[62vw] min-w-[250px] max-w-[480px]"
      >
        <Bloom n={2} className="h-full w-full origin-bottom-right animate-[sway_10s_ease-in-out_infinite]" />
      </motion.div>

      {/* Markaziy matn */}
      <motion.div
        style={off ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center px-10 text-center"
      >
        <p className="max-w-[16rem] font-display text-sm uppercase leading-relaxed tracking-[0.3em] text-ivory/90 sm:text-base">
          {eyebrow}
        </p>

        {/* oltin fleur-ajratgich (tepada) */}
        <Bloom n={7} className="mt-5 h-6 w-52 sm:w-64" />

        <div className="my-4 animate-draw-in">
          <h1 className="font-display text-6xl font-medium leading-[1.05] text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-8xl">
            {groom}
          </h1>
          <span className="my-1 block font-display text-4xl italic text-gold-light sm:text-5xl">
            &amp;
          </span>
          <h1 className="font-display text-6xl font-medium leading-[1.05] text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-8xl">
            {bride}
          </h1>
        </div>

        {/* oltin fleur-ajratgich (pastda) */}
        <Bloom n={7} className="mt-1 h-6 w-52 sm:w-64" />
      </motion.div>

      {/* scroll ishorasi */}
      <span className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 animate-float text-2xl text-gold-light/70">
        ⌄
      </span>
    </section>
  );
}
