import { type CreateInvitationInput, DEFAULT_MUSIC, TEMPLATE_CATALOG } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import {
  afterCreateKeyboard,
  confirmKeyboard,
  dressChoicesKeyboard,
  flowKeyboard,
  gateKeyboard,
  locationKeyboard,
  mainReplyKeyboard,
  musicKeyboard,
  photosKeyboard,
  timeChoicesKeyboard,
} from '../keyboards/menu';
import { buildCalendar } from '../keyboards/calendar';
import { localeOf } from '../i18n';
import { parseDate, parseNames, parseTime } from '../services/parse';
import { uploadTelegramFile } from './shared';
import type { BotContext, BotConversation } from '../context';

/** Bekor qilish signali — helperdan tashlaniladi, oqim boshida ushlanadi. */
class CancelError extends Error {}
/** "Orqaga" — oldingi qadamga; "Qolganini o'tkazish" — ixtiyoriylarni tugatish. */
const BACK = Symbol('back');
const SKIPALL = Symbol('skipall');
type Ctrl<T> = T | typeof BACK | typeof SKIPALL;

const REQ_TOTAL = 5;
const OPT_TOTAL = 4;

interface Music {
  url: string | undefined;
  source: 'none' | 'custom' | 'default';
}

interface Collected {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  location?: { lat: number; lng: number };
  coverImageUrl?: string;
  gallery?: string[];
  story?: string;
  dressCode?: string;
  music: Music;
}

const MAX_PHOTOS = 8;

type Msg = ReturnType<typeof getMessages>['bot'];

function loc(ctx: BotContext): Msg {
  return getMessages(localeOf(ctx)).bot;
}

/** Progress ko'rsatkichi: "Asosiy · ▰▰▱ 2/5". */
function head(label: string, n: number, total: number): string {
  const bar = '▰'.repeat(n) + '▱'.repeat(Math.max(0, total - n));
  return `${label} · ${bar} ${n}/${total}`;
}

/** Boshqaruv tugmalari: bekor → throw, orqaga → BACK, qolganini → SKIPALL, aks holda null. */
async function readControl(
  ctx: BotContext,
  m: Msg,
  text: string,
): Promise<typeof BACK | typeof SKIPALL | null> {
  if (text === m.cancelButton) {
    await ctx.reply(m.cancelled, { reply_markup: { remove_keyboard: true } });
    throw new CancelError();
  }
  if (text === m.backButton) return BACK;
  if (text === m.skipRestButton) return SKIPALL;
  return null;
}

// ── Majburiy faza (Asosiy) ────────────────────────────────────────────────

