import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/** Nafis floral divider — sarlavhalar orasida naqsh sifatida. currentColor bilan bo'yaladi. */
export function Flourish({ className }: { className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 220 16"
      className={cn('h-4 w-40 text-gold', className)}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M8 8h74" />
        <path d="M212 8h-74" />
        <path d="M82 8c5-6 11-6 14 0" />
        <path d="M138 8c-5-6-11-6-14 0" />
      </g>
      <circle cx="96" cy="8" r="1.8" fill="currentColor" />
      <circle cx="124" cy="8" r="1.8" fill="currentColor" />
      <path d="M110 2l5 6-5 6-5-6z" fill="currentColor" />
    </svg>
  );
}

/** Monogram — kuyov va kelin bosh harflari ikki halqali naqsh ichida. */
export function Monogram({
  left,
  right,
  className,
}: {
  left: string;
  right: string;
  className?: string;
}): ReactNode {
  const a = (left.trim()[0] ?? '').toUpperCase();
  const b = (right.trim()[0] ?? '').toUpperCase();
  return (
    <div
      className={cn(
        'relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-gold/50 text-gold',
        className,
      )}
    >
      <span className="absolute inset-[6px] rounded-full border border-gold/25" />
      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gold" />
      <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gold" />
      <span className="font-display text-2xl tracking-tight">
        {a}
        <span className="mx-0.5 text-[0.7em] opacity-70">&amp;</span>
        {b}
      </span>
    </div>
  );
}

/** Kichik naqsh nuqtasi (bo'limlar orasidagi ajratgich uchun). */
export function DotDivider({ className }: { className?: string }): ReactNode {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-gold/60', className)}>
      <span className="h-px w-8 bg-current" />
      <span className="h-1 w-1 rotate-45 bg-current" />
      <span className="h-px w-8 bg-current" />
    </div>
  );
}
