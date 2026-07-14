import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { container } from './composition';
import type { BotContext, SessionData } from './context';
import { createInvitationFlow } from './flows/create-invitation';
import { registerStart } from './handlers/start';
import { registerMyInvites } from './handlers/myinvites';

/** Bot instance'ni yig'adi: session → conversations → handlerlar. */
export function createBot(): Bot<BotContext> {
  const bot = new Bot<BotContext>(container.env.botToken);

  bot.use(session({ initial: (): SessionData => ({}) }));
  bot.use(conversations());
  bot.use(createConversation(createInvitationFlow, 'create-invitation'));

  registerStart(bot);
  registerMyInvites(bot);

  // Telegram menyu buyruqlari (input yonidagi "/" tugma)
  void bot.api.setMyCommands([
    { command: 'start', description: 'Bosh menyu' },
    { command: 'new', description: 'Yangi taklifnoma' },
    { command: 'myinvites', description: 'Mening taklifnomalarim' },
    { command: 'help', description: 'Yordam' },
    { command: 'cancel', description: 'Bekor qilish' },
  ]);

  bot.catch((err) => {
    console.error('Bot xatosi:', err.error);
  });

  return bot;
}
