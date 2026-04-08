import { useState, useEffect } from 'react';

export type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

export function useBreathingTimer() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('Rest');
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

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setPhase('Rest');
    setTimer(4);
    setCycleCount(0);
  };

  return { isActive, phase, timer, cycleCount, toggle, reset };
}
