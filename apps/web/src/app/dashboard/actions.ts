'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/shared/auth/current-user';
import { deleteMyInvitation } from '@/shared/api/dashboard-source';

/** Taklifnomani o'chirish (dashboard form action). Faqat egasi. */
export async function removeInvitationAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await deleteMyInvitation(id, session.sub);
  revalidatePath('/dashboard');
}
