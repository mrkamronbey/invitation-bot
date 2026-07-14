import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Flourish } from './ornaments';

interface SectionProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly title?: string;
}

/** Taklifnoma bloklari uchun umumiy o'ram — naqshli sarlavha bilan. */
export function Section({ children, className, title }: SectionProps): ReactNode {
  return (
    <section className={cn('mx-auto w-full max-w-xl px-6 py-14', className)}>
      {title ? (
        <div className="mb-10 flex flex-col items-center">
          <h2 className="font-display text-3xl tracking-wide text-gold sm:text-4xl">{title}</h2>
          <Flourish className="mt-3" />
        </div>
      ) : null}
      {children}
    </section>
  );
}
