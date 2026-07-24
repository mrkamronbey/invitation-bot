import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BarChart3, CheckCircle2, Users, XCircle } from 'lucide-react';
import { getSession } from '@/shared/auth/current-user';
import { getMyStats, listMyInvitations } from '@/shared/api/dashboard-source';
import { getSiteDict, getSiteLang } from '@/shared/i18n/site';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export const dynamic = 'force-dynamic';

/** Statistika — barcha taklifnomalar bo'yicha yig'ma ko'rsatkichlar. */
export default async function StatsPage(): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  const lang = await getSiteLang();
  const dict = getSiteDict(lang);
  const t = dict.stats;

  const invitations = await listMyInvitations(session.sub);
  const stats = await Promise.all(
    invitations.map((inv) =>
      getMyStats(inv.id, session.sub)
        .then((s) => ({ inv, s }))
        .catch(() => ({ inv, s: null })),
    ),
  );

  const totalInvites = invitations.length;
  const totalResponses = stats.reduce((sum, x) => sum + (x.s?.responses ?? 0), 0);
  const totalAttending = stats.reduce((sum, x) => sum + (x.s?.attendingResponses ?? 0), 0);
  const totalGuests = stats.reduce((sum, x) => sum + (x.s?.totalGuests ?? 0), 0);
  const totalDeclining = stats.reduce((sum, x) => sum + (x.s?.decliningResponses ?? 0), 0);
  const responseRate = totalInvites > 0 ? Math.round((totalResponses / totalInvites) * 10) / 10 : 0;

  const cards = [
    { icon: BarChart3, n: totalResponses, l: t.totalResponses },
    { icon: CheckCircle2, n: totalAttending, l: t.totalAttending },
    { icon: Users, n: totalGuests, l: t.totalGuests },
    { icon: XCircle, n: totalDeclining, l: t.declining },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} lang={lang} d={dict.dash} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">{t.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

        {totalInvites === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-14 text-center">
              <p className="text-2xl font-bold text-primary">{t.empty}</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{t.emptyHint}</p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/new">{dict.dash.newBtn}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Umumiy kartalar */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((c) => (
                <Card key={c.l}>
                  <CardContent className="py-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <c.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <p className="mt-4 text-3xl font-bold tracking-tight">{c.n}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.l}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-center justify-between py-5">
                  <span className="text-sm text-muted-foreground">{t.totalInvites}</span>
                  <span className="text-2xl font-bold text-primary">{totalInvites}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center justify-between py-5">
                  <span className="text-sm text-muted-foreground">{t.responseRate}</span>
                  <span className="text-2xl font-bold text-primary">{responseRate}</span>
                </CardContent>
              </Card>
            </div>

            {/* Taklifnomalar kesimida */}
            <h2 className="mt-12 text-lg font-semibold">{t.perInvite}</h2>
            <div className="mt-4 space-y-3">
              {stats.map(({ inv, s }) => (
                <Card key={inv.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {inv.groomName} <span className="text-primary">&amp;</span> {inv.brideName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {s?.responses ?? 0} · {t.totalResponses.toLowerCase()} — {s?.totalGuests ?? 0}{' '}
                        {t.totalGuests.toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-4 text-sm">
                        <span className="text-primary">
                          <span className="text-lg font-bold">{s?.attendingResponses ?? 0}</span>{' '}
                          <span className="text-xs text-muted-foreground">{t.totalAttending}</span>
                        </span>
                      </div>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/${inv.id}/guests`}>{t.guests}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
