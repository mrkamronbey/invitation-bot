import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/** Minimal shablon — ko'p bo'sh joy, nozik chiziqlar, tinch. */
export function MinimalTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">taklifnoma</p>
          <h1 className="mt-8 text-4xl font-light tracking-wide sm:text-5xl">
            {invitation.groomName} &amp; {invitation.brideName}
          </h1>
          <div className="mx-auto my-8 h-px w-16 bg-gold" />
          <p className="text-sm uppercase tracking-[0.3em] opacity-60">{dateLine}</p>
        </div>
      </header>

      <InvitationBody invitation={invitation} />
    </main>
  );
}
