import type { Bot } from 'grammy';
import { getMessages } from '@invitation/i18n';
import { mainMenuKeyboard } from '../keyboards/menu';
import { templatesKeyboard } from '../keyboards/templates';
import { ensureUser } from '../services/ensure-user';
import { sendMyInvites } from './myinvites';
import type { BotContext } from '../context';

const t = getMessages('uz');
const m = t.bot;

export function registerStart(bot: Bot<BotContext>): void {
  // /start — chiroyli kutib olish + bosh menyu
  bot.command('start', async (ctx) => {
    await ensureUser(ctx);
    await ctx.reply(m.welcome, { parse_mode: 'Markdown', reply_markup: mainMenuKeyboard() });
  });

  // /new — to'g'ridan-to'g'ri shablon tanlash
  bot.command('new', async (ctx) => {
    await ensureUser(ctx);
    await ctx.reply(m.chooseTemplate, { reply_markup: templatesKeyboard() });
  });

  // /help — yordam
  bot.command('help', (ctx) => ctx.reply(m.help, { parse_mode: 'Markdown' }));

  // /cancel — yaratish oqimidan chiqish
  bot.command('cancel', async (ctx) => {
    await ctx.conversation.exit('create-invitation');
    await ctx.reply(m.cancelled);
  });

  // Menyu tugmalari
  bot.callbackQuery('menu:new', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ensureUser(ctx);
    await ctx.reply(m.chooseTemplate, { reply_markup: templatesKeyboard() });
  });

  bot.callbackQuery('menu:help', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(m.help, { parse_mode: 'Markdown' });
  });

  bot.callbackQuery('menu:myinvites', async (ctx) => {
    await ctx.answerCallbackQuery();
    await sendMyInvites(ctx);
  });

  // Shablon tanlandi → yaratish oqimiga kirish
  bot.callbackQuery(/^tpl:(.+)$/, async (ctx) => {
    const templateId = ctx.match ? ctx.match[1] : undefined;
    const user = await ensureUser(ctx);
    await ctx.answerCallbackQuery();
    if (!templateId || !user) {
      await ctx.reply(t.common.error);
      return;
    }
    ctx.session.templateId = templateId;
    ctx.session.ownerId = user.id;
    await ctx.conversation.enter('create-invitation');
  });
}
