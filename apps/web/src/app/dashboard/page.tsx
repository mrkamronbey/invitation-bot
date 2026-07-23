import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { getMyStats, listMyInvitations } from '@/shared/api/dashboard-source';
import { formatEventDate } from '@/shared/lib/format';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CopyLinkButton } from '@/features/dashboard/CopyLinkButton';
import { DeleteInvitationButton } from '@/features/dashboard/DeleteInvitationButton';

export const dynamic = 'force-dynamic';

/** Shaxsiy kabinet — foydalanuvchi taklifnomalari ro'yxati va boshqaruv. */
export default async function DashboardPage(): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const invitations = await listMyInvitations(session.sub);
  const stats = await Promise.all(
    invitations.map((inv) => getMyStats(inv.id, session.sub).catch(() => null)),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl">Taklifnomalarim</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Salom, {session.name}! Bu yerda taklifnomalaringizni boshqarasiz.
            </p>
          </div>
          {/* Yangi taklifnoma — 8-bosqichda ochiladi */}
          <Button disabled title="Tez orada">
            + Yangi taklifnoma
          </Button>
        </div>

        {invitations.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-14 text-center">
              <p className="font-display text-2xl text-primary">Hozircha taklifnoma yo‘q</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Telegram bot orqali birinchi taklifnomangizni yarating — u shu yerda
                paydo bo‘ladi.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {invitations.map((inv, i) => {
              const link = `${siteUrl}/i/${inv.slug}`;
              const st = stats[i];
              return (
                <Card key={inv.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle>
                        {inv.groomName} <span className="text-primary">&amp;</span> {inv.brideName}
                      </CardTitle>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide ${
                          inv.status === 'published'
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {inv.status === 'published' ? 'Nashr' : 'Qoralama'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatEventDate(inv.eventDate)}
                      {inv.eventTime ? ` · ${inv.eventTime}` : ''}
                    </p>
                  </CardHeader>

                  <CardContent className="mt-auto space-y-4">
                    {st ? (
                      <div className="flex gap-4 text-sm">
                        <span>
                          <span className="font-display text-xl text-primary">{st.responses}</span>{' '}
                          <span className="text-muted-foreground">javob</span>
                        </span>
                        <span>
                          <span className="font-display text-xl text-primary">
                            {st.totalGuests}
                          </span>{' '}
                          <span className="text-muted-foreground">mehmon</span>
                        </span>
                      </div>
                    ) : null}

                    <p className="truncate rounded-md border border-border bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                      {link}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/i/${inv.slug}`} target="_blank" rel="noreferrer">
                          Ko‘rish
                        </Link>
                      </Button>
                      <CopyLinkButton url={link} />
                      <Button size="sm" variant="ghost" disabled title="Tez orada">
                        Tahrir
                      </Button>
                      <DeleteInvitationButton id={inv.id} label="O‘chirish" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
