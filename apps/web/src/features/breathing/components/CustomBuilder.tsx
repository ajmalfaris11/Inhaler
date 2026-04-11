'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Minus, Info } from 'lucide-react';
import { Exercise } from '../data';

interface CustomBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
}

const DurationSelector = React.memo(({ label, value, setter }: { label: string, value: number, setter: (v: number) => void }) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium px-1">{label}</span>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setter(Math.max(0, value - 1))}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <Minus size={18} />
        </button>
        
        <div className="flex-1 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5">
          <span className="text-xl font-light text-white">{value}</span>
          <span className="text-[10px] text-gray-500 ml-1.5 uppercase tracking-wide">sec</span>
        </div>

        <button 
          onClick={() => setter(Math.min(60, value + 1))}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
});

DurationSelector.displayName = 'DurationSelector';

export function CustomBuilder({ isOpen, onClose, onSave }: CustomBuilderProps) {
  const [name, setName] = useState('');
  const [inhale, setInhale] = useState(4);
  const [hold1, setHold1] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold2, setHold2] = useState(4);

  const handleSave = () => {
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: name,
      subtitle: 'My Journey',
      description: `Custom pattern: ${inhale}-${hold1}-${exhale}-${hold2}`,
      howTo: `Inhale for ${inhale}s, hold for ${hold1}s, exhale for ${exhale}s, and hold for ${hold2}s.`,
      why: 'This is your personalized breathing journey designed for your specific needs.',
      benefits: ['Personalized flow', 'Custom rhythm'],
      icon: 'Activity',
      gradient: {
        start: '#6366f1',
        end: '#a855f7'
      },
      pattern: { inhale, hold1, exhale, hold2 }
    };

    onSave(newExercise);
    setName('');
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-surface border border-white/10 rounded-[40px] z-[120] p-8 shadow-2xl overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-light tracking-tight text-white">Create Journey</h2>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Design your own pattern</p>
              </div>
              <button onClick={onClose} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium px-1">Journey Name</span>
                <input 
                  type="text" 
                  placeholder="e.g. Morning Focus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-8">
                <DurationSelector label="Inhale Duration" value={inhale} setter={setInhale} />
                <DurationSelector label="Hold Duration (Full)" value={hold1} setter={setHold1} />
                <DurationSelector label="Exhale Duration" value={exhale} setter={setExhale} />
                <DurationSelector label="Hold Duration (Empty)" value={hold2} setter={setHold2} />
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex gap-4">
                <Info size={20} className="text-gray-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  A typical cycle usually lasts between 12-24 seconds. Try to keep your exhale equal to or longer than your inhale for maximum relaxation.
                </p>
              </div>

              <button 
                onClick={handleSave}
                disabled={!name.trim()}
                className={`w-full h-16 rounded-full flex items-center justify-center gap-3 font-medium text-lg transition-all active:scale-[0.98] shadow-xl ${
                  name.trim() ? 'bg-white text-black hover:opacity-90' : 'bg-white/5 text-gray-600 border border-white/5 pointer-events-none'
                }`}
              >
                <Save size={20} />
                Save to My Journey
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
