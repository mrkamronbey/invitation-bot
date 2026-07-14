import { randomUUID } from 'node:crypto';
import type { Clock, IdGenerator } from '@invitation/domain';

/** Crypto asosidagi UUID generatori. */
export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}

/** Tizim soati. */
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
