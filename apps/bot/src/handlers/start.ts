import type { Bot } from 'grammy';
import { TEMPLATE_CATALOG } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { mainReplyKeyboard } from '../keyboards/menu';
import { templatesKeyboard } from '../keyboards/templates';
import { ensureUser } from '../services/ensure-user';
import { sendMyInvites } from './myinvites';
import type { BotContext } from '../context';

const t = getMessages('uz');
const m = t.bot;

/** Shablonlarni rasm (preview) bilan ko'rsatadi + tanlash tugmalari. */
async function sendTemplateChooser(ctx: BotContext): Promise<void> {
  await ensureUser(ctx);
  try {
    await ctx.replyWithMediaGroup(
      TEMPLATE_CATALOG.map((tpl) => ({
        type: 'photo' as const,
        media: tpl.previewImage,
        caption: tpl.name,
      })),
    );
  } catch {
    // Preview yuklanmasa ham tanlovni ko'rsatamiz.
  }
  await ctx.reply(m.chooseTemplate, { reply_markup: templatesKeyboard() });
}

export function registerStart(bot: Bot<BotContext>): void {
  // /start — kutib olish + REPLY menyu
  bot.command('start', async (ctx) => {
    await ensureUser(ctx);
    await ctx.reply(m.welcome, { parse_mode: 'Markdown', reply_markup: mainReplyKeyboard() });
  });

  bot.command('new', (ctx) => sendTemplateChooser(ctx));
  bot.command('help', (ctx) => ctx.reply(m.help, { parse_mode: 'Markdown' }));
  bot.command('cancel', async (ctx) => {
    await ctx.conversation.exit('create-invitation');
    await ctx.reply(m.cancelled, { reply_markup: mainReplyKeyboard() });
  });

  // Reply menyu tugmalari (matn sifatida keladi)
  bot.hears(m.menuCreate, (ctx) => sendTemplateChooser(ctx));
  bot.hears(m.menuMyInvites, (ctx) => sendMyInvites(ctx));
  bot.hears(m.menuHelp, (ctx) => ctx.reply(m.help, { parse_mode: 'Markdown' }));

  // Inline "Yana yaratish" tugmasi
  bot.callbackQuery('menu:new', async (ctx) => {
    await ctx.answerCallbackQuery();
    await sendTemplateChooser(ctx);
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
