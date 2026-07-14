import { uz } from './locales/uz';

export type Locale = 'uz' | 'ru' | 'en';
export type Messages = typeof uz;

const dictionaries = {
  uz,
} satisfies Partial<Record<Locale, Messages>>;

export const DEFAULT_LOCALE: Locale = 'uz';

/** Til bo'yicha matnlar to'plamini qaytaradi (topilmasa — o'zbekcha). */
export function getMessages(locale: string = DEFAULT_LOCALE): Messages {
  return dictionaries[locale as keyof typeof dictionaries] ?? uz;
}

export { uz };
