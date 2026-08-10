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
import { ChateauHero } from './ChateauHero';

interface ChateauBodyProps {
  readonly invitation: Invitation;
}

/** Chateau bo'lim sarlavhasi — yashil serif katta harflar + kichik strelka bezak. */
function Heading({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <h2 className="chateau-serif text-2xl uppercase tracking-[0.22em] text-[#3a5a2c] sm:text-3xl">
        {children}
      </h2>
      <img
        src="/images/chateau/divider-arrow.webp"
        alt=""
        aria-hidden
        className="mt-3 h-2 w-24 opacity-70"
      />
    </div>
  );
}

function Wrap({ children }: { readonly children: ReactNode }): ReactNode {
  return <section className="relative mx-auto w-full max-w-xl px-6 py-14">{children}</section>;
}

/** Ornament divider (chateau ornament.webp). */
function Divider(): ReactNode {
  return (
    <div className="flex justify-center py-2">
      <img src="/images/chateau/ornament.webp" alt="" aria-hidden className="h-10 opacity-80" />
    </div>
  );
}

/**
 * Chateau taklifnoma tanasi (chungdoi chateau-green — "European Garden"):
 * och/oq fon, akvarel shato hero, yashil nafis serif, dala gullari aksenti.
 * Bo'limlar Royal bilan bir xil, faqat och bog' uslubida qayta bo'yalgan.
 * Data-driven: ota-onalar / kun tartibi / sovg'a faqat ma'lumot bo'lsa chiqadi.
 */
