import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { InvitationBody } from '@/widgets/invitation-body/InvitationBody';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { ParallaxHero } from './ParallaxHero';

/** Parallax shablon — qatlamli, scroll'da jonlanadigan premium hero. */
export function ParallaxTemplate({ invitation }: TemplateProps): ReactNode {
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');
  const kicker = invitation.locale === 'ru' ? 'Приглашение' : 'Taklifnoma';

  return (
    <main className="min-h-screen bg-cream text-ink">
      <ParallaxHero
        groom={invitation.groomName}
        bride={invitation.brideName}
        dateLine={dateLine}
        cover={invitation.coverImageUrl}
        kicker={kicker}
      />
      <div className="pattern-soft">
        <InvitationBody invitation={invitation} />
      </div>
    </main>
  );
}
