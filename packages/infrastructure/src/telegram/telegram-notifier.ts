import type { Notifier, OwnerRef, Rsvp } from '@invitation/domain';

/**
 * RSVP xabari matnini tayyorlaydigan funksiya. Tarjima (i18n) — presentation/composition
 * qatlamining ishi, shuning uchun matn shu yerdan tashqaridan inject qilinadi.
 */
export type RsvpMessageFormatter = (owner: OwnerRef, rsvp: Rsvp, invitationSlug: string) => string;

/**
 * Telegram xabarnoma adapteri (Notifier port). Bot API'ning `sendMessage`
 * metodiga to'g'ridan-to'g'ri fetch qiladi — grammY ham i18n ham kerak emas,
 * shuning uchun web (Vercel) jarayonidan ham egaga xabar yubora oladi.
 */
export class TelegramNotifier implements Notifier {
  constructor(
    private readonly botToken: string,
    private readonly formatRsvp: RsvpMessageFormatter,
  ) {}

  async notifyRsvp(owner: OwnerRef, rsvp: Rsvp, invitationSlug: string): Promise<void> {
    const text = this.formatRsvp(owner, rsvp, invitationSlug);

    await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: owner.telegramId, text }),
    });
  }
}
