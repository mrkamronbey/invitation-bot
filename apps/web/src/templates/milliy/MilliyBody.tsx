import type { ReactNode } from 'react';
import type { Invitation } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';
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
import { CornerFlourish, GirihBackdrop, IslimiRozetka, Rozetka, UZ } from './UzOrnaments';

interface MilliyBodyProps {
  readonly invitation: Invitation;
}

/** Bo'lim sarlavhasi — minimalistik: nozik serif + qisqa oltin chiziq. */
function Heading({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <h2
        data-anim="letters"
        className="uz-serif text-xl uppercase tracking-[0.26em] sm:text-2xl"
        style={{ color: UZ.tealDeep }}
      >
        {children}
      </h2>
      <span
        data-anim="line"
        className="mt-4 block h-px w-12"
        style={{ background: `${UZ.gold}99` }}
      />
    </div>
  );
}

function Wrap({ children }: { readonly children: ReactNode }): ReactNode {
  return <section className="relative mx-auto w-full max-w-xl px-6 py-14">{children}</section>;
}

/** Bo'limlar orasidagi ajratgich — chiziq markazdan yoyiladi + kichik romb. */
function Divider(): ReactNode {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span data-anim="line" className="block h-px w-16" style={{ background: `${UZ.gold}66` }} />
      <span
        data-anim="zoom"
        className="block h-1.5 w-1.5 rotate-45"
        style={{ background: UZ.gold }}
      />
      <span data-anim="line" className="block h-px w-16" style={{ background: `${UZ.gold}66` }} />
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
    and: ru ? 'и' : 'va',
    scroll: ru ? 'листайте' : 'pastga suring',
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
    // Butun taklifnoma nafis serifda — sayt UI shrifti (Gilroy) bu yerga tushmaydi
    <div className="uz-serif relative text-[1.05rem]" style={{ color: UZ.ink }}>
      {/* ── Hero: aylanuvchi girih medalyon + chizilib chiquvchi naqshlar ── */}
      <header className="relative min-h-[92svh] overflow-hidden px-8 pb-14 pt-20 text-center">
        {/* orqa fon: katta girih rozetka — scroll bilan sekin aylanadi */}
        <div
          data-spin="22"
          data-parallax="0.12"
          className="pointer-events-none absolute left-1/2 top-[18%] w-[30rem] max-w-none -translate-x-1/2 opacity-[0.09]"
        >
          <IslimiRozetka className="w-full" />
        </div>

        {/* burchak bezaklari — o'zini chizadi */}
        <CornerFlourish
          data-anim="draw"
          className="absolute left-4 top-4 h-16 w-16"
          color={UZ.gold}
        />
        <CornerFlourish
          flipX
          data-anim="draw"
          className="absolute right-4 top-4 h-16 w-16"
          color={UZ.gold}
        />

        <div className="relative">
          <div data-anim="zoom">
            <Rozetka className="mx-auto h-12 w-12" />
          </div>

          <p
            data-anim="rise"
            className="uz-serif mt-7 text-[0.64rem] uppercase tracking-[0.32em]"
            style={{ color: UZ.teal }}
          >
            {t.welcome}
          </p>

          <h1
            className="uz-serif mt-12 uppercase leading-[1.2] tracking-[0.12em]"
            style={{ color: UZ.tealDeep }}
          >
            <span data-anim="letters" className="block text-[2.5rem] sm:text-6xl">
              {invitation.groomName}
            </span>
            <span
              data-anim="zoom"
              className="uz-script my-3 block text-4xl normal-case tracking-normal sm:text-5xl"
              style={{ color: UZ.gold }}
            >
              {t.and}
            </span>
            <span data-anim="letters" className="block text-[2.5rem] sm:text-6xl">
              {invitation.brideName}
            </span>
          </h1>

          <span
            data-anim="line"
            className="mx-auto mt-10 block h-px w-20"
            style={{ background: `${UZ.gold}99` }}
          />

          {/* pastga ishora — nozik pulsatsiya */}
          <div data-anim="rise" className="mt-14 flex flex-col items-center gap-2">
            <span
              className="uz-serif text-[0.58rem] uppercase tracking-[0.3em]"
              style={{ color: `${UZ.teal}aa` }}
            >
              {t.scroll}
            </span>
            <span className="uz-scroll-hint block h-8 w-px" style={{ background: `${UZ.gold}88` }} />
          </div>
        </div>
      </header>

      {/* ── Nikoh to'yi: ota-onalar + sana ── */}
      <Wrap>
        <div data-anim="rise">
          <Heading>{t.ceremony}</Heading>
        </div>
        <div data-anim="rise">
          <p className="text-center text-sm" style={{ color: UZ.teal }}>
            {t.withJoy}
          </p>
        </div>

        {hasParents ? (
          <div data-anim="rise">
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
          </div>
        ) : null}

        <div data-anim="rise">
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
        </div>
      </Wrap>

      {/* ── Albom ── */}
      {gallery.length > 0 ? (
        <>
          <Divider />
          <Wrap>
            <div data-anim="rise">
              <Heading>{t.story}</Heading>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(0, 6).map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  data-anim="zoom"
                  className={i === 0 ? 'col-span-2' : undefined}
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
                </div>
              ))}
            </div>
          </Wrap>
        </>
      ) : null}

      {/* ── Hikoya ── */}
      {invitation.story ? (
        <Wrap>
          <div data-anim="rise">
            <p
              className="uz-serif text-center text-2xl italic leading-relaxed sm:text-3xl"
              style={{ color: UZ.tealDeep }}
            >
              “{invitation.story}”
            </p>
          </div>
        </Wrap>
      ) : null}

      <Divider />

      {/* ── Ziyofat: kalendar + countdown ── */}
      <Wrap>
        <div data-anim="rise">
          <Heading>{t.reception}</Heading>
        </div>
        <div data-anim="zoom">
          <CalendarCard eventDate={invitation.eventDate} locale={invitation.locale} tone="light" />
        </div>
        <div className="mt-6">
          <div data-anim="rise">
            <AddToCalendar
              title={`${invitation.groomName} & ${invitation.brideName}`}
              eventDate={invitation.eventDate}
              eventTime={invitation.eventTime}
              location={invitation.venue?.address ?? invitation.venue?.name}
              details={invitation.story}
              label={t.addCal}
              tone="light"
            />
          </div>
        </div>
        <div className="mt-10">
          <div data-anim="rise">
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
          </div>
        </div>
      </Wrap>

      {/* ── Manzil ── */}
      {invitation.venue?.geo || invitation.venue?.mapUrl ? (
        <Wrap>
          <div data-anim="rise">
            <Heading>{t.location}</Heading>
          </div>
          {invitation.venue?.geo ? (
            <div data-anim="zoom">
              {/* nom/manzil yuqorida ko'rsatilgan — bu yerda faqat xarita
                  (MapBlock matnlari to'q mavzu uchun, och fonda o'qilmaydi) */}
              <MapBlock
                lat={invitation.venue.geo.lat}
                lng={invitation.venue.geo.lng}
                directionsLabel={t.directions}
              />
            </div>
          ) : null}
          {invitation.venue?.mapUrl ? (
            <div data-anim="rise">
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
            </div>
          ) : null}
        </Wrap>
      ) : null}

      {/* ── Kiyim uslubi ── */}
      {invitation.dressCode ? (
        <Wrap>
          <div data-anim="rise">
            <DressSwatches
              label={t.dress}
              text={invitation.dressCode}
              colors={[UZ.ivoryWarm, UZ.goldLight, UZ.teal]}
              tone="light"
            />
          </div>
        </Wrap>
      ) : null}

      {/* ── Kun tartibi ── */}
      {schedule.length > 0 ? (
        <>
          <Divider />
          <Wrap>
            <div data-anim="rise">
              <Heading>{t.schedule}</Heading>
            </div>
            <div className="mx-auto max-w-sm">
              {schedule.map((item, i) => (
                <div key={item.time + item.title + i} data-anim="rise">
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
                </div>
              ))}
            </div>
          </Wrap>
        </>
      ) : null}

      {/* ── Tilaklar ── */}
      <WishesWall slug={invitation.slug} locale={invitation.locale} />

      {/* ── RSVP ── */}
      <Wrap>
        <div data-anim="rise">
          <Heading>{m.rsvpTitle}</Heading>
          <RsvpForm slug={invitation.slug} locale={invitation.locale} />
        </div>
      </Wrap>

      {/* ── Sovg'a — to'q firuza panel (koshin uslubi urg'usi) ── */}
      {hasGift && gift?.cardNumber ? (
        <Wrap>
          <div data-anim="zoom">
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
          </div>
        </Wrap>
      ) : null}

      {/* ── Ulashish ── */}
      <Wrap>
        <div data-anim="rise">
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
        </div>
      </Wrap>

      {/* ── Footer: nozik rozetka + rahmat ── */}
      <footer className="relative overflow-hidden px-6 pb-16 pt-8 text-center">
        <CornerFlourish
          flipY
          className="absolute bottom-4 left-4 h-14 w-14 opacity-55"
          color={UZ.gold}
        />
        <CornerFlourish
          flipX
          flipY
          className="absolute bottom-4 right-4 h-14 w-14 opacity-55"
          color={UZ.gold}
        />
        <div className="relative">
          <Rozetka className="mx-auto h-10 w-10 opacity-95" />
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
