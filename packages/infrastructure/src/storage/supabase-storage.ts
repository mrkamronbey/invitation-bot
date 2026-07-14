import type { Storage, StoredFile, UploadInput } from '@invitation/domain';
import type { SupabaseClient } from '../supabase/client';

/** Supabase Storage adapteri — rasm/musiqa yuklaydi va public URL qaytaradi. */
export class SupabaseStorage implements Storage {
  constructor(private readonly db: SupabaseClient) {}

  async upload(input: UploadInput): Promise<StoredFile> {
    const bucket = this.db.storage.from(input.bucket);
    const { error } = await bucket.upload(input.path, input.bytes, {
      contentType: input.contentType,
      upsert: true,
    });
    if (error) throw error;

    const { data } = bucket.getPublicUrl(input.path);
    return { url: data.publicUrl, path: input.path };
  }
}
