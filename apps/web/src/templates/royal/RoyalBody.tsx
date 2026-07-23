import type { ReactNode } from 'react';
import type { Invitation } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';
import { Reveal } from '@/shared/ui/Reveal';
import { DressSwatches } from '@/shared/ui/DressSwatches';
import { Countdown } from '@/widgets/countdown/Countdown';
import { CalendarCard } from '@/widgets/calendar/CalendarCard';
import { AddToCalendar } from '@/widgets/calendar/AddToCalendar';
import { GiftBox } from '@/widgets/gift/GiftBox';
import { WishesWall } from '@/widgets/wishes/WishesWall';
import { RsvpForm } from '@/features/submit-rsvp/RsvpForm';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';
import { Bloom } from './RoyalFlora';
import { RoyalDivider } from './RoyalDivider';

interface RoyalBodyProps {
  readonly invitation: Invitation;
}

/** Royal sarlavha — tepasida oltin barg aksenti (flower-6), oltin serif + shimmer chiziq. */
function Heading({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <Bloom n={6} className="mb-1 h-10 w-16 opacity-90" />
      <h2 className="font-display text-3xl tracking-[0.12em] text-gold sm:text-4xl">{children}</h2>
      <span className="gold-shimmer mt-3 h-px w-16 bg-gold" />
    </div>
  );
}

function Wrap({ children }: { readonly children: ReactNode }): ReactNode {
  return <section className="relative mx-auto w-full max-w-xl px-6 py-14">{children}</section>;
}

/** Bo'lim chetidan mo'ralab turuvchi baland vertikal shox (flower-5). */
function SideSpray({ side }: { readonly side: 'left' | 'right' }): ReactNode {
  const pos = side === 'left' ? '-left-16 sm:-left-10' : '-right-16 sm:-right-10';
  return (
    <Bloom
      n={5}
      flipX={side === 'right'}
      className={`pointer-events-none absolute top-1/2 hidden h-[70%] w-40 -translate-y-1/2 opacity-30 animate-float sm:block ${pos}`}
    />
  );
}

/**
 * Royal taklifnoma tanasi (och, oltin+oq atirgul mavzu).
 * Anatomiya: marosim → album → hikoya → ziyofat (kalendar+countdown) →
 * dress-code → kun tartibi → tilaklar → RSVP → sovg'a → footer.
 * NB: kun tartibi (schedule) va sovg'a kartasi hozircha namuna — 2-bosqichda
 * bot orqali to'ldiriladigan bo'ladi.
 */
