import { Bot, GrammyError, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { container } from './composition';
import type { BotContext, SessionData } from './context';
import { botText } from './i18n';
import { createInvitationFlow } from './flows/create-invitation';
import { editInvitationFlow } from './flows/edit-invitation';
import { guestLinkFlow } from './flows/guest-link';
import { mainReplyKeyboard } from './keyboards/menu';
import { registerStart } from './handlers/start';
import { registerMyInvites } from './handlers/myinvites';
import { registerManage } from './handlers/manage';
import { SupabaseSessionStorage } from './storage/supabase-session-storage';

/** Bot instance'ni yig'adi: session → conversations → handlerlar → xato chegarasi. */
export function createBot(): Bot<BotContext> {
  const bot = new Bot<BotContext>(container.env.botToken);

  bot.use(
    session({
      initial: (): SessionData => ({}),
      storage: new SupabaseSessionStorage<SessionData>(container.db),
    }),
  );
  bot.use(conversations());
  bot.use(createConversation(createInvitationFlow, 'create-invitation'));
  bot.use(createConversation(editInvitationFlow, 'edit-invitation'));
  bot.use(createConversation(guestLinkFlow, 'guest-link'));

  registerStart(bot);
  registerMyInvites(bot);
  registerManage(bot);

  // Telegram menyu buyruqlari (input yonidagi "/" tugma)
  void bot.api.setMyCommands([
    { command: 'start', description: 'Bosh menyu / Главное меню' },
    { command: 'new', description: 'Yangi taklifnoma / Новое приглашение' },
    { command: 'myinvites', description: 'Taklifnomalarim / Мои приглашения' },
    { command: 'demo', description: 'Namuna / Пример' },
    { command: 'help', description: 'Yordam / Помощь' },
    { command: 'cancel', description: 'Bekor qilish / Отмена' },
  ]);

  // Global xato chegarasi — bot hech qachon "jim qotib" qolmasin.
  bot.catch(async (err) => {
    console.error('Bot xatosi:', err.error);
    try {
      const m = botText(err.ctx);
      await err.ctx.reply(m.errorGeneric, { reply_markup: mainReplyKeyboard(m) });
    } catch (replyErr) {
      // Javob yuborib bo'lmasa (masalan, foydalanuvchi botni bloklagan) — jimgina o'tamiz.
      if (!(replyErr instanceof GrammyError))
        console.error('Xato javobida ikkilamchi xato:', replyErr);
    }
  });

  return bot;
}
