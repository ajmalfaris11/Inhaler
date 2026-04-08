import React from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { BreathingPhase } from '../hooks/useBreathingTimer';

interface BreathingCircleProps {
  phase: BreathingPhase;
  timer: number;
}

const circleVariants = {
  Inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
  Hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "linear" } },
  Exhale: { scale: 1, opacity: 0.6, transition: { duration: 4, ease: "easeInOut" } },
  Rest: { scale: 1, opacity: 0.4, transition: { duration: 4, ease: "linear" } },
};

export function BreathingCircle({ phase, timer }: BreathingCircleProps) {
  return (
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
  );
}
