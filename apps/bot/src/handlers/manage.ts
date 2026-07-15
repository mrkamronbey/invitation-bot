import type { Bot } from 'grammy';
import type { InvitationStats } from '@invitation/application';
import { container } from '../composition';
import { deleteConfirmKeyboard, mainReplyKeyboard } from '../keyboards/menu';
import { botText } from '../i18n';
import { ensureUser } from '../services/ensure-user';
import type { BotContext } from '../context';

type Msg = ReturnType<typeof botText>;

function statsText(m: Msg, s: InvitationStats): string {
  const head = `${m.statsTitle(s.groomName, s.brideName)}\n\n${m.statsSummary({
    responses: s.responses,
    attending: s.attendingResponses,
    declining: s.decliningResponses,
    guests: s.totalGuests,
  })}`;

  if (s.entries.length === 0) return `${head}\n\n${m.statsEmpty}`;

  const lines = s.entries
    .map((e) => (e.attending ? m.statsGuestYes(e.name, e.guestsCount) : m.statsGuestNo(e.name)))
    .join('\n');
  return `${head}\n\n${lines}`;
}

export function registerManage(bot: Bot<BotContext>): void {
  // ✏️ Tahrirlash → tahrirlash oqimiga kirish
  bot.callbackQuery(/^edit:(.+)$/, async (ctx) => {
    const id = ctx.match?.[1];
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!id || !user) return;
    ctx.session.editInvitationId = id;
    ctx.session.ownerId = user.id;
    await ctx.conversation.enter('edit-invitation');
  });

  // 📇 Shaxsiy havola → mehmon ismi bilan oqim
  bot.callbackQuery(/^guest:(.+)$/, async (ctx) => {
    const id = ctx.match?.[1];
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!id || !user) return;
    ctx.session.guestInvitationId = id;
    ctx.session.ownerId = user.id;
    await ctx.conversation.enter('guest-link');
  });

  // 📤 Ulashish uchun post — guruhga forward qilinadigan chiroyli xabar
  bot.callbackQuery(/^share:(.+)$/, async (ctx) => {
    const id = ctx.match?.[1];
    const m = botText(ctx);
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!id || !user) return;
    const inv = (await container.listOwnerInvitations.execute(user.id)).find((x) => x.id === id);
    if (!inv) {
      await ctx.reply(m.errorGeneric);
      return;
    }
    const url = `${container.env.siteUrl}/${inv.slug}`;
    const dateline = `${m.dateWords(inv.eventDate)}${inv.eventTime ? ` · ${inv.eventTime}` : ''}`;
    const caption = m.sharePost({
      groom: inv.groomName,
      bride: inv.brideName,
      dateline,
      venue: inv.venue?.name ?? '—',
      url,
    });
    if (inv.coverImageUrl) {
      try {
        await ctx.replyWithPhoto(inv.coverImageUrl, { caption, parse_mode: 'Markdown' });
        return;
      } catch {
        // Rasm yuborilmasa — matn bilan davom etamiz.
      }
    }
    await ctx.reply(caption, { parse_mode: 'Markdown' });
  });

  // 📊 Statistika
  bot.callbackQuery(/^stats:(.+)$/, async (ctx) => {
    const id = ctx.match?.[1];
    const m = botText(ctx);
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!id || !user) return;
    const res = await container.getInvitationStats.execute(id, user.id);
    if (!res.ok) {
      await ctx.reply(m.errorGeneric);
      return;
    }
    await ctx.reply(statsText(m, res.value), { parse_mode: 'Markdown' });
  });

  // 🗑 O'chirish — tasdiq so'raladi
  bot.callbackQuery(/^del:(.+)$/, async (ctx) => {
    const id = ctx.match?.[1];
    const m = botText(ctx);
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!id || !user) return;
    const inv = (await container.listOwnerInvitations.execute(user.id)).find((x) => x.id === id);
    if (!inv) {
      await ctx.reply(m.errorGeneric);
      return;
    }
    await ctx.reply(m.deleteConfirm(inv.groomName, inv.brideName), {
      parse_mode: 'Markdown',
      reply_markup: deleteConfirmKeyboard(m, id),
    });
  });

  // Tasdiqlandi → o'chirish
  bot.callbackQuery(/^delyes:(.+)$/, async (ctx) => {
    const id = ctx.match?.[1];
    const m = botText(ctx);
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!id || !user) return;
    const res = await container.deleteInvitation.execute({ invitationId: id, ownerId: user.id });
    await ctx.reply(res.ok ? m.deleted : m.errorGeneric, { reply_markup: mainReplyKeyboard(m) });
  });

  // O'chirish bekor qilindi
  bot.callbackQuery('delno', async (ctx) => {
    const m = botText(ctx);
    await ctx.answerCallbackQuery();
    await ctx.reply(m.cancelled, { reply_markup: mainReplyKeyboard(m) });
  });
}
