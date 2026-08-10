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
 * Chateau konvert — sodda va toza: yashil fon, oq karta, nafis serif ismlar.
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
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-[#3a5a2c] px-6"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full max-w-sm rounded-2xl bg-[#fbfaf3] px-8 py-12 text-center shadow-xl"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#7da55c]">
                {invitedLabel}
              </p>

              <h1 className="chateau-serif mt-6 text-3xl uppercase leading-snug tracking-[0.06em] text-[#3a5a2c]">
                {groom}
                <span className="my-2 block text-xl italic normal-case tracking-normal text-[#7da55c]">
                  &amp;
                </span>
                {bride}
              </h1>

              <span className="mx-auto mt-6 block h-px w-16 bg-[#7da55c]/50" />

              {dateLine ? (
                <p className="chateau-serif mt-6 text-lg text-[#3a5a2c]">{dateLine}</p>
              ) : null}

              {guest ? (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5a8040]/80">
                    {invitedPrefix}
                  </p>
                  <p className="chateau-serif mt-1 text-xl text-[#3a5a2c]">{guest}</p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-9 w-full rounded-full bg-[#3a5a2c] px-8 py-3 text-sm font-medium text-[#fbfaf3] transition-colors hover:bg-[#2e4a22]"
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
