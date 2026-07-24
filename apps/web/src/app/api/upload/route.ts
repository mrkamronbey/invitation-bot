import { type NextRequest, NextResponse } from 'next/server';
import { SupabaseStorage, createSupabaseClient } from '@invitation/infrastructure';
import { getSession } from '@/shared/auth/current-user';

const BUCKET = 'invitations';
const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

/** Rasm yuklash — sessiya tekshiriladi, Supabase Storage'ga (service-role) yoziladi. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'storage not configured' }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file kerak' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'faqat rasm' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'rasm 6MB dan katta' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `gallery/${session.sub}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

  try {
    const storage = new SupabaseStorage(createSupabaseClient({ url, key }));
    const stored = await storage.upload({ bucket: BUCKET, path, bytes, contentType: file.type });
    return NextResponse.json({ url: stored.url });
  } catch {
    return NextResponse.json({ error: 'yuklashda xatolik' }, { status: 500 });
  }
}
