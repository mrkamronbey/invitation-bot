'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArchFrame, GirihBackdrop, GirihRamka, Rozetka, Tasma, UZ } from './UzOrnaments';

interface MilliyCoverProps {
  readonly groom: string;
  readonly bride: string;
  readonly dateLine: string;
  readonly openLabel: string;
  readonly invitedLabel: string;
  readonly invitedPrefix: string;
  readonly children: ReactNode;
}

/**
 * Milliy konvert — to'q firuza fon (girih naqshi bilan), oltin ramkali
 * nog'ora-oq karta va mehrob ravog'i. "Ochish" bosilganda ko'tarilib yo'qoladi.
 * `?g=Ism` — mehmon ismi.
 */
export function MilliyCover({
  groom,
  bride,
  dateLine,
  openLabel,
  invitedLabel,
  invitedPrefix,
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
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-6"
            style={{
              background: `radial-gradient(ellipse at 50% 10%, ${UZ.teal} 0%, ${UZ.tealDeep} 60%, #072F32 100%)`,
            }}
          >
            {/* girih naqshli fon */}
            <GirihBackdrop
              id="cover-girih"
              className="absolute inset-0"
              color={UZ.goldLight}
              opacity={0.12}
            />

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="relative w-full max-w-sm overflow-hidden rounded-[1.25rem] border px-8 pb-10 pt-12 text-center shadow-[0_30px_80px_-24px_rgba(0,0,0,0.65)]"
              style={{ background: UZ.ivory, borderColor: `${UZ.gold}66` }}
            >
              {/* mehrob ravog'i — yulduz ostidan boshlanadi, kontentni ramkalaydi */}
              <ArchFrame
                className="pointer-events-none absolute inset-x-4 bottom-3 top-[4.75rem] opacity-25"
                color={UZ.gold}
              />

              {/* haqiqiy girih yulduz ramkasi — ismlar ortida nozik suv belgisi */}
              <GirihRamka className="pointer-events-none absolute left-1/2 top-1/2 w-[19rem] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.13]" />

              <div className="relative">
                <Rozetka className="mx-auto h-12 w-12" />

                <p
                  className="mt-5 text-[0.6rem] uppercase tracking-[0.3em]"
                  style={{ color: UZ.teal }}
                >
                  {invitedLabel}
                </p>

                <h1
                  className="uz-serif mt-6 text-3xl uppercase leading-snug tracking-[0.05em]"
                  style={{ color: UZ.tealDeep }}
                >
                  {groom}
                  <span
                    className="my-2 block text-xl italic normal-case tracking-normal"
                    style={{ color: UZ.gold }}
                  >
                    &amp;
                  </span>
                  {bride}
                </h1>

                <Tasma className="mx-auto mt-5 w-44 opacity-90" />

                {dateLine ? (
                  <p className="uz-serif mt-5 text-lg" style={{ color: UZ.ink }}>
                    {dateLine}
                  </p>
                ) : null}

                {guest ? (
                  <div className="mt-5">
                    <p
                      className="text-[0.6rem] uppercase tracking-[0.22em]"
                      style={{ color: UZ.teal }}
                    >
                      {invitedPrefix}
                    </p>
                    <p className="uz-serif mt-1 text-xl" style={{ color: UZ.tealDeep }}>
                      {guest}
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="uz-serif mt-8 w-full rounded-full px-8 py-3 text-base tracking-wide text-white transition-opacity hover:opacity-90"
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
