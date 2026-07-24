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
import { Bloom } from './RoyalFlora';
import { RoyalDivider } from './RoyalDivider';
import { dateParts } from './royalDate';

interface RoyalBodyProps {
  readonly invitation: Invitation;
}

/** Royal sarlavha — tepasida oltin barg aksenti (flower-6), oltin serif + shimmer chiziq. */
function Heading({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <Bloom n={6} className="mb-1 h-10 w-16 opacity-90" />
      <h2 className="font-display text-3xl tracking-[0.12em] text-gold-light sm:text-4xl">
        {children}
      </h2>
      <span className="gold-shimmer mt-3 h-px w-16 bg-gold-light" />
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
      className={`pointer-events-none absolute top-1/2 hidden h-[70%] w-40 -translate-y-1/2 opacity-40 animate-float sm:block ${pos}`}
    />
  );
}

/**
 * Royal taklifnoma tanasi (to'q zumrad, oltin+oq atirgul mavzu — royal-v2-green).
 * Anatomiya: marosim (ota-onalar) → album (2×2) → hikoya → ziyofat
 * (kalendar+countdown) → dress-code → kun tartibi → tilaklar → RSVP → sovg'a → footer.
 * NB: ota-onalar, kun tartibi va sovg'a — data-driven: faqat ma'lumot kiritilgan
 * bo'lsa ko'rsatiladi (aks holda bo'lim yashiriladi, soxta ma'lumot chiqmaydi).
 */
