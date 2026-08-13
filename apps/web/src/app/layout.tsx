import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Cormorant_Garamond, Pinyon_Script, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/shared/ui/toast';

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

// Kalligrafik aksent — "va", "hurmatli", sana oldidagi nozik yozuvlar uchun.
const script = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elektron to‘y taklifnomasi',
  description: 'Telegram orqali yaratiladigan chiroyli to‘y taklifnomalari.',
};

export default async function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}): Promise<ReactNode> {
  const dark = (await cookies()).get('site_theme')?.value === 'dark';
  const lang = (await cookies()).get('site_lang')?.value === 'ru' ? 'ru' : 'uz';
  return (
    <html
      lang={lang}
      className={`${display.variable} ${royalSerif.variable} ${script.variable}${dark ? ' dark' : ''}`}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
