import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/** Telegram Login Widget qaytaradigan foydalanuvchi ma'lumoti. */
export interface TelegramLoginData {
  readonly id: number;
  readonly first_name: string;
  readonly last_name?: string;
  readonly username?: string;
  readonly photo_url?: string;
  readonly auth_date: number;
}

const MAX_AGE_SECONDS = 86_400; // 1 kun — eski auth qabul qilinmaydi

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN ?? process.env.BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN (yoki BOT_TOKEN) sozlanmagan.');
  return token;
}

/**
 * Telegram Login Widget imzosini tekshiradi (rasmiy algoritm):
 *   secret = SHA256(bot_token)
 *   hmac   = HMAC_SHA256(data_check_string, secret)
 *   data_check_string = "key=value" (hash'dan tashqari, kalit bo'yicha saralangan) \n bilan
 * Soxta emasligiga va eski emasligiga ishonch hosil qilinadi.
 */
export function verifyTelegramLogin(
  params: Record<string, string>,
): TelegramLoginData | null {
  const { hash, ...rest } = params;
  if (!hash) return null;

  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join('\n');

  const secret = createHash('sha256').update(botToken()).digest();
  const computed = createHmac('sha256', secret).update(dataCheckString).digest('hex');

  const a = Buffer.from(computed, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const authDate = Number(rest.auth_date);
  if (!Number.isFinite(authDate)) return null;
  const nowSec = Math.floor(Date.now() / 1000);
  if (nowSec - authDate > MAX_AGE_SECONDS) return null;

  const id = Number(rest.id);
  if (!Number.isFinite(id)) return null;

  return {
    id,
    first_name: rest.first_name ?? '',
    last_name: rest.last_name || undefined,
    username: rest.username || undefined,
    photo_url: rest.photo_url || undefined,
    auth_date: authDate,
  };
}
