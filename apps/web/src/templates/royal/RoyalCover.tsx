'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bloom } from './RoyalFlora';

interface RoyalCoverProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly kicker: string;
  readonly openLabel: string;
  readonly invitedPrefix: string;
  readonly invitedSuffix: string;
  readonly children: ReactNode;
}

/**
 * Royal konvert — dastlab butun ekranni yopadi (och, oltin ramkali karta).
 * "Ochish" bosilganda yuqoriga ko'tarilib yo'qoladi. `?g=Ism` bo'lsa mehmon
 * ismi kartada ko'rsatiladi.
 */
export function RoyalCover({
  groom,
  bride,
  dateLine,
  kicker,
  openLabel,
  invitedPrefix,
  invitedSuffix,
  children,
}: RoyalCoverProps): ReactNode {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const sp = useSearchParams();
  const guestRaw = sp.get('g')?.trim();
  const guest = guestRaw && guestRaw.length > 0 && guestRaw.length <= 60 ? guestRaw : undefined;

  const a = (groom.trim()[0] ?? '').toUpperCase();
  const b = (bride.trim()[0] ?? '').toUpperCase();

  useEffect(() => {
    document.body.style.overflow = open ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {children}

      <AnimatePresence>
        {!open ? (
          <motion.div
            key="royal-cover"
            initial={false}
            exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-cream to-[#efe3cf] px-6"
          >
            {/* fon burchak gullari */}
            <Bloom
              n={1}
              className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 opacity-70"
            />
            <Bloom
              n={2}
              className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 opacity-70"
            />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative w-full max-w-sm rounded-[1.4rem] border border-gold/40 bg-white/85 px-8 pb-10 pt-12 text-center shadow-[0_30px_80px_-24px_rgba(120,90,40,0.45)] backdrop-blur-sm"
            >
              <span className="pointer-events-none absolute inset-2 rounded-[1.1rem] border border-gold/20" />

              {/* oltin monogram medalyoni */}
              <span className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-white font-display text-lg text-gold shadow-md">
                {a}
                <span className="mx-[1px] text-[0.7em] opacity-70">&amp;</span>
                {b}
              </span>

              <p className="mt-2 text-[0.6rem] uppercase tracking-[0.4em] text-gold">{kicker}</p>

              <div className="mt-4">
                <p className="font-display text-4xl leading-tight text-ink">{groom}</p>
                <span className="my-0.5 block font-display text-2xl italic text-gold">&amp;</span>
                <p className="font-display text-4xl leading-tight text-ink">{bride}</p>
              </div>

              <span className="mx-auto mt-4 flex items-center justify-center gap-2 text-gold/70">
                <span className="h-px w-8 bg-current" />
                <span className="text-xs">❦</span>
                <span className="h-px w-8 bg-current" />
              </span>

              <p className="mt-4 text-sm tracking-wide text-ink/75">{dateLine}</p>

              {guest ? (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{invitedPrefix}</p>
                  <p className="mt-1 inline-block rounded-full bg-gold/10 px-4 py-1 font-display text-xl text-gold">
                    {guest}
                  </p>
                  <p className="mt-1 text-xs text-ink/55">{invitedSuffix}</p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white shadow-md transition hover:bg-[#9c7a48]"
              >
                {openLabel}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
