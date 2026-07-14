import type { Notifier, OwnerRef, Rsvp } from '@invitation/domain';
import { getMessages } from '@invitation/i18n';

/**
 * Telegram xabarnoma adapteri (Notifier port). Bot API'ning `sendMessage`
 * metodiga to'g'ridan-to'g'ri fetch qiladi — grammY kerak emas, shuning uchun
 * web (Vercel) jarayonidan ham egaga xabar yubora oladi.
 */
export class TelegramNotifier implements Notifier {
  constructor(
    private readonly botToken: string,
    private readonly siteUrl: string,
  ) {}

  async notifyRsvp(owner: OwnerRef, rsvp: Rsvp, invitationSlug: string): Promise<void> {
    const m = getMessages(owner.locale).bot;
    const notice = m.rsvpNotice(rsvp.guestName, rsvp.attending, rsvp.guestsCount);
    const text = `${notice}\n${this.siteUrl}/${invitationSlug}`;

    await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: owner.telegramId, text }),
    });
  }
}
