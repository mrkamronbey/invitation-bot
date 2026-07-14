/** ID generatori (port) — uuid. Infrastructure crypto bilan bajaradi. */
export interface IdGenerator {
  generate(): string;
}

/** Vaqt manbai (port) — testda soxta (mock) berish uchun ajratilgan. */
export interface Clock {
  now(): Date;
}
