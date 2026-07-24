import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LandingPage } from '@/views/landing/LandingPage';
import { getSiteDict, getSiteLang } from '@/shared/i18n/site';

export const metadata: Metadata = {
  title: 'taklif.uz — Elektron to‘y taklifnomasi | Telegramda 2 daqiqada',
  description:
    'Telegram bot yoki sayt orqali chiroyli, animatsiyali elektron to‘y taklifnomasi yarating. Ma’lumot kiriting, noyob havola oling. Mehmonlar web sahifada RSVP qiladi.',
};

export default async function Page(): Promise<ReactNode> {
  const lang = await getSiteLang();
  return <LandingPage lang={lang} dict={getSiteDict(lang)} />;
}
