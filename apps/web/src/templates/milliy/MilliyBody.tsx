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
import { MapBlock } from '@/widgets/map/MapBlock';
import { ShareButtons } from '@/widgets/share/ShareButtons';
import { RsvpForm } from '@/features/submit-rsvp/RsvpForm';
import { dateParts } from '../royal/royalDate';
import { GirihBackdrop, GirihStar, IslimiCorner, OrnamentDivider, UZ } from './UzOrnaments';

interface MilliyBodyProps {
  readonly invitation: Invitation;
}

/** Bo'lim sarlavhasi — girih yulduz + firuza serif + oltin ajratgich. */
function Heading({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <div className="mb-9 flex flex-col items-center text-center">
      <GirihStar className="h-8 w-8" color={UZ.gold} />
      <h2
        className="uz-serif mt-3 text-2xl uppercase tracking-[0.2em] sm:text-3xl"
        style={{ color: UZ.tealDeep }}
      >
        {children}
      </h2>
      <OrnamentDivider className="mt-3 h-4 w-40" color={UZ.gold} />
    </div>
  );
}

function Wrap({ children }: { readonly children: ReactNode }): ReactNode {
  return <section className="relative mx-auto w-full max-w-xl px-6 py-14">{children}</section>;
}

/** Bo'limlar orasidagi naqshli ajratgich. */
function Divider(): ReactNode {
  return (
    <div className="flex justify-center py-1">
      <OrnamentDivider className="h-5 w-52 opacity-70" color={UZ.gold} />
    </div>
  );
}

/**
 * Milliy taklifnoma tanasi — Samarqand koshini uslubi:
 * nog'ora-oq fon, firuza + oltin, girih va islimiy naqshlar.
 * Data-driven: ota-onalar / kun tartibi / sovg'a faqat ma'lumot bo'lsa chiqadi.
 */
