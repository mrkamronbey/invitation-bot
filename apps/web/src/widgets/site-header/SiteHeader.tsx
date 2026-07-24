import type { ReactNode } from 'react';
import Link from 'next/link';
import type { SiteDict, SiteLang } from '@/shared/i18n/site';
import { LangSwitcher } from '@/features/i18n/LangSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { LogoutButton } from '@/features/auth/LogoutButton';
import { DashboardNav } from './DashboardNav';

interface SiteHeaderProps {
  readonly userName?: string;
  readonly lang: SiteLang;
  readonly d: SiteDict['dash'];
}

/** Sayt sarlavhasi (dashboard) — brend + ichki navigatsiya + til/tema + chiqish. */
export function SiteHeader({ userName, lang, d }: SiteHeaderProps): ReactNode {
  const navItems = [
    { href: '/dashboard', label: d.navDashboard },
    { href: '/dashboard/stats', label: d.navStats },
    { href: '/dashboard/profile', label: d.navProfile },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            taklif<span className="text-primary">.uz</span>
          </Link>
          <div className="hidden md:block">
            <DashboardNav items={navItems} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LangSwitcher current={lang} />
          {userName ? (
            <span className="hidden text-sm text-muted-foreground lg:inline">{userName}</span>
          ) : null}
          <LogoutButton
            label={d.logout}
            confirmTitle={d.logoutConfirmTitle}
            confirmText={d.logoutConfirmText}
            cancelLabel={d.delNo}
          />
        </div>
      </div>
      {/* Mobil navigatsiya */}
      <div className="border-t border-border/60 px-4 py-2 md:hidden">
        <DashboardNav items={navItems} />
      </div>
    </header>
  );
}