/** Kuyov va kelin ismi — bitta savolda. */
async function askNames(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  canBack: boolean,
): Promise<typeof BACK | { groom: string; bride: string }> {
  await ctx.reply(`${head(m.phaseMain, 1, REQ_TOTAL)}\n${m.askNames}`, {
    reply_markup: flowKeyboard(m, { canBack }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (ctrl !== null) continue;
    const names = parseNames(txt);
    if (names) {
      await ctx.reply(`✅ 💍 ${names.groom} & ${names.bride}`);
      return names;
    }
    await ctx.reply(m.invalidNames);
  }
}

/** Sana — inline tugmali kalendar (bosib tanlash) yoki yozib (zaxira). */
async function askDatePicker(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  canBack: boolean,
): Promise<typeof BACK | string> {
  const todayIso = await conversation.external(() => new Date().toISOString().slice(0, 10));
  let year = Number(todayIso.slice(0, 4));
  let month0 = Number(todayIso.slice(5, 7)) - 1;
  const sent = await ctx.reply(`${head(m.phaseMain, n, REQ_TOTAL)}\n${m.askDate}`, {
    reply_markup: buildCalendar(m, year, month0, todayIso, canBack),
  });
  const chatId = ctx.chat?.id;

  for (;;) {
    const upd = await conversation.wait();
    const data = upd.callbackQuery?.data;
    if (data) {
      await upd.answerCallbackQuery();
      if (data === 'cal:noop') continue;
      if (data === 'cal:back') return BACK;
      if (data === 'cal:cancel') {
        await ctx.reply(m.cancelled, { reply_markup: { remove_keyboard: true } });
        throw new CancelError();
      }
      if (data.startsWith('cal:nav:')) {
        const parts = data.slice(8).split('-');
        year = Number(parts[0]);
        month0 = Number(parts[1]) - 1;
        if (chatId) {
          await ctx.api.editMessageReplyMarkup(chatId, sent.message_id, {
            reply_markup: buildCalendar(m, year, month0, todayIso, canBack),
          });
        }
        continue;
      }
      if (data.startsWith('cal:day:')) {
        const iso = data.slice(8);
        await ctx.reply(m.dateConfirmed(m.dateWords(iso)));
        return iso;
      }
      continue;
    }

    // Zaxira: matn bilan yozish (2026.09.15 / 15.09.2026 ...)
    const txt = (upd.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (ctrl === null && txt.length > 0) {
      const iso = parseDate(txt);
      if (iso) {
        await ctx.reply(m.dateConfirmed(m.dateWords(iso)));
        return iso;
      }
      await ctx.reply(m.invalidDate);
    }
  }
}

/** Vaqt — majburiy (tugmali tanlov yoki yozib). */
async function askTimeReq(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  canBack: boolean,
): Promise<typeof BACK | string> {
  await ctx.reply(`${head(m.phaseMain, n, REQ_TOTAL)}\n${m.askTime}`, {
    reply_markup: timeChoicesKeyboard(m, { canBack }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (ctrl !== null) continue;
    const hm = parseTime(txt);
    if (hm) return hm;
    await ctx.reply(m.invalidTime);
  }
}

async function askReqText(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  prompt: string,
  canBack: boolean,
): Promise<typeof BACK | string> {
  await ctx.reply(`${head(m.phaseMain, n, REQ_TOTAL)}\n${prompt}`, {
    reply_markup: flowKeyboard(m, { canBack }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (txt.length > 0 && ctrl === null) return txt;
    if (ctrl === null) await ctx.reply(prompt);
  }
}

/** Lokatsiya — majburiy (Telegram "joy yuborish"). */
async function askLocationReq(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  canBack: boolean,
): Promise<typeof BACK | { lat: number; lng: number }> {
  for (;;) {
    await ctx.reply(`${head(m.phaseMain, n, REQ_TOTAL)}\n${m.askLocation}`, {
      reply_markup: locationKeyboard(m, { canBack }),
    });
    const res = await conversation.wait();
    const geo = res.message?.location;
    if (geo) return { lat: geo.latitude, lng: geo.longitude };
    const ctrl = await readControl(ctx, m, (res.message?.text ?? '').trim());
    if (ctrl === BACK) return BACK;
    await ctx.reply(m.invalidLocation);
  }
}

/** Asosiy 5 maydon (ism, sana, vaqt, to'yxona, lokatsiya) — orqaga bilan. */
async function collectRequired(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  d: Collected,
): Promise<void> {
  let i = 0;
  while (i < REQ_TOTAL) {
    const canBack = i > 0;
    switch (i) {
      case 0: {
        const r = await askNames(conversation, ctx, m, canBack);
        if (r === BACK) break;
        d.groomName = r.groom;
        d.brideName = r.bride;
        i++;
        break;
      }
      case 1: {
        const r = await askDatePicker(conversation, ctx, m, 2, canBack);
        if (r === BACK) i--;
        else {
          d.eventDate = r;
          i++;
        }
        break;
      }
      case 2: {
        const r = await askTimeReq(conversation, ctx, m, 3, canBack);
        if (r === BACK) i--;
        else {
          d.eventTime = r;
          i++;
        }
        break;
      }
      case 3: {
        const r = await askReqText(conversation, ctx, m, 4, m.askVenue, canBack);
        if (r === BACK) i--;
        else {
          d.venueName = r;
          i++;
        }
        break;
      }
      default: {
        const r = await askLocationReq(conversation, ctx, m, 5, canBack);
        if (r === BACK) i--;
        else {
          d.location = r;
          i++;
        }
        break;
      }
    }
  }
}

// ── Ixtiyoriy faza (Qo'shimcha) ────────────────────────────────────────────

function optPrompt(m: Msg, n: number, prompt: string): string {
  return `${head(m.phaseExtra, n, OPT_TOTAL)}\n${prompt} (${m.optionalHint})`;
}

async function askOptText(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  prompt: string,
): Promise<Ctrl<string | undefined>> {
  await ctx.reply(optPrompt(m, n, prompt), {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true, skipRest: true }),
  });
  const res = await conversation.waitFor(':text');
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl !== null) return ctrl;
  if (txt === m.skipButton || txt.length === 0) return undefined;
  return txt;
}

async function askDress(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<string | undefined>> {
  await ctx.reply(optPrompt(m, n, m.askDressCode), {
    reply_markup: dressChoicesKeyboard(m, { optional: true, canBack: true, skipRest: true }),
  });
  const res = await conversation.waitFor(':text');
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl !== null) return ctrl;
  if (txt === m.skipButton || txt.length === 0) return undefined;
  return txt;
}

/** Rasm(lar) — bir nechta yuborish mumkin; birinchisi cover, qolgani galereya. */
async function askPhotos(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<string[]>> {
  const urls: string[] = [];
  await ctx.reply(optPrompt(m, n, m.askCover), {
    reply_markup: photosKeyboard(m, 0, { canBack: true, skipRest: true }),
  });
  for (;;) {
    const res = await conversation.wait();
    const photos = res.message?.photo;
    const largest = photos?.[photos.length - 1];
    if (largest) {
      const url = await uploadTelegramFile(
        conversation,
        ctx,
        largest.file_id,
        'covers',
        'image/jpeg',
        'jpg',
      );
      if (url) urls.push(url);
      if (urls.length >= MAX_PHOTOS) return urls;
      await ctx.reply(m.photoAdded(urls.length), {
        reply_markup: photosKeyboard(m, urls.length, { canBack: true, skipRest: true }),
      });
      continue;
    }
    const txt = (res.message?.text ?? '').trim();
    if (txt === m.photosDone || txt === m.skipButton) return urls;
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl !== null) return ctrl;
  }
}

async function askMusic(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<Music>> {
  await ctx.reply(optPrompt(m, n, m.askMusic), {
    reply_markup: musicKeyboard(m, { canBack: true, skipRest: true }),
  });
  for (;;) {
    const res = await conversation.wait();
    const audio = res.message?.audio ?? res.message?.voice;
    if (audio) {
      const url = await uploadTelegramFile(
        conversation,
        ctx,
        audio.file_id,
        'music',
        'audio/mpeg',
        'mp3',
      );
      return url ? { url, source: 'custom' } : { url: undefined, source: 'none' };
    }
    const txt = (res.message?.text ?? '').trim();

    const track = DEFAULT_MUSIC.find((t) => t.name === txt);
    if (track) return { url: track.url, source: 'default' };
    if (txt === m.musicNone || txt === m.skipButton) return { url: undefined, source: 'none' };

    if (txt === m.musicOwn) {
      const own = await askOwnMusic(conversation, ctx, m);
      if (own !== 'menu') return own;
      await ctx.reply(optPrompt(m, n, m.askMusic), {
        reply_markup: musicKeyboard(m, { canBack: true, skipRest: true }),
      });
      continue;
    }

    const ctrl = await readControl(ctx, m, txt);
    if (ctrl !== null) return ctrl;
  }
}

/** "O'z musiqam" — audio kutadi; ◀️ orqaga bosilса menyuga qaytadi. */
async function askOwnMusic(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
): Promise<Ctrl<Music> | 'menu'> {
  await ctx.reply(m.askMusicOwn, { reply_markup: flowKeyboard(m, { canBack: true }) });
  for (;;) {
    const res = await conversation.wait();
    const audio = res.message?.audio ?? res.message?.voice;
    if (audio) {
      const url = await uploadTelegramFile(
        conversation,
        ctx,
        audio.file_id,
        'music',
        'audio/mpeg',
        'mp3',
      );
      return url ? { url, source: 'custom' } : { url: undefined, source: 'none' };
    }
    const ctrl = await readControl(ctx, m, (res.message?.text ?? '').trim());
    if (ctrl === BACK) return 'menu';
    if (ctrl === SKIPALL) return SKIPALL;
  }
}

/**
 * Qo'shimcha 4 maydon (rasm, matn, kiyim, musiqa) — orqaga (birinchisidan
 * darvozaga) va "qolganini o'tkazish" bilan. 'gate' — darvozaga qaytish.
 */
async function collectOptional(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  d: Collected,
): Promise<'done' | 'gate'> {
  let i = 0;
  while (i < OPT_TOTAL) {
    const n = i + 1;
    let ctrl: typeof BACK | typeof SKIPALL | null = null;
    switch (i) {
      case 0: {
        const r = await askPhotos(conversation, ctx, m, n);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else if (r.length > 0) {
          d.coverImageUrl = r[0];
          d.gallery = r.slice(1);
        }
        break;
      }
      case 1: {
        const r = await askOptText(conversation, ctx, m, n, m.askStory);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.story = r;
        break;
      }
      case 2: {
        const r = await askDress(conversation, ctx, m, n);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.dressCode = r;
        break;
      }
      default: {
        const r = await askMusic(conversation, ctx, m, n);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.music = r;
        break;
      }
    }

    if (ctrl === SKIPALL) return 'done';
    if (ctrl === BACK) {
      if (i === 0) return 'gate';
      i--;
    } else {
      i++;
    }
  }
  return 'done';
}

/** Darvoza: ixtiyoriy ma'lumot qo'shiladimi? */
async function askGate(conversation: BotConversation, ctx: BotContext, m: Msg): Promise<boolean> {
  await ctx.reply(m.gateTitle, { parse_mode: 'Markdown', reply_markup: gateKeyboard(m) });
  const res = await conversation.waitUntil(
    (c) => c.callbackQuery?.data === 'gate:yes' || c.callbackQuery?.data === 'gate:no',
  );
  await res.answerCallbackQuery();
  return res.callbackQuery?.data === 'gate:yes';
}

function reviewText(m: Msg, templateId: string, d: Collected): string {
  const L = m.labels;
  const tplName = TEMPLATE_CATALOG.find((x) => x.id === templateId)?.name ?? templateId;
  return [
    m.reviewTitle,
    '',
    `🎨 ${L.template}: ${tplName}`,
    `💍 ${L.couple}: ${d.groomName} & ${d.brideName}`,
    `📅 ${L.date}: ${m.dateWords(d.eventDate)}${d.eventTime ? ` · ${d.eventTime}` : ''}`,
    `🏛 ${L.venue}: ${d.venueName ?? L.none}`,
    `📍 ${L.location}: ${d.location ? L.yes : L.none}`,
    `🖼 ${L.photo}: ${d.coverImageUrl ? `${L.yes} (${1 + (d.gallery?.length ?? 0)})` : L.none}`,
    `📝 ${L.story}: ${d.story ?? L.none}`,
    `👗 ${L.dress}: ${d.dressCode ?? L.none}`,
    `🎵 ${L.music}: ${d.music.source !== 'none' ? L.yes : L.none}`,
  ].join('\n');
}

/** Taklifnoma yaratish FSM: asosiy (5) → darvoza → qo'shimcha (4) → tasdiqlash → havola. */
export async function createInvitationFlow(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<void> {
  const m = loc(ctx);
  const templateId = ctx.session.templateId ?? 'royal';
  const ownerId = ctx.session.ownerId;
  if (!ownerId) {
    await ctx.reply(getMessages(localeOf(ctx)).common.error);
    return;
  }

  const d: Collected = {
    groomName: '',
    brideName: '',
    eventDate: '',
    music: { url: undefined, source: 'none' },
  };

  try {
    for (;;) {
      await collectRequired(conversation, ctx, m, d);
      // Darvoza + ixtiyoriy faza (orqaga darvozaga qaytishi mumkin)
      for (;;) {
        const wantsExtra = await askGate(conversation, ctx, m);
        if (!wantsExtra) break;
        const res = await collectOptional(conversation, ctx, m, d);
        if (res === 'gate') continue;
        break;
      }

      await ctx.reply(reviewText(m, templateId, d), {
        parse_mode: 'Markdown',
        reply_markup: confirmKeyboard(m),
      });
      const res = await conversation.waitUntil(
        (c) => c.callbackQuery?.data === 'confirm' || c.callbackQuery?.data === 'restart',
      );
      await res.answerCallbackQuery();
      if (res.callbackQuery?.data === 'confirm') break;
    }
  } catch (e) {
    if (e instanceof CancelError) return;
    throw e;
  }

  await ctx.reply(m.creating, { reply_markup: { remove_keyboard: true } });

  const input: CreateInvitationInput = {
    ownerId,
    templateId: templateId as CreateInvitationInput['templateId'],
    groomName: d.groomName,
    brideName: d.brideName,
    eventDate: d.eventDate,
    eventTime: d.eventTime,
    venueName: d.venueName,
    location: d.location,
    story: d.story,
    dressCode: d.dressCode,
    coverImageUrl: d.coverImageUrl,
    gallery: d.gallery,
    musicUrl: d.music.url,
    musicSource: d.music.source,
  };

  const result = await conversation.external(() => container.createInvitation.execute(input));
  if (!result.ok) {
    await ctx.reply(`${getMessages(localeOf(ctx)).common.error}\n${result.error.message}`, {
      reply_markup: mainReplyKeyboard(m),
    });
    return;
  }

  const link = `${container.env.siteUrl}/i/${result.value.slug}`;
  await ctx.reply(m.ready(link), {
    parse_mode: 'Markdown',
    reply_markup: afterCreateKeyboard(m, result.value.id, link),
  });
}
