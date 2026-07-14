/** Foydalanuvchi kiritgan ism/sana/vaqtni moslashuvchan tahlil qiladi. */

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * "Kuyov va kelin" ismini bitta matndan ajratadi.
 * Ajratuvchilar: "va", "and", "и", "&", ",", "/", "-", "—".
 * Birinchi ism — kuyov, ikkinchisi — kelin. Ikkitadan kam bo'lsa — null.
 */
export function parseNames(raw: string): { groom: string; bride: string } | null {
  const parts = raw
    .split(/\s*(?:\bva\b|\band\b|\bи\b|&|,|\/|—|-|\+)\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (parts.length < 2) return null;
  const [groom, bride] = parts;
  if (!groom || !bride) return null;
  return { groom, bride };
}

function isValidYmd(y: number, mo: number, d: number): boolean {
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/**
 * Sanani turli formatlardan (15.09.2026, 15/09/2026, 15-09-2026, 2026-09-15)
 * ISO YYYY-MM-DD ko'rinishiga keltiradi. Noto'g'ri bo'lsa — null.
 */
export function parseDate(raw: string): string | null {
  const s = raw.trim();

  // YYYY-MM-DD / YYYY.MM.DD / YYYY/MM/DD
  const ymd = /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/.exec(s);
  if (ymd) {
    const [y, mo, d] = [Number(ymd[1]), Number(ymd[2]), Number(ymd[3])];
    return isValidYmd(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null;
  }

  const dmy = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(s);
  if (dmy) {
    const [d, mo, y] = [Number(dmy[1]), Number(dmy[2]), Number(dmy[3])];
    return isValidYmd(y, mo, d) ? `${y}-${pad(mo)}-${pad(d)}` : null;
  }

  return null;
}

/**
 * Vaqtni moslashuvchan tahlil qiladi (17:00, 17.00, 17, 9:5) → HH:mm. Noto'g'ri bo'lsa — null.
 */
export function parseTime(raw: string): string | null {
  const s = raw.trim().replace(/\s+/g, '');

  const hm = /^(\d{1,2})[:.](\d{1,2})$/.exec(s);
  if (hm) {
    const [h, mi] = [Number(hm[1]), Number(hm[2])];
    return h < 24 && mi < 60 ? `${pad(h)}:${pad(mi)}` : null;
  }

  const hOnly = /^(\d{1,2})$/.exec(s);
  if (hOnly) {
    const h = Number(hOnly[1]);
    return h < 24 ? `${pad(h)}:00` : null;
  }

  return null;
}
