'use client';

import { useState, useEffect, useRef } from 'react';

export type SoundscapeType = 'none' | 'rain' | 'forest' | 'deep-space' | 'zen-bowls';

interface Soundscape {
  id: SoundscapeType;
  name: string;
  url: string;
}

export const soundscapes: Soundscape[] = [
  { id: 'rain', name: 'Rain', url: '/music/liecio-light-rain-109591.mp3' },
  { id: 'forest', name: 'Forest', url: '/music/mdjahidhossain-birds-nature-relax-sounds-110839.mp3' },
  { id: 'deep-space', name: 'Deep Space', url: '/music/soul_frequencies-528-hz-transformation-music-500282.mp3' },
  { id: 'zen-bowls', name: 'Zen Bowls', url: '/music/alex_jauk-zen-fountain-ambience-210613.mp3' },
];

export function useSoundscape() {
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('none');
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    if (activeSoundscape === 'none') {
      audio.pause();
    } else {
      const sound = soundscapes.find(s => s.id === activeSoundscape);
      if (sound) {
        audio.src = sound.url;
        audio.volume = volume;
        audio.play().catch(err => console.error("Audio play failed:", err));
      }
    }

    return () => {
      audio.pause();
    };
  }, [activeSoundscape]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSoundscape = (id: SoundscapeType) => {
    setActiveSoundscape(prev => prev === id ? 'none' : id);
  };

  return {
    activeSoundscape,
    setActiveSoundscape,
    toggleSoundscape,
    volume,
    setVolume,
    soundscapes
  };
}
