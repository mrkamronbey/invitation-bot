'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Leaves } from '@/shared/ui/Leaves';

interface EnvelopeCoverProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly kicker: string; // "Taklifnoma"
  readonly openLabel: string; // "Ochish"
  readonly invitedPrefix: string; // "Hurmatli"
  readonly invitedSuffix: string; // "sizni to'yimizga taklif qilamiz"
  readonly children: ReactNode;
}

/**
 * Konvert/karta — dastlab butun ekranni yopadi. "Ochish" bosilganda
 * yuqoriga ko'tarilib yo'qoladi va taklifnoma ochiladi (chungdoi uslubi).
 * `?g=Ism` bo'lsa — mehmon ismi kartada ko'rsatiladi.
 */
export function EnvelopeCover({
  groom,
  bride,
  dateLine,
  kicker,
  openLabel,
  invitedPrefix,
  invitedSuffix,
  children,
}: EnvelopeCoverProps): ReactNode {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const sp = useSearchParams();
  const guestRaw = sp.get('g')?.trim();
  const guest = guestRaw && guestRaw.length > 0 && guestRaw.length <= 60 ? guestRaw : undefined;

  // Konvert ochilgunча sahifa scroll qilinmasin
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
            key="cover"
            initial={false}
            exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald via-emerald-deep to-emerald-deep px-6"
          >
            {/* suzuvchi barglar (fon) */}
            <div className="pointer-events-none absolute inset-0">
              <Leaves className="h-full w-full text-gold-light/40" />
            </div>

            {/* markaziy karta */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative w-full max-w-sm rounded-[1.6rem] bg-ivory px-8 pb-9 pt-12 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            >
              {/* yuqori medalyon */}
              <span className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald text-xl text-ivory shadow-lg">
                ♥
              </span>

              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-emerald/70">{kicker}</p>

              <div className="mt-4">
                <p className="font-display text-4xl leading-tight text-emerald">{groom}</p>
                <span className="my-0.5 block font-display text-2xl text-gold">&amp;</span>
                <p className="font-display text-4xl leading-tight text-emerald">{bride}</p>
              </div>

              <span className="mx-auto mt-4 flex items-center justify-center gap-2 text-gold/70">
                <span className="h-px w-8 bg-current" />
                <span className="text-xs">❦</span>
                <span className="h-px w-8 bg-current" />
              </span>

              <p className="mt-4 text-sm tracking-wide text-emerald/80">{dateLine}</p>

              {guest ? (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald/60">
                    {invitedPrefix}
                  </p>
                  <p className="mt-1 inline-block rounded-full bg-emerald/10 px-4 py-1 font-display text-xl text-emerald">
                    {guest}
                  </p>
                  <p className="mt-1 text-xs text-emerald/60">{invitedSuffix}</p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-ivory shadow-md transition hover:bg-emerald-deep"
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
