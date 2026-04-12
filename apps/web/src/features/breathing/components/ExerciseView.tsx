'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Pause, Play, Music, Settings as SettingsIcon } from 'lucide-react';
import { Exercise } from '../data';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { useSoundscape } from '../hooks/useSoundscape';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useBinauralBeats } from '../hooks/useBinauralBeats';
import { BreathingCircle } from './BreathingCircle';
import { SessionSettings } from './SessionSettings';

interface ExerciseViewProps {
  exercise: Exercise;
  onBack: () => void;
  onRecordSession: (id: string, duration: number) => void;
}

export function ExerciseView({ exercise, onBack, onRecordSession }: ExerciseViewProps) {
  const timer = useBreathingTimer(exercise.pattern);
  const soundscape = useSoundscape(timer.isActive);
  const voice = useVoiceAssistant(timer.phase, timer.isActive);
  const binaural = useBinauralBeats(timer.isActive);

  // Record session on leave if any time was spent
  useEffect(() => {
    return () => {
      if (timer.totalTime > 10) { // Only record if spent more than 10 seconds
        onRecordSession(exercise.id, timer.totalTime);
      }
    };
  }, [timer.totalTime, exercise.id, onRecordSession]);

  // Local settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [selectedVoiceId, setSelectedVoiceId] = useState('seraphina');

  const handleReset = () => {
    timer.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center w-full min-h-[80vh] justify-between py-8"
    >
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-light text-white tracking-tight">{exercise.name}</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{timer.phase}</p>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <SettingsIcon size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <BreathingCircle 
          phase={timer.phase} 
          timer={timer.timeLeft}
          gradient={exercise.gradient}
        />
      </div>

      <div className="w-full space-y-8 mt-12">
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handleReset}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            onClick={timer.toggle}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            {timer.isActive ? <Pause size={32} fill="black" /> : <Play size={32} className="ml-1" fill="black" />}
          </button>

          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg">
            <Music size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[24px] flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest text-gray-600">Cycles</span>
            <span className="text-xl font-light text-white">{timer.cycles}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[24px] flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest text-gray-600">Duration</span>
            <span className="text-xl font-light text-white">
              {Math.floor(timer.totalTime / 60)}:{(timer.totalTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <SessionSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeSoundscape={soundscape.activeSoundscape}
        onSelectSoundscape={soundscape.toggleSoundscape}
        soundscapeVolume={soundscape.volume}
        onSetSoundscapeVolume={soundscape.setVolume}
        isVoiceEnabled={isVoiceEnabled}
        onSetVoiceEnabled={setIsVoiceEnabled}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={setSelectedVoiceId}
        voiceVolume={voiceVolume}
        onSetVoiceVolume={setVoiceVolume}
        onTestVoice={(id) => {
          if (typeof window !== 'undefined') {
            const utterance = new SpeechSynthesisUtterance("Inhale deeply through your nose.");
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.name.includes(id === 'atlas' ? 'Male' : 'Female'));
            if (voice) utterance.voice = voice;
            window.speechSynthesis.speak(utterance);
          }
        }}
        activeBinaural={binaural.activeBinaural}
        onSelectBinaural={binaural.toggleBinaural}
        binauralVolume={binaural.binauralVolume}
        onSetBinauralVolume={binaural.setBinauralVolume}
      />
    </motion.div>
  );
}
