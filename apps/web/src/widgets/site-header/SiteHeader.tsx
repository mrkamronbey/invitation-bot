import type { ReactNode } from 'react';
import Link from 'next/link';
import type { SiteLang } from '@/shared/i18n/site';
import { Button } from '@/shared/ui/button';
import { LangSwitcher } from '@/features/i18n/LangSwitcher';

interface SiteHeaderProps {
  readonly userName?: string;
  readonly lang: SiteLang;
  readonly logoutLabel: string;
}

/** Sayt sarlavhasi (dashboard/editor) — brend + til + foydalanuvchi + chiqish. */
export function SiteHeader({ userName, lang, logoutLabel }: SiteHeaderProps): ReactNode {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          taklif<span className="text-primary">.uz</span>
        </Link>
        <div className="flex items-center gap-3">
          <LangSwitcher current={lang} />
          {userName ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">{userName}</span>
          ) : null}
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="outline" size="sm">
              {logoutLabel}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
