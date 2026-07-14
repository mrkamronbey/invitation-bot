'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

/** Scroll paytida yumshoq paydo bo'lish animatsiyasi (Framer Motion). */
export function Reveal({ children, delay = 0, className }: RevealProps): ReactNode {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
