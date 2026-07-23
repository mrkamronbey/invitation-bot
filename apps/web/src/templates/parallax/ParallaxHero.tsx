'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Flourish, Monogram } from '@/shared/ui/ornaments';
import { FloralCorner } from '@/shared/ui/floral';
import { Petals } from '@/shared/ui/Petals';

interface ParallaxHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly cover?: string;
  readonly kicker: string;
}

/**
 * Parallax hero — bir necha qatlam scroll'da har xil tezlikda siljiydi:
 * fon (sekin) → naqsh (o'rta) → matn → barglar (tez). Chuqurlik hissi.
 * `prefers-reduced-motion` hurmat qilinadi (animatsiya o'chadi).
 */
export function ParallaxHero({
  groom,
  bride,
  dateLine,
  cover,
  kicker,
}: ParallaxHeroProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const petalY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const off = reduce || undefined; // reduced-motion: transformlarni qo'llamaymiz

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-night">
      {/* Qatlam 0 — fon rasm (sekin parallax + zoom) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-0"
      >
        {cover ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2119] via-night to-[#12100d]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-night/45 via-night/50 to-night/75" />
      </motion.div>

      {/* Qatlam 1 — naqsh burchaklari (o'rta parallax) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: midY }}
        className="pointer-events-none absolute inset-0"
      >
        <FloralCorner className="absolute left-2 top-2 w-36 text-white/70 sm:w-52" />
        <FloralCorner className="absolute bottom-2 right-2 w-36 -scale-100 text-white/70 sm:w-52" />
      </motion.div>

      {/* Qatlam 2 — matn (yuqoriga siljiydi + so'nadi) */}
      <motion.div
        style={off ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <div className="animate-draw-in">
          <Monogram left={groom} right={bride} className="!border-white/60 !text-white" />
        </div>
        <p className="mt-8 text-xs uppercase tracking-[0.4em] text-white/80">{kicker}</p>
        <h1 className="mt-4 font-display text-6xl font-medium leading-[1.05] drop-shadow-sm sm:text-8xl">
          {groom}
          <span className="mx-3 text-gold">&amp;</span>
          {bride}
        </h1>
        <Flourish className="mt-6 text-white/70" />
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/90">{dateLine}</p>
      </motion.div>

      {/* Qatlam 3 — suzuvchi barglar (tez parallax, old plan) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: petalY }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <Petals />
      </motion.div>

      <span className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-2xl text-white/60">
        ⌄
      </span>
    </section>
  );
}
