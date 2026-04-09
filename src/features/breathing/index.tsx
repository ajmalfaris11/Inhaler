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
    <div className="flex flex-col items-center w-full px-4 sm:px-0">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <div className="bg-surface border border-white/10 rounded-[40px] p-8 w-full max-auto max-w-[480px] mt-8 shadow-2xl">
            <HomeView onStart={handleStart} onDetails={handleDetails} />
          </div>
        )}
        {view === 'exercise' && (
          <div className="bg-surface border border-white/10 rounded-[40px] p-8 w-full max-auto max-w-[480px] mt-8 shadow-2xl">
            <ExerciseView exercise={selectedExercise!} onBack={handleBack} />
          </div>
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
    >
      <h1 className="text-4xl font-extrabold tracking-tighter mb-1 bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Inhale</h1>
      <p className="text-gray-500 text-sm font-medium mb-8">Premium breathing exercises for modern minds.</p>
      
      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} onStart={() => onStart(ex)} onDetails={() => onDetails(ex)} />
      ))}
    </motion.div>
  );
}

function ExerciseCard({ exercise, onStart, onDetails }: { exercise: Exercise; onStart: () => void; onDetails: () => void }) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 mb-6 transition-all duration-400 hover:bg-surface-hover hover:border-accent-start/20 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center shrink-0">
          <Icon size={24} color="black" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg leading-tight">{exercise.name}</div>
          <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide font-semibold">{exercise.subtitle}</div>
        </div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        {exercise.description}
      </p>

      <div className="flex gap-3 w-full">
        <button className="flex-1 bg-white text-black hover:bg-gray-200 rounded-full py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-all" onClick={onStart}>
          <Play size={16} fill="black" />
          Start
        </button>
        <button className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-full py-2.5 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-all" onClick={onDetails}>
          <Info size={16} />
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
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-background z-[100] overflow-y-auto flex flex-col"
    >
      {/* Hero Section */}
      <div className="sticky top-0 z-20 h-[220px] sm:h-[250px] bg-surface flex flex-col items-center justify-center p-8 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] to-black opacity-50 z-[-1]" />
        
        <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft size={20} />
        </button>
        
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(0,130,255,0.4)]">
          <Icon size={40} color="black" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-center leading-none">
          {exercise.name}
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 sm:p-12 max-w-2xl mx-auto w-full">
        <div className="mb-10">
          <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-accent-end mb-3">What is it?</span>
          <p className="text-xl text-white font-medium leading-relaxed opacity-90">{exercise.description}</p>
        </div>
        
        <div className="mb-10">
          <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-accent-end mb-3">Instructions</span>
          <p className="text-base text-gray-400 leading-relaxed font-medium">{exercise.howTo}</p>
        </div>
        
        <div className="mb-10">
          <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-accent-end mb-3">Science</span>
          <p className="text-base text-gray-400 leading-relaxed font-medium">{exercise.why}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[10px] uppercase tracking-[0.2em] font-black text-accent-end mb-3">Benefits</span>
          <div className="flex flex-wrap gap-2">
            {exercise.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300">
                <CheckCircle2 size={14} className="text-accent-end" />
                {b}
              </span>
            ))}
          </div>
        </div>
        
        {/* Spacer for sticky bottom bar */}
        <div className="h-20" />
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 w-full p-6 sm:p-8 bg-gradient-to-t from-background via-background/90 to-transparent z-30 flex justify-center">
        <button 
          onClick={onStart}
          className="w-full max-w-md h-16 rounded-[24px] bg-gradient-to-br from-accent-start to-accent-end text-black font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,130,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Play size={22} fill="black" />
          Start Session
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
      className="flex flex-col items-center"
    >
      <div className="w-full flex justify-start">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <h1 className="text-4xl font-black tracking-tight mt-4 text-center">{exercise.name}</h1>
      <p className="text-gray-500 text-sm mb-8">{exercise.subtitle}</p>

      <BreathingCircle phase={phase} timer={timer} />

      <div className="h-6 text-xl font-light text-center mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {isActive ? phase : 'Tap Start to Begin'}
          </motion.div>
        </AnimatePresence>
      </div>

      <BreathingControls isActive={isActive} toggle={toggle} reset={reset} />
      
      <div className="mt-8 text-[10px] uppercase tracking-widest font-black text-gray-700">
        {cycleCount} Cycles Completed
      </div>
    </motion.div>
  );
}
