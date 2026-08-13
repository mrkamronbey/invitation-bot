import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Invitation } from '@invitation/domain';
import { getSession } from '@/shared/auth/current-user';
import { getMyInvitation } from '@/shared/api/dashboard-source';
import { getSiteDict, getSiteLang } from '@/shared/i18n/site';
import type { EditorInput } from '@/shared/api/editor-types';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { EditorForm } from '@/features/editor/EditorForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly params: Promise<{ readonly id: string }>;
}

/** Invitation entity'ni editor kirishiga o'giradi (tahrir formasi uchun). */
function toEditorInput(inv: Invitation): EditorInput {
  return {
    templateId: inv.templateId,
    groomName: inv.groomName,
    brideName: inv.brideName,
    eventDate: inv.eventDate,
    eventTime: inv.eventTime ?? '',
    venueName: inv.venue?.name ?? '',
    venueAddress: inv.venue?.address ?? '',
    venueMapUrl: inv.venue?.mapUrl ?? '',
    story: inv.story ?? '',
    dressCode: inv.dressCode ?? '',
    parents: {
      groom: {
        father: inv.parents?.groom?.father ?? '',
        mother: inv.parents?.groom?.mother ?? '',
      },
      bride: {
        father: inv.parents?.bride?.father ?? '',
        mother: inv.parents?.bride?.mother ?? '',
      },
    },
    schedule: inv.schedule ? inv.schedule.map((s) => ({ time: s.time, title: s.title })) : [],
    gift: {
      cardNumber: inv.gift?.cardNumber ?? '',
      cardHolder: inv.gift?.cardHolder ?? '',
      note: inv.gift?.note ?? '',
    },
    gallery: [...inv.gallery],
    locale: inv.locale,
  };
}

/** Taklifnomani tahrirlash sahifasi. */
export default async function EditInvitationPage({ params }: PageProps): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id } = await params;
  const invitation = await getMyInvitation(id, session.sub);
  if (!invitation) notFound();
  const lang = await getSiteLang();
  const dict = getSiteDict(lang);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} lang={lang} d={dict.dash} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">{dict.editor.editEyebrow}</p>
        <h1 className="mb-8 mt-2 text-4xl font-bold tracking-tight">
          {invitation.groomName} &amp; {invitation.brideName}
        </h1>
        <EditorForm mode="edit" invitationId={id} initial={toEditorInput(invitation)} t={dict.editor} />
      </main>
    </div>
  );
}
