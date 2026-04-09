'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Info, Moon, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
import { BreathingControls } from './components/BreathingControls';
import { exercises, Exercise } from './data';

const IconMap = {
  Moon,
  Zap,
  Activity,
};

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<'home' | 'exercise' | 'details'>('home');

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
  };

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-0 max-w-[480px] mx-auto py-12">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <HomeView onStart={handleStart} onDetails={handleDetails} />
        )}
        {view === 'exercise' && (
          <ExerciseView exercise={selectedExercise!} onBack={handleBack} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'details' && selectedExercise && (
          <DetailsView exercise={selectedExercise} onBack={handleBack} onStart={() => setView('exercise')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeView({ onStart, onDetails }: { onStart: (ex: Exercise) => void; onDetails: (ex: Exercise) => void }) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-br from-white via-white to-gray-600 bg-clip-text text-transparent text-center sm:text-left">Inhale</h1>
      <p className="text-gray-500 text-sm font-medium mb-10 text-center sm:text-left">Premium breathing exercises for modern minds.</p>
      
      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} onStart={() => onStart(ex)} onDetails={() => onDetails(ex)} />
      ))}
    </motion.div>
  );
}

function ExerciseCard({ exercise, onStart, onDetails }: { exercise: Exercise; onStart: () => void; onDetails: () => void }) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <div className="bg-surface border border-white/10 rounded-[32px] p-6 mb-6 transition-all duration-400 hover:bg-surface-hover hover:border-accent-start/20 flex flex-col gap-6 shadow-xl">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center shrink-0">
          <Icon size={28} color="black" />
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-xl leading-tight">{exercise.name}</div>
          <div className="text-[10px] text-accent-end mt-1 uppercase tracking-widest font-black">{exercise.subtitle}</div>
        </div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        {exercise.description}
      </p>

      <div className="flex gap-3 w-full">
        <button className="flex-1 bg-white text-black hover:bg-gray-200 rounded-full h-12 font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]" onClick={onStart}>
          <Play size={18} fill="black" />
          Start
        </button>
        <button className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full h-12 font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]" onClick={onDetails}>
          <Info size={18} />
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
      key="details"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-background z-[100] overflow-y-auto flex flex-col"
    >
      {/* Hero Section */}
      <div className="sticky top-0 z-20 h-[220px] sm:h-[280px] bg-surface flex flex-col items-center justify-center p-8 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] to-black opacity-60 z-[-1]" />
        
        <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft size={22} />
        </button>
        
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,130,255,0.4)]">
          <Icon size={48} color="black" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-center leading-none">
          {exercise.name}
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 sm:p-12 max-w-2xl mx-auto w-full">
        <div className="mb-12">
          <span className="block text-[10px] uppercase tracking-[0.25em] font-black text-accent-end mb-4">The Essence</span>
          <p className="text-xl text-white font-semibold leading-relaxed opacity-95">{exercise.description}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[10px] uppercase tracking-[0.25em] font-black text-accent-end mb-4">Methodology</span>
          <p className="text-base text-gray-400 leading-relaxed font-medium">{exercise.howTo}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[10px] uppercase tracking-[0.25em] font-black text-accent-end mb-4">The Science</span>
          <p className="text-base text-gray-400 leading-relaxed font-medium">{exercise.why}</p>
        </div>
        
        <div className="mb-16">
          <span className="block text-[10px] uppercase tracking-[0.25em] font-black text-accent-end mb-4">Core Benefits</span>
          <div className="flex flex-wrap gap-3">
            {exercise.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-black text-gray-300">
                <CheckCircle2 size={14} className="text-accent-end" />
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
          className="w-full max-w-md h-16 rounded-[28px] bg-gradient-to-br from-accent-start to-accent-end text-black font-black text-xl flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(0,130,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Play size={24} fill="black" />
          Begin Practice
        </button>
      </div>
    </motion.div>
  );
}

function ExerciseView({ exercise, onBack }: { exercise: Exercise; onBack: () => void }) {
  const { isActive, phase, timer, cycleCount, toggle, reset } = useBreathingTimer(exercise.pattern);

  return (
    <motion.div
      key="exercise"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center w-full"
    >
      <div className="w-full flex justify-start mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          Return
        </button>
      </div>

      <h1 className="text-5xl font-black tracking-tighter text-center leading-tight mb-2">{exercise.name}</h1>
      <p className="text-accent-end text-[10px] uppercase tracking-widest font-black mb-12">{exercise.subtitle}</p>

      <BreathingCircle phase={phase} timer={timer} />

      <div className="h-10 text-2xl font-light text-center mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-medium tracking-wide text-gray-300"
          >
            {isActive ? phase : 'Tap Start to Begin'}
          </motion.div>
        </AnimatePresence>
      </div>

      <BreathingControls isActive={isActive} toggle={toggle} reset={reset} />
      
      <div className="mt-12 text-[10px] uppercase tracking-[0.3em] font-black text-gray-800">
        {cycleCount} Cycles Completed
      </div>
    </motion.div>
  );
}
