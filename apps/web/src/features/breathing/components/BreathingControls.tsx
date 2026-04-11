import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
}

export function BreathingControls({ isActive, toggle, reset }: BreathingControlsProps) {
  return (
    <div className="mt-12 flex gap-4 justify-center">
      <button 
        onClick={toggle} 
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
          !isActive 
            ? 'bg-white text-black hover:bg-gray-200' 
            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
        }`}
      >
        {isActive ? <Pause size={20} /> : <Play size={20} />}
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button 
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
      >
        <RotateCcw size={20} />
        Reset
      </button>
    </div>
  );
}
