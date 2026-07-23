import type { ReactNode } from 'react';

interface DressSwatchesProps {
  readonly label: string;
  readonly text?: string;
  readonly colors: readonly string[];
  readonly tone?: 'dark' | 'light';
}

/**
 * Dress-code — matn + rang doiralari (mehmon qaysi rangda kelishini ko'radi).
 */
export function DressSwatches({
  label,
  text,
  colors,
  tone = 'dark',
}: DressSwatchesProps): ReactNode {
  const head = tone === 'dark' ? 'text-gold-light' : 'text-gold';
  const body = tone === 'dark' ? 'text-ivory/80' : 'text-ink/80';
  const ring = tone === 'dark' ? 'ring-white/25' : 'ring-black/10';

  return (
    <div className="text-center">
      <p className={`text-sm uppercase tracking-[0.25em] ${head}`}>{label}</p>
      {text ? <p className={`mt-2 text-lg ${body}`}>{text}</p> : null}
      <div className="mt-4 flex items-center justify-center gap-3">
        {colors.map((c, i) => (
          <span
            key={`${c}-${i}`}
            className={`h-8 w-8 rounded-full ring-1 ${ring} shadow-sm`}
            style={{ backgroundColor: c }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
