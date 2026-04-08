'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
import { BreathingControls } from './components/BreathingControls';
import { exercises, Exercise } from './data';

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<'home' | 'exercise'>('home');

  const handleSelect = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('exercise');
  };

  const handleBack = () => {
    setView('home');
    // We'll reset state when going back
  };

  return (
    <div className="glass-card">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <HomeView onSelect={handleSelect} />
        ) : (
          <ExerciseView exercise={selectedExercise!} onBack={handleBack} />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeView({ onSelect }: { onSelect: (ex: Exercise) => void }) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Inhale</h1>
      <p className="subtitle">Choose your breathing journey</p>
      
      {exercises.map((ex) => (
        <div key={ex.id} className="exercise-card" onClick={() => onSelect(ex)}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0082ff, #00ffd5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <ChevronRight size={20} color="black" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{ex.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#888' }}>{ex.subtitle}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function ExerciseView({ exercise, onBack }: { exercise: Exercise; onBack: () => void }) {
  const { isActive, phase, timer, cycleCount, toggle, reset } = useBreathingTimer(exercise.pattern);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      key="exercise"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Home
        </button>
      </div>

      <h1>{exercise.name}</h1>
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
            {isActive ? phase : 'Ready to begin?'}
          </motion.div>
        </AnimatePresence>
      </div>

      <BreathingControls isActive={isActive} toggle={toggle} reset={reset} />

      <div style={{ marginTop: '2.5rem', width: '100%' }}>
        <button 
          style={{ width: '100%', justifyContent: 'center', background: showDetails ? 'var(--surface-hover)' : 'var(--glass)' }}
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info size={18} />
          {showDetails ? 'Hide' : 'View'} Details
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="details-section">
                <h3>What is it?</h3>
                <p>{exercise.description}</p>
                
                <h3>How to do it?</h3>
                <p>{exercise.howTo}</p>
                
                <h3>Why it works?</h3>
                <p>{exercise.why}</p>
                
                <h3>Benefits</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {exercise.benefits.map((b, i) => (
                    <span key={i} className="benefit-tag">{b}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
