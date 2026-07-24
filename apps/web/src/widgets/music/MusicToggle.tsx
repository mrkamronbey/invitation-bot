'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

/** Fon musiqasi — suzuvchi play/pause tugmasi (brauzer avtoplayni bloklaydi). */
export function MusicToggle({ src }: { readonly src: string }): ReactNode {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  async function toggle(): Promise<void> {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        /* play rad etildi — e'tiborsiz */
      }
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Pauza' : 'Musiqa'}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold-light/40 bg-emerald-deep/80 text-gold-light shadow-lg backdrop-blur-sm transition hover:bg-emerald"
    >
      <span className={playing ? 'animate-pulse' : ''}>{playing ? '♪' : '♫'}</span>
    </button>
  );
}
