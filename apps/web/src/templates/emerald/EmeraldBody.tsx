import type { ReactNode } from 'react';
import type { Invitation } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';
import { Reveal } from '@/shared/ui/Reveal';
import { DotDivider } from '@/shared/ui/ornaments';
import { DressSwatches } from '@/shared/ui/DressSwatches';
import { Countdown } from '@/widgets/countdown/Countdown';
import { CalendarCard } from '@/widgets/calendar/CalendarCard';
import { AddToCalendar } from '@/widgets/calendar/AddToCalendar';
import { GiftBox } from '@/widgets/gift/GiftBox';
import { WishesWall } from '@/widgets/wishes/WishesWall';
import { RsvpForm } from '@/features/submit-rsvp/RsvpForm';
import { formatEventDate, formatEventTime } from '@/shared/lib/format';

interface EmeraldBodyProps {
  readonly invitation: Invitation;
}

/** Emerald-mavzu bo'lim sarlavhasi — oltin, naqshli. */
function Heading({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <h2 className="font-display text-3xl tracking-[0.15em] text-gold-light sm:text-4xl">
        {children}
      </h2>
      <span className="gold-shimmer mt-3 h-px w-16 bg-gold-light" />
    </div>
  );
}

function Wrap({ children }: { readonly children: ReactNode }): ReactNode {
  return <section className="mx-auto w-full max-w-xl px-6 py-14">{children}</section>;
}

/**
 * Emerald taklifnoma tanasi (to'q zumrad mavzu). chungdoi anatomiyasi:
 * marosim → album → ziyofat + kalendar + countdown → dress-code → kun tartibi →
 * tilaklar + RSVP → sovg'a qutisi.
 * NB: kun tartibi (schedule) va sovg'a kartasi hozircha namuna — 2-bosqichda
 * bot orqali to'ldiriladigan bo'ladi.
 */
export async function EmeraldBody({ invitation }: EmeraldBodyProps): Promise<ReactNode> {
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
    at: ru ? 'в' : 'da',
  };

  // Namuna kun tartibi (2-bosqichda ma'lumotdan keladi)
  const schedule: ReadonlyArray<readonly [string, string]> = [
    ['16:30', ru ? 'Встреча гостей' : 'Mehmonlarni kutib olish'],
    [invitation.eventTime ?? '17:00', ru ? 'Церемония' : 'Nikoh marosimi'],
    ['18:30', ru ? 'Банкет' : 'Ziyofat'],
    ['21:00', ru ? 'Завершение' : 'Yakuniy qism'],
  ];

  return (
    <div className="text-ivory">
      {/* Marosim ma'lumoti */}
      <Wrap>
        <Reveal>
          <Heading>{t.ceremony}</Heading>
          <div className="text-center">
            <p className="font-display text-4xl text-ivory sm:text-5xl">
              {invitation.groomName} <span className="text-gold-light">&amp;</span>{' '}
              {invitation.brideName}
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-ivory/80">{dateLine}</p>
            {invitation.venue?.name ? (
              <p className="mt-2 text-lg text-gold-light">{invitation.venue.name}</p>
            ) : null}
            {invitation.venue?.address ? (
              <p className="mt-1 text-sm text-ivory/60">{invitation.venue.address}</p>
            ) : null}
          </div>
        </Reveal>
      </Wrap>

      {/* Album (polaroid grid) */}
      {invitation.gallery.length > 0 ? (
        <Wrap>
          <Reveal>
            <Heading>{t.album}</Heading>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {invitation.gallery.slice(0, 6).map((src, i) => (
              <Reveal key={`${src}-${i}`} delay={i * 60} variant={i % 2 === 0 ? 'left' : 'right'}>
                <div
                  className={`overflow-hidden rounded-md border-4 border-ivory/90 bg-ivory shadow-xl ${
                    i % 2 === 0 ? '-rotate-2' : 'rotate-2'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <p className="text-center font-display text-2xl italic leading-relaxed text-ivory/90 sm:text-3xl">
              “{invitation.story}”
            </p>
          </Reveal>
        </Wrap>
      ) : null}

      {/* Ziyofat + kalendar + Add-to-Calendar + countdown */}
      <Wrap>
        <Reveal>
          <Heading>{t.reception}</Heading>
        </Reveal>
        <Reveal variant="scale">
          <CalendarCard
            eventDate={invitation.eventDate}
            locale={invitation.locale}
            tone="dark"
          />
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
              tone="dark"
            />
          </Reveal>
        </div>
        <div className="mt-10">
          <Reveal>
            <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-gold-light/80">
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
              colors={['#0f3d2e', '#d8bd82', '#f4efe3']}
              tone="dark"
            />
          </Reveal>
        </Wrap>
      ) : null}

      {/* Kun tartibi (timeline) */}
      <Wrap>
        <Reveal>
          <Heading>{t.schedule}</Heading>
        </Reveal>
        <div className="mx-auto max-w-sm">
          {schedule.map(([time, ev], i) => (
            <Reveal key={time + ev} delay={i * 60} variant="left">
              <div className="flex items-center gap-4 border-l border-gold-light/30 pl-5 pb-6 last:pb-0">
                <span className="relative -ml-[1.6rem] flex h-3 w-3 shrink-0 rounded-full bg-gold-light">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold-light/50" />
                </span>
                <span className="w-16 font-display text-xl text-gold-light">{time}</span>
                <span className="text-ivory/85">{ev}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>

      {/* Tilaklar */}
      <div className="[&_h2]:!text-gold-light [&_blockquote]:text-ivory/90 [&_figure]:!border-gold-light/20 [&_figure]:!bg-white/[0.04]">
        <WishesWall slug={invitation.slug} locale={invitation.locale} />
      </div>

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

      {!invitation.isPremium ? (
        <footer className="pb-10 pt-4 text-center text-xs text-ivory/35">
          <DotDivider className="mb-4 !text-gold-light/40" />
          taklif.uz orqali yaratilgan
        </footer>
      ) : null}
    </div>
  );
}
