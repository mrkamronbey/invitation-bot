import { type CreateInvitationInput, TEMPLATE_CATALOG } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import { confirmKeyboard, flowKeyboard, locationKeyboard, readyKeyboard } from '../keyboards/menu';
import type { BotContext, BotConversation } from '../context';

const t = getMessages('uz');
const m = t.bot;
const L = m.labels;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const TOTAL = 10;
const label = (n: number): string => m.step(n, TOTAL);

/** Bekor qilish signali — helperdan tashlaniladi, oqim boshida ushlanadi. */
class CancelError extends Error {}

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
  music: { url: string | undefined; source: 'none' | 'custom' };
}

async function cancelIfRequested(ctx: BotContext, text: string): Promise<void> {
  if (text === m.cancelButton) {
    await ctx.reply(m.cancelled, { reply_markup: { remove_keyboard: true } });
    throw new CancelError();
  }
}

async function uploadFile(
  conversation: BotConversation,
  ctx: BotContext,
  fileId: string,
  folder: string,
  contentType: string,
  ext: string,
): Promise<string | undefined> {
  return conversation.external(async () => {
    const file = await ctx.api.getFile(fileId);
    if (!file.file_path) return undefined;
    const resp = await fetch(
      `https://api.telegram.org/file/bot${container.env.botToken}/${file.file_path}`,
    );
    const bytes = new Uint8Array(await resp.arrayBuffer());
    const path = `${folder}/${container.ids.generate()}.${ext}`;
    const stored = await container.storage.upload({
      bucket: 'invitations',
      path,
      bytes,
      contentType,
    });
    return stored.url;
  });
}

async function askRequired(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
  prompt: string,
): Promise<string> {
  await ctx.reply(`${label(n)} · ${prompt}`, { reply_markup: flowKeyboard(false) });
  const res = await conversation.waitFor(':text');
  const txt = (res.message?.text ?? '').trim();
  await cancelIfRequested(ctx, txt);
  return txt;
}

async function askOptionalText(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
  prompt: string,
): Promise<string | undefined> {
  await ctx.reply(`${label(n)} · ${prompt}`, { reply_markup: flowKeyboard(true) });
  const res = await conversation.waitFor(':text');
  const txt = (res.message?.text ?? '').trim();
  await cancelIfRequested(ctx, txt);
  if (txt === m.skipButton || txt.length === 0) return undefined;
  return txt;
}

async function askDate(conversation: BotConversation, ctx: BotContext, n: number): Promise<string> {
  await ctx.reply(`${label(n)} · ${m.askDate}`, { reply_markup: flowKeyboard(false) });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    await cancelIfRequested(ctx, txt);
    if (DATE_RE.test(txt)) return txt;
    await ctx.reply(m.invalidDate);
  }
}

async function askTime(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<string | undefined> {
  await ctx.reply(`${label(n)} · ${m.askTime}`, { reply_markup: flowKeyboard(true) });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    await cancelIfRequested(ctx, txt);
    if (txt === m.skipButton) return undefined;
    if (TIME_RE.test(txt)) return txt;
    await ctx.reply(m.invalidTime);
  }
}

async function askLocation(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<{ lat: number; lng: number } | undefined> {
  await ctx.reply(`${label(n)} · ${m.askLocation}`, { reply_markup: locationKeyboard() });
  const res = await conversation.wait();
  const loc = res.message?.location;
  if (loc) return { lat: loc.latitude, lng: loc.longitude };
  await cancelIfRequested(ctx, (res.message?.text ?? '').trim());
  return undefined;
}

async function askCoverPhoto(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<string | undefined> {
  await ctx.reply(`${label(n)} · ${m.askCover}`, { reply_markup: flowKeyboard(true) });
  const res = await conversation.wait();
  const photos = res.message?.photo;
  const largest = photos?.[photos.length - 1];
  if (largest) return uploadFile(conversation, ctx, largest.file_id, 'covers', 'image/jpeg', 'jpg');
  await cancelIfRequested(ctx, (res.message?.text ?? '').trim());
  return undefined;
}

async function askMusic(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<{ url: string | undefined; source: 'none' | 'custom' }> {
  await ctx.reply(`${label(n)} · ${m.askMusic}`, { reply_markup: flowKeyboard(true) });
  const res = await conversation.wait();
  const audio = res.message?.audio ?? res.message?.voice;
  if (audio) {
    const url = await uploadFile(conversation, ctx, audio.file_id, 'music', 'audio/mpeg', 'mp3');
    return url ? { url, source: 'custom' } : { url: undefined, source: 'none' };
  }
  await cancelIfRequested(ctx, (res.message?.text ?? '').trim());
  return { url: undefined, source: 'none' };
}

async function collectFields(conversation: BotConversation, ctx: BotContext): Promise<Collected> {
  return {
    groomName: await askRequired(conversation, ctx, 1, m.askGroom),
    brideName: await askRequired(conversation, ctx, 2, m.askBride),
    eventDate: await askDate(conversation, ctx, 3),
    eventTime: await askTime(conversation, ctx, 4),
    venueName: await askOptionalText(conversation, ctx, 5, m.askVenue),
    location: await askLocation(conversation, ctx, 6),
    coverImageUrl: await askCoverPhoto(conversation, ctx, 7),
    story: await askOptionalText(conversation, ctx, 8, m.askStory),
    dressCode: await askOptionalText(conversation, ctx, 9, m.askDressCode),
    music: await askMusic(conversation, ctx, 10),
  };
}

function reviewText(templateId: string, d: Collected): string {
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
  const templateId = ctx.session.templateId ?? 'classic';
  const ownerId = ctx.session.ownerId;
  if (!ownerId) {
    await ctx.reply(t.common.error);
    return;
  }

  let data: Collected;
  try {
    for (;;) {
      data = await collectFields(conversation, ctx);
      await ctx.reply(reviewText(templateId, data), {
        parse_mode: 'Markdown',
        reply_markup: confirmKeyboard(),
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
    await ctx.reply(`${t.common.error}\n${result.error.message}`);
    return;
  }

  const link = `${container.env.siteUrl}/${result.value.slug}`;
  await ctx.reply(m.ready(link), { parse_mode: 'Markdown', reply_markup: readyKeyboard(link) });
}
