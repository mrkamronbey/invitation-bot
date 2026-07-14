import { InlineKeyboard, Keyboard } from 'grammy';
import { getMessages } from '@invitation/i18n';

const m = getMessages('uz').bot;

/** Bosh menyu — REPLY tugmalar (pastda doim turadi, tez ishlatiladi). */
export function mainReplyKeyboard(): Keyboard {
  return new Keyboard()
    .text(m.menuCreate)
    .row()
    .text(m.menuMyInvites)
    .text(m.menuHelp)
    .resized()
    .persistent();
}

/** Yaratish oqimida — reply tugmalar (ixtiyoriy bo'lsa ⏭, doim ❌). */
export function flowKeyboard(optional: boolean): Keyboard {
  const kb = new Keyboard();
  if (optional) kb.text(m.skipButton);
  kb.text(m.cancelButton);
  return kb.resized();
}

/** Lokatsiya so'rovi — Telegram "joy yuborish" tugmasi + ⏭/❌. */
export function locationKeyboard(): Keyboard {
  return new Keyboard()
    .requestLocation('📍 Lokatsiyani yuborish')
    .row()
    .text(m.skipButton)
    .text(m.cancelButton)
    .resized();
}

/** Tasdiqlash — inline (Ha, yaratish / Boshidan). */
export function confirmKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text(m.reviewConfirm, 'confirm')
    .row()
    .text(m.reviewRestart, 'restart');
}

/** Taklifnoma tayyor bo'lgach — inline (Ochish / Ulashish / Yana). */
export function readyKeyboard(link: string): InlineKeyboard {
  return new InlineKeyboard()
    .url(m.openButton, link)
    .url(m.shareButton, `https://t.me/share/url?url=${encodeURIComponent(link)}`)
    .row()
    .text(m.newButton, 'menu:new');
}
