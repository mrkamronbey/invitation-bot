const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

/** `2026-09-15` → `15-sentabr, 2026`. */
export function formatEventDate(iso: string): string {
  const [yearRaw, monthRaw, dayRaw] = iso.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const monthName = UZ_MONTHS[month - 1] ?? '';
  return `${day}-${monthName}, ${year}`;
}

/** `17:00` → `17:00` (bo'sh bo'lsa bo'sh qator). */
export function formatEventTime(time: string | undefined): string {
  return time ?? '';
}
