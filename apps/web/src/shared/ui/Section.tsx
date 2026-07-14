import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface SectionProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly title?: string;
}

/** Taklifnoma bloklari uchun umumiy o'ram (markazlangan, chegaralangan kenglik). */
export function Section({ children, className, title }: SectionProps): ReactNode {
  return (
    <section className={cn('mx-auto w-full max-w-xl px-6 py-12', className)}>
      {title ? (
        <h2 className="mb-8 text-center font-serif text-2xl tracking-wide text-gold">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
