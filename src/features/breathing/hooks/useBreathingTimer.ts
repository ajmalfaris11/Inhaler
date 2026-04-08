import { useState, useEffect } from 'react';

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
          if (prev <= 1) {
            if (phase === 'Inhale') {
              if (pattern.hold1 > 0) {
                setPhase('Hold');
                return pattern.hold1;
              }
              setPhase('Exhale');
              return pattern.exhale;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return pattern.exhale;
            } else if (phase === 'Exhale') {
              if (pattern.hold2 > 0) {
                setPhase('Rest');
                return pattern.hold2;
              }
              setPhase('Inhale');
              setCycleCount((c) => c + 1);
              return pattern.inhale;
            } else {
              setPhase('Inhale');
              setCycleCount((c) => c + 1);
              return pattern.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhase('Rest');
      setTimer(pattern.inhale);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, pattern]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setPhase('Rest');
    setTimer(pattern.inhale);
    setCycleCount(0);
  };

  return { isActive, phase, timer, cycleCount, toggle, reset };
}
