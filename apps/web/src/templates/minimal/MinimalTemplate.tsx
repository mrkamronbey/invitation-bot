import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { Flourish } from '@/shared/ui/ornaments';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/** Minimal shablon — ko'p bo'sh joy, nozik naqsh, tinch. */
export function MinimalTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center animate-fade-up">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">taklifnoma</p>
          <h1 className="mt-8 font-display text-5xl font-medium tracking-wide sm:text-6xl">
            {invitation.groomName} &amp; {invitation.brideName}
          </h1>
          <Flourish className="my-8 w-40" />
          <p className="text-sm uppercase tracking-[0.3em] opacity-60">{dateLine}</p>
        </div>
      </header>

      <InvitationBody invitation={invitation} />
    </main>
  );
}
