import type { Bot } from 'grammy';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import { ensureUser } from '../services/ensure-user';
import type { BotContext } from '../context';

const m = getMessages('uz');

export function registerMyInvites(bot: Bot<BotContext>): void {
  bot.command('myinvites', async (ctx) => {
    const user = await ensureUser(ctx);
    if (!user) {
      await ctx.reply(m.common.error);
      return;
    }

    const list = await container.listOwnerInvitations.execute(user.id);
    if (list.length === 0) {
      await ctx.reply(m.bot.myInvitesEmpty);
      return;
    }

    const lines = list.map(
      (inv) => `• ${inv.groomName} & ${inv.brideName}\n${container.env.siteUrl}/${inv.slug}`,
    );
    await ctx.reply(lines.join('\n\n'));
  });
}
