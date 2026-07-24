'use client';

import { type ReactNode, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Lang = 'uz' | 'ru';

/** Sayt tili almashtirgich (uz/ru) — cookie'ga yozadi va sahifani yangilaydi. */
export function LangSwitcher({ current }: { readonly current: Lang }): ReactNode {
  const router = useRouter();
  const [, start] = useTransition();

  function pick(lang: Lang): void {
    document.cookie = `site_lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    start(() => router.refresh());
  }

  const btn = (lang: Lang, label: string): ReactNode => (
    <button
      type="button"
      onClick={() => pick(lang)}
      className={`px-1.5 text-sm transition-colors ${
        current === lang ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      {btn('uz', 'UZ')}
      <span className="text-border">|</span>
      {btn('ru', 'RU')}
    </div>
  );
}
