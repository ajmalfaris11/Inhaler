'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
import { BreathingControls } from './components/BreathingControls';

export function BreathingExercise() {
  const { isActive, phase, timer, cycleCount, toggle, reset } = useBreathingTimer();

  return (
    <main className="glass-card" style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Inhale</h1>
      </motion.div>

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

      {cycleCount > 0 && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
          Cycles completed: {cycleCount}
        </div>
      )}

      <BreathingControls isActive={isActive} toggle={toggle} reset={reset} />

      <div style={{ marginTop: '2rem', width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <button style={{ border: 'none', background: 'none', padding: '0.5rem' }}>
          <Settings size={20} color="#888" />
        </button>
        <span style={{ fontSize: '0.8rem', color: '#555', display: 'flex', alignItems: 'center' }}>
          Box Breathing (4-4-4-4)
        </span>
      </div>
    </main>
  );
}
