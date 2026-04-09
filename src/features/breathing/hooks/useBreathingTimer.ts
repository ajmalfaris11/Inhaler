import { useState, useEffect, useRef } from 'react';

export type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

interface Pattern {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

export function useBreathingTimer(pattern: Pattern) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('Rest');
  const [timer, setTimer] = useState(pattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);

  // Use a ref to track the last spoken phase to avoid double triggers
  const lastSpokenPhase = useRef<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      // If we just started, immediately set phase to Inhale
      if (phase === 'Rest') {
        setPhase('Inhale');
        setTimer(pattern.inhale);
      }

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Determine next phase
            let nextPhase: BreathingPhase = 'Inhale';
            let nextTimer = pattern.inhale;

            if (phase === 'Inhale') {
              if (pattern.hold1 > 0) {
                nextPhase = 'Hold';
                nextTimer = pattern.hold1;
              } else {
                nextPhase = 'Exhale';
                nextTimer = pattern.exhale;
              }
            } else if (phase === 'Hold') {
              nextPhase = 'Exhale';
              nextTimer = pattern.exhale;
            } else if (phase === 'Exhale') {
              if (pattern.hold2 > 0) {
                nextPhase = 'Rest';
                nextTimer = pattern.hold2;
              } else {
                nextPhase = 'Inhale';
                nextTimer = pattern.inhale;
                setCycleCount((c) => c + 1);
              }
            } else if (phase === 'Rest') {
              nextPhase = 'Inhale';
              nextTimer = pattern.inhale;
              setCycleCount((c) => c + 1);
            }

            setPhase(nextPhase);
            return nextTimer;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, pattern]);

  const toggle = () => {
    if (!isActive) {
      // Starting: immediately trigger phase change
      setPhase('Inhale');
      setTimer(pattern.inhale);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setPhase('Rest');
    setTimer(pattern.inhale);
    setCycleCount(0);
  };

  return { isActive, phase, timer, cycleCount, toggle, reset };
}
