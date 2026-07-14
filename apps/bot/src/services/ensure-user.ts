import type { User } from '@invitation/domain';
import { container } from '../composition';
import type { BotContext } from '../context';

/**
 * Telegram foydalanuvchisini bazaga yozadi (yoki mavjudini qaytaradi).
 * Ism/familiya/username Telegramdan avtomatik olinadi va o'zgarsa yangilanadi.
 */
export async function ensureUser(ctx: BotContext): Promise<User | null> {
  const from = ctx.from;
  if (!from) return null;

  const existing = await container.users.findByTelegramId(from.id);
  if (existing) {
    // Telegram profilidagi o'zgarishlarni (ism/familiya/username) yangilab turamiz.
    const fresh: User = {
      ...existing,
      username: from.username,
      firstName: from.first_name,
      lastName: from.last_name ?? existing.lastName,
    };
    if (
      fresh.username !== existing.username ||
      fresh.firstName !== existing.firstName ||
      fresh.lastName !== existing.lastName
    ) {
      await container.users.upsert(fresh);
    }
    return fresh;
  }

  const user: User = {
    id: container.ids.generate(),
    telegramId: from.id,
    username: from.username,
    firstName: from.first_name,
    lastName: from.last_name,
    languageCode: from.language_code ?? 'uz',
  };
  await container.users.upsert(user);
  return user;
}