export async function RoyalBody({ invitation }: RoyalBodyProps): Promise<ReactNode> {
  const m = getMessages(invitation.locale).web;
  const ru = invitation.locale === 'ru';
  const dp = dateParts(invitation.eventDate, invitation.locale);

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
    parentsNote: ru ? 'Родители' : 'Ota-onalar',
    withJoy: ru
      ? 'С радостью объявляем о свадьбе наших детей'
      : 'Farzandlarimiz to‘yini quvonch bilan e’lon qilamiz',
    groomSide: ru ? 'Жених' : 'Kuyov',
    brideSide: ru ? 'Невеста' : 'Kelin',
    parentsGroom: ru ? 'Родители жениха' : 'Kuyov ota-onasi',
    parentsBride: ru ? 'Родители невесты' : 'Kelin ota-onasi',
    location: ru ? 'Как добраться' : 'Manzil',
    directions: ru ? 'Маршрут' : 'Yo‘l ko‘rsatish',
    share: ru ? 'Поделиться' : 'Ulashing',
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const inviteUrl = `${siteUrl}/i/${invitation.slug}`;

  // Data-driven bo'limlar — faqat ma'lumot bo'lsa ko'rsatiladi
  const parents = invitation.parents;
  const hasGroomParents = Boolean(parents?.groom?.father || parents?.groom?.mother);
  const hasBrideParents = Boolean(parents?.bride?.father || parents?.bride?.mother);
  const hasParents = hasGroomParents || hasBrideParents;
  const schedule = invitation.schedule ?? [];
  const gift = invitation.gift;
  const hasGift = Boolean(gift?.cardNumber || gift?.cardHolder || gift?.note);

  return (
    <div className="text-ivory">
      {/* Marosim ma'lumoti + ota-onalar (namuna) */}
      <Wrap>
        <SideSpray side="left" />
        <Reveal>
          <Heading>{t.ceremony}</Heading>
        </Reveal>
        <Reveal>
          <p className="text-center text-sm uppercase tracking-[0.2em] text-ivory/70">
            {t.withJoy}
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-8 text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-light/80">
              {t.groomSide}
            </p>
            <p className="mt-2 font-display text-4xl text-ivory sm:text-5xl">
              {invitation.groomName}
            </p>
            <span className="my-4 block font-display text-3xl italic text-gold-light">&amp;</span>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-light/80">
              {t.brideSide}
            </p>
            <p className="mt-2 font-display text-4xl text-ivory sm:text-5xl">
              {invitation.brideName}
            </p>

            {/* Ota-onalar (bor bo'lsa) — ikki ustun */}
            {hasParents ? (
              <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-6">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-light/70">
                    {t.parentsGroom}
                  </p>
                  {parents?.groom?.father ? (
                    <p className="mt-1 text-sm text-ivory/85">{parents.groom.father}</p>
                  ) : null}
                  {parents?.groom?.mother ? (
                    <p className="text-sm text-ivory/85">{parents.groom.mother}</p>
                  ) : null}
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-gold-light/70">
                    {t.parentsBride}
                  </p>
                  {parents?.bride?.father ? (
                    <p className="mt-1 text-sm text-ivory/85">{parents.bride.father}</p>
                  ) : null}
                  {parents?.bride?.mother ? (
                    <p className="text-sm text-ivory/85">{parents.bride.mother}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Sana bloki — HAFTA-KUNI | KUN | OY / YIL */}
            <div className="mt-7 flex items-center justify-center gap-4 text-ivory/90">
              <span className="text-[0.65rem] uppercase tracking-[0.28em] sm:text-xs">
                {dp.weekday}
              </span>
              <span className="h-9 w-px bg-gold-light/50" />
              <span className="font-display text-4xl text-gold-light">{dp.day}</span>
              <span className="h-9 w-px bg-gold-light/50" />
              <span className="text-[0.65rem] uppercase tracking-[0.28em] sm:text-xs">
                {dp.month}
              </span>
            </div>
            <p className="mt-1 text-sm tracking-[0.3em] text-ivory/70">
              {dp.year}
              {invitation.eventTime ? ` · ${invitation.eventTime}` : ''}
            </p>
            {invitation.venue?.name ? (
              <p className="mt-3 text-lg text-gold-light">{invitation.venue.name}</p>
            ) : null}
            {invitation.venue?.address ? (
              <p className="mt-1 text-sm text-ivory/55">{invitation.venue.address}</p>
            ) : null}
          </div>
        </Reveal>
      </Wrap>

      <RoyalDivider />

      {/* Album — 2×2 to'g'ri to'r (oltin qirrali) */}
      {invitation.gallery.length > 0 ? (
        <Wrap>
          <SideSpray side="right" />
          <Reveal>
            <Heading>{t.album}</Heading>
          </Reveal>
          <div className="grid grid-cols-2 gap-3">
            {invitation.gallery.slice(0, 6).map((src, i) => (
              <Reveal key={`${src}-${i}`} delay={i * 60} variant={i % 2 === 0 ? 'left' : 'right'}>
                <div className="overflow-hidden rounded-md border border-gold-light/40 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
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

      <RoyalDivider variant="fleur" />

      {/* Ziyofat + kalendar + Add-to-Calendar + countdown */}
      <Wrap>
        <SideSpray side="left" />
        <Reveal>
          <Heading>{t.reception}</Heading>
        </Reveal>
        <Reveal variant="scale">
          <CalendarCard eventDate={invitation.eventDate} locale={invitation.locale} tone="dark" />
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

      {/* Manzil + xarita (geo yoki Yandex havola bo'lsa) */}
      {invitation.venue?.geo || invitation.venue?.mapUrl ? (
        <Wrap>
          <Reveal>
            <Heading>{t.location}</Heading>
          </Reveal>
          {invitation.venue?.name ? (
            <Reveal>
              <p className="mb-5 text-center text-lg text-gold-light">{invitation.venue.name}</p>
            </Reveal>
          ) : null}
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
                  className="inline-flex items-center gap-2 rounded-full border border-gold-light/50 bg-gold-light/10 px-7 py-3 text-sm uppercase tracking-[0.18em] text-gold-light transition-colors hover:bg-gold-light/20"
                >
                  {t.directions}
                </a>
              </div>
            </Reveal>
          ) : null}
        </Wrap>
      ) : null}

      {/* Dress code */}
      {invitation.dressCode ? (
        <Wrap>
          <Reveal>
            <DressSwatches
              label={t.dress}
              text={invitation.dressCode}
              colors={['#f4efe3', '#d8bd82', '#0f3d2e']}
              tone="dark"
            />
          </Reveal>
        </Wrap>
      ) : null}

      {/* Kun tartibi (timeline) — faqat ma'lumot bo'lsa */}
      {schedule.length > 0 ? (
        <>
          <RoyalDivider />
          <Wrap>
            <SideSpray side="right" />
            <Reveal>
              <Heading>{t.schedule}</Heading>
            </Reveal>
            <div className="mx-auto max-w-sm">
              {schedule.map((item, i) => (
                <Reveal key={item.time + item.title + i} delay={i * 60} variant="left">
                  <div className="flex items-center gap-4 border-l border-gold-light/30 pb-6 pl-5 last:pb-0">
                    <span className="relative -ml-[1.6rem] flex h-3 w-3 shrink-0 rounded-full bg-gold-light">
                      <span className="absolute inset-0 animate-ping rounded-full bg-gold-light/50" />
                    </span>
                    <span className="w-16 font-display text-xl text-gold-light">{item.time}</span>
                    <span className="text-ivory/85">{item.title}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </>
      ) : null}

      {/* Tilaklar (to'q mavzuga moslash) */}
      <div className="[&_blockquote]:text-ivory/90 [&_figure]:!border-gold-light/20 [&_figure]:!bg-white/[0.04] [&_h2]:!text-gold-light">
        <WishesWall slug={invitation.slug} locale={invitation.locale} />
      </div>

      {/* RSVP */}
      <Wrap>
        <Reveal>
          <Heading>{m.rsvpTitle}</Heading>
          <RsvpForm slug={invitation.slug} locale={invitation.locale} />
        </Reveal>
      </Wrap>

      {/* Sovg'a qutisi — faqat karta ma'lumoti bo'lsa */}
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

      {/* Ulashish */}
      <Wrap>
        <Reveal>
          <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-gold-light/80">
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

      {/* Footer — lavr gulchambar + rahmat */}
      <footer className="flex flex-col items-center px-6 pb-12 pt-4 text-center">
        <Bloom n={4} className="h-24 w-72 sm:h-28 sm:w-96" />
        <p className="mt-4 font-display text-2xl italic text-gold-light">
          {ru ? 'Ждём вас!' : 'Sizni kutamiz!'}
        </p>
        {!invitation.isPremium ? (
          <p className="mt-3 text-xs text-ivory/35">taklif.uz orqali yaratilgan</p>
        ) : null}
      </footer>
    </div>
  );
}
