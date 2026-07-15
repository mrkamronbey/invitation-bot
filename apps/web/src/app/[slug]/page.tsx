import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getMessages } from '@invitation/i18n';
import { getInvitationBySlug } from '@/shared/api/invitation-source';
import { getTemplate } from '@/templates/registry';

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) return { title: 'Taklifnoma topilmadi' };

  const title = `${invitation.groomName} & ${invitation.brideName} — Taklifnoma`;
  return {
    title,
    description: invitation.story ?? title,
    openGraph: {
      title,
      description: invitation.story ?? title,
      images: invitation.coverImageUrl ? [invitation.coverImageUrl] : undefined,
    },
  };
}

/** `?g=Ism` bo'lsa — mehmon ismini o'qiydi (shaxsiy taklif). */
function readGuestName(sp: Record<string, string | string[] | undefined>): string | undefined {
  const g = sp.g;
  const raw = typeof g === 'string' ? g : Array.isArray(g) ? g[0] : undefined;
  const name = raw?.trim();
  return name && name.length > 0 && name.length <= 60 ? name : undefined;
}

export default async function InvitationPage({
  params,
  searchParams,
}: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const guestName = readGuestName(await searchParams);
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) notFound();

  const Template = getTemplate(invitation.templateId).component;
  const m = getMessages(invitation.locale);

  return (
    <>
      {guestName ? (
        <div className="absolute inset-x-0 top-0 z-40 bg-ink/70 py-2.5 text-center text-sm tracking-wide text-cream backdrop-blur-sm">
          {m.web.guestGreeting(guestName)}
        </div>
      ) : null}
      <Template invitation={invitation} />
    </>
  );
}
