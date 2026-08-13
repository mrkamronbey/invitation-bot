'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArchFrame, GirihBackdrop, OrnateFrame, Rozetka, UZ } from './UzOrnaments';

interface MilliyCoverProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly openLabel: string;
  readonly invitedLabel: string;
  readonly invitedPrefix: string;
  readonly andWord: string;
  readonly children: ReactNode;
}

/**
 * Milliy konvert — minimalistik: to'q firuza fon (nozik girih naqshi),
 * nog'ora-oq karta, perimetr ramka + mehrob ravog'i, nafis serif + kalligrafiya.
 * `?g=Ism` — mehmon ismi.
 */
export function MilliyCover({
  groom,
  bride,
  dateLine,
  openLabel,
  invitedLabel,
  invitedPrefix,
  andWord,
  children,
}: MilliyCoverProps): ReactNode {
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
            key="milliy-cover"
            initial={false}
            exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-5"
            style={{
              background: `radial-gradient(ellipse at 50% 12%, ${UZ.teal} 0%, ${UZ.tealDeep} 62%, #072F32 100%)`,
            }}
          >
            <GirihBackdrop
              id="cover-girih"
              className="absolute inset-0"
              color={UZ.goldLight}
              opacity={0.1}
            />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="uz-paper relative w-full max-w-[22rem] overflow-hidden rounded-sm px-9 pb-11 pt-12 text-center shadow-[0_28px_70px_-22px_rgba(0,0,0,0.6)]"
              style={{ background: UZ.ivory }}
            >
              {/* perimetr ramka + burchak bezaklari */}
              <OrnateFrame color={UZ.gold} />

              {/* mehrob ravog'i — ismlarni ramkalaydi */}
              <ArchFrame
                className="pointer-events-none absolute inset-x-9 bottom-16 top-[6.5rem] opacity-[0.22]"
                color={UZ.gold}
              />

              <div className="relative">
                <Rozetka className="mx-auto h-9 w-9 opacity-95" />

                <p
                  className="uz-serif mt-6 text-[0.62rem] uppercase tracking-[0.34em]"
                  style={{ color: UZ.teal }}
                >
                  {invitedLabel}
                </p>

                <h1
                  className="uz-serif mt-8 text-[1.85rem] uppercase leading-[1.25] tracking-[0.14em]"
                  style={{ color: UZ.tealDeep }}
                >
                  {groom}
                  <span
                    className="uz-script my-1.5 block text-3xl normal-case tracking-normal"
                    style={{ color: UZ.gold }}
                  >
                    {andWord}
                  </span>
                  {bride}
                </h1>

                {dateLine ? (
                  <>
                    <span
                      className="mx-auto mt-7 block h-px w-14"
                      style={{ background: `${UZ.gold}99` }}
                    />
                    <p
                      className="uz-serif mt-6 text-[0.72rem] uppercase tracking-[0.26em]"
                      style={{ color: UZ.ink }}
                    >
                      {dateLine}
                    </p>
                  </>
                ) : null}

                {guest ? (
                  <div className="mt-6">
                    <p className="uz-script text-xl" style={{ color: UZ.gold }}>
                      {invitedPrefix}
                    </p>
                    <p
                      className="uz-serif mt-0.5 text-lg uppercase tracking-[0.12em]"
                      style={{ color: UZ.tealDeep }}
                    >
                      {guest}
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="uz-serif mt-9 rounded-full px-9 py-2.5 text-[0.72rem] uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
                  style={{ background: UZ.teal }}
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
