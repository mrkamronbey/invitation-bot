'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Flourish, Monogram } from '@/shared/ui/ornaments';
import { Petals } from '@/shared/ui/Petals';

interface ParallaxHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly cover?: string;
  readonly kicker: string;
}

/** Canva'da tayyorlangan real akvarel gulli ramka (public asset). */
const FLORAL_FRAME = '/images/floral-frame-real.png';

/**
 * Parallax hero — real rasm qatlamlari scroll'da har xil tezlikda siljiydi:
 *   • gulli ramka (real akvarel, sekin + zoom)
 *   • kelin-kuyov surati nafis ramkada (o'rta tezlik)
 *   • ismlar/sana matni (matn qatlami)
 *   • suzuvchi gul barglari (tez, old plan)
 * Yorug', havodor, premium — `prefers-reduced-motion` hurmat qilinadi.
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

  // Har qatlam boshqa tezlikda — chuqurlik hissi
  const frameY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const frameScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const petalY = useTransform(scrollYProgress, [0, 1], ['0%', '48%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

  const off = reduce || undefined; // reduced-motion: transformlarni qo'llamaymiz

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-cream">
      {/* Qatlam 0 — real gulli ramka (Canva akvarel), sekin parallax + zoom */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: frameY, scale: frameScale }}
        className="absolute inset-0 -z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${FLORAL_FRAME})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* markazni yumshatuvchi nur — matn o'qilishi uchun */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,247,242,0.72)_20%,rgba(250,247,242,0)_60%)]" />
      </motion.div>

      {/* Qatlam 1+2 — surat + matn (bitta markaziy ustun, o'rta parallax) */}
      <motion.div
        style={off ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-ink"
      >
        {cover ? (
          <motion.div
            style={off ? undefined : { y: photoY }}
            className="mb-7 animate-draw-in"
          >
            <div className="relative h-44 w-36 overflow-hidden rounded-[46%] border-[3px] border-gold/70 shadow-[0_20px_44px_-14px_rgba(40,33,27,0.5)] sm:h-56 sm:w-44">
              {/* real kelin-kuyov surati */}
              <img src={cover} alt="" className="h-full w-full object-cover" />
              <span className="pointer-events-none absolute inset-0 rounded-[46%] ring-1 ring-inset ring-white/40" />
            </div>
          </motion.div>
        ) : (
          <div className="mb-6 animate-draw-in">
            <Monogram left={groom} right={bride} />
          </div>
        )}

        <p className="text-[0.7rem] uppercase tracking-[0.42em] text-gold">{kicker}</p>
        <h1 className="mt-3 font-display text-5xl font-medium leading-[1.05] text-ink drop-shadow-[0_1px_1px_rgba(250,247,242,0.8)] sm:text-7xl">
          {groom}
          <span className="mx-3 text-gold">&amp;</span>
          {bride}
        </h1>
        <Flourish className="mt-5 text-gold" />
        <p className="mt-4 text-xs uppercase tracking-[0.28em] text-ink/75 sm:text-sm">{dateLine}</p>
      </motion.div>

      {/* Qatlam 3 — suzuvchi gul barglari (tez parallax, old plan) */}
      <motion.div
        aria-hidden
        style={off ? undefined : { y: petalY }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <Petals />
      </motion.div>

      <span className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-float text-2xl text-gold/70">
        ⌄
      </span>
    </section>
  );
}
