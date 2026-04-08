import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
}

export function BreathingControls({ isActive, toggle, reset }: BreathingControlsProps) {
  return (
    <div className="controls">
      <button onClick={toggle} className={!isActive ? 'primary' : ''}>
        {isActive ? <Pause size={20} /> : <Play size={20} />}
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>
        <RotateCcw size={20} />
        Reset
      </button>
    </div>
  );
}
