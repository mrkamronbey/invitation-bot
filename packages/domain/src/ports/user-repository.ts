import type { User } from '../entities/user';

/** Foydalanuvchilar ombori (port). */
export interface UserRepository {
  findByTelegramId(telegramId: number): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  upsert(user: User): Promise<void>;
}
