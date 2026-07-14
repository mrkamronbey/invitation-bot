import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/** Zamonaviy shablon — to'q fon, yengil shrift, oltin urg'u. */
export function ModernTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-ink text-cream">
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {invitation.coverImageUrl ? (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `url(${invitation.coverImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : null}
        <div className="relative animate-fade-up">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Save the date</p>
          <h1 className="mt-8 text-5xl font-light leading-tight sm:text-7xl">
            {invitation.groomName}
            <br />
            <span className="text-gold">&amp;</span>
            <br />
            {invitation.brideName}
          </h1>
          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-cream/80">{dateLine}</p>
        </div>
      </header>

      <InvitationBody invitation={invitation} />
    </main>
  );
}
