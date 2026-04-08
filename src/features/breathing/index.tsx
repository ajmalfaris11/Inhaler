'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Info, Moon, Zap, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
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
    <div className="glass-card" style={view === 'details' ? { maxWidth: '600px', padding: '0', overflow: 'hidden' } : {}}>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: '100%' }}
    >
      {/* Hero Section */}
      <div style={{ 
        height: '250px', 
        background: 'linear-gradient(135deg, #001a33 0%, #000 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <button className="back-btn" onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', margin: 0, background: 'rgba(0,0,0,0.3)' }}>
          <ArrowLeft size={18} />
        </button>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 40px rgba(0, 130, 255, 0.4)'
          }}
        >
          <Icon size={40} color="black" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 0 }}
        >
          {exercise.name}
        </motion.h1>
      </div>

      {/* Content Section */}
      <div style={{ padding: '2.5rem' }}>
        <div className="details-section">
          <h3>Description</h3>
          <p style={{ fontSize: '1.1rem', color: '#fff' }}>{exercise.description}</p>
          
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '2rem 0' }} />

          <h3>How to perform</h3>
          <p>{exercise.howTo}</p>
          
          <h3>Why it matters</h3>
          <p>{exercise.why}</p>
          
          <h3>Benefits</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {exercise.benefits.map((b, i) => (
              <span key={i} className="benefit-tag" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                <CheckCircle2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {b}
              </span>
            ))}
          </div>

          <button className="primary" onClick={onStart} style={{ width: '100%', height: '60px', fontSize: '1.1rem' }}>
            <Play size={20} fill="black" />
            Start Session Now
          </button>
        </div>
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
