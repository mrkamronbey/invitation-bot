import { InlineKeyboard } from 'grammy';
import { TEMPLATE_CATALOG } from '@invitation/contracts';

/** Shablon tanlash inline klaviaturasi (katalogdan quriladi). */
export function templatesKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  for (const template of TEMPLATE_CATALOG) {
    keyboard.text(template.name, `tpl:${template.id}`).row();
  }
  return keyboard;
}
