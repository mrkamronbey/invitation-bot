'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/shared/auth/current-user';
import {
  createInvitationForOwner,
  updateInvitationForOwner,
} from '@/shared/api/dashboard-source';
import type { EditorInput, EditorResult } from '@/shared/api/editor-types';

/** Yangi taklifnoma yaratadi (editor formasi). */
export async function createInvitationAction(input: EditorInput): Promise<EditorResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Iltimos qayta kiring.' };
  const res = await createInvitationForOwner(session.sub, input);
  if (res.ok) revalidatePath('/dashboard');
  return res;
}

/** Mavjud taklifnomani tahrirlaydi (editor formasi). */
export async function updateInvitationAction(
  id: string,
  input: EditorInput,
): Promise<EditorResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: 'Iltimos qayta kiring.' };
  const res = await updateInvitationForOwner(id, session.sub, input);
  if (res.ok) revalidatePath('/dashboard');
  return res;
}
