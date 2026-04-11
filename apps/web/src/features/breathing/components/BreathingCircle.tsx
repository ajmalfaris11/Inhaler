import { motion, AnimatePresence } from 'framer-motion';
import { BreathingPhase } from '../hooks/useBreathingTimer';

interface BreathingCircleProps {
  phase: BreathingPhase;
  timer: number;
  gradient?: {
    start: string;
    end: string;
  };
}

const circleVariants = {
  Inhale: { scale: 1.5, opacity: 1, transition: { duration: 4, ease: "easeInOut" } },
  Hold: { scale: 1.5, opacity: 0.8, transition: { duration: 4, ease: "linear" } },
  Exhale: { scale: 1, opacity: 0.6, transition: { duration: 4, ease: "easeInOut" } },
  Rest: { scale: 1, opacity: 0.4, transition: { duration: 4, ease: "linear" } },
} as const;

export function BreathingCircle({ phase, timer, gradient }: BreathingCircleProps) {
  // Safety fallback for gradient
  const bgGradient = gradient 
    ? `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`
    : 'linear-gradient(135deg, #0082ff 0%, #00ffd5 100%)';
  
  const shadowColor = gradient ? gradient.start : '#0082ff';

  return (
    <div className="relative my-8 flex items-center justify-center">
      <motion.div
        className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full flex items-center justify-center relative shadow-2xl transition-colors duration-500"
        style={{
          background: bgGradient,
          boxShadow: `0 0 100px ${shadowColor}44`
        }}
        animate={phase}
        variants={circleVariants}
      />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl sm:text-9xl font-extralight text-white drop-shadow-2xl font-sans pointer-events-none flex items-center justify-center w-full h-full">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timer}
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 1.1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="absolute"
          >
            {timer}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
