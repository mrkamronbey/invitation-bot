import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Send, UserRound } from 'lucide-react';
import { getSession } from '@/shared/auth/current-user';
import { listMyInvitations } from '@/shared/api/dashboard-source';
import { getSiteDict, getSiteLang } from '@/shared/i18n/site';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LangSwitcher } from '@/features/i18n/LangSwitcher';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

export const dynamic = 'force-dynamic';

/** Profil — hisob ma'lumotlari, sozlamalar va bot ulanishi. */
export default async function ProfilePage(): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  const lang = await getSiteLang();
  const dict = getSiteDict(lang);
  const t = dict.profile;
  const invitations = await listMyInvitations(session.sub);
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '';

  const rows = [
    { label: t.name, value: session.name || '—' },
    { label: t.telegramId, value: session.tid ? String(session.tid) : '—' },
    { label: t.invitesCount, value: String(invitations.length) },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} lang={lang} d={dict.dash} />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">{t.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

        <div className="mt-8 grid gap-5">
          {/* Hisob ma'lumotlari */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <CardTitle>{t.account}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-medium">{r.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sozlamalar */}
          <Card>
            <CardHeader>
              <CardTitle>{t.prefs}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.language}</span>
                <LangSwitcher current={lang} />
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-sm text-muted-foreground">{t.theme}</span>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Telegram bot */}
          <Card>
            <CardHeader>
              <CardTitle>{t.botCard}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.botText}</p>
              {botUsername ? (
                <Button asChild variant="outline" className="mt-4">
                  <a href={`https://t.me/${botUsername}`} target="_blank" rel="noreferrer">
                    <Send className="h-4 w-4" strokeWidth={2} />
                    {t.openBot}
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
