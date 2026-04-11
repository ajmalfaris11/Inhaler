'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceProfile {
  id: string;
  name: string;
  pitch: number;
  rate: number;
  lang: string;
  voiceNameIncludes: string[];
}

export const voiceProfiles: VoiceProfile[] = [
  {
    id: 'luna',
    name: 'Zen Guide',
    pitch: 1.05,
    rate: 0.75,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'Samantha', 'Google US English', 'Aria'],
  },
  {
    id: 'atlas',
    name: 'Scientific Instructor',
    pitch: 0.8,
    rate: 0.8,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'David', 'Microsoft David', 'Guy', 'Google US English Male'],
  },
  {
    id: 'aria',
    name: 'Soft Whisper',
    pitch: 0.95,
    rate: 0.7,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'Google UK English Female', 'Zira'],
  },
  {
    id: 'caspian',
    name: 'Deep Presence',
    pitch: 0.9,
    rate: 0.75,
    lang: 'en-US',
    voiceNameIncludes: ['Natural', 'Neural', 'James', 'Google UK English Male'],
  }
];

export function useVoiceAssistant() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('luna');
  const [isEnabled, setIsEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const updateVoices = useCallback(() => {
    if (synthRef.current) {
      const allVoices = synthRef.current.getVoices();
      // Prioritize high-quality voices
      const sortedVoices = [...allVoices].sort((a, b) => {
        const aIsNatural = a.name.includes('Natural') || a.name.includes('Neural');
        const bIsNatural = b.name.includes('Natural') || b.name.includes('Neural');
        if (aIsNatural && !bIsNatural) return -1;
        if (!aIsNatural && bIsNatural) return 1;
        return 0;
      });
      setVoices(sortedVoices);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }
  }, [updateVoices]);

  const getVoice = useCallback((profile: VoiceProfile) => {
    if (voices.length === 0) return null;

    const isMaleProfile = profile.id === 'atlas' || profile.id === 'caspian';

    // 1. Try to find by specific priority names + Natural/Neural
    for (const name of profile.voiceNameIncludes) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }

    // 2. Fallback to gender detection + quality
    if (isMaleProfile) {
      const maleVoice = voices.find(v =>
        (v.name.includes('Natural') || v.name.includes('Neural')) &&
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy'))
      );
      if (maleVoice) return maleVoice;
    } else {
      const femaleVoice = voices.find(v =>
        (v.name.includes('Natural') || v.name.includes('Neural')) &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('aria'))
      );
      if (femaleVoice) return femaleVoice;
    }

    return voices[0];
  }, [voices]);

  const speak = useCallback((text: string, forceProfile?: VoiceProfile) => {
    if (!synthRef.current || !isEnabled) return;

    synthRef.current.cancel();
    const profile = forceProfile || voiceProfiles.find(p => p.id === selectedProfileId) || voiceProfiles[0];

    // Adding commas and ellipses to force natural-sounding pauses
    const formattedText = text
      .replace('Inhale', 'Breathe in...')
      .replace('Exhale', 'Breathe out...')
      .replace('Hold', 'Hold...');

    const utterance = new SpeechSynthesisUtterance(formattedText);

    const voice = getVoice(profile);
    if (voice) utterance.voice = voice;

    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = voiceVolume;

    synthRef.current.speak(utterance);
  }, [selectedProfileId, isEnabled, voiceVolume, getVoice]);

  const testVoice = (profileId: string) => {
    const profile = voiceProfiles.find(p => p.id === profileId);
    if (profile) {
      speak(`Hello. I am the ${profile.name}. Let's find some peace together. Breathe in... and out.`, profile);
    }
  };

  return {
    selectedProfileId,
    setSelectedProfileId,
    isEnabled,
    setIsEnabled,
    voiceVolume,
    setVoiceVolume,
    speak,
    testVoice,
    voiceProfiles
  };
}
