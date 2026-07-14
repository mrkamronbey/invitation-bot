import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LandingPage } from '@/views/landing/LandingPage';

export const metadata: Metadata = {
  title: 'taklif.uz — Elektron to‘y taklifnomasi | Telegramda 2 daqiqada',
  description:
    'Telegram bot orqali chiroyli, animatsiyali elektron to‘y taklifnomasi yarating. Shablon tanlang, ma’lumot kiriting, noyob havola oling. Mehmonlar web sahifada RSVP qiladi.',
};

export default function Page(): ReactNode {
  return <LandingPage />;
}
