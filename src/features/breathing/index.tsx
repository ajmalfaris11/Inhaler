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
    <div className="glass-card" style={view === 'details' ? { maxWidth: '500px', padding: '0', overflowY: 'auto', maxHeight: '85vh' } : {}}>
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <HomeView onStart={handleStart} onDetails={handleDetails} />
        )}
        {view === 'details' && (
          <DetailsView exercise={selectedExercise!} onBack={handleBack} onStart={() => setView('exercise')} />
        )}
        {view === 'exercise' && (
          <ExerciseView exercise={selectedExercise!} onBack={handleBack} />
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
      <h1>Inhale</h1>
      <p className="subtitle">Premium breathing exercises for modern minds.</p>
      
      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} onStart={() => onStart(ex)} onDetails={() => onDetails(ex)} />
      ))}
    </motion.div>
  );
}

function ExerciseCard({ exercise, onStart, onDetails }: { exercise: Exercise; onStart: () => void; onDetails: () => void }) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <div className="exercise-card">
      <div className="card-header">
        <div className="card-icon">
          <Icon size={24} color="black" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{exercise.name}</div>
          <div style={{ fontSize: '0.85rem', color: '#777', marginTop: '2px' }}>{exercise.subtitle}</div>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: '#999', lineHeight: '1.5' }}>
        {exercise.description}
      </p>

      <div className="card-actions">
        <button className="primary" onClick={onStart}>
          <Play size={16} fill="black" />
          Start
        </button>
        <button onClick={onDetails}>
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ width: '100%' }}
    >
      {/* Hero Section */}
      <div className="details-hero">
        <button className="back-btn" onClick={onBack} style={{ position: 'absolute', top: '24px', left: '24px', margin: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={18} />
        </button>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card-icon"
          style={{ width: '72px', height: '72px', borderRadius: '24px', marginBottom: '1.25rem' }}
        >
          <Icon size={32} color="black" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 0, letterSpacing: '-0.05em' }}
        >
          {exercise.name}
        </motion.h1>
      </div>

      {/* Content Section */}
      <div className="details-content-wrapper">
        <span className="section-title">What is it?</span>
        <p className="section-text">{exercise.description}</p>
        
        <span className="section-title">Instructions</span>
        <p className="section-subtext">{exercise.howTo}</p>
        
        <span className="section-title">Science</span>
        <p className="section-subtext">{exercise.why}</p>
        
        <span className="section-title">Benefits</span>
        <div className="benefit-list">
          {exercise.benefits.map((b, i) => (
            <span key={i} className="benefit-tag">
              <CheckCircle2 size={14} color="var(--accent-end)" />
              {b}
            </span>
          ))}
        </div>

        <button className="start-action-btn" onClick={onStart}>
          <Play size={20} fill="black" />
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <button className="back-btn" onClick={onBack} style={{ border: 'none', background: 'none' }}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <h1 style={{ marginTop: '1rem' }}>{exercise.name}</h1>
      <p className="subtitle">{exercise.subtitle}</p>

      <BreathingCircle phase={phase} timer={timer} />

      <div className="status-text">
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
      
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#444' }}>
        {cycleCount} Cycles Completed
      </div>
    </motion.div>
  );
}
