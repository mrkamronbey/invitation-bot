'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface MusicToggleProps {
  readonly src: string;
}

/** Fon musiqasi — brauzer siyosatiga ko'ra user bosgandan keyin ijro etiladi. */
export function MusicToggle({ src }: MusicToggleProps): ReactNode {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle(): void {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label="Musiqa"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 text-lg text-white shadow-lg backdrop-blur transition-transform hover:scale-105"
      >
        {playing ? '🔊' : '🎵'}
      </button>
    </>
  );
}
