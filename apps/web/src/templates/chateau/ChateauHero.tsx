'use client';

import { type ReactNode, useRef } from 'react';
import {
  motion,
  type MotionStyle,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface ChateauHeroProps {
  readonly groom: string;
  readonly bride: string;
  readonly welcome: string;
}

/**
 * Chateau birinchi bo'lim (chungdoi chateau-green uslubi):
 * ornament → "to'yimizga xush kelibsiz" (strelkali chiziq) → katta yashil serif
 * ismlar → orqada akvarel bulutlar → pastda akvarel shato.
 * Scroll paytida bulutlar turli tezlikda suriladi (parallax chuqurlik).
 */
export function ChateauHero({ groom, bride, welcome }: ChateauHeroProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Bo'lim ekrandan chiqib ketguncha bo'lgan scroll ulushi (0 → 1).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Har bir qatlam boshqa tezlikda — old qatlam tezroq, orqadagi sekinroq.
  const cloudFar = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const cloudMid = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const cloudNear = useTransform(scrollYProgress, [0, 1], ['0%', '-70%']);
  const chateauY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  // Harakatni kamaytirish yoqilgan bo'lsa — statik ko'rinish.
  const p = (style: MotionStyle): MotionStyle | undefined => (reduce ? undefined : style);

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#fdfdfa]">
      {/* ── Bulutlar (parallax qatlamlar) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <motion.img
          src="/images/chateau/cloud-2.webp"
          alt=""
          style={p({ y: cloudFar })}
          className="absolute left-[-18%] top-[26%] w-[78%] opacity-70"
        />
        <motion.img
          src="/images/chateau/cloud-3.webp"
          alt=""
          style={p({ y: cloudMid })}
          className="absolute right-[-14%] top-[34%] w-[72%] opacity-80"
        />
        <motion.img
          src="/images/chateau/cloud-1.webp"
          alt=""
          style={p({ y: cloudNear })}
          className="absolute left-[-8%] top-[48%] w-[96%] opacity-90"
        />
      </div>

      {/* ── Matn qatlami (sahifa bilan birga suriladi — parallax faqat bulutlarda) ── */}
      <div className="relative z-10 px-6 pt-12 text-center">
        <img
          src="/images/chateau/ornament.webp"
          alt=""
          aria-hidden
          className="mx-auto h-6 opacity-90 sm:h-7"
        />

        <div className="mt-4 flex items-center justify-center gap-3">
          <img
            src="/images/chateau/divider-arrow.webp"
            alt=""
            aria-hidden
            className="h-1.5 w-14 opacity-80 sm:w-20"
          />
          <span className="chateau-serif whitespace-nowrap text-[0.68rem] uppercase tracking-[0.18em] text-[#3a5a2c] sm:text-sm sm:tracking-[0.22em]">
            {welcome}
          </span>
          <img
            src="/images/chateau/divider-arrow.webp"
            alt=""
            aria-hidden
            className="h-1.5 w-14 -scale-x-100 opacity-80 sm:w-20"
          />
        </div>

        <h1 className="chateau-serif mt-12 uppercase leading-[0.95] text-[#3a5a2c]">
          <span className="block text-[3.25rem] tracking-[0.02em] sm:text-7xl">{groom}</span>
          <span className="my-5 block text-xl italic normal-case tracking-normal text-[#5a8040] sm:my-7 sm:text-2xl">
            &amp;
          </span>
          <span className="block text-[3.25rem] tracking-[0.02em] sm:text-7xl">{bride}</span>
        </h1>
      </div>

      {/* ── Shato (pastda, sekin parallax) ── */}
      <motion.img
        src="/images/chateau/chateau.webp"
        alt=""
        aria-hidden
        style={p({ y: chateauY })}
        className="relative z-[5] -mt-10 w-full sm:-mt-16"
      />
    </div>
  );
}
