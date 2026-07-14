import { type Bot, InlineKeyboard } from 'grammy';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import { ensureUser } from '../services/ensure-user';
import type { BotContext } from '../context';

const m = getMessages('uz').bot;

/** Egadagi taklifnomalar ro'yxatini yuboradi (buyruq va menyu tugmasi uchun). */
export async function sendMyInvites(ctx: BotContext): Promise<void> {
  const user = await ensureUser(ctx);
  if (!user) {
    await ctx.reply(getMessages('uz').common.error);
    return;
  }

  const list = await container.listOwnerInvitations.execute(user.id);
  if (list.length === 0) {
    await ctx.reply(m.myInvitesEmpty, {
      reply_markup: new InlineKeyboard().text(m.menuCreate, 'menu:new'),
    });
    return;
  }

  await ctx.reply(m.myInvitesTitle, { parse_mode: 'Markdown' });
  for (const inv of list) {
    const link = `${container.env.siteUrl}/${inv.slug}`;
    await ctx.reply(`💍 ${inv.groomName} & ${inv.brideName}`, {
      reply_markup: new InlineKeyboard().url(m.openButton, link),
    });
  }
}

export function registerMyInvites(bot: Bot<BotContext>): void {
  bot.command('myinvites', (ctx) => sendMyInvites(ctx));
}
