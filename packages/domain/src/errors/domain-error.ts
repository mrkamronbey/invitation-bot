/** Domain darajasidagi kutilgan xatolarning kodlari. */
export type DomainErrorCode =
  | 'INVALID_NAME'
  | 'INVALID_DATE'
  | 'INVALID_TIME'
  | 'INVALID_SLUG'
  | 'INVALID_LOCATION'
  | 'INVALID_TEMPLATE'
  | 'INVALID_GUESTS_COUNT'
  | 'INVALID_GUEST_NAME'
  | 'SLUG_TAKEN'
  | 'INVITATION_NOT_FOUND';

/** Biznes-qoidaga zid holatni ifodalovchi typed xato. */
export class DomainError extends Error {
  public readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}
