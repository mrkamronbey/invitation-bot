import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

interface SiteHeaderProps {
  readonly userName?: string;
}

/** Sayt sarlavhasi (dashboard/editor uchun) — brend + foydalanuvchi + chiqish. */
export function SiteHeader({ userName }: SiteHeaderProps): ReactNode {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="font-display text-2xl tracking-tight text-primary">
          Taklif
        </Link>
        <div className="flex items-center gap-3">
          {userName ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">{userName}</span>
          ) : null}
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="outline" size="sm">
              Chiqish
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
