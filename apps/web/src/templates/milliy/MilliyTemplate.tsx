import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { MusicToggle } from '@/widgets/music/MusicToggle';
import { MilliyCover } from './MilliyCover';
import { MilliyBody } from './MilliyBody';
import { GirihBackdrop, UZ } from './UzOrnaments';

/**
 * Milliy — o'zbek milliy uslubidagi shablon (Samarqand koshini palitrasi):
 * firuza + oltin, girih (geometrik) va islimiy (o'simliksimon) naqshlar,
 * mehrob ravog'i. Barcha bezaklar SVG — rasm yuklanmaydi.
 */
export function MilliyTemplate({ invitation }: TemplateProps): ReactNode {
  const ru = invitation.locale === 'ru';
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <MilliyCover
      groom={invitation.groomName}
      bride={invitation.brideName}
      dateLine={dateLine}
      openLabel={ru ? 'Открыть' : 'Ochish'}
      invitedLabel={ru ? 'Приглашение на свадьбу' : 'To‘y taklifnomasi'}
      invitedPrefix={ru ? 'Уважаемый(ая)' : 'Hurmatli'}
      andWord={ru ? 'и' : 'va'}
    >
      <main className="uz-paper relative min-h-screen" style={{ background: UZ.ivory }}>
        {/* nozik girih fon to'qimasi — butun sahifa bo'ylab */}
        <GirihBackdrop
          id="page-girih"
          className="pointer-events-none fixed inset-0"
          color={UZ.teal}
          opacity={0.03}
        />
        <div className="relative">
          <MilliyBody invitation={invitation} />
        </div>
        {invitation.musicSource !== 'none' && invitation.musicUrl ? (
          <MusicToggle src={invitation.musicUrl} />
        ) : null}
      </main>
    </MilliyCover>
  );
}
