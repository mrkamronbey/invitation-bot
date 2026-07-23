import type { Bot } from 'grammy';
import { container } from '../composition';
import { manageKeyboard, mainReplyKeyboard } from '../keyboards/menu';
import { botText } from '../i18n';
import { ensureUser } from '../services/ensure-user';
import type { BotContext } from '../context';

/** Egadagi taklifnomalar ro'yxatini boshqaruv tugmalari bilan yuboradi. */
export async function sendMyInvites(ctx: BotContext): Promise<void> {
  const m = botText(ctx);
  const user = await ensureUser(ctx);
  if (!user) {
    await ctx.reply(m.errorGeneric);
    return;
  }

  const list = await container.listOwnerInvitations.execute(user.id);
  if (list.length === 0) {
    await ctx.reply(m.myInvitesEmpty, { reply_markup: mainReplyKeyboard(m) });
    return;
  }

  await ctx.reply(m.myInvitesTitle, { parse_mode: 'Markdown' });
  for (const inv of list) {
    const link = `${container.env.siteUrl}/i/${inv.slug}`;
    const title = `💍 ${inv.groomName} & ${inv.brideName}\n📅 ${inv.eventDate}${
      inv.eventTime ? ` · ${inv.eventTime}` : ''
    }`;
    await ctx.reply(title, { reply_markup: manageKeyboard(m, inv.id, link) });
  }
}

export function registerMyInvites(bot: Bot<BotContext>): void {
  bot.command('myinvites', (ctx) => sendMyInvites(ctx));
}
