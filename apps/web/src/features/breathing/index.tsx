'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Info, Moon, Zap, Activity, CheckCircle2, ShieldAlert, Wind, AlertTriangle, Trophy, Flame, Compass } from 'lucide-react';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
import { exercises, Exercise } from './data';
import { useSoundscape } from './hooks/useSoundscape';
import { SoundscapeSelector } from './components/SoundscapeSelector';
import { Music } from 'lucide-react';

const IconMap = {
  Moon,
  Zap,
  Activity,
  ShieldAlert,
  Wind,
  Flame,
  Compass,
};

// Precise Speech Utility
const speakPhase = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const priorityVoices = ['Google US English', 'Microsoft Aria Online', 'Natural', 'Samantha', 'Aria'];

  let selectedVoice = null;
  for (const name of priorityVoices) {
    selectedVoice = voices.find(v => v.name.includes(name) && !v.name.includes('Male'));
    if (selectedVoice) break;
  }

  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.pitch = 0.95;
  utterance.rate = 0.9;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
};

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<'home' | 'exercise' | 'details'>('home');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    // Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
      };

      if (document.readyState === 'complete') {
        register();
      } else {
        window.addEventListener('load', register);
      }
    }
  }, []);

  const handleStart = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('exercise');
  };

  const handleDetails = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('details');
  };

  const handleBack = () => {
    setView('home');
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
  };

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-0 max-w-[480px] mx-auto py-12 font-sans">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <HomeView key="home" onStart={handleStart} onDetails={handleDetails} />
        )}
        {view === 'exercise' && selectedExercise && (
          <ExerciseView key="exercise" exercise={selectedExercise} onBack={handleBack} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'details' && selectedExercise && (
          <DetailsView key="details" exercise={selectedExercise} onBack={handleBack} onStart={() => setView('exercise')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeView({ onStart, onDetails }: { onStart: (ex: Exercise) => void; onDetails: (ex: Exercise) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h1 className="text-5xl font-light tracking-tight mb-2 bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent text-center sm:text-left">Inhaler</h1>
      <p className="text-gray-400 text-sm font-light mb-10 text-center sm:text-left tracking-wide">Premium breathing journeys for inner peace.</p>
      
      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} onStart={() => onStart(ex)} onDetails={() => onDetails(ex)} />
      ))}
    </motion.div>
  );
}

function ExerciseCard({ exercise, onStart, onDetails }: { exercise: Exercise; onStart: () => void; onDetails: () => void }) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <div className="bg-surface border border-white/5 rounded-[32px] p-7 mb-6 transition-all duration-500 hover:border-white/10 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      {exercise.isAdvanced && (
        <div className="absolute top-4 right-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full">
          Advanced
        </div>
      )}
      <div className="flex items-center gap-5">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 opacity-90 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
        >
          <Icon size={26} color="black" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <div className="font-normal text-xl leading-tight tracking-tight">{exercise.name}</div>
          <div 
            className="text-[11px] mt-1 uppercase tracking-[0.2em] font-medium"
            style={{ color: exercise.gradient.end }}
          >
            {exercise.subtitle}
          </div>
        </div>
      </div>

      <p className="text-[0.9rem] text-gray-400 leading-relaxed font-light">
        {exercise.description}
      </p>

      <div className="flex gap-4 w-full">
        <button 
          className="flex-1 text-black hover:opacity-90 rounded-full h-12 font-medium text-[0.9rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98]" 
          onClick={onStart}
          style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
        >
          <Play size={16} fill="black" />
          Start
        </button>
        <button 
          className="flex-1 bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 rounded-full h-12 font-medium text-[0.9rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98]" 
          onClick={onDetails}
        >
          <div style={{ color: exercise.gradient.end }}>
            <Info size={16} strokeWidth={1.5} />
          </div>
          Details
        </button>
      </div>
    </div>
  );
}

