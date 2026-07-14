import { type Result, ok, err } from '../result';
import { DomainError } from '../errors/domain-error';

/** Geografik nuqta — Telegram lokatsiya pin'idan (lat/lng). */
export class GeoPoint {
  private constructor(
    public readonly lat: number,
    public readonly lng: number,
  ) {}

  static create(lat: number, lng: number): Result<GeoPoint, DomainError> {
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return err(
        new DomainError('INVALID_LOCATION', "Kenglik (lat) -90..90 oralig'ida bo'lishi kerak."),
      );
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return err(
        new DomainError('INVALID_LOCATION', "Uzunlik (lng) -180..180 oralig'ida bo'lishi kerak."),
      );
    }
    return ok(new GeoPoint(lat, lng));
  }
}
