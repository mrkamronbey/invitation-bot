'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ChateauCoverProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly openLabel: string;
  readonly invitedLabel: string;
  readonly invitedPrefix: string;
  readonly children: ReactNode;
}

/**
 * Chateau konvert (chungdoi chateau-green uslubi): to'q bog'-yashil fon,
 * oq/ivory karta, orqasida akvarel dala gullari, yuqori serif katta harflar.
 * "Ochish" bosilganda yuqoriga ko'tarilib yo'qoladi. `?g=Ism` — mehmon ismi.
 */
export function ChateauCover({
  groom,
  bride,
  dateLine,
  openLabel,
  invitedLabel,
  invitedPrefix,
  children,
}: ChateauCoverProps): ReactNode {
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
            key="chateau-cover"
            initial={false}
            exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6"
            style={{
              background:
                'radial-gradient(ellipse at 50% 15%, #5c7d3f 0%, #3a5a2c 55%, #2b451f 100%)',
            }}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[1.6rem] bg-[#fbfaf3] px-8 pb-11 pt-16 text-center shadow-[0_30px_90px_-20px_rgba(0,0,0,0.55)]"
            >
              {/* akvarel dala gullari — nomlar ortida yumshoq band */}
              <img
                src="/images/chateau/hoanho2-1.webp"
                alt=""
                aria-hidden
                className="pointer-events-none absolute -left-3 top-16 w-32 opacity-55 sm:w-36"
              />
              <img
                src="/images/chateau/hoanho3-1.webp"
                alt=""
                aria-hidden
                className="pointer-events-none absolute -right-3 top-16 w-32 opacity-55 sm:w-36"
              />

              {/* yuqori yurak medalyoni */}
              <span className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#2e4a22] text-xl text-white shadow-lg">
                ♥
              </span>

              <div className="relative">
                <h1 className="chateau-serif text-3xl uppercase leading-tight tracking-[0.08em] text-[#3a5a2c]">
                  {groom}
                  <span className="my-1 block text-xl italic tracking-normal text-[#7da55c]">
                    &amp;
                  </span>
                  {bride}
                </h1>

                <span className="mx-auto mt-4 flex items-center justify-center gap-2 text-[#7da55c]">
                  <span className="h-px w-8 bg-current" />
                  <span className="text-xs">❦</span>
                  <span className="h-px w-8 bg-current" />
                </span>

                {dateLine ? (
                  <p className="chateau-serif mt-4 text-lg text-[#3a5a2c]">{dateLine}</p>
                ) : null}

                {guest ? (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#5a8040]/80">
                      {invitedPrefix}
                    </p>
                    <p className="chateau-serif mt-1 inline-block rounded-full bg-[#3a5a2c]/10 px-4 py-1 text-xl text-[#3a5a2c]">
                      {guest}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm tracking-[0.15em] text-[#5a8040]">{invitedLabel}</p>
                )}

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="chateau-serif mt-7 inline-flex items-center gap-2 rounded-full bg-[#3a5a2c] px-9 py-3 text-base font-semibold text-[#fbfaf3] shadow-[0_10px_24px_-8px_rgba(58,90,44,0.7)] transition hover:bg-[#2e4a22]"
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
