import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { getMyInvitation, getMyStats } from '@/shared/api/dashboard-source';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly params: Promise<{ readonly id: string }>;
}

/** Mehmonlar (RSVP javoblari) — kim keladi, necha kishi, tilaklar. */
export default async function GuestsPage({ params }: PageProps): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id } = await params;
  const invitation = await getMyInvitation(id, session.sub);
  if (!invitation) notFound();
  const stats = await getMyStats(id, session.sub);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">← Orqaga</Link>
        </Button>
        <h1 className="mt-3 font-display text-3xl">
          {invitation.groomName} &amp; {invitation.brideName} — mehmonlar
        </h1>

        {stats ? (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { n: stats.responses, l: 'javob' },
              { n: stats.attendingResponses, l: 'keladi' },
              { n: stats.totalGuests, l: 'jami mehmon' },
            ].map((s) => (
              <Card key={s.l}>
                <CardContent className="py-5 text-center">
                  <p className="font-display text-3xl text-primary">{s.n}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {stats && stats.entries.length > 0 ? (
          <div className="mt-6 space-y-3">
            {stats.entries.map((g, i) => (
              <Card key={i}>
                <CardContent className="flex items-start justify-between gap-4 py-4">
                  <div>
                    <p className="font-medium">{g.name}</p>
                    {g.message ? (
                      <p className="mt-1 text-sm text-muted-foreground">“{g.message}”</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        g.attending
                          ? 'bg-primary/15 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {g.attending ? 'Keladi' : 'Kelmaydi'}
                    </span>
                    {g.attending ? (
                      <p className="mt-1 text-xs text-muted-foreground">{g.guestsCount} kishi</p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-6">
            <CardContent className="py-12 text-center text-muted-foreground">
              Hozircha javoblar yo‘q. Mehmonlar taklifnomada javob berganda shu yerda
              ko‘rinadi.
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
