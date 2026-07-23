import { type Result, ok, err } from '../result';
import { DomainError } from '../errors/domain-error';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_LENGTH = 80;

/** Kirill → lotin transliteratsiya (o'zbek/rus ismlarini slug qilish uchun). */
const TRANSLIT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'x',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'i',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ў: 'o',
  қ: 'q',
  ғ: 'g',
  ҳ: 'h',
};

const slugify = (raw: string): string =>
  raw
    .toLowerCase()
    .split('')
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join('')
    .replace(/['`ʼ’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_LENGTH)
    .replace(/-+$/g, '');

/** URL slug — masalan `aziz-va-malika`. */
export class Slug {
  private constructor(public readonly value: string) {}

  /** Tayyor slug qatorini tekshiradi (masalan bazadan/URL'dan kelgan). */
  static create(raw: string): Result<Slug, DomainError> {
    const value = raw.trim().toLowerCase();
    if (!SLUG_PATTERN.test(value) || value.length > MAX_LENGTH) {
      return err(
        new DomainError(
          'INVALID_SLUG',
          "Slug faqat kichik harf, raqam va tire (-) dan iborat bo'lsin.",
        ),
      );
    }
    return ok(new Slug(value));
  }

  /** Kuyov va kelin ismidan asosiy slug yasaydi: `aziz-va-malika`. */
  static fromNames(groom: string, bride: string): Result<Slug, DomainError> {
    const g = slugify(groom);
    const b = slugify(bride);
    if (g.length === 0 || b.length === 0) {
      return err(new DomainError('INVALID_SLUG', "Ismlardan slug yasab bo'lmadi."));
    }
    return Slug.create(`${g}-va-${b}`);
  }

  /**
   * Ismlar + noyob (taxmin qilib bo'lmaydigan) qisqa kod: `aziz-malika-7f3k9q`.
   * Kod use-case tomonidan beriladi (IdGenerator asosida). Har taklifnoma uchun
   * unique link — birov boshqasinikini ko'ra olmaydi.
   */
  static fromNamesWithCode(groom: string, bride: string, code: string): Result<Slug, DomainError> {
    const g = slugify(groom);
    const b = slugify(bride);
    const c = slugify(code);
    if (g.length === 0 || b.length === 0 || c.length === 0) {
      return err(new DomainError('INVALID_SLUG', "Ismlardan slug yasab bo'lmadi."));
    }
    return Slug.create(`${g}-${b}-${c}`);
  }

  /** Band bo'lgan slug uchun raqamli qo'shimcha: `aziz-va-malika-2`. */
  withSuffix(n: number): Result<Slug, DomainError> {
    return Slug.create(`${this.value}-${n}`);
  }
}
