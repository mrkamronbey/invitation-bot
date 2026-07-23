'use client';

import { type ReactNode, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface GiftBoxProps {
  readonly title: string;
  readonly hint: string; // "Ochish uchun bosing"
  readonly note: string; // rahmat matni
  readonly cardNumber?: string;
  readonly cardHolder?: string;
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

/**
 * Sovg'a qutisi — bosilganda ochiladi va (ixtiyoriy) karta raqami ko'rinadi.
 * Mehmon "to'y sovg'asi" ni bir tegishda nusxalaydi.
 */
export function GiftBox({
  title,
  hint,
  note,
  cardNumber,
  cardHolder,
  copyLabel,
  copiedLabel,
}: GiftBoxProps): ReactNode {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  const copy = (): void => {
    if (!cardNumber) return;
    void navigator.clipboard?.writeText(cardNumber.replace(/\s+/g, '')).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-2xl tracking-wide text-gold-light">{title}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group mt-6 inline-flex flex-col items-center outline-none"
        aria-expanded={open}
      >
        <span className="relative block h-24 w-24">
          {/* qopqoq */}
          <motion.span
            aria-hidden
            animate={reduce ? undefined : open ? { y: -14, rotate: -12 } : { y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="absolute left-1/2 top-1 z-10 h-6 w-[5.5rem] -translate-x-1/2 rounded-md bg-gold-light shadow-md"
          >
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-emerald-deep" />
          </motion.span>
          {/* quti tanasi */}
          <span className="absolute bottom-0 left-1/2 h-16 w-20 -translate-x-1/2 rounded-md bg-gradient-to-b from-emerald to-emerald-deep shadow-lg">
            <span className="absolute left-1/2 top-0 h-full w-3 -translate-x-1/2 bg-gold-light/70" />
          </span>
        </span>
        <span className="mt-4 text-xs uppercase tracking-[0.2em] text-ivory/60 transition group-hover:text-gold-light">
          {open ? '' : hint}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={reduce ? undefined : { opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 w-full max-w-sm overflow-hidden"
          >
            <p className="text-sm leading-relaxed text-ivory/75">{note}</p>
            {cardNumber ? (
              <div className="mt-4 rounded-2xl border border-gold-light/30 bg-white/[0.04] p-4 backdrop-blur-sm">
                {cardHolder ? (
                  <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">{cardHolder}</p>
                ) : null}
                <p className="mt-1 font-mono text-lg tracking-[0.2em] text-gold-light">
                  {cardNumber}
                </p>
                <button
                  type="button"
                  onClick={copy}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-light/50 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-gold-light transition hover:bg-gold-light/10"
                >
                  {copied ? copiedLabel : copyLabel}
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
