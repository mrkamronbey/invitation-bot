import { type CreateInvitationInput, TEMPLATE_CATALOG } from '@invitation/contracts';
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
  timeChoicesKeyboard,
} from '../keyboards/menu';
import { localeOf } from '../i18n';
import { parseDate, parseTime } from '../services/parse';
import { uploadTelegramFile } from './shared';
import type { BotContext, BotConversation } from '../context';

/** Bekor qilish signali — helperdan tashlaniladi, oqim boshida ushlanadi. */
class CancelError extends Error {}
/** "Orqaga" — oldingi qadamga; "Qolganini o'tkazish" — ixtiyoriylarni tugatish. */
const BACK = Symbol('back');
const SKIPALL = Symbol('skipall');
type Ctrl<T> = T | typeof BACK | typeof SKIPALL;

const REQ_TOTAL = 3;
const OPT_TOTAL = 7;

interface Music {
  url: string | undefined;
  source: 'none' | 'custom';
}

interface Collected {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  location?: { lat: number; lng: number };
  coverImageUrl?: string;
  story?: string;
  dressCode?: string;
  music: Music;
}

type Msg = ReturnType<typeof getMessages>['bot'];

function loc(ctx: BotContext): Msg {
  return getMessages(localeOf(ctx)).bot;
}

/** Progress ko'rsatkichi: "Asosiy · ▰▰▱ 2/3". */
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

async function askRequiredText(
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

async function askDate(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  canBack: boolean,
): Promise<typeof BACK | string> {
  await ctx.reply(`${head(m.phaseMain, 3, REQ_TOTAL)}\n${m.askDate}`, {
    reply_markup: flowKeyboard(m, { canBack }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (ctrl !== null) continue;
    const iso = parseDate(txt);
    if (iso) {
      await ctx.reply(m.dateConfirmed(m.dateWords(iso)));
      return iso;
    }
    await ctx.reply(m.invalidDate);
  }
}

/** Asosiy 3 maydon (kuyov, kelin, sana) — orqaga bilan. */
async function collectRequired(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  d: Collected,
): Promise<void> {
  let i = 0;
  while (i < REQ_TOTAL) {
    const canBack = i > 0;
    if (i === 0) {
      const r = await askRequiredText(conversation, ctx, m, 1, m.askGroom, canBack);
      if (r === BACK) i = Math.max(0, i - 1);
      else {
        d.groomName = r;
        i++;
      }
    } else if (i === 1) {
      const r = await askRequiredText(conversation, ctx, m, 2, m.askBride, canBack);
      if (r === BACK) i--;
      else {
        d.brideName = r;
        i++;
      }
    } else {
      const r = await askDate(conversation, ctx, m, canBack);
      if (r === BACK) i--;
      else {
        d.eventDate = r;
        i++;
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

async function askTime(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<string | undefined>> {
  await ctx.reply(optPrompt(m, n, m.askTime), {
    reply_markup: timeChoicesKeyboard(m, { canBack: true, skipRest: true }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl !== null) return ctrl;
    if (txt === m.skipButton) return undefined;
    const hm = parseTime(txt);
    if (hm) return hm;
    await ctx.reply(m.invalidTime);
  }
}

async function askDress(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<string | undefined>> {
  await ctx.reply(optPrompt(m, n, m.askDressCode), {
    reply_markup: dressChoicesKeyboard(m, { canBack: true, skipRest: true }),
  });
  const res = await conversation.waitFor(':text');
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl !== null) return ctrl;
  if (txt === m.skipButton || txt.length === 0) return undefined;
  return txt;
}

async function askLocation(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<{ lat: number; lng: number } | undefined>> {
  await ctx.reply(optPrompt(m, n, m.askLocation), {
    reply_markup: locationKeyboard(m, { canBack: true, skipRest: true }),
  });
  const res = await conversation.wait();
  const geo = res.message?.location;
  if (geo) return { lat: geo.latitude, lng: geo.longitude };
  const ctrl = await readControl(ctx, m, (res.message?.text ?? '').trim());
  return ctrl !== null ? ctrl : undefined;
}

async function askCover(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<string | undefined>> {
  await ctx.reply(optPrompt(m, n, m.askCover), {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true, skipRest: true }),
  });
  const res = await conversation.wait();
  const photos = res.message?.photo;
  const largest = photos?.[photos.length - 1];
  if (largest) {
    return uploadTelegramFile(conversation, ctx, largest.file_id, 'covers', 'image/jpeg', 'jpg');
  }
  const ctrl = await readControl(ctx, m, (res.message?.text ?? '').trim());
  return ctrl !== null ? ctrl : undefined;
}

async function askMusic(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<Ctrl<Music>> {
  await ctx.reply(optPrompt(m, n, m.askMusic), {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true, skipRest: true }),
  });
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
  if (ctrl !== null) return ctrl;
  return { url: undefined, source: 'none' };
}

/**
 * Qo'shimcha 7 maydon — orqaga (birinchisidan darvozaga qaytadi) va
 * "qolganini o'tkazish" bilan. 'gate' — darvozaga qайtish, aks holda tugadi.
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
        const r = await askTime(conversation, ctx, m, n);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.eventTime = r;
        break;
      }
      case 1: {
        const r = await askOptText(conversation, ctx, m, n, m.askVenue);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.venueName = r;
        break;
      }
      case 2: {
        const r = await askLocation(conversation, ctx, m, n);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.location = r;
        break;
      }
      case 3: {
        const r = await askCover(conversation, ctx, m, n);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.coverImageUrl = r;
        break;
      }
      case 4: {
        const r = await askOptText(conversation, ctx, m, n, m.askStory);
        if (r === BACK || r === SKIPALL) ctrl = r;
        else d.story = r;
        break;
      }
      case 5: {
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
    `🖼 ${L.photo}: ${d.coverImageUrl ? L.yes : L.none}`,
    `📝 ${L.story}: ${d.story ?? L.none}`,
    `👗 ${L.dress}: ${d.dressCode ?? L.none}`,
    `🎵 ${L.music}: ${d.music.source === 'custom' ? L.yes : L.none}`,
  ].join('\n');
}

/** Taklifnoma yaratish FSM: asosiy → darvoza → qo'shimcha → tasdiqlash → havola. */
export async function createInvitationFlow(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<void> {
  const m = loc(ctx);
  const templateId = ctx.session.templateId ?? 'classic';
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

  const link = `${container.env.siteUrl}/${result.value.slug}`;
  await ctx.reply(m.ready(link), {
    parse_mode: 'Markdown',
    reply_markup: afterCreateKeyboard(m, result.value.id, link),
  });
}
