import { InlineKeyboard, Keyboard } from 'grammy';
import type { Messages } from '@invitation/i18n';

type M = Messages['bot'];

/** Bosh menyu — REPLY tugmalar (pastda doim turadi, tez ishlatiladi). */
export function mainReplyKeyboard(m: M): Keyboard {
  return new Keyboard()
    .text(m.menuCreate)
    .row()
    .text(m.menuMyInvites)
    .row()
    .text(m.menuHelp)
    .text(m.menuLanguage)
    .resized()
    .persistent();
}

/** Til tanlash — inline. */
export function languageKeyboard(m: M): InlineKeyboard {
  return new InlineKeyboard().text(m.langUz, 'lang:uz').text(m.langRu, 'lang:ru');
}

/** Telefon so'rovi — bir bosishda "kontaktni ulashish" + "keyinroq" (reply). */
export function contactKeyboard(m: M): Keyboard {
  return new Keyboard()
    .requestContact(m.sharePhoneButton)
    .row()
    .text(m.laterButton)
    .resized()
    .oneTime();
}

interface FlowOpts {
  readonly optional?: boolean;
  readonly canBack?: boolean;
}

/** Yaratish oqimida — reply tugmalar (⏭ ixtiyoriy, ◀️ orqaga, ❌ bekor). */
export function flowKeyboard(m: M, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard();
  if (opts.optional) kb.text(m.skipButton).row();
  if (opts.canBack) kb.text(m.backButton);
  kb.text(m.cancelButton);
  return kb.resized();
}

/** Lokatsiya so'rovi — Telegram "joy yuborish" tugmasi + ⏭/◀️/❌. */
export function locationKeyboard(m: M, canBack = false): Keyboard {
  const kb = new Keyboard().requestLocation('📍').row().text(m.skipButton).row();
  if (canBack) kb.text(m.backButton);
  kb.text(m.cancelButton);
  return kb.resized();
}

/** Tasdiqlash — inline (Ha, yaratish / Boshidan). */
export function confirmKeyboard(m: M): InlineKeyboard {
  return new InlineKeyboard()
    .text(m.reviewConfirm, 'confirm')
    .row()
    .text(m.reviewRestart, 'restart');
}

/** Taklifnoma boshqaruvi — inline (Ochish / Statistika / Tahrirlash / O'chirish). */
export function manageKeyboard(m: M, invitationId: string, link: string): InlineKeyboard {
  return new InlineKeyboard()
    .url(m.manageOpen, link)
    .text(m.manageStats, `stats:${invitationId}`)
    .row()
    .text(m.manageEdit, `edit:${invitationId}`)
    .text(m.manageDelete, `del:${invitationId}`);
}

/** Tahrirlanadigan maydonlar — inline. */
export function editFieldsKeyboard(m: M): InlineKeyboard {
  const f = m.editField;
  return new InlineKeyboard()
    .text(f.template, 'editf:template')
    .text(f.groom, 'editf:groom')
    .row()
    .text(f.bride, 'editf:bride')
    .text(f.date, 'editf:date')
    .row()
    .text(f.time, 'editf:time')
    .text(f.venue, 'editf:venue')
    .row()
    .text(f.location, 'editf:location')
    .text(f.photo, 'editf:photo')
    .row()
    .text(f.story, 'editf:story')
    .text(f.dress, 'editf:dress')
    .row()
    .text(f.music, 'editf:music')
    .row()
    .text(m.editDone, 'editf:done');
}

/** Yaratilgandan keyin — Ochish / Ulashish / Tahrirlash / Yana. */
export function afterCreateKeyboard(m: M, invitationId: string, link: string): InlineKeyboard {
  return new InlineKeyboard()
    .url(m.openButton, link)
    .url(m.shareButton, `https://t.me/share/url?url=${encodeURIComponent(link)}`)
    .row()
    .text(m.manageEdit, `edit:${invitationId}`)
    .text(m.newButton, 'menu:new');
}

/** O'chirishni tasdiqlash — inline. */
export function deleteConfirmKeyboard(m: M, invitationId: string): InlineKeyboard {
  return new InlineKeyboard().text(m.deleteYes, `delyes:${invitationId}`).text(m.deleteNo, 'delno');
}
