import { InlineKeyboard } from 'grammy';
import { getMessages } from '@invitation/i18n';

const m = getMessages('uz').bot;

/** Bosh menyu (inline) — /start dan keyin ko'rsatiladi. */
export function mainMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text(m.menuCreate, 'menu:new')
    .row()
    .text(m.menuMyInvites, 'menu:myinvites')
    .text(m.menuHelp, 'menu:help');
}

/** Ixtiyoriy qadamlar uchun "o'tkazib yuborish" tugmasi. */
export function skipKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text(m.skipButton, 'skip');
}

/** Taklifnoma tayyor bo'lgach ko'rsatiladigan tugmalar. */
export function readyKeyboard(link: string): InlineKeyboard {
  return new InlineKeyboard()
    .url(m.openButton, link)
    .url(m.shareButton, `https://t.me/share/url?url=${encodeURIComponent(link)}`)
    .row()
    .text(m.newButton, 'menu:new');
}
