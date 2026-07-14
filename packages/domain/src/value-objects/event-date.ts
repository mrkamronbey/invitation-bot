import { type Result, ok, err } from '../result';
import { DomainError } from '../errors/domain-error';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * To'y sanasi — `YYYY-MM-DD` formatida, haqiqiy kalendar sanasi.
 * "Kelajakda bo'lishi" qoidasi use-case'da (Clock port bilan) tekshiriladi —
 * value object faqat format va haqiqiylikni tekshiradi (sof, testlanadigan).
 */
export class EventDate {
  private constructor(public readonly iso: string) {}

  static create(raw: string): Result<EventDate, DomainError> {
    const value = raw.trim();
    if (!ISO_DATE.test(value)) {
      return err(new DomainError('INVALID_DATE', "Sana YYYY-MM-DD formatida bo'lishi kerak."));
    }
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      return err(new DomainError('INVALID_DATE', "Sana haqiqiy bo'lishi kerak."));
    }
    // Kun/oy chegaradan chiqib ketmaganini tekshirish (masalan 2026-02-31 rad etiladi).
    if (parsed.toISOString().slice(0, 10) !== value) {
      return err(new DomainError('INVALID_DATE', "Sana haqiqiy bo'lishi kerak."));
    }
    return ok(new EventDate(value));
  }

  toDate(): Date {
    return new Date(`${this.iso}T00:00:00.000Z`);
  }

  isAfter(reference: Date): boolean {
    return this.toDate().getTime() > reference.getTime();
  }
}
