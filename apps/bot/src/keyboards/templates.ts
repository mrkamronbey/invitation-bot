import { InlineKeyboard } from 'grammy';
import { TEMPLATE_CATALOG } from '@invitation/contracts';

/**
 * Shablon tanlash inline klaviaturasi (katalogdan quriladi).
 * prefix — callback-data prefiksi ('tpl' yaratishda, 'etpl' tahrirlashda).
 */
export function templatesKeyboard(prefix: 'tpl' | 'etpl' = 'tpl'): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  for (const template of TEMPLATE_CATALOG) {
    keyboard.text(template.name, `${prefix}:${template.id}`).row();
  }
  return keyboard;
}
