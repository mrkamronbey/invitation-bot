'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/** Dark/Light almashtirgich — <html>.dark klassini va cookie'ni o'zgartiradi (reloadsiz). */
export function ThemeToggle(): ReactNode {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setReady(true);
  }, []);

  function toggle(): void {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.cookie = `site_theme=${next ? 'dark' : 'light'}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Light' : 'Dark'}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      {ready && dark ? (
        <Sun className="h-4 w-4" strokeWidth={1.8} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.8} />
      )}
    </button>
  );
}
