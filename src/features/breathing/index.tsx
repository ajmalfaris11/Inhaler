'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Info, Moon, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
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
      <h1 className="text-5xl font-light tracking-tight mb-2 bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent text-center sm:text-left font-sans">Inhale</h1>
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
    <div className="bg-surface border border-white/5 rounded-[32px] p-7 mb-6 transition-all duration-500 hover:border-accent-start/30 flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center shrink-0 opacity-90 shadow-lg">
          <Icon size={26} color="black" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <div className="font-normal text-xl leading-tight tracking-tight">{exercise.name}</div>
          <div className="text-[11px] text-accent-end mt-1 uppercase tracking-[0.2em] font-medium">{exercise.subtitle}</div>
        </div>
      </div>

      <p className="text-[0.9rem] text-gray-400 leading-relaxed font-light">
        {exercise.description}
      </p>

      <div className="flex gap-4 w-full">
        <button className="flex-1 bg-white text-black hover:bg-gray-200 rounded-full h-12 font-medium text-[0.9rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98]" onClick={onStart}>
          <Play size={16} fill="black" />
          Start
        </button>
        <button className="flex-1 bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 rounded-full h-12 font-medium text-[0.9rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98]" onClick={onDetails}>
          <Info size={16} strokeWidth={1.5} />
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
      <div className="sticky top-0 z-20 h-[220px] sm:h-[280px] bg-surface flex flex-col items-center justify-center p-8 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] to-black opacity-40 z-[-1]" />
        
        <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
        
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center mb-6 shadow-xl">
          <Icon size={40} color="black" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-center leading-none">
          {exercise.name}
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 sm:p-12 max-w-2xl mx-auto w-full font-light">
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium text-accent-end mb-4 opacity-80">The Essence</span>
          <p className="text-xl text-white leading-relaxed font-light">{exercise.description}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium text-accent-end mb-4 opacity-80">Methodology</span>
          <p className="text-base text-gray-400 leading-relaxed">{exercise.howTo}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium text-accent-end mb-4 opacity-80">The Science</span>
          <p className="text-base text-gray-400 leading-relaxed">{exercise.why}</p>
        </div>
        
        <div className="mb-16">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium text-accent-end mb-4 opacity-80">Core Benefits</span>
          <div className="flex flex-wrap gap-3">
            {exercise.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-xs font-light text-gray-300">
                <CheckCircle2 size={14} className="text-accent-end opacity-60" strokeWidth={1.5} />
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
          className="w-full max-w-md h-16 rounded-full bg-gradient-to-br from-accent-start to-accent-end text-black font-medium text-lg flex items-center justify-center gap-3 shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
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

  return (
    <motion.div
      key="exercise"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-background z-[50] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Top Left Return Button */}
      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-[60]"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 pb-32">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-light tracking-tighter text-center leading-tight mb-2"
        >
          {exercise.name}
        </motion.h1>
        <p className="text-accent-end text-[11px] uppercase tracking-[0.4em] font-medium mb-12 opacity-80">{exercise.subtitle}</p>

        <BreathingCircle phase={phase} timer={timer} />

        <div className="h-10 text-2xl font-light text-center mt-12">
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
        </div>
        
        <div className="mt-8 text-[11px] uppercase tracking-[0.5em] font-medium text-gray-700">
          {cycleCount} Cycles Completed
        </div>
      </div>

      {/* Sticky Bottom Row for Start and Reset */}
      <div className="absolute bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-background via-background/95 to-transparent z-[60]">
        <div className="max-w-xl mx-auto flex gap-4 w-full">
          <button 
            onClick={toggle}
            className={`flex-1 h-16 rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              !isActive 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} fill={!isActive ? 'black' : 'none'} />}
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
    </motion.div>
  );
}
