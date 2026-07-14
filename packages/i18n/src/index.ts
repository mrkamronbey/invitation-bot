import { uz } from './locales/uz';
import { ru } from './locales/ru';

export type Locale = 'uz' | 'ru' | 'en';
export type Messages = typeof uz;

const dictionaries = {
  uz,
  ru,
} satisfies Partial<Record<Locale, Messages>>;

export const DEFAULT_LOCALE: Locale = 'uz';
export const SUPPORTED_LOCALES: readonly Locale[] = ['uz', 'ru'];

/** Kirish qiymatidan qo'llab-quvvatlanadigan tilni aniqlaydi (aks holda — uz). */
export function normalizeLocale(input: string | undefined): Locale {
  return input === 'ru' ? 'ru' : 'uz';
}

/** Til bo'yicha matnlar to'plamini qaytaradi (topilmasa — o'zbekcha). */
export function getMessages(locale: string = DEFAULT_LOCALE): Messages {
  return dictionaries[locale as keyof typeof dictionaries] ?? uz;
}

export { uz, ru };
