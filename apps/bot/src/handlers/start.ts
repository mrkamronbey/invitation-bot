import type { Bot } from 'grammy';
import { TEMPLATE_CATALOG } from '@invitation/contracts';
import { type Locale, getMessages, ru, uz } from '@invitation/i18n';
import { container } from '../composition';
import { contactKeyboard, languageKeyboard, mainReplyKeyboard } from '../keyboards/menu';
import { templatesKeyboard } from '../keyboards/templates';
import { botText, localeOf } from '../i18n';
import { ensureUser } from '../services/ensure-user';
import { sendMyInvites } from './myinvites';
import type { BotContext } from '../context';

// Menyu tugmalari matni ikki tilda — reply tugmani ikkala tilda ham tanish uchun.
const CREATE_LABELS = [uz.bot.menuCreate, ru.bot.menuCreate];
const MY_LABELS = [uz.bot.menuMyInvites, ru.bot.menuMyInvites];
const HELP_LABELS = [uz.bot.menuHelp, ru.bot.menuHelp];
const LANG_LABELS = [uz.bot.menuLanguage, ru.bot.menuLanguage];
const LATER_LABELS = [uz.bot.laterButton, ru.bot.laterButton];

/** Shablonlarni rasm (preview) bilan ko'rsatadi + tanlash tugmalari. */
async function sendTemplateChooser(ctx: BotContext): Promise<void> {
  await ensureUser(ctx);
  const m = botText(ctx);
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
  await ctx.reply(m.chooseTemplate, { reply_markup: templatesKeyboard('tpl') });
}

/** Tilni sessiya va foydalanuvchi profiliga yozadi. */
async function applyLanguage(ctx: BotContext, lang: Locale): Promise<void> {
  ctx.session.lang = lang;
  const user = await ensureUser(ctx);
  if (user && user.languageCode !== lang) {
    await container.users.upsert({ ...user, languageCode: lang });
  }
}

export function registerStart(bot: Bot<BotContext>): void {
  bot.command('start', async (ctx) => {
    await ensureUser(ctx);
    const m = botText(ctx);
    if (!ctx.session.lang) {
      await ctx.reply(m.chooseLanguage, { reply_markup: languageKeyboard(m) });
      return;
    }
    await ctx.reply(m.welcome, { parse_mode: 'Markdown', reply_markup: mainReplyKeyboard(m) });
  });

  // Til tanlash (birinchi /start yoki "🌐 Til" tugmasi)
  bot.callbackQuery(/^lang:(uz|ru)$/, async (ctx) => {
    const lang = (ctx.match?.[1] ?? 'uz') as Locale;
    await applyLanguage(ctx, lang);
    await ctx.answerCallbackQuery();
    const m = getMessages(lang).bot;
    const user = await ensureUser(ctx);
    await ctx.reply(m.welcome, { parse_mode: 'Markdown', reply_markup: mainReplyKeyboard(m) });
    // Onboarding: telefonni bir marta (ixtiyoriy) so'raymiz.
    if (user && !user.phone) {
      await ctx.reply(m.askPhone, { reply_markup: contactKeyboard(m) });
    }
  });

  // Telefon kontakti ulashildi (ixtiyoriy) — o'z raqamini saqlaymiz.
  bot.on(':contact', async (ctx) => {
    const m = botText(ctx);
    const contact = ctx.message?.contact;
    const user = await ensureUser(ctx);
    if (user && contact && (!contact.user_id || contact.user_id === ctx.from?.id)) {
      await container.users.upsert({
        ...user,
        phone: contact.phone_number,
        lastName: contact.last_name ?? user.lastName,
      });
      await ctx.reply(m.phoneSaved, { reply_markup: mainReplyKeyboard(m) });
    } else {
      await ctx.reply('👍', { reply_markup: mainReplyKeyboard(m) });
    }
  });

  // "Keyinroq" — telefonni o'tkazib yuboramiz.
  bot.hears(LATER_LABELS, (ctx) =>
    ctx.reply('👍', { reply_markup: mainReplyKeyboard(botText(ctx)) }),
  );

  bot.command('new', (ctx) => sendTemplateChooser(ctx));
  bot.command('help', (ctx) => ctx.reply(botText(ctx).help, { parse_mode: 'Markdown' }));
  bot.command('cancel', async (ctx) => {
    await ctx.conversation.exit('create-invitation');
    await ctx.conversation.exit('edit-invitation');
    const m = botText(ctx);
    await ctx.reply(m.cancelled, { reply_markup: mainReplyKeyboard(m) });
  });

  // Reply menyu tugmalari (matn sifatida keladi) — ikki tilda
  bot.hears(CREATE_LABELS, (ctx) => sendTemplateChooser(ctx));
  bot.hears(MY_LABELS, (ctx) => sendMyInvites(ctx));
  bot.hears(HELP_LABELS, (ctx) => ctx.reply(botText(ctx).help, { parse_mode: 'Markdown' }));
  bot.hears(LANG_LABELS, (ctx) => {
    const m = botText(ctx);
    return ctx.reply(m.chooseLanguage, { reply_markup: languageKeyboard(m) });
  });

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
      await ctx.reply(getMessages(localeOf(ctx)).common.error);
      return;
    }
    ctx.session.templateId = templateId;
    ctx.session.ownerId = user.id;
    await ctx.conversation.enter('create-invitation');
  });
}
