import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Shartli class nomlarini birlashtiradi + Tailwind konfliktlarini hal qiladi (shadcn). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
