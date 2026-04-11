'use client';

import { useState, useEffect, useRef } from 'react';

export type BinauralType = 'none' | 'alpha' | 'theta' | 'delta';

interface BinauralConfig {
  id: BinauralType;
  name: string;
  description: string;
  frequency: number; // The beat frequency
  baseFreq: number;  // The carrier frequency
}

export const binauralConfigs: BinauralConfig[] = [
  { 
    id: 'alpha', 
    name: 'Alpha Focus', 
    description: '10Hz for flow state and alert relaxation.',
    frequency: 10,
    baseFreq: 200
  },
  { 
    id: 'theta', 
    name: 'Theta Meditate', 
    description: '6Hz for deep meditation and creativity.',
    frequency: 6,
    baseFreq: 180
  },
  { 
    id: 'delta', 
    name: 'Delta Rest', 
    description: '2.5Hz for deep physical relaxation.',
    frequency: 2.5,
    baseFreq: 140
  },
];

export function useBinauralBeats() {
  const [activeBinaural, setActiveBinaural] = useState<BinauralType>('none');
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const leftPannerRef = useRef<StereoPannerNode | null>(null);
  const rightPannerRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stop = () => {
    if (leftOscRef.current) {
      leftOscRef.current.stop();
      leftOscRef.current.disconnect();
      leftOscRef.current = null;
    }
    if (rightOscRef.current) {
      rightOscRef.current.stop();
      rightOscRef.current.disconnect();
      rightOscRef.current = null;
    }
  };

  const start = (config: BinauralConfig) => {
    if (typeof window === 'undefined') return;
    
    stop();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.gain.value = volume;
    gainNodeRef.current.connect(ctx.destination);

    // Left Ear
    leftOscRef.current = ctx.createOscillator();
    leftOscRef.current.type = 'sine';
    leftOscRef.current.frequency.value = config.baseFreq;
    
    leftPannerRef.current = ctx.createStereoPanner();
    leftPannerRef.current.pan.value = -1;
    
    leftOscRef.current.connect(leftPannerRef.current);
    leftPannerRef.current.connect(gainNodeRef.current);

    // Right Ear
    rightOscRef.current = ctx.createOscillator();
    rightOscRef.current.type = 'sine';
    rightOscRef.current.frequency.value = config.baseFreq + config.frequency;
    
    rightPannerRef.current = ctx.createStereoPanner();
    rightPannerRef.current.pan.value = 1;
    
    rightOscRef.current.connect(rightPannerRef.current);
    rightPannerRef.current.connect(gainNodeRef.current);

    leftOscRef.current.start();
    rightOscRef.current.start();
  };

  useEffect(() => {
    if (activeBinaural === 'none') {
      stop();
    } else {
      const config = binauralConfigs.find(c => c.id === activeBinaural);
      if (config) start(config);
    }

    return () => stop();
  }, [activeBinaural]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current?.currentTime || 0, 0.1);
    }
  }, [volume]);

  const toggleBinaural = (id: BinauralType) => {
    setActiveBinaural(prev => prev === id ? 'none' : id);
  };

  return {
    activeBinaural,
    setActiveBinaural,
    toggleBinaural,
    binauralVolume: volume,
    setBinauralVolume: setVolume,
    binauralConfigs
  };
}