export function MilliyBody({ invitation }: MilliyBodyProps): ReactNode {
  const m = getMessages(invitation.locale).web;
  const ru = invitation.locale === 'ru';
  const dp = dateParts(invitation.eventDate, invitation.locale);

  const t = {
    welcome: ru ? 'Добро пожаловать на нашу свадьбу' : 'To‘yimizga xush kelibsiz',
    ceremony: ru ? 'Никох' : 'Nikoh to‘yi',
    reception: ru ? 'Торжество' : 'Ziyofat',
    story: ru ? 'Наш альбом' : 'Bizning albom',
    schedule: ru ? 'Программа дня' : 'Kun tartibi',
    gift: ru ? 'Подарок' : 'Sovg‘a',
    addCal: ru ? 'В календарь' : 'Kalendarga qo‘shish',
    giftHint: ru ? 'Нажмите, чтобы открыть' : 'Ochish uchun bosing',
    giftNote: ru
      ? 'Ваше присутствие — лучший подарок. По желанию можно перевести на карту ниже.'
      : 'Ishtirokingizning o‘zi biz uchun eng katta sovg‘a. Xohlasangiz, quyidagi kartaga o‘tkazishingiz mumkin.',
    copy: ru ? 'Копировать' : 'Nusxalash',
    copied: ru ? 'Скопировано' : 'Nusxalandi',
    dress: m.dressCode,
    withJoy: ru
      ? 'С радостью объявляем о свадьбе наших детей'
      : 'Farzandlarimiz to‘yini quvonch bilan e’lon qilamiz',
    time: ru ? 'Время' : 'Vaqt',
    parentsGroom: ru ? 'Родители жениха' : 'Kuyov ota-onasi',
    parentsBride: ru ? 'Родители невесты' : 'Kelin ota-onasi',
    location: ru ? 'Как добраться' : 'Manzil',
    directions: ru ? 'Маршрут' : 'Yo‘l ko‘rsatish',
    share: ru ? 'Поделиться' : 'Ulashing',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const inviteUrl = `${siteUrl}/i/${invitation.slug}`;

  const parents = invitation.parents;
  const hasParents = Boolean(
    parents?.groom?.father || parents?.groom?.mother || parents?.bride?.father || parents?.bride?.mother,
  );
  const schedule = invitation.schedule ?? [];
  const gift = invitation.gift;
  const hasGift = Boolean(gift?.cardNumber || gift?.cardHolder || gift?.note);
  const gallery = invitation.gallery;

  return (
    <div className="relative" style={{ color: UZ.ink }}>
      {/* ── Hero: islimiy burchaklar + ismlar ── */}
      <header className="relative overflow-hidden px-6 pb-6 pt-16 text-center">
        <IslimiCorner
          className="pointer-events-none absolute -left-2 top-2 h-28 w-28 opacity-45 sm:h-36 sm:w-36"
          color={UZ.gold}
        />
        <IslimiCorner
          flipX
          className="pointer-events-none absolute -right-2 top-2 h-28 w-28 opacity-45 sm:h-36 sm:w-36"
          color={UZ.gold}
        />

        <Reveal>
          <p
            className="text-[0.65rem] uppercase tracking-[0.3em]"
            style={{ color: UZ.teal }}
          >
            {t.welcome}
          </p>

          <h1
            className="uz-serif mt-10 uppercase leading-tight tracking-[0.04em]"
            style={{ color: UZ.tealDeep }}
          >
            <span className="block text-4xl sm:text-6xl">{invitation.groomName}</span>
            <span
              className="my-4 block text-2xl italic normal-case tracking-normal"
              style={{ color: UZ.gold }}
            >
              &amp;
            </span>
            <span className="block text-4xl sm:text-6xl">{invitation.brideName}</span>
          </h1>

          <OrnamentDivider className="mx-auto mt-9 h-5 w-56" color={UZ.gold} />
        </Reveal>
      </header>

      {/* ── Nikoh to'yi: ota-onalar + sana ── */}
      <Wrap>
        <Reveal>
          <Heading>{t.ceremony}</Heading>
        </Reveal>
        <Reveal>
          <p className="text-center text-sm" style={{ color: UZ.teal }}>
            {t.withJoy}
          </p>
        </Reveal>

        {hasParents ? (
          <Reveal>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-6 text-center">
              <div>
                <p
                  className="text-[0.6rem] uppercase tracking-[0.2em]"
                  style={{ color: UZ.turquoise }}
                >
                  {t.parentsGroom}
                </p>
                {parents?.groom?.father ? (
                  <p className="mt-2 font-medium" style={{ color: UZ.tealDeep }}>
                    {parents.groom.father}
                  </p>
                ) : null}
                {parents?.groom?.mother ? (
                  <p className="font-medium" style={{ color: UZ.tealDeep }}>
                    {parents.groom.mother}
                  </p>
                ) : null}
              </div>
              <div className="border-l" style={{ borderColor: `${UZ.gold}44` }}>
                <p
                  className="text-[0.6rem] uppercase tracking-[0.2em]"
                  style={{ color: UZ.turquoise }}
                >
                  {t.parentsBride}
                </p>
                {parents?.bride?.father ? (
                  <p className="mt-2 font-medium" style={{ color: UZ.tealDeep }}>
                    {parents.bride.father}
                  </p>
                ) : null}
                {parents?.bride?.mother ? (
                  <p className="font-medium" style={{ color: UZ.tealDeep }}>
                    {parents.bride.mother}
                  </p>
                ) : null}
              </div>
            </div>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="mt-10 text-center">
            {invitation.venue?.name ? (
              <p className="uz-serif text-2xl" style={{ color: UZ.tealDeep }}>
                {invitation.venue.name}
              </p>
            ) : null}
            {invitation.venue?.address ? (
              <p className="mt-1 text-sm" style={{ color: UZ.teal }}>
                {invitation.venue.address}
              </p>
            ) : null}

            {invitation.eventTime ? (
              <div className="mt-6">
                <p
                  className="text-[0.65rem] uppercase tracking-[0.28em]"
                  style={{ color: UZ.turquoise }}
                >
                  {t.time}
                </p>
                <p className="uz-serif mt-1 text-3xl" style={{ color: UZ.tealDeep }}>
                  {invitation.eventTime}
                </p>
              </div>
            ) : null}

            {/* Sana bloki — hafta kuni | kun | oy */}
            <div
              className="mt-7 flex items-center justify-center gap-4"
              style={{ color: UZ.tealDeep }}
            >
              <span className="text-[0.65rem] uppercase tracking-[0.26em] sm:text-xs">
                {dp.weekday}
              </span>
              <span className="h-9 w-px" style={{ background: `${UZ.gold}80` }} />
              <span className="uz-serif text-4xl" style={{ color: UZ.gold }}>
                {dp.day}
              </span>
              <span className="h-9 w-px" style={{ background: `${UZ.gold}80` }} />
              <span className="text-[0.65rem] uppercase tracking-[0.26em] sm:text-xs">
                {dp.month}
              </span>
            </div>
            <p className="uz-serif mt-2 text-xl" style={{ color: UZ.teal }}>
              {dp.year}
            </p>
          </div>
        </Reveal>
      </Wrap>

      {/* ── Albom ── */}
      {gallery.length > 0 ? (
        <>
          <Divider />
          <Wrap>
            <Reveal>
              <Heading>{t.story}</Heading>
            </Reveal>
            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(0, 6).map((src, i) => (
                <Reveal
                  key={`${src}-${i}`}
                  delay={i * 60}
                  variant={i % 2 === 0 ? 'left' : 'right'}
                  className={i === 0 ? 'col-span-2' : ''}
                >
                  <div
                    className="overflow-hidden rounded-lg border"
                    style={{ borderColor: `${UZ.gold}55` }}
                  >
                    <img
                      src={src}
                      alt=""
                      className={`w-full object-cover ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </>
      ) : null}

      {/* ── Hikoya ── */}
      {invitation.story ? (
        <Wrap>
          <Reveal>
            <p
              className="uz-serif text-center text-2xl italic leading-relaxed sm:text-3xl"
              style={{ color: UZ.tealDeep }}
            >
              “{invitation.story}”
            </p>
          </Reveal>
        </Wrap>
      ) : null}

      <Divider />

      {/* ── Ziyofat: kalendar + countdown ── */}
      <Wrap>
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
            <p
              className="mb-5 text-center text-xs uppercase tracking-[0.3em]"
              style={{ color: UZ.turquoise }}
            >
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

      {/* ── Manzil ── */}
      {invitation.venue?.geo || invitation.venue?.mapUrl ? (
        <Wrap>
          <Reveal>
            <Heading>{t.location}</Heading>
          </Reveal>
          {invitation.venue?.geo ? (
            <Reveal variant="scale">
              <MapBlock
                lat={invitation.venue.geo.lat}
                lng={invitation.venue.geo.lng}
                venueName={invitation.venue.name}
                address={invitation.venue.address}
                directionsLabel={t.directions}
              />
            </Reveal>
          ) : null}
          {invitation.venue?.mapUrl ? (
            <Reveal>
              <div className="mt-6 flex justify-center">
                <a
                  href={invitation.venue.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
                  style={{ background: UZ.teal }}
                >
                  {t.directions}
                </a>
              </div>
            </Reveal>
          ) : null}
        </Wrap>
      ) : null}

      {/* ── Kiyim uslubi ── */}
      {invitation.dressCode ? (
        <Wrap>
          <Reveal>
            <DressSwatches
              label={t.dress}
              text={invitation.dressCode}
              colors={[UZ.ivoryWarm, UZ.goldLight, UZ.teal]}
              tone="light"
            />
          </Reveal>
        </Wrap>
      ) : null}

      {/* ── Kun tartibi ── */}
      {schedule.length > 0 ? (
        <>
          <Divider />
          <Wrap>
            <Reveal>
              <Heading>{t.schedule}</Heading>
            </Reveal>
            <div className="mx-auto max-w-sm">
              {schedule.map((item, i) => (
                <Reveal key={item.time + item.title + i} delay={i * 60} variant="left">
                  <div
                    className="flex items-center gap-4 border-l pb-6 pl-5 last:pb-0"
                    style={{ borderColor: `${UZ.gold}55` }}
                  >
                    <span
                      className="-ml-[1.6rem] block h-3 w-3 shrink-0 rotate-45"
                      style={{ background: UZ.gold }}
                    />
                    <span className="uz-serif w-16 text-xl" style={{ color: UZ.tealDeep }}>
                      {item.time}
                    </span>
                    <span style={{ color: UZ.ink }}>{item.title}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </>
      ) : null}

      {/* ── Tilaklar ── */}
      <WishesWall slug={invitation.slug} locale={invitation.locale} />

      {/* ── RSVP ── */}
      <Wrap>
        <Reveal>
          <Heading>{m.rsvpTitle}</Heading>
          <RsvpForm slug={invitation.slug} locale={invitation.locale} />
        </Reveal>
      </Wrap>

      {/* ── Sovg'a — to'q firuza panel (koshin uslubi urg'usi) ── */}
      {hasGift && gift?.cardNumber ? (
        <Wrap>
          <Reveal variant="scale">
            <div
              className="relative overflow-hidden rounded-2xl border px-6 py-10"
              style={{ background: UZ.tealDeep, borderColor: `${UZ.gold}55` }}
            >
              <GirihBackdrop
                id="gift-girih"
                className="pointer-events-none absolute inset-0"
                color={UZ.goldLight}
                opacity={0.14}
              />
              <div className="relative">
                <GiftBox
                  title={t.gift}
                  hint={t.giftHint}
                  note={gift.note ?? t.giftNote}
                  cardNumber={gift.cardNumber}
                  cardHolder={gift.cardHolder ?? `${invitation.groomName} ${invitation.brideName}`}
                  copyLabel={t.copy}
                  copiedLabel={t.copied}
                />
              </div>
            </div>
          </Reveal>
        </Wrap>
      ) : null}

      {/* ── Ulashish ── */}
      <Wrap>
        <Reveal>
          <p
            className="mb-5 text-center text-xs uppercase tracking-[0.3em]"
            style={{ color: UZ.turquoise }}
          >
            {t.share}
          </p>
          <ShareButtons
            url={inviteUrl}
            title={`${invitation.groomName} & ${invitation.brideName}`}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
        </Reveal>
      </Wrap>

      {/* ── Footer: islimiy burchaklar + rahmat ── */}
      <footer className="relative overflow-hidden px-6 pb-14 pt-6 text-center">
        <IslimiCorner
          flipY
          className="pointer-events-none absolute -left-2 bottom-2 h-24 w-24 opacity-40"
          color={UZ.gold}
        />
        <IslimiCorner
          flipX
          flipY
          className="pointer-events-none absolute -right-2 bottom-2 h-24 w-24 opacity-40"
          color={UZ.gold}
        />
        <div className="relative">
          <GirihStar className="mx-auto h-9 w-9" color={UZ.gold} />
          <p className="uz-serif mt-4 text-2xl italic" style={{ color: UZ.tealDeep }}>
            {ru ? 'Ждём вас!' : 'Sizni kutamiz!'}
          </p>
          {!invitation.isPremium ? (
            <p className="mt-3 text-xs" style={{ color: `${UZ.teal}99` }}>
              taklif.uz orqali yaratilgan
            </p>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
