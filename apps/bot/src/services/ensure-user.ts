import type { User } from '@invitation/domain';
import { container } from '../composition';
import type { BotContext } from '../context';

/** Telegram foydalanuvchisini bazaga yozadi (yoki mavjudini qaytaradi). */
export async function ensureUser(ctx: BotContext): Promise<User | null> {
  const from = ctx.from;
  if (!from) return null;

  const existing = await container.users.findByTelegramId(from.id);
  if (existing) return existing;

  const user: User = {
    id: container.ids.generate(),
    telegramId: from.id,
    username: from.username,
    firstName: from.first_name,
    languageCode: from.language_code ?? 'uz',
  };
  await container.users.upsert(user);
  return user;
}
