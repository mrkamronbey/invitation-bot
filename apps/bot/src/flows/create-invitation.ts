import type { CreateInvitationInput } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import { readyKeyboard, skipKeyboard } from '../keyboards/menu';
import type { BotContext, BotConversation } from '../context';

const t = getMessages('uz');
const m = t.bot;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const TOTAL = 10;
const label = (n: number): string => m.step(n, TOTAL);

// Telegram fayl (rasm/audio) yuklab, Supabase Storage'ga joylaydi.
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
  await ctx.reply(`${label(n)} · ${prompt}`);
  const res = await conversation.waitFor(':text');
  return (res.message?.text ?? '').trim();
}

async function askOptionalText(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
  prompt: string,
): Promise<string | undefined> {
  await ctx.reply(`${label(n)} · ${prompt}`, { reply_markup: skipKeyboard() });
  const res = await conversation.waitUntil(
    (c) => c.message?.text !== undefined || c.callbackQuery?.data === 'skip',
  );
  if (res.callbackQuery) {
    await res.answerCallbackQuery();
    return undefined;
  }
  const txt = (res.message?.text ?? '').trim();
  return txt.length > 0 ? txt : undefined;
}

async function askDate(conversation: BotConversation, ctx: BotContext, n: number): Promise<string> {
  await ctx.reply(`${label(n)} · ${m.askDate}`);
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    if (DATE_RE.test(txt)) return txt;
    await ctx.reply(m.invalidDate);
  }
}

async function askTime(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<string | undefined> {
  await ctx.reply(`${label(n)} · ${m.askTime}`, { reply_markup: skipKeyboard() });
  for (;;) {
    const res = await conversation.waitUntil(
      (c) => c.message?.text !== undefined || c.callbackQuery?.data === 'skip',
    );
    if (res.callbackQuery) {
      await res.answerCallbackQuery();
      return undefined;
    }
    const txt = (res.message?.text ?? '').trim();
    if (TIME_RE.test(txt)) return txt;
    await ctx.reply(m.invalidTime, { reply_markup: skipKeyboard() });
  }
}

async function askLocation(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<{ lat: number; lng: number } | undefined> {
  await ctx.reply(`${label(n)} · ${m.askLocation}`, { reply_markup: skipKeyboard() });
  const res = await conversation.waitUntil(
    (c) => c.message?.location !== undefined || c.callbackQuery?.data === 'skip',
  );
  if (res.callbackQuery) {
    await res.answerCallbackQuery();
    return undefined;
  }
  const loc = res.message?.location;
  return loc ? { lat: loc.latitude, lng: loc.longitude } : undefined;
}

async function askCoverPhoto(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<string | undefined> {
  await ctx.reply(`${label(n)} · ${m.askCover}`, { reply_markup: skipKeyboard() });
  const res = await conversation.waitUntil(
    (c) => (c.message?.photo?.length ?? 0) > 0 || c.callbackQuery?.data === 'skip',
  );
  if (res.callbackQuery) {
    await res.answerCallbackQuery();
    return undefined;
  }
  const photos = res.message?.photo;
  const largest = photos?.[photos.length - 1];
  if (!largest) return undefined;
  return uploadFile(conversation, ctx, largest.file_id, 'covers', 'image/jpeg', 'jpg');
}

async function askMusic(
  conversation: BotConversation,
  ctx: BotContext,
  n: number,
): Promise<{ url: string | undefined; source: 'none' | 'custom' }> {
  await ctx.reply(`${label(n)} · ${m.askMusic}`, { reply_markup: skipKeyboard() });
  const res = await conversation.waitUntil(
    (c) =>
      c.message?.audio !== undefined ||
      c.message?.voice !== undefined ||
      c.callbackQuery?.data === 'skip',
  );
  if (res.callbackQuery) {
    await res.answerCallbackQuery();
    return { url: undefined, source: 'none' };
  }
  const audio = res.message?.audio ?? res.message?.voice;
  if (!audio) return { url: undefined, source: 'none' };
  const url = await uploadFile(conversation, ctx, audio.file_id, 'music', 'audio/mpeg', 'mp3');
  return url ? { url, source: 'custom' } : { url: undefined, source: 'none' };
}

/** Taklifnoma yaratish FSM: qadamli savol-javob → CreateInvitationUseCase → havola. */
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

  const groomName = await askRequired(conversation, ctx, 1, m.askGroom);
  const brideName = await askRequired(conversation, ctx, 2, m.askBride);
  const eventDate = await askDate(conversation, ctx, 3);
  const eventTime = await askTime(conversation, ctx, 4);
  const venueName = await askOptionalText(conversation, ctx, 5, m.askVenue);
  const location = await askLocation(conversation, ctx, 6);
  const coverImageUrl = await askCoverPhoto(conversation, ctx, 7);
  const story = await askOptionalText(conversation, ctx, 8, m.askStory);
  const dressCode = await askOptionalText(conversation, ctx, 9, m.askDressCode);
  const music = await askMusic(conversation, ctx, 10);

  await ctx.reply(m.creating);

  const input: CreateInvitationInput = {
    ownerId,
    templateId: templateId as CreateInvitationInput['templateId'],
    groomName,
    brideName,
    eventDate,
    eventTime,
    venueName,
    location,
    story,
    dressCode,
    coverImageUrl,
    musicUrl: music.url,
    musicSource: music.source,
  };

  const result = await conversation.external(() => container.createInvitation.execute(input));
  if (!result.ok) {
    await ctx.reply(`${t.common.error}\n${result.error.message}`);
    return;
  }

  const link = `${container.env.siteUrl}/${result.value.slug}`;
  await ctx.reply(m.ready(link), { parse_mode: 'Markdown', reply_markup: readyKeyboard(link) });
}
