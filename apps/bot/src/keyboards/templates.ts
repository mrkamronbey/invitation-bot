import { InlineKeyboard } from 'grammy';
import { TEMPLATE_CATALOG } from '@invitation/contracts';

/**
 * Shablon tanlash inline klaviaturasi (katalogdan quriladi).
 * prefix — callback-data prefiksi ('tpl' yaratishda, 'etpl' tahrirlashda).
 * Bitta shablon bo'lsa (va continueLabel berilsa) — "Davom etish" tugmasi
 * ko'rsatiladi (tanlov ekrani baribir ko'rinadi, foydalanuvchi davom etadi).
 */
export function templatesKeyboard(
  prefix: 'tpl' | 'etpl' = 'tpl',
  continueLabel?: string,
): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const only = TEMPLATE_CATALOG[0];
  if (TEMPLATE_CATALOG.length === 1 && continueLabel && only) {
    return keyboard.text(continueLabel, `${prefix}:${only.id}`);
  }
  for (const template of TEMPLATE_CATALOG) {
    keyboard.text(template.name, `${prefix}:${template.id}`).row();
  }
  return keyboard;
}
