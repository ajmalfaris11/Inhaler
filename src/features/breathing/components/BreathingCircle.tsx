import React from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { BreathingPhase } from '../hooks/useBreathingTimer';

interface BreathingCircleProps {
  phase: BreathingPhase;
  timer: number;
  gradient: {
    start: string;
    end: string;
  };
}

const circleVariants = {
  Inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
  Hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "linear" } },
  Exhale: { scale: 1, opacity: 0.6, transition: { duration: 4, ease: "easeInOut" } },
  Rest: { scale: 1, opacity: 0.4, transition: { duration: 4, ease: "linear" } },
};

export function BreathingCircle({ phase, timer, gradient }: BreathingCircleProps) {
  return (
    <div className="relative my-8 flex items-center justify-center">
      <motion.div
        className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full flex items-center justify-center relative shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`,
          boxShadow: `0 0 80px ${gradient.start}33`
        }}
        animate={phase}
        variants={circleVariants}
      >
        <Wind size={48} color="white" className="opacity-50" strokeWidth={1} />
      </motion.div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-extralight text-white drop-shadow-2xl font-sans">
        {timer}
      </div>
    </div>
  );
}
