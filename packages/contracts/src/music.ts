/** Tayyor (default) fon musiqalari — bot tanlov ko'rsatadi, web ijro etadi. */
export interface MusicTrack {
  readonly id: string;
  readonly name: string;
  readonly url: string;
}

const BASE = 'https://czeuszszsdprclplmyee.supabase.co/storage/v1/object/public/invitations/music';

/**
 * Mavjud tayyor kuylar. Yangi kuy qo'shilganda shu yerga qo'shiladi.
 * (Hozircha vaqtinchalik namuna audiolar — keyin haqiqiy to'y kuylariga almashtiriladi.)
 */
export const DEFAULT_MUSIC: readonly MusicTrack[] = [
  { id: 'm1', name: '🎵 Nozik', url: `${BASE}/default-1.mp3` },
  { id: 'm2', name: '🎵 Tantanavor', url: `${BASE}/default-2.mp3` },
  { id: 'm3', name: '🎵 Romantik', url: `${BASE}/default-3.mp3` },
];
