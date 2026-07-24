import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { getMyStats, listMyInvitations } from '@/shared/api/dashboard-source';
import { getSiteDict, getSiteLang } from '@/shared/i18n/site';
import { formatEventDate } from '@/shared/lib/format';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CopyLinkButton } from '@/features/dashboard/CopyLinkButton';
import { DeleteInvitationButton } from '@/features/dashboard/DeleteInvitationButton';
import { QrButton } from '@/features/dashboard/QrButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly searchParams: Promise<{ readonly saved?: string }>;
}

/** Shaxsiy kabinet — foydalanuvchi taklifnomalari ro'yxati va boshqaruv. */
export default async function DashboardPage({ searchParams }: PageProps): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  const { saved } = await searchParams;
  const lang = await getSiteLang();
  const d = getSiteDict(lang).dash;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const invitations = await listMyInvitations(session.sub);
  const stats = await Promise.all(
    invitations.map((inv) => getMyStats(inv.id, session.sub).catch(() => null)),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} lang={lang} logoutLabel={d.logout} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl">{d.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{d.hello(session.name)}</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/new">{d.newBtn}</Link>
          </Button>
        </div>

        {saved ? (
          <p className="mt-6 rounded-lg bg-primary/15 px-4 py-3 text-sm text-primary">{d.saved}</p>
        ) : null}

        {invitations.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-14 text-center">
              <p className="font-display text-2xl text-primary">{d.empty}</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{d.emptyHint}</p>
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
                        {inv.status === 'published' ? d.nashr : d.qoralama}
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
                          <span className="text-muted-foreground">{d.responses}</span>
                        </span>
                        <span>
                          <span className="font-display text-xl text-primary">
                            {st.totalGuests}
                          </span>{' '}
                          <span className="text-muted-foreground">{d.guestsWord}</span>
                        </span>
                      </div>
                    ) : null}

                    <p className="truncate rounded-md border border-border bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                      {link}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/i/${inv.slug}`} target="_blank" rel="noreferrer">
                          {d.view}
                        </Link>
                      </Button>
                      <CopyLinkButton url={link} copyLabel={d.copy} copiedLabel={d.copied} />
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/${inv.id}/guests`}>{d.guests}</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/${inv.id}/edit`}>{d.edit}</Link>
                      </Button>
                      <QrButton url={link} name={`${inv.groomName}-${inv.brideName}`} />
                      <DeleteInvitationButton id={inv.id} label={d.del} />
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
