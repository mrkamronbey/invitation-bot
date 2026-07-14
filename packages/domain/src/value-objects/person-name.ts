import { type Result, ok, err } from '../result';
import { DomainError } from '../errors/domain-error';

const MAX_LENGTH = 40;

/** Kishi ismi — bo'sh emas, ≤ 40 belgi. */
export class PersonName {
  private constructor(public readonly value: string) {}

  static create(raw: string): Result<PersonName, DomainError> {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return err(new DomainError('INVALID_NAME', "Ism bo'sh bo'lmasligi kerak."));
    }
    if (trimmed.length > MAX_LENGTH) {
      return err(new DomainError('INVALID_NAME', `Ism ${MAX_LENGTH} belgidan oshmasligi kerak.`));
    }
    return ok(new PersonName(trimmed));
  }
}
