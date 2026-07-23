import type { ReactNode } from 'react';
import { Bloom } from './RoyalFlora';

/**
 * Bo'limlar orasidagi gulli ajratgich — markazda gorizontal gulchambar (flower-3),
 * ikki yonida sekin yaltirovchi oltin chiziq.
 */
export function RoyalDivider(): ReactNode {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <span className="gold-shimmer h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
      <Bloom n={3} className="h-16 w-40 shrink-0 sm:h-20 sm:w-56" />
      <span className="gold-shimmer h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
