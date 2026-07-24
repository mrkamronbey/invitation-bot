import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import { getSession } from '@/shared/auth/current-user';
import { getSiteDict, getSiteLang } from '@/shared/i18n/site';
import { TelegramLoginButton } from '@/features/auth/TelegramLoginButton';
import { LangSwitcher } from '@/features/i18n/LangSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { Card, CardContent } from '@/shared/ui/card';

interface PageProps {
  readonly searchParams: Promise<{ readonly error?: string }>;
}

/** Kirish sahifasi — Telegram Login Widget orqali (och/to'q, minimal premium). */
export default async function LoginPage({ searchParams }: PageProps): Promise<ReactNode> {
  const session = await getSession();
  if (session) redirect('/dashboard');

  const { error } = await searchParams;
  const lang = await getSiteLang();
  const d = getSiteDict(lang).login;
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const authUrl = `${siteUrl}/api/auth/telegram`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      {/* nozik oltin fon nurlanishi */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_55%)]"
      />

      {/* yuqori panel — brend + til + tema */}
      <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight">
          taklif<span className="text-primary">.uz</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LangSwitcher current={lang} />
        </div>
      </div>

      {/* markaziy karta */}
      <div className="relative z-0 w-full max-w-sm text-center">
        <Card className="border-border/70 shadow-xl">
          <CardContent className="px-8 pb-10 pt-12">
            {/* oltin emblema */}
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
              <Heart className="h-7 w-7" strokeWidth={1.6} />
            </span>

            <h1 className="font-display text-3xl tracking-tight">{d.title}</h1>
            <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
              {d.subtitle}
            </p>

            {error ? (
              <p className="mt-5 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error === 'server' ? d.errServer : d.errAuth}
              </p>
            ) : null}

            <div className="mt-7 flex min-h-[48px] justify-center">
              {botUsername ? (
                <TelegramLoginButton botUsername={botUsername} authUrl={authUrl} />
              ) : (
                <p className="text-xs text-muted-foreground">{d.notConfigured}</p>
              )}
            </div>

            <p className="mt-6 border-t border-border/60 pt-5 text-xs leading-relaxed text-muted-foreground">
              {d.hint}
            </p>
          </CardContent>
        </Card>

        <Link
          href="/"
          className="mt-6 inline-block text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {lang === 'ru' ? 'На главную' : 'Bosh sahifa'}
        </Link>
      </div>
    </main>
  );
}
