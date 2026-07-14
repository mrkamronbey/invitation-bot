import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

/** Klassik shablon — nafis serif, iliq krem ranglar, katta rasm hero. */
export function ClassicTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <main className="min-h-screen bg-cream font-sans text-ink">
      <header
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={
          invitation.coverImageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(44,38,32,0.45), rgba(44,38,32,0.55)), url(${invitation.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="animate-fade-up text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/80">Taklifnoma</p>
          <h1 className="font-sans text-5xl leading-tight sm:text-6xl">
            {invitation.groomName}
            <span className="mx-3 text-gold">&amp;</span>
            {invitation.brideName}
          </h1>
          <p className="mt-6 text-lg tracking-wide text-white/90">{dateLine}</p>
        </div>
      </header>

      <InvitationBody invitation={invitation} />
    </main>
  );
}
