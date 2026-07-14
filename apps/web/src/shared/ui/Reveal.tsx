'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealVariant = 'up' | 'scale' | 'blur' | 'left' | 'right';

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly variant?: RevealVariant;
  readonly className?: string;
}

// Nafis easeOutExpo egri chizig'i — silliq, premium his beradi.
const EASE = [0.16, 1, 0.3, 1] as const;

const VARIANTS: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  left: {
    hidden: { opacity: 0, x: -48 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 48 },
    show: { opacity: 1, x: 0 },
  },
};

/** Scroll paytida nafis paydo bo'lish animatsiyasi (Framer Motion). */
export function Reveal({ children, delay = 0, variant = 'up', className }: RevealProps): ReactNode {
  return (
    <motion.div
      className={className}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Bolalarni ketma-ket (stagger) animatsiya qiluvchi o'ram. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly stagger?: number;
}): ReactNode {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

/** RevealGroup ichidagi element — guruh bilan ketma-ket paydo bo'ladi. */
export function RevealItem({
  children,
  variant = 'up',
  className,
}: {
  readonly children: ReactNode;
  readonly variant?: RevealVariant;
  readonly className?: string;
}): ReactNode {
  return (
    <motion.div
      className={className}
      variants={VARIANTS[variant]}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
