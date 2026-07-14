import type { Bot } from 'grammy';
import { getMessages } from '@invitation/i18n';
import { templatesKeyboard } from '../keyboards/templates';
import { ensureUser } from '../services/ensure-user';
import type { BotContext } from '../context';

const m = getMessages('uz');

export function registerStart(bot: Bot<BotContext>): void {
  bot.command('start', async (ctx) => {
    await ensureUser(ctx);
    await ctx.reply(m.bot.start);
    await ctx.reply(m.bot.chooseTemplate, { reply_markup: templatesKeyboard() });
  });

  bot.callbackQuery(/^tpl:(.+)$/, async (ctx) => {
    const templateId = ctx.match ? ctx.match[1] : undefined;
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!templateId || !user) {
      await ctx.reply(m.common.error);
      return;
    }
    ctx.session.templateId = templateId;
    ctx.session.ownerId = user.id;
    await ctx.conversation.enter('create-invitation');
  });
}
