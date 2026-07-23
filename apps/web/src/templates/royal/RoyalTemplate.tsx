import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { RoyalCover } from './RoyalCover';
import { RoyalHero } from './RoyalHero';
import { RoyalBody } from './RoyalBody';

/**
 * Royal — oq atirgul + oltin premium shablon (chungdoi royal-v2-green uslubi):
 * konvert ochilishi → parallax gulli hero (tushuvchi barglar) → och mavzu bo'limlar.
 * Bezaklar: apps/web/public/images/royal/flower-1..7.png (RoyalFlora.tsx izohiga qarang).
 */
export function RoyalTemplate({ invitation }: TemplateProps): ReactNode {
  const ru = invitation.locale === 'ru';
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');
  const kicker = ru ? 'Приглашение' : 'Taklifnoma';
  const eyebrow = ru ? 'Приглашаем на свадьбу' : 'Turmush quramiz';

  return (
    <RoyalCover
      groom={invitation.groomName}
      bride={invitation.brideName}
      dateLine={dateLine}
      kicker={kicker}
      openLabel={ru ? 'Открыть' : 'Ochish'}
      invitedPrefix={ru ? 'Уважаемый(ая)' : 'Hurmatli'}
      invitedSuffix={ru ? 'приглашаем вас на нашу свадьбу' : 'sizni to‘yimizga taklif qilamiz'}
    >
      <main className="min-h-screen bg-cream text-ink">
        <RoyalHero
          groom={invitation.groomName}
          bride={invitation.brideName}
          dateLine={dateLine}
          kicker={kicker}
          eyebrow={eyebrow}
          venue={invitation.venue?.name}
        />
        <div className="pattern-soft">
          <RoyalBody invitation={invitation} />
        </div>
      </main>
    </RoyalCover>
  );
}
