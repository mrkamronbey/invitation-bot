import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import './globals.css';

// Nafis serif — kuyov-kelin ismi va katta sarlavhalar uchun. Tana esa Gilroy.
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Royal shablon uchun — yuqori kontrastli nafis serif (royal-v2-green uslubi).
const royalSerif = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-royal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elektron to‘y taklifnomasi',
  description: 'Telegram orqali yaratiladigan chiroyli to‘y taklifnomalari.',
};

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html lang="uz" className={`${display.variable} ${royalSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