export async function RoyalBody({ invitation }: RoyalBodyProps): Promise<ReactNode> {
  const m = getMessages(invitation.locale).web;
  const ru = invitation.locale === 'ru';
  const dateLine = [formatEventDate(invitation.eventDate), formatEventTime(invitation.eventTime)]
    .filter(Boolean)
    .join(' · ');

  const t = {
    ceremony: ru ? 'Церемония' : 'Nikoh marosimi',
    reception: ru ? 'Торжество' : 'Ziyofat',
    album: ru ? 'Наш альбом' : 'Bizning albom',
    schedule: ru ? 'Программа дня' : 'Kun tartibi',
    gift: ru ? 'Подарок' : 'Sovg‘a qutisi',
    addCal: ru ? 'В календарь' : 'Kalendarga qo‘shish',
    giftHint: ru ? 'Нажмите, чтобы открыть' : 'Ochish uchun bosing',
    giftNote: ru
      ? 'Ваше присутствие — лучший подарок. По желанию можно перевести на карту ниже.'
      : 'Ishtirokingizning o‘zi biz uchun eng katta sovg‘a. Xohlasangiz, quyidagi kartaga o‘tkazishingiz mumkin.',
    copy: ru ? 'Копировать' : 'Nusxalash',
    copied: ru ? 'Скопировано' : 'Nusxalandi',
    dress: m.dressCode,
  };

  // Namuna kun tartibi (2-bosqichda ma'lumotdan keladi)
  const schedule: ReadonlyArray<readonly [string, string]> = [
    ['16:30', ru ? 'Встреча гостей' : 'Mehmonlarni kutib olish'],
    [invitation.eventTime ?? '17:00', ru ? 'Церемония' : 'Nikoh marosimi'],
    ['18:30', ru ? 'Банкет' : 'Ziyofat'],
    ['21:00', ru ? 'Завершение' : 'Yakuniy qism'],
  ];

  return (
    <div className="text-ink">
      {/* Marosim ma'lumoti */}
      <Wrap>
        <SideSpray side="left" />
        <Reveal>
          <Heading>{t.ceremony}</Heading>
          <div className="text-center">
            <p className="font-display text-4xl text-ink sm:text-5xl">
              {invitation.groomName} <span className="italic text-gold">&amp;</span>{' '}
              {invitation.brideName}
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-ink/70">{dateLine}</p>
            {invitation.venue?.name ? (
              <p className="mt-2 text-lg text-gold">{invitation.venue.name}</p>
            ) : null}
            {invitation.venue?.address ? (
              <p className="mt-1 text-sm text-ink/55">{invitation.venue.address}</p>
            ) : null}
          </div>
        </Reveal>
      </Wrap>

      <RoyalDivider />

      {/* Album (polaroid grid) */}
      {invitation.gallery.length > 0 ? (
        <Wrap>
          <SideSpray side="right" />
          <Reveal>
            <Heading>{t.album}</Heading>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {invitation.gallery.slice(0, 6).map((src, i) => (
              <Reveal key={`${src}-${i}`} delay={i * 60} variant={i % 2 === 0 ? 'left' : 'right'}>
                <div
                  className={`overflow-hidden rounded-md border-4 border-white bg-white shadow-[0_12px_30px_-12px_rgba(120,90,40,0.4)] ${
                    i % 2 === 0 ? '-rotate-2' : 'rotate-2'
                  }`}
                >
                  <img src={src} alt="" className="aspect-[4/5] h-full w-full object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      ) : null}

      {/* Hikoya */}
      {invitation.story ? (
        <Wrap>
          <Reveal>
            <p className="text-center font-display text-2xl italic leading-relaxed text-ink/85 sm:text-3xl">
              “{invitation.story}”
            </p>
          </Reveal>
        </Wrap>
      ) : null}

      <RoyalDivider variant="fleur" />

      {/* Ziyofat + kalendar + Add-to-Calendar + countdown */}
      <Wrap>
        <SideSpray side="left" />
        <Reveal>
          <Heading>{t.reception}</Heading>
        </Reveal>
        <Reveal variant="scale">
          <CalendarCard eventDate={invitation.eventDate} locale={invitation.locale} tone="light" />
        </Reveal>
        <div className="mt-6">
          <Reveal>
            <AddToCalendar
              title={`${invitation.groomName} & ${invitation.brideName}`}
              eventDate={invitation.eventDate}
              eventTime={invitation.eventTime}
              location={invitation.venue?.address ?? invitation.venue?.name}
              details={invitation.story}
              label={t.addCal}
              tone="light"
            />
          </Reveal>
        </div>
        <div className="mt-10">
          <Reveal>
            <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-gold">
              {m.countdownLabel}
            </p>
            <Countdown
              eventDate={invitation.eventDate}
              eventTime={invitation.eventTime}
              locale={invitation.locale}
            />
          </Reveal>
        </div>
      </Wrap>

      {/* Dress code */}
      {invitation.dressCode ? (
        <Wrap>
          <Reveal>
            <DressSwatches
              label={t.dress}
              text={invitation.dressCode}
              colors={['#ffffff', '#d8bd82', '#0f3d2e']}
              tone="light"
            />
          </Reveal>
        </Wrap>
      ) : null}

      <RoyalDivider />

      {/* Kun tartibi (timeline) */}
      <Wrap>
        <SideSpray side="right" />
        <Reveal>
          <Heading>{t.schedule}</Heading>
        </Reveal>
        <div className="mx-auto max-w-sm">
          {schedule.map(([time, ev], i) => (
            <Reveal key={time + ev} delay={i * 60} variant="left">
              <div className="flex items-center gap-4 border-l border-gold/30 pb-6 pl-5 last:pb-0">
                <span className="relative -ml-[1.6rem] flex h-3 w-3 shrink-0 rounded-full bg-gold">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/50" />
                </span>
                <span className="w-16 font-display text-xl text-gold">{time}</span>
                <span className="text-ink/80">{ev}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>

      {/* Tilaklar */}
      <WishesWall slug={invitation.slug} locale={invitation.locale} />

      {/* RSVP */}
      <Wrap>
        <Reveal>
          <Heading>{m.rsvpTitle}</Heading>
          <RsvpForm slug={invitation.slug} locale={invitation.locale} />
        </Reveal>
      </Wrap>

      {/* Sovg'a qutisi */}
      <Wrap>
        <Reveal variant="scale">
          <GiftBox
            title={t.gift}
            hint={t.giftHint}
            note={t.giftNote}
            cardNumber="8600 1234 5678 9010"
            cardHolder={`${invitation.groomName} ${invitation.brideName}`}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
        </Reveal>
      </Wrap>

      {/* Footer — lavr gulchambar + rahmat */}
      <footer className="flex flex-col items-center px-6 pb-12 pt-4 text-center">
        <Bloom n={4} className="h-24 w-72 sm:h-28 sm:w-96" />
        <p className="mt-4 font-display text-2xl italic text-gold">
          {ru ? 'Ждём вас!' : 'Sizni kutamiz!'}
        </p>
        {!invitation.isPremium ? (
          <p className="mt-3 text-xs text-ink/35">taklif.uz orqali yaratilgan</p>
        ) : null}
      </footer>
    </div>
  );
}
