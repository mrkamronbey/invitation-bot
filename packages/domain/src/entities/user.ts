/** User — bot foydalanuvchisi (kuyov-kelin / taklifnoma egasi). */
export interface User {
  readonly id: string;
  readonly telegramId: number;
  readonly username?: string;
  readonly firstName: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly languageCode: string;
}
