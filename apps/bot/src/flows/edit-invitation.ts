import { type UpdateInvitationPatch, isTemplateIdDto } from '@invitation/contracts';
import { getMessages } from '@invitation/i18n';
import { container } from '../composition';
import {
  editFieldsKeyboard,
  flowKeyboard,
  locationKeyboard,
  mainReplyKeyboard,
} from '../keyboards/menu';
import { templatesKeyboard } from '../keyboards/templates';
import { localeOf } from '../i18n';
import { parseDate, parseTime } from '../services/parse';
import { uploadTelegramFile } from './shared';
import type { BotContext, BotConversation } from '../context';

type Msg = ReturnType<typeof getMessages>['bot'];

function loc(ctx: BotContext): Msg {
  return getMessages(localeOf(ctx)).bot;
}

const CANCEL = Symbol('cancel');
type OrCancel<T> = T | typeof CANCEL;

/** Bitta matnli qiymatni so'raydi; ❌ bosilса — CANCEL. */
async function askText(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  prompt: string,
): Promise<OrCancel<string>> {
  await ctx.reply(`${m.editPrompt}\n${prompt}`, { reply_markup: flowKeyboard(m) });
  for (;;) {
    const res = await conversation.waitFor(':text');
    const txt = (res.message?.text ?? '').trim();
    if (txt === m.cancelButton) return CANCEL;
    if (txt.length > 0) return txt;
  }
}

/** Tanlangan maydon uchun yangi qiymatni so'rab, patch qaytaradi (yoki null — bekor). */
async function askEditValue(
  conversation: BotConversation,
  ctx: BotContext,
  m: Msg,
  field: string,
): Promise<UpdateInvitationPatch | null> {
  switch (field) {
    case 'groom': {
      const v = await askText(conversation, ctx, m, m.askGroom);
      return v === CANCEL ? null : { groomName: v };
    }
    case 'bride': {
      const v = await askText(conversation, ctx, m, m.askBride);
      return v === CANCEL ? null : { brideName: v };
    }
    case 'venue': {
      const v = await askText(conversation, ctx, m, m.askVenue);
      return v === CANCEL ? null : { venueName: v };
    }
    case 'story': {
      const v = await askText(conversation, ctx, m, m.askStory);
      return v === CANCEL ? null : { story: v };
    }
    case 'dress': {
      const v = await askText(conversation, ctx, m, m.askDressCode);
      return v === CANCEL ? null : { dressCode: v };
    }
    case 'date': {
      await ctx.reply(`${m.editPrompt}\n${m.askDate}`, { reply_markup: flowKeyboard(m) });
      for (;;) {
        const res = await conversation.waitFor(':text');
        const txt = (res.message?.text ?? '').trim();
        if (txt === m.cancelButton) return null;
        const iso = parseDate(txt);
        if (iso) return { eventDate: iso };
        await ctx.reply(m.invalidDate);
      }
    }
    case 'time': {
      await ctx.reply(`${m.editPrompt}\n${m.askTime}`, { reply_markup: flowKeyboard(m) });
      for (;;) {
        const res = await conversation.waitFor(':text');
        const txt = (res.message?.text ?? '').trim();
        if (txt === m.cancelButton) return null;
        const hm = parseTime(txt);
        if (hm) return { eventTime: hm };
        await ctx.reply(m.invalidTime);
      }
    }
    case 'location': {
      await ctx.reply(`${m.editPrompt}\n${m.askLocation}`, { reply_markup: locationKeyboard(m) });
      const res = await conversation.wait();
      const geo = res.message?.location;
      if (geo) return { location: { lat: geo.latitude, lng: geo.longitude } };
      return null;
    }
    case 'photo': {
      await ctx.reply(`${m.editPrompt}\n${m.askCover}`, { reply_markup: flowKeyboard(m) });
      const res = await conversation.wait();
      const photos = res.message?.photo;
      const largest = photos?.[photos.length - 1];
      if (!largest) return null;
      const url = await uploadTelegramFile(
        conversation,
        ctx,
        largest.file_id,
        'covers',
        'image/jpeg',
        'jpg',
      );
      return url ? { coverImageUrl: url } : null;
    }
    case 'music': {
      await ctx.reply(`${m.editPrompt}\n${m.askMusic}`, { reply_markup: flowKeyboard(m) });
      const res = await conversation.wait();
      const audio = res.message?.audio ?? res.message?.voice;
      if (!audio) return null;
      const url = await uploadTelegramFile(
        conversation,
        ctx,
        audio.file_id,
        'music',
        'audio/mpeg',
        'mp3',
      );
      return url ? { musicUrl: url, musicSource: 'custom' } : null;
    }
    case 'template': {
      await ctx.reply(`${m.editPrompt}\n${m.chooseTemplate}`, {
        reply_markup: templatesKeyboard('etpl'),
      });
      const res = await conversation.waitFor('callback_query:data');
      await res.answerCallbackQuery();
      const id = (res.callbackQuery?.data ?? '').replace('etpl:', '');
      return isTemplateIdDto(id) ? { templateId: id } : null;
    }
    default:
      return null;
  }
}

/** Tahrirlash FSM: maydon tanlash → yangi qiymat → saqlash → yana/tayyor. */
export async function editInvitationFlow(
  conversation: BotConversation,
  ctx: BotContext,
): Promise<void> {
  const m = loc(ctx);
  const invitationId = ctx.session.editInvitationId;
  const ownerId = ctx.session.ownerId;
  if (!invitationId || !ownerId) {
    await ctx.reply(getMessages(localeOf(ctx)).common.error);
    return;
  }

  for (;;) {
    await ctx.reply(m.editTitle, { reply_markup: editFieldsKeyboard(m) });
    const pick = await conversation.waitFor('callback_query:data');
    await pick.answerCallbackQuery();
    const data = pick.callbackQuery?.data ?? '';
    if (data === 'editf:done') break;
    const field = data.replace('editf:', '');

    const patch = await askEditValue(conversation, ctx, m, field);
    if (patch) {
      const res = await conversation.external(() =>
        container.updateInvitation.execute({ invitationId, ownerId, patch }),
      );
      await ctx.reply(
        res.ok ? m.editSaved : `${getMessages(localeOf(ctx)).common.error}\n${res.error.message}`,
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }
  }

  await ctx.reply(m.editDone, { reply_markup: mainReplyKeyboard(m) });
}
