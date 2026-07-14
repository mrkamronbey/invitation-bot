import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getInvitationBySlug } from '@/shared/api/invitation-source';
import { getTemplate } from '@/templates/registry';

interface PageProps {
  readonly params: Promise<{ readonly slug: string }>;
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

export default async function InvitationPage({ params }: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) notFound();

  const Template = getTemplate(invitation.templateId).component;
  return <Template invitation={invitation} />;
}