export function ChateauBody({ invitation }: ChateauBodyProps): ReactNode {
  const m = getMessages(invitation.locale).web;
  const ru = invitation.locale === 'ru';
  const dp = dateParts(invitation.eventDate, invitation.locale);

  const t = {
    welcome: ru ? 'Добро пожаловать на нашу свадьбу' : 'To‘yimizga xush kelibsiz',
    ceremony: ru ? 'О церемонии' : 'Nikoh marosimi',
    reception: ru ? 'Торжество' : 'Ziyofat',
    story: ru ? 'Наша история' : 'Bizning tariximiz',
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
    withJoy: ru
      ? 'С радостью объявляем о свадьбе'
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
  const hasGroomParents = Boolean(parents?.groom?.father || parents?.groom?.mother);
  const hasBrideParents = Boolean(parents?.bride?.father || parents?.bride?.mother);
  const hasParents = hasGroomParents || hasBrideParents;
  const schedule = invitation.schedule ?? [];
  const gift = invitation.gift;
  const hasGift = Boolean(gift?.cardNumber || gift?.cardHolder || gift?.note);
  const gallery = invitation.gallery;

  return (
    <div className="relative text-[#33472a]">
      {/* ── Hero: parallax bulutlar + akvarel shato ── */}
      <ChateauHero
        groom={invitation.groomName}
        bride={invitation.brideName}
        welcome={t.welcome}
      />

      {/* ── Marosim + ota-onalar ── */}
      <Wrap>
        <Reveal>
          <Heading>{t.ceremony}</Heading>
        </Reveal>
        <Reveal>
          <p className="text-center text-sm text-[#5a8040]">{t.withJoy}</p>
        </Reveal>

        {hasParents ? (
          <Reveal>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-[#7da55c]">
                  {t.parentsGroom}
                </p>
                {parents?.groom?.father ? (
                  <p className="mt-2 font-semibold text-[#3a5a2c]">{parents.groom.father}</p>
                ) : null}
                {parents?.groom?.mother ? (
                  <p className="font-semibold text-[#3a5a2c]">{parents.groom.mother}</p>
                ) : null}
              </div>
              <div className="border-l border-[#3a5a2c]/20">
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-[#7da55c]">
                  {t.parentsBride}
                </p>
                {parents?.bride?.father ? (
                  <p className="mt-2 font-semibold text-[#3a5a2c]">{parents.bride.father}</p>
                ) : null}
                {parents?.bride?.mother ? (
                  <p className="font-semibold text-[#3a5a2c]">{parents.bride.mother}</p>
                ) : null}
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Katta kalligrafik nomlar */}
        <Reveal>
          <div className="mt-10 text-center">
            <p className="chateau-serif text-4xl text-[#3a5a2c] sm:text-5xl">
              {invitation.groomName}
            </p>
            <span className="chateau-serif my-2 block text-2xl italic text-[#7da55c]">&amp;</span>
            <p className="chateau-serif text-4xl text-[#3a5a2c] sm:text-5xl">
              {invitation.brideName}
            </p>
          </div>
        </Reveal>

        {/* Joy + vaqt + sana */}
        <Reveal>
          <div className="mt-10 text-center">
            {invitation.venue?.name ? (
              <p className="chateau-serif text-2xl text-[#3a5a2c]">{invitation.venue.name}</p>
            ) : null}
            {invitation.venue?.address ? (
              <p className="mt-1 text-sm text-[#5a8040]">{invitation.venue.address}</p>
            ) : null}

            {invitation.eventTime ? (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7da55c]">{t.time}</p>
                <p className="chateau-serif mt-1 text-3xl text-[#3a5a2c]">{invitation.eventTime}</p>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-center gap-4 text-[#3a5a2c]">
              <span className="text-[0.65rem] uppercase tracking-[0.28em] sm:text-xs">
                {dp.weekday}
              </span>
              <span className="h-9 w-px bg-[#3a5a2c]/25" />
              <span className="chateau-serif text-4xl text-[#3a5a2c]">{dp.day}</span>
              <span className="h-9 w-px bg-[#3a5a2c]/25" />
              <span className="text-[0.65rem] uppercase tracking-[0.28em] sm:text-xs">
                {dp.month}
              </span>
            </div>
            <p className="chateau-serif mt-2 text-xl text-[#5a8040]">{dp.year}</p>
          </div>
        </Reveal>
      </Wrap>

      {/* ── Our story — galereya (masonry) ── */}
      {gallery.length > 0 ? (
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
                <div className="overflow-hidden rounded-xl shadow-[0_12px_30px_-14px_rgba(58,90,44,0.45)]">
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
      ) : null}

      {/* ── Hikoya ── */}
      {invitation.story ? (
        <Wrap>
          <Reveal>
            <p className="chateau-serif text-center text-2xl italic leading-relaxed text-[#3a5a2c] sm:text-3xl">
              “{invitation.story}”
            </p>
          </Reveal>
        </Wrap>
      ) : null}

      <Divider />

      {/* ── Ziyofat: kalendar + add-to-calendar + countdown ── */}
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
            <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-[#7da55c]">
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#3a5a2c] px-7 py-3 text-sm uppercase tracking-[0.16em] text-[#fbfaf3] transition-colors hover:bg-[#2e4a22]"
                >
                  {t.directions}
                </a>
              </div>
            </Reveal>
          ) : null}
        </Wrap>
      ) : null}

      {/* ── Dress code ── */}
      {invitation.dressCode ? (
        <Wrap>
          <Reveal>
            <DressSwatches
              label={t.dress}
              text={invitation.dressCode}
              colors={['#e8f0dc', '#7da55c', '#3a5a2c']}
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
                  <div className="flex items-center gap-4 border-l border-[#3a5a2c]/25 pb-6 pl-5 last:pb-0">
                    <span className="relative -ml-[1.6rem] flex h-3 w-3 shrink-0 rounded-full bg-[#5a8040]" />
                    <span className="chateau-serif w-16 text-xl text-[#3a5a2c]">{item.time}</span>
                    <span className="text-[#4a5f3d]">{item.title}</span>
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

      {/* ── Sovg'a ── */}
      {hasGift && gift?.cardNumber ? (
        <Wrap>
          <Reveal variant="scale">
            <GiftBox
              title={t.gift}
              hint={t.giftHint}
              note={gift.note ?? t.giftNote}
              cardNumber={gift.cardNumber}
              cardHolder={gift.cardHolder ?? `${invitation.groomName} ${invitation.brideName}`}
              copyLabel={t.copy}
              copiedLabel={t.copied}
            />
          </Reveal>
        </Wrap>
      ) : null}

      {/* ── Ulashish ── */}
      <Wrap>
        <Reveal>
          <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-[#7da55c]">
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

      {/* ── Footer ── */}
      <footer className="flex flex-col items-center px-6 pb-14 pt-4 text-center">
        <img src="/images/chateau/hoanho3-1.webp" alt="" aria-hidden className="h-28 opacity-90" />
        <p className="chateau-serif mt-4 text-2xl italic text-[#3a5a2c]">
          {ru ? 'Ждём вас!' : 'Sizni kutamiz!'}
        </p>
        {!invitation.isPremium ? (
          <p className="mt-3 text-xs text-[#5a8040]/60">taklif.uz orqali yaratilgan</p>
        ) : null}
      </footer>
    </div>
  );
}
