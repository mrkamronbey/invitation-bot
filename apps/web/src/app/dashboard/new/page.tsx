import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { EditorForm } from '@/features/editor/EditorForm';

export const dynamic = 'force-dynamic';

/** Yangi taklifnoma yaratish sahifasi. */
export default async function NewInvitationPage(): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Yangi</p>
        <h1 className="mb-8 mt-2 font-display text-4xl">Taklifnoma yaratish</h1>
        <EditorForm mode="create" />
      </main>
    </div>
  );
}
