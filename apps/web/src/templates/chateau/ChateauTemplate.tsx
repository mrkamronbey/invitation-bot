import type { ReactNode } from 'react';
import type { TemplateProps } from '../types';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { MusicToggle } from '@/widgets/music/MusicToggle';
import { ChateauCover } from './ChateauCover';
import { ChateauBody } from './ChateauBody';

/**
 * Chateau — och "European Garden" shablon (chungdoi chateau-green uslubi):
 * yashil konvert → akvarel shato (château) hero → oq fonli nozik bo'limlar.
 * Bezaklar: apps/web/public/images/chateau/*.webp.
 */
export function ChateauTemplate({ invitation }: TemplateProps): ReactNode {
  const ru = invitation.locale === 'ru';
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  return (
    <ChateauCover
      groom={invitation.groomName}
      bride={invitation.brideName}
      dateLine={dateLine}
      openLabel={ru ? 'Открыть приглашение' : 'Taklifnomani ochish'}
      invitedLabel={ru ? 'Вы приглашены' : 'Siz taklif qilinasiz'}
      invitedPrefix={ru ? 'Уважаемый(ая)' : 'Hurmatli'}
    >
      <main className="min-h-screen bg-[#fdfdfa] text-[#33472a]">
        <ChateauBody invitation={invitation} />
        {invitation.musicSource !== 'none' && invitation.musicUrl ? (
          <MusicToggle src={invitation.musicUrl} />
        ) : null}
      </main>
    </ChateauCover>
  );
}
