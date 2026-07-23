import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/shared/auth/current-user';
import { SiteHeader } from '@/widgets/site-header/SiteHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

/**
 * Dashboard (vaqtinchalik minimal) — sessiyani tekshiradi va foydalanuvchini
 * ko'rsatadi. To'liq boshqaruv (taklifnomalar ro'yxati, yaratish/tahrir)
 * 7–8-bosqichda quriladi.
 */
export default async function DashboardPage(): Promise<ReactNode> {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader userName={session.name} />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl">Salom, {session.name}! 👋</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Bu yer — sizning shaxsiy kabinetingiz. Tez orada shu yerda barcha
          taklifnomalaringiz, yaratish va tahrirlash bo‘ladi.
        </p>

        <Card className="mt-8 max-w-md">
          <CardHeader>
            <CardTitle>Yangi taklifnoma</CardTitle>
            <CardDescription>Bir necha daqiqada chiroyli taklifnoma yarating.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Yaratish (tez orada)</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
