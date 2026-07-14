import { type CreateInvitationInput, TEMPLATE_CATALOG } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import {
  afterCreateKeyboard,
  confirmKeyboard,
  flowKeyboard,
  locationKeyboard,
  mainReplyKeyboard,
} from '../keyboards/menu';
import { localeOf } from '../i18n';
import { parseDate, parseTime } from '../services/parse';
import { uploadTelegramFile } from './shared';
import type { BotContext, BotConversation } from '../context';

/** Bekor qilish signali — helperdan tashlaniladi, oqim boshida ushlanadi. */
class CancelError extends Error {}
/** "Orqaga" signali — oldingi qadamga qaytish. */
const BACK = Symbol('back');
type OrBack<T> = T | typeof BACK;

const TOTAL = 10;

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

/** Boshqaruv tugmalarini ajratadi: bekor → throw, orqaga → BACK, aks holda null. */
async function readControl(ctx: BotContext, m: Msg, text: string): Promise<typeof BACK | null> {
  if (text === m.cancelButton) {
    await ctx.reply(m.cancelled, { reply_markup: { remove_keyboard: true } });
    throw new CancelError();
  }
  if (text === m.backButton) return BACK;
  return null;
}

async function askRequired(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  prompt: string,
  canBack: boolean,
): Promise<OrBack<string>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${prompt}`, {
    reply_markup: flowKeyboard(m, { canBack }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (txt.length > 0) return txt;
    await ctx.reply(prompt);
  }
}

async function askOptionalText(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  prompt: string,
): Promise<OrBack<string | undefined>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${prompt}`, {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true }),
  });
  const res = await conversation.waitFor(':text');
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl === BACK) return BACK;
  if (txt === m.skipButton || txt.length === 0) return undefined;
  return txt;
}

async function askDate(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
  canBack: boolean,
): Promise<OrBack<string>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${m.askDate}`, {
    reply_markup: flowKeyboard(m, { canBack }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    const iso = parseDate(txt);
    if (iso) return iso;
    await ctx.reply(m.invalidDate);
  }
}

async function askTime(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<OrBack<string | undefined>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${m.askTime}`, {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true }),
  });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    const ctrl = await readControl(ctx, m, txt);
    if (ctrl === BACK) return BACK;
    if (txt === m.skipButton) return undefined;
    const hm = parseTime(txt);
    if (hm) return hm;
    await ctx.reply(m.invalidTime);
  }
}

async function askLocation(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<OrBack<{ lat: number; lng: number } | undefined>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${m.askLocation}`, {
    reply_markup: locationKeyboard(m, true),
  });
  const res = await conversation.wait();
  const geo = res.message?.location;
  if (geo) return { lat: geo.latitude, lng: geo.longitude };
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl === BACK) return BACK;
  return undefined;
}

async function askCoverPhoto(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<OrBack<string | undefined>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${m.askCover}`, {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true }),
  });
  const res = await conversation.wait();
  const photos = res.message?.photo;
  const largest = photos?.[photos.length - 1];
  if (largest) {
    return uploadTelegramFile(conversation, ctx, largest.file_id, 'covers', 'image/jpeg', 'jpg');
  }
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl === BACK) return BACK;
  return undefined;
}

