import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import { guestLinkKeyboard, mainReplyKeyboard } from '../keyboards/menu';
import { localeOf } from '../i18n';
import type { BotContext, BotConversation } from '../context';

/**
 * Shaxsiy taklif havolasi FSM: mehmon ismini so'raydi va har biri uchun
 * `.../slug?g=Ism` havolasini qaytaradi. "Tayyor" bosilguncha davom etadi.
 */
export async function guestLinkFlow(conversation: BotConversation, ctx: BotContext): Promise<void> {
  const m = getMessages(localeOf(ctx)).bot;
  const invitationId = ctx.session.guestInvitationId;
  const ownerId = ctx.session.ownerId;
  if (!invitationId || !ownerId) {
    await ctx.reply(getMessages(localeOf(ctx)).common.error);
    return;
  }

  const slug = await conversation.external(async () => {
    const list = await container.listOwnerInvitations.execute(ownerId);
    return list.find((x) => x.id === invitationId)?.slug;
  });
  if (!slug) {
    await ctx.reply(m.errorGeneric);
    return;
  }

  const base = `${container.env.siteUrl}/${slug}`;
  await ctx.reply(m.guestAsk, { parse_mode: 'Markdown', reply_markup: guestLinkKeyboard(m) });

  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    if (txt === m.editDone || txt === m.cancelButton) break;
    if (txt.length === 0) continue;
    const url = `${base}?g=${encodeURIComponent(txt)}`;
    await ctx.reply(m.guestLink(txt, url), { parse_mode: 'Markdown' });
  }

  await ctx.reply(m.editDone, { reply_markup: mainReplyKeyboard(m) });
}
