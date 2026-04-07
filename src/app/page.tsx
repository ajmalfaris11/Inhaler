'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Wind } from 'lucide-react';

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Rest');
  const [timer, setTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Switch phases
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 4;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 4;
            } else if (phase === 'Exhale') {
              setPhase('Rest');
              return 4;
            } else {
              setPhase('Inhale');
              setCycleCount((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhase('Rest');
      setTimer(4);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleApp = () => setIsActive(!isActive);
  const resetApp = () => {
    setIsActive(false);
    setPhase('Rest');
    setTimer(4);
    setCycleCount(0);
  };

  const circleVariants = {
    Inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
    Hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "linear" } },
    Exhale: { scale: 1, opacity: 0.6, transition: { duration: 4, ease: "easeInOut" } },
    Rest: { scale: 1, opacity: 0.4, transition: { duration: 4, ease: "linear" } },
  };

  return (
    <main className="glass-card" style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Inhale</h1>
      </motion.div>

      <div style={{ position: 'relative', margin: '2rem 0' }}>
        <motion.div
          className="breathing-circle"
          animate={phase}
          variants={circleVariants}
        >
          <Wind size={48} color="white" style={{ opacity: 0.5 }} />
        </motion.div>
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3rem',
          fontWeight: 700,
          color: 'white',
          textShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}>
          {timer}
        </div>
      </div>

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

      <div className="controls">
        <button onClick={toggleApp} className={!isActive ? 'primary' : ''}>
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetApp}>
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

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
