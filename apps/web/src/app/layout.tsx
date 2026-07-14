import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elektron to‘y taklifnomasi',
  description: 'Telegram orqali yaratiladigan chiroyli to‘y taklifnomalari.',
};

export default function RootLayout({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
