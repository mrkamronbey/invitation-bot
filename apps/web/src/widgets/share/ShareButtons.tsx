'use client';

import { type ReactNode, useState } from 'react';

interface ShareButtonsProps {
  readonly url: string;
  readonly title: string;
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

/** Ijtimoiy ulashish — WhatsApp / Telegram / havolani nusxalash (Royal to'q mavzu). */
export function ShareButtons({ url, title, copyLabel, copiedLabel }: ShareButtonsProps): ReactNode {
  const [copied, setCopied] = useState(false);
  const text = `${title} — ${url}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard yo'q — e'tiborsiz */
    }
  }

  const cls =
    'inline-flex items-center gap-2 rounded-full border border-gold-light/40 px-5 py-2.5 text-sm font-medium text-gold-light transition hover:bg-gold-light/10';

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a href={wa} target="_blank" rel="noreferrer" className={cls}>
        WhatsApp
      </a>
      <a href={tg} target="_blank" rel="noreferrer" className={cls}>
        Telegram
      </a>
      <button type="button" onClick={copy} className={cls}>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
