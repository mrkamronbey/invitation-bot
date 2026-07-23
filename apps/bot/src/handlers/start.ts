import type { Bot } from 'grammy';
import { TEMPLATE_CATALOG } from '@invitation/contracts';
import { type Locale, getMessages, normalizeLocale, ru, uz } from '@invitation/i18n';
import { container } from '../composition';
import {
  contactKeyboard,
  demoKeyboard,
  languageKeyboard,
  mainReplyKeyboard,
  welcomeCtaKeyboard,
} from '../keyboards/menu';
import { templatesKeyboard } from '../keyboards/templates';
import { botText, localeOf } from '../i18n';
import { ensureUser } from '../services/ensure-user';
import { sendMyInvites } from './myinvites';
import type { BotContext } from '../context';

// Menyu tugmalari matni ikki tilda — reply tugmani ikkala tilda ham tanish uchun.
const CREATE_LABELS = [uz.bot.menuCreate, ru.bot.menuCreate];
const MY_LABELS = [uz.bot.menuMyInvites, ru.bot.menuMyInvites];
const DEMO_LABELS = [uz.bot.menuDemo, ru.bot.menuDemo];
const HELP_LABELS = [uz.bot.menuHelp, ru.bot.menuHelp];
const LANG_LABELS = [uz.bot.menuLanguage, ru.bot.menuLanguage];
const LATER_LABELS = [uz.bot.laterButton, ru.bot.laterButton];

type Msg = ReturnType<typeof botText>;

async function invitesCountOf(userId: string): Promise<number> {
  return (await container.listOwnerInvitations.execute(userId)).length;
}

/** Welcome banner + matn (yangi/qaytgan userga mos) + inline CTA + pastki menyu. */
async function showWelcomeAndMenu(ctx: BotContext, m: Msg): Promise<void> {
  const user = await ensureUser(ctx);
  const count = user ? await invitesCountOf(user.id) : 0;
  const caption = count > 0 ? m.welcomeBack(count) : m.welcome;
  try {
    await ctx.replyWithPhoto(container.env.bannerUrl, {
      caption,
      parse_mode: 'Markdown',
      reply_markup: welcomeCtaKeyboard(m),
    });
  } catch {
    await ctx.reply(caption, { parse_mode: 'Markdown', reply_markup: welcomeCtaKeyboard(m) });
  }
  await ctx.reply(m.menuHint, { reply_markup: mainReplyKeyboard(m) });
}

/** Namuna (demo) taklifnomani ko'rsatadi. */
async function sendDemo(ctx: BotContext): Promise<void> {
  const m = botText(ctx);
  await ctx.reply(m.demoIntro, {
    parse_mode: 'Markdown',
    reply_markup: demoKeyboard(m, container.env.demoUrl),
  });
}

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

/** Shablonni belgilaydi va yaratish oqimiga kiradi (foydalanuvchini ta'minlab). */
async function enterCreate(ctx: BotContext, templateId: string): Promise<void> {
  const user = await ensureUser(ctx);
  if (!user) {
    await ctx.reply(getMessages(localeOf(ctx)).common.error);
    return;
  }
  ctx.session.templateId = templateId;
  ctx.session.ownerId = user.id;
  await ctx.conversation.enter('create-invitation');
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
    // Qaytgan userni oldindan aniqlaymiz (profilida tili bo'lishi mumkin).
    const existing = ctx.from ? await container.users.findByTelegramId(ctx.from.id) : null;
    await ensureUser(ctx);

    // Til: sessiya → profil (qaytgan user) → yangi user'dan so'raymiz.
    if (!ctx.session.lang) {
      if (existing) {
        ctx.session.lang = normalizeLocale(existing.languageCode);
      } else {
        const m = botText(ctx);
        await ctx.reply(m.chooseLanguage, { reply_markup: languageKeyboard(m) });
        return;
      }
    }
    await showWelcomeAndMenu(ctx, botText(ctx));
  });

  // Til tanlandi → AVVAL (birinchi marta) telefon so'raymiz, so'ng welcome + menyu.
  bot.callbackQuery(/^lang:(uz|ru)$/, async (ctx) => {
    const lang = (ctx.match?.[1] ?? 'uz') as Locale;
    await applyLanguage(ctx, lang);
    await ctx.answerCallbackQuery();
    const m = getMessages(lang).bot;
    const user = await ensureUser(ctx);
    if (user && !user.phone) {
      await ctx.reply(m.askPhone, { reply_markup: contactKeyboard(m) });
      return;
    }
    await showWelcomeAndMenu(ctx, m);
  });

  // Telefon kontakti ulashildi (ixtiyoriy) → saqlaymiz, so'ng welcome + menyu.
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
      await ctx.reply(m.phoneSaved, { reply_markup: { remove_keyboard: true } });
    }
    await showWelcomeAndMenu(ctx, m);
  });

  // "Keyinroq" — telefonni o'tkazamiz, welcome + menyuга o'tamiz.
  bot.hears(LATER_LABELS, (ctx) => showWelcomeAndMenu(ctx, botText(ctx)));

  bot.command('new', (ctx) => sendTemplateChooser(ctx));
  bot.command('demo', (ctx) => sendDemo(ctx));
  bot.command('help', (ctx) => ctx.reply(botText(ctx).help, { parse_mode: 'Markdown' }));
  bot.command('cancel', async (ctx) => {
    await ctx.conversation.exit('create-invitation');
    await ctx.conversation.exit('edit-invitation');
    await ctx.conversation.exit('guest-link');
    const m = botText(ctx);
    await ctx.reply(m.cancelled, { reply_markup: mainReplyKeyboard(m) });
  });

  // Reply menyu tugmalari (matn sifatida keladi) — ikki tilda
  bot.hears(CREATE_LABELS, (ctx) => sendTemplateChooser(ctx));
  bot.hears(MY_LABELS, (ctx) => sendMyInvites(ctx));
  bot.hears(DEMO_LABELS, (ctx) => sendDemo(ctx));
  bot.hears(HELP_LABELS, (ctx) => ctx.reply(botText(ctx).help, { parse_mode: 'Markdown' }));
  bot.hears(LANG_LABELS, (ctx) => {
    const m = botText(ctx);
    return ctx.reply(m.chooseLanguage, { reply_markup: languageKeyboard(m) });
  });

  // Inline "Namuna ko'rish" tugmasi
  bot.callbackQuery('demo', async (ctx) => {
    await ctx.answerCallbackQuery();
    await sendDemo(ctx);
  });

  // Inline "Yaratish / Yana yaratish" tugmasi
  bot.callbackQuery('menu:new', async (ctx) => {
    await ctx.answerCallbackQuery();
    // Bitta shablon bo'lsa — tanlash qadamini o'tkazib, to'g'ridan-to'g'ri
    // yaratishga kiramiz. Shablonlar ko'paysa — tanlov qayta ochiladi.
    if (TEMPLATE_CATALOG.length === 1) {
      await enterCreate(ctx, TEMPLATE_CATALOG[0]!.id);
      return;
    }
    await sendTemplateChooser(ctx);
  });

  // Shablon tanlandi → yaratish oqimiga kirish (ko'p shablonli holat)
  bot.callbackQuery(/^tpl:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const templateId = ctx.match ? ctx.match[1] : undefined;
    if (!templateId) {
      await ctx.reply(getMessages(localeOf(ctx)).common.error);
      return;
    }
    await enterCreate(ctx, templateId);
  });
}
