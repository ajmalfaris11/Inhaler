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
    <div className="relative my-8 flex items-center justify-center">
      <motion.div
        className="breathing-circle w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]"
        animate={phase}
        variants={circleVariants}
      >
        <Wind size={48} color="white" className="opacity-50" />
      </motion.div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-white drop-shadow-2xl">
        {timer}
      </div>
    </div>
  );
}
