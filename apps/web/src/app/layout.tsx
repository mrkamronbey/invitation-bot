import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import './globals.css';

// Nafis serif — kuyov-kelin ismi va katta sarlavhalar uchun. Tana esa Gilroy.
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elektron to‘y taklifnomasi',
  description: 'Telegram orqali yaratiladigan chiroyli to‘y taklifnomalari.',
};

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html lang="uz" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
