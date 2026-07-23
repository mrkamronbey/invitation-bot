import type { ReactNode } from 'react';
import { Bloom } from './RoyalFlora';

type DividerVariant = 'rose' | 'fleur';

/**
 * Bo'limlar orasidagi gulli ajratgich.
 *  - 'rose'  → markazda gorizontal atirgul gulchambari (flower-3)
 *  - 'fleur' → oltin fleur-ajratgich (flower-7), ikki yonida yaltirovchi chiziq
 */
export function RoyalDivider({ variant = 'rose' }: { readonly variant?: DividerVariant }): ReactNode {
  if (variant === 'fleur') {
    return (
      <div className="flex items-center justify-center py-4" aria-hidden>
        <Bloom n={7} className="h-10 w-64 sm:h-12 sm:w-80" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <span className="gold-shimmer h-px w-14 bg-gradient-to-r from-transparent to-gold/60" />
      <Bloom n={3} className="h-16 w-40 shrink-0 sm:h-20 sm:w-56" />
      <span className="gold-shimmer h-px w-14 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
