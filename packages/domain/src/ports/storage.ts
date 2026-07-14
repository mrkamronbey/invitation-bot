/** Yuklangan fayl ma'lumoti. */
export interface StoredFile {
  readonly url: string;
  readonly path: string;
}

export interface UploadInput {
  readonly bucket: string;
  readonly path: string;
  readonly bytes: Uint8Array;
  readonly contentType: string;
}

/** Fayl ombori (port) — rasm/musiqa. Infrastructure Supabase Storage bilan bajaradi. */
export interface Storage {
  upload(input: UploadInput): Promise<StoredFile>;
}