function DetailsView({ exercise, onBack, onStart }: { exercise: Exercise; onBack: () => void; onStart: () => void }) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-background z-[100] overflow-y-auto flex flex-col font-sans"
    >
      {/* Hero Section */}
      <div className="sticky top-0 z-20 h-[220px] sm:h-[280px] bg-surface flex flex-col items-center justify-center p-8 border-b border-white/5">
        <div className="absolute inset-0 opacity-40 z-[-1]" style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}22 0%, #000 100%)` }} />
        
        <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
        
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
        >
          <Icon size={40} color="black" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-center leading-none">
          {exercise.name}
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 sm:p-12 max-w-2xl mx-auto w-full font-light">
        {exercise.warning && (
          <div className="mb-10 p-5 bg-orange-500/5 border border-orange-500/20 rounded-[24px] flex gap-4 items-start">
            <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={20} />
            <div>
              <span className="block text-[10px] uppercase tracking-[0.1em] font-medium text-orange-500 mb-1">Safety Warning</span>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{exercise.warning}</p>
            </div>
          </div>
        )}

        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>The Essence</span>
          <p className="text-xl text-white leading-relaxed font-light">{exercise.description}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>Methodology</span>
          <p className="text-base text-gray-400 leading-relaxed">{exercise.howTo}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>The Science</span>
          <p className="text-base text-gray-400 leading-relaxed">{exercise.why}</p>
        </div>
        
        <div className="mb-16">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>Core Benefits</span>
          <div className="flex flex-wrap gap-3">
            {exercise.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-xs font-light text-gray-300">
                <CheckCircle2 size={14} className="opacity-60" strokeWidth={1.5} style={{ color: exercise.gradient.end }} />
                {b}
              </span>
            ))}
          </div>
        </div>
        
        <div className="h-24" />
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-background via-background/95 to-transparent z-30 flex justify-center">
        <button 
          onClick={onStart}
          className="w-full max-w-md h-16 rounded-full text-black font-medium text-lg flex items-center justify-center gap-3 shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
          style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
        >
          <Play size={20} fill="black" />
          Begin Practice
        </button>
      </div>
    </motion.div>
  );
}

function ExerciseView({ exercise, onBack }: { exercise: Exercise; onBack: () => void }) {
  const { isActive, phase, timer, cycleCount, toggle, reset } = useBreathingTimer(exercise.pattern);
  const { activeSoundscape, toggleSoundscape, soundscapes } = useSoundscape();
  const [isSoundscapeOpen, setIsSoundscapeOpen] = useState(false);
  const lastPhaseRef = useRef(phase);

  // Trigger speech on phase change
  useEffect(() => {
    if (isActive && phase !== lastPhaseRef.current) {
      speakPhase(phase);
      lastPhaseRef.current = phase;
    }
  }, [phase, isActive]);

  const handleToggle = () => {
    if (!isActive) {
      speakPhase('Inhale');
      lastPhaseRef.current = 'Inhale';
    }
    toggle();
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Milestones for Breath Hold
  const milestones = [60, 45, 30, 15, 5];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-background z-[50] flex flex-col items-center justify-center overflow-hidden font-sans"
    >
      {/* Top Left Return Button */}
      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-[60]"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      {/* Top Right Soundscape Button */}
      <button 
        onClick={() => setIsSoundscapeOpen(true)} 
        className={`absolute top-8 right-8 p-3 rounded-full border transition-all z-[60] flex items-center gap-2 ${
          activeSoundscape !== 'none' 
            ? 'bg-white border-white text-black' 
            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
        }`}
      >
        <Music size={20} strokeWidth={1.5} />
        {activeSoundscape !== 'none' && (
          <span className="text-[10px] font-bold uppercase tracking-wider pr-1">
            {soundscapes.find(s => s.id === activeSoundscape)?.name}
          </span>
        )}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 pb-32">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-light tracking-tighter text-center leading-tight mb-2 font-sans"
        >
          {exercise.name}
        </motion.h1>
        <p className="text-[11px] uppercase tracking-[0.4em] font-medium mb-12 opacity-80" style={{ color: exercise.gradient.end }}>{exercise.subtitle}</p>

        <BreathingCircle phase={phase} timer={timer} gradient={exercise.gradient} />

        <div className="h-10 text-2xl font-light text-center mt-12 flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-light tracking-[0.2em] text-gray-200"
            >
              {isActive ? phase : 'Ready to Begin'}
            </motion.div>
          </AnimatePresence>
          
          {/* Milestone UI for Hold phase */}
          {isActive && phase === 'Hold' && exercise.id === 'deep-hold' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-2"
            >
              <Trophy size={12} className="text-yellow-500" />
              Target: {timer > 60 ? 'Mastery' : timer > 30 ? 'Advanced' : 'Beginner'}
            </motion.div>
          )}
        </div>
        
        <div className="mt-12 text-[11px] uppercase tracking-[0.5em] font-medium text-gray-700">
          {cycleCount} Cycles Completed
        </div>
      </div>

      {/* Sticky Bottom Row for Start and Reset */}
      <div className="absolute bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-background via-background/95 to-transparent z-[60]">
        <div className="max-w-xl mx-auto flex gap-4 w-full">
          <button 
            onClick={handleToggle}
            className="flex-1 h-16 rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-black shadow-xl"
            style={{ 
              background: isActive 
                ? 'white' 
                : `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` 
            }}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} fill="black" />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button 
            onClick={reset}
            className="flex-1 h-16 rounded-full font-medium text-lg flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <RotateCcw size={24} />
            Restart
          </button>
        </div>
      </div>

      <SoundscapeSelector 
        isOpen={isSoundscapeOpen} 
        onClose={() => setIsSoundscapeOpen(false)} 
        activeSoundscape={activeSoundscape}
        onSelect={toggleSoundscape}
      />
    </motion.div>
  );
}
