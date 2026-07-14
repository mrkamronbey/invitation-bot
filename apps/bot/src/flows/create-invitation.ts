import type { CreateInvitationInput } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import type { BotContext, BotConversation } from '../context';

const m = getMessages('uz');
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isSkip = (text: string): boolean => text === '-' || text.toLowerCase() === '/skip';

async function askText(
  conversation: BotConversation,
  ctx: BotContext,
  prompt: string,
): Promise<string> {
  await ctx.reply(prompt);
  const res = await conversation.waitFor(':text');
  return (res.message?.text ?? '').trim();
}

async function askOptional(
  conversation: BotConversation,
  ctx: BotContext,
  prompt: string,
): Promise<string | undefined> {
  const text = await askText(conversation, ctx, prompt);
  return isSkip(text) ? undefined : text;
}

async function askDate(conversation: BotConversation, ctx: BotContext): Promise<string> {
  for (;;) {
    const text = await askText(conversation, ctx, m.bot.askDate);
    if (DATE_RE.test(text)) return text;
    await ctx.reply(m.bot.invalidDate);
  }
}

async function askLocation(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<{ lat: number; lng: number } | undefined> {
  await ctx.reply(m.bot.askLocation);
  const res = await conversation.wait();
  const loc = res.message?.location;
  return loc ? { lat: loc.latitude, lng: loc.longitude } : undefined;
}

async function askCoverPhoto(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<string | undefined> {
  await ctx.reply(m.bot.askCover);
  const res = await conversation.wait();
  const photos = res.message?.photo;
  if (!photos || photos.length === 0) return undefined;
  const largest = photos[photos.length - 1];
  if (!largest) return undefined;
  const fileId = largest.file_id;

  return conversation.external(async () => {
    const file = await ctx.api.getFile(fileId);
    if (!file.file_path) return undefined;
    const url = `https://api.telegram.org/file/bot${container.env.botToken}/${file.file_path}`;
    const resp = await fetch(url);
    const bytes = new Uint8Array(await resp.arrayBuffer());
    const path = `covers/${container.ids.generate()}.jpg`;
    const stored = await container.storage.upload({
      bucket: 'invitations',
      path,
      bytes,
      contentType: 'image/jpeg',
    });
    return stored.url;
  });
}

async function askMusic(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<{ url: string | undefined; source: 'none' | 'custom' }> {
  await ctx.reply(m.bot.askMusic);
  const res = await conversation.wait();
  const audio = res.message?.audio ?? res.message?.voice;
  if (!audio) return { url: undefined, source: 'none' };
  const fileId = audio.file_id;

  const url = await conversation.external(async () => {
    const file = await ctx.api.getFile(fileId);
    if (!file.file_path) return undefined;
    const resp = await fetch(
      `https://api.telegram.org/file/bot${container.env.botToken}/${file.file_path}`,
    );
    const bytes = new Uint8Array(await resp.arrayBuffer());
    const path = `music/${container.ids.generate()}.mp3`;
    const stored = await container.storage.upload({
      bucket: 'invitations',
      path,
      bytes,
      contentType: 'audio/mpeg',
    });
    return stored.url;
  });

  return url ? { url, source: 'custom' } : { url: undefined, source: 'none' };
}

/** Taklifnoma yaratish FSM: savol-javob → CreateInvitationUseCase → havola. */
export async function createInvitationFlow(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<void> {
  const templateId = ctx.session.templateId ?? 'classic';
  const ownerId = ctx.session.ownerId;
  if (!ownerId) {
    await ctx.reply(m.common.error);
    return;
  }

  const groomName = await askText(conversation, ctx, m.bot.askGroom);
  const brideName = await askText(conversation, ctx, m.bot.askBride);
  const eventDate = await askDate(conversation, ctx);
  const eventTime = await askOptional(conversation, ctx, m.bot.askTime);
  const venueName = await askOptional(conversation, ctx, m.bot.askVenue);
  const location = await askLocation(conversation, ctx);
  const coverImageUrl = await askCoverPhoto(conversation, ctx);
  const story = await askOptional(conversation, ctx, m.bot.askStory);
  const dressCode = await askOptional(conversation, ctx, m.bot.askDressCode);
  const music = await askMusic(conversation, ctx);

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
    await ctx.reply(`${m.common.error}\n${result.error.message}`);
    return;
  }

  const link = `${container.env.siteUrl}/${result.value.slug}`;
  await ctx.reply(m.bot.ready(link));
}
