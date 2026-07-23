'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bloom } from './RoyalFlora';
import { RoyalStars } from './RoyalStars';

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
 * Royal konvert — to'q zumrad karta butun ekranni yopadi (royal-v2-green uslubi):
 * yuqori medalyonда yurak, oq atirgul burchaklar, miltillovchi oltin yulduzchalar.
 * "Ochish" bosilganda yuqoriga ko'tarilib yo'qoladi. `?g=Ism` — mehmon ismi.
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
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#12402e_0%,#0b241a_60%,#071710_100%)] px-6"
          >
            <RoyalStars />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative w-full max-w-sm rounded-[1.4rem] border border-gold-light/25 bg-emerald/40 px-8 pb-11 pt-14 text-center shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md"
            >
              {/* oq atirgul burchaklar (kartada) */}
              <Bloom
                n={1}
                className="pointer-events-none absolute -left-14 -top-14 h-40 w-40"
              />
              <Bloom
                n={2}
                flipX
                className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40"
              />

              {/* yuqori yurak medalyoni */}
              <span className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-xl text-emerald shadow-lg">
                ♥
              </span>

              <div className="relative">
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-gold-light">{kicker}</p>

                <div className="mt-4">
                  <p className="font-display text-4xl leading-tight text-ivory">{groom}</p>
                  <span className="my-0.5 block font-display text-2xl italic text-gold-light">
                    &amp;
                  </span>
                  <p className="font-display text-4xl leading-tight text-ivory">{bride}</p>
                </div>

                <span className="mx-auto mt-4 flex items-center justify-center gap-2 text-gold-light/70">
                  <span className="h-px w-8 bg-current" />
                  <span className="text-xs">❦</span>
                  <span className="h-px w-8 bg-current" />
                </span>

                <p className="mt-4 text-sm tracking-wide text-ivory/80">{dateLine}</p>

                {guest ? (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-ivory/60">
                      {invitedPrefix}
                    </p>
                    <p className="mt-1 inline-block rounded-full bg-ivory/10 px-4 py-1 font-display text-xl text-gold-light">
                      {guest}
                    </p>
                    <p className="mt-1 text-xs text-ivory/60">{invitedSuffix}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-ivory/55">
                    {invitedSuffix}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-ivory px-9 py-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald shadow-[0_8px_24px_-6px_rgba(216,189,130,0.5)] transition hover:bg-white"
                >
                  {openLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
