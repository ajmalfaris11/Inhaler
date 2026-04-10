import { useState, useEffect, useCallback } from 'react';

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

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Timer hit zero, transition phase
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
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, pattern]);

  const toggle = useCallback(() => {
    setIsActive((prev) => {
      const starting = !prev;
      if (starting) {
        setPhase('Inhale');
        setTimer(pattern.inhale);
      }
      return starting;
    });
  }, [pattern.inhale]);

  const reset = useCallback(() => {
    setIsActive(false);
    setPhase('Rest');
    setTimer(pattern.inhale);
    setCycleCount(0);
  }, [pattern.inhale]);

  return { isActive, phase, timer, cycleCount, toggle, reset };
}
