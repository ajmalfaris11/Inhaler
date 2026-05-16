'use client';

import { useState, useEffect, useRef } from 'react';

export type SoundscapeType = 'none' | 'zen-river' | 'zen-fountain' | 'winter-rain' | 'light-rain' | 'nature-birds' | 'hz-transformation';

interface Soundscape {
  id: SoundscapeType;
  name: string;
  url: string;
}

export const soundscapes: Soundscape[] = [
  { id: 'zen-river', name: 'Zen River', url: '/music/alex_jauk-calm-zen-river-flowing-228223.mp3' },
  { id: 'zen-fountain', name: 'Zen Fountain', url: '/music/alex_jauk-zen-fountain-ambience-210613.mp3' },
  { id: 'winter-rain', name: 'Winter Rain', url: '/music/fxprosound-winter-rain-in-oak-forest-loop-185672.mp3' },
  { id: 'light-rain', name: 'Light Rain', url: '/music/liecio-light-rain-109591.mp3' },
  { id: 'nature-birds', name: 'Nature Birds', url: '/music/mdjahidhossain-birds-nature-relax-sounds-110839.mp3' },
  { id: 'hz-transformation', name: '528Hz Transform', url: '/music/soul_frequencies-528-hz-transformation-music-500282.mp3' },
];

export function useSoundscape(isPlaying: boolean = false) {
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

    if (activeSoundscape === 'none' || !isPlaying) {
      audio.pause();
    } else {
      const sound = soundscapes.find(s => s.id === activeSoundscape);
      if (sound) {
        if (audio.src !== window.location.origin + sound.url) {
          audio.src = sound.url;
        }
        audio.volume = volume;
        audio.play().catch(err => console.error("Audio play failed:", err));
      }
    }

    return () => {
      audio.pause();
    };
  }, [activeSoundscape, isPlaying, volume]);

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
