import type { Context, SessionFlavor } from 'grammy';
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations';
import type { Locale } from '@invitation/i18n';

export interface SessionData {
  lang?: Locale;
  templateId?: string;
  ownerId?: string;
  editInvitationId?: string;
}

/** Bot konteksti — session + conversations flavor bilan. */
export type BotContext = Context & SessionFlavor<SessionData> & ConversationFlavor;

export type BotConversation = Conversation<BotContext>;
