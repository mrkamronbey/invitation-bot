import { type Locale, type Messages, getMessages, normalizeLocale } from '@invitation/i18n';
import type { BotContext } from './context';

/** Kontekstdagi (sessiyadagi) tilni aniqlaydi — Telegram tilidan boshlang'ich taxmin bilan. */
export function localeOf(ctx: BotContext): Locale {
  return ctx.session.lang ?? normalizeLocale(ctx.from?.language_code);
}

/** Kontekst tili bo'yicha to'liq matnlar to'plami. */
export function messagesOf(ctx: BotContext): Messages {
  return getMessages(localeOf(ctx));
}

/** Kontekst tili bo'yicha bot bo'limi matnlari (eng ko'p ishlatiladi). */
export function botText(ctx: BotContext): Messages['bot'] {
  return messagesOf(ctx).bot;
}
