import { InlineKeyboard, Keyboard } from 'grammy';
import { DEFAULT_MUSIC } from '@invitation/contracts';
import type { Messages } from '@invitation/i18n';

type M = Messages['bot'];

/** Bosh menyu — REPLY tugmalar (pastda doim turadi, tez ishlatiladi). */
export function mainReplyKeyboard(m: M): Keyboard {
  return new Keyboard()
    .text(m.menuCreate)
    .row()
    .text(m.menuMyInvites)
    .text(m.menuDemo)
    .row()
    .text(m.menuHelp)
    .text(m.menuLanguage)
    .resized()
    .persistent();
}

/** Welcome ostidagi asosiy chaqiruv (inline): Namuna / Yaratish. */
export function welcomeCtaKeyboard(m: M): InlineKeyboard {
  return new InlineKeyboard().text(m.ctaDemo, 'demo').row().text(m.ctaCreate, 'menu:new');
}

/** Namuna xabari (inline): jonli namunani ochish / o'zimnikini yaratish. */
export function demoKeyboard(m: M, demoUrl: string): InlineKeyboard {
  return new InlineKeyboard()
    .url(m.demoOpenButton, demoUrl)
    .row()
    .text(m.demoCreateButton, 'menu:new');
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
  readonly skipRest?: boolean;
}

/** Boshqaruv tugmalari qatorlari (⏭ qolgani / ◀️ orqaga / ❌ bekor) — barcha oqim klaviaturalari uchun umumiy. */
function appendControls(kb: Keyboard, m: M, opts: FlowOpts): Keyboard {
  if (opts.skipRest) kb.text(m.skipRestButton).row();
  if (opts.canBack) kb.text(m.backButton);
  kb.text(m.cancelButton);
  return kb.resized();
}

/** Yaratish oqimida — reply tugmalar (⏭ ixtiyoriy, ⏭⏭ qolgani, ◀️ orqaga, ❌ bekor). */
export function flowKeyboard(m: M, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard();
  if (opts.optional) kb.text(m.skipButton).row();
  return appendControls(kb, m, opts);
}

/** Vaqt tez tanlovlari (tugma). Skip faqat ixtiyoriy bo'lsa. */
export function timeChoicesKeyboard(m: M, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard();
  const t = m.timeChoices;
  for (let i = 0; i < t.length; i += 3) {
    t.slice(i, i + 3).forEach((label) => kb.text(label));
    kb.row();
  }
  if (opts.optional) kb.text(m.skipButton).row();
  return appendControls(kb, m, opts);
}

/** Kiyim uslubi tez tanlovlari (tugma). Skip faqat ixtiyoriy bo'lsa. */
export function dressChoicesKeyboard(m: M, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard().text(m.dressClassic).text(m.dressNational).text(m.dressFree).row();
  if (opts.optional) kb.text(m.skipButton).row();
  return appendControls(kb, m, opts);
}

/** Musiqa tanlovi — tayyor kuylar + o'z musiqasi + musiqasiz. */
export function musicKeyboard(m: M, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard();
  for (const track of DEFAULT_MUSIC) kb.text(track.name);
  kb.row().text(m.musicOwn).text(m.musicNone).row();
  return appendControls(kb, m, opts);
}

/** Rasm(lar) — bir nechta yuborilgach "Tayyor" chiqadi. */
export function photosKeyboard(m: M, count: number, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard();
  if (count > 0) kb.text(m.photosDone).row();
  else kb.text(m.skipButton).row();
  return appendControls(kb, m, opts);
}

/** Ixtiyoriy ma'lumot darvozasi — inline (Ha, qo'shaman / Yo'q, tayyor). */
export function gateKeyboard(m: M): InlineKeyboard {
  return new InlineKeyboard().text(m.gateYes, 'gate:yes').text(m.gateNo, 'gate:no');
}

/** Lokatsiya so'rovi — Telegram "joy yuborish" tugmasi. Skip faqat ixtiyoriy bo'lsa. */
export function locationKeyboard(m: M, opts: FlowOpts = {}): Keyboard {
  const kb = new Keyboard().requestLocation('📍').row();
  if (opts.optional) kb.text(m.skipButton).row();
  return appendControls(kb, m, opts);
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
    .text(m.manageDelete, `del:${invitationId}`)
    .row()
    .text(m.manageShare, `share:${invitationId}`)
    .text(m.manageGuest, `guest:${invitationId}`);
}

/** Shaxsiy havola oqimida — faqat "Tayyor" (reply). */
export function guestLinkKeyboard(m: M): Keyboard {
  return new Keyboard().text(m.editDone).resized();
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
    .text(m.manageShare, `share:${invitationId}`)
    .row()
    .text(m.manageEdit, `edit:${invitationId}`)
    .text(m.newButton, 'menu:new');
}

/** O'chirishni tasdiqlash — inline. */
export function deleteConfirmKeyboard(m: M, invitationId: string): InlineKeyboard {
  return new InlineKeyboard().text(m.deleteYes, `delyes:${invitationId}`).text(m.deleteNo, 'delno');
}