async function askMusic(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  n: number,
): Promise<OrBack<Music>> {
  await ctx.reply(`${m.step(n, TOTAL)} · ${m.askMusic}`, {
    reply_markup: flowKeyboard(m, { optional: true, canBack: true }),
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
  const txt = (res.message?.text ?? '').trim();
  const ctrl = await readControl(ctx, m, txt);
  if (ctrl === BACK) return BACK;
  return { url: undefined, source: 'none' };
}

/** Qadamli yig'ish — "orqaga" bilan navigatsiya qilinadi. */
async function collectFields(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
): Promise<Collected> {
  const d: Partial<Collected> = {};
  let i = 0;
  const back = (): void => {
    i = Math.max(0, i - 1);
  };

  while (i < TOTAL) {
    const canBack = i > 0;
    const step = i + 1;
    switch (i) {
      case 0: {
        const r = await askRequired(conversation, ctx, m, step, m.askGroom, canBack);
        if (r === BACK) back();
        else {
          d.groomName = r;
          i++;
        }
        break;
      }
      case 1: {
        const r = await askRequired(conversation, ctx, m, step, m.askBride, canBack);
        if (r === BACK) back();
        else {
          d.brideName = r;
          i++;
        }
        break;
      }
      case 2: {
        const r = await askDate(conversation, ctx, m, step, canBack);
        if (r === BACK) back();
        else {
          d.eventDate = r;
          i++;
        }
        break;
      }
      case 3: {
        const r = await askTime(conversation, ctx, m, step);
        if (r === BACK) back();
        else {
          d.eventTime = r;
          i++;
        }
        break;
      }
      case 4: {
        const r = await askOptionalText(conversation, ctx, m, step, m.askVenue);
        if (r === BACK) back();
        else {
          d.venueName = r;
          i++;
        }
        break;
      }
      case 5: {
        const r = await askLocation(conversation, ctx, m, step);
        if (r === BACK) back();
        else {
          d.location = r;
          i++;
        }
        break;
      }
      case 6: {
        const r = await askCoverPhoto(conversation, ctx, m, step);
        if (r === BACK) back();
        else {
          d.coverImageUrl = r;
          i++;
        }
        break;
      }
      case 7: {
        const r = await askOptionalText(conversation, ctx, m, step, m.askStory);
        if (r === BACK) back();
        else {
          d.story = r;
          i++;
        }
        break;
      }
      case 8: {
        const r = await askOptionalText(conversation, ctx, m, step, m.askDressCode);
        if (r === BACK) back();
        else {
          d.dressCode = r;
          i++;
        }
        break;
      }
      default: {
        const r = await askMusic(conversation, ctx, m, step);
        if (r === BACK) back();
        else {
          d.music = r;
          i++;
        }
        break;
      }
    }
  }

  return {
    groomName: d.groomName ?? '',
    brideName: d.brideName ?? '',
    eventDate: d.eventDate ?? '',
    eventTime: d.eventTime,
    venueName: d.venueName,
    location: d.location,
    coverImageUrl: d.coverImageUrl,
    story: d.story,
    dressCode: d.dressCode,
    music: d.music ?? { url: undefined, source: 'none' },
  };
}

function reviewText(m: Msg, templateId: string, d: Collected): string {
  const L = m.labels;
  const tplName = TEMPLATE_CATALOG.find((x) => x.id === templateId)?.name ?? templateId;
  return [
    m.reviewTitle,
    '',
    `🎨 ${L.template}: ${tplName}`,
    `💍 ${L.couple}: ${d.groomName} & ${d.brideName}`,
    `📅 ${L.date}: ${d.eventDate}${d.eventTime ? ` · ${d.eventTime}` : ''}`,
    `🏛 ${L.venue}: ${d.venueName ?? L.none}`,
    `📍 ${L.location}: ${d.location ? L.yes : L.none}`,
    `🖼 ${L.photo}: ${d.coverImageUrl ? L.yes : L.none}`,
    `📝 ${L.story}: ${d.story ?? L.none}`,
    `👗 ${L.dress}: ${d.dressCode ?? L.none}`,
    `🎵 ${L.music}: ${d.music.source === 'custom' ? L.yes : L.none}`,
  ].join('\n');
}

/** Taklifnoma yaratish FSM: qadamli savol-javob → tasdiqlash → use-case → havola. */
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

  let data: Collected;
  try {
    for (;;) {
      data = await collectFields(conversation, ctx, m);
      await ctx.reply(reviewText(m, templateId, data), {
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
    groomName: data.groomName,
    brideName: data.brideName,
    eventDate: data.eventDate,
    eventTime: data.eventTime,
    venueName: data.venueName,
    location: data.location,
    story: data.story,
    dressCode: data.dressCode,
    coverImageUrl: data.coverImageUrl,
    musicUrl: data.music.url,
    musicSource: data.music.source,
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
