'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Info, Moon, Zap, Activity, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [view, setView] = useState<'home' | 'exercise'>('home');

  const handleStart = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('exercise');
  };

  const handleBack = () => {
    setView('home');
  };

  return (
    <div className="glass-card">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <HomeView onStart={handleStart} />
        ) : (
          <ExerciseView exercise={selectedExercise!} onBack={handleBack} />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeView({ onStart }: { onStart: (ex: Exercise) => void }) {
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
        <ExerciseCard key={ex.id} exercise={ex} onStart={() => onStart(ex)} />
      ))}
    </motion.div>
  );
}

function ExerciseCard({ exercise, onStart }: { exercise: Exercise; onStart: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
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

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="details-content"
          >
            <h4>How to</h4>
            <p>{exercise.howTo}</p>
            <h4>Benefits</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {exercise.benefits.map((b, i) => (
                <span key={i} className="benefit-tag">{b}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card-actions">
        <button className="primary" onClick={onStart}>
          <Play size={16} fill="black" />
          Start
        </button>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          <Info size={16} />
          {isExpanded ? 'Less' : 'Details'}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
