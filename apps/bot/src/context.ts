import type { Context, SessionFlavor } from 'grammy';
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations';

export interface SessionData {
  templateId?: string;
  ownerId?: string;
}

/** Bot konteksti — session + conversations flavor bilan. */
export type BotContext = Context & SessionFlavor<SessionData> & ConversationFlavor;

export type BotConversation = Conversation<BotContext>;
