'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Minus, Info, Moon, Zap, Activity, ShieldAlert, Wind, Flame, Compass, Heart } from 'lucide-react';
import { Exercise, IconMap } from '../data';

const GRADIENTS = [
  { start: '#6366f1', end: '#a855f7', name: 'Mystic' },
  { start: '#0082ff', end: '#00ffd5', name: 'Zen' },
  { start: '#f43f5e', end: '#fb923c', name: 'Sunset' },
  { start: '#10b981', end: '#3b82f6', name: 'Forest' },
  { start: '#ec4899', end: '#8b5cf6', name: 'Lotus' },
  { start: '#4b5563', end: '#111827', name: 'Void' },
];

const ICONS = Object.keys(IconMap);

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
          onClick={() => setter(value + 1)}
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
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

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
      icon: selectedIcon,
      gradient: {
        start: selectedGradient.start,
        end: selectedGradient.end
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

            <div className="space-y-10">
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

              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium px-1">Visual Identity</span>
                <div className="flex flex-col gap-6 p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                  {/* Icon Selector */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {ICONS.map((iconName) => {
                      const Icon = IconMap[iconName as keyof typeof IconMap];
                      const isActive = selectedIcon === iconName;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setSelectedIcon(iconName)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                            isActive ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Gradient Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    {GRADIENTS.map((g) => {
                      const isActive = selectedGradient.start === g.start;
                      return (
                        <button
                          key={g.name}
                          onClick={() => setSelectedGradient(g)}
                          className={`h-10 rounded-xl border flex items-center justify-center gap-2 px-3 transition-all ${
                            isActive ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ background: `linear-gradient(135deg, ${g.start}, ${g.end})` }}
                          />
                          <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>{g.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex gap-4">
                <Info size={20} className="text-gray-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Customizing your visuals helps you mentally associate specific themes with your breathing states.
                </p>
              </div>

              <button 
                onClick={handleSave}
                disabled={!name.trim()}
                className={`w-full h-16 rounded-full flex items-center justify-center gap-3 font-medium text-lg transition-all active:scale-[0.98] shadow-xl ${
                  name.trim() ? 'bg-white text-black hover:opacity-90' : 'bg-white/5 text-gray-600 border border-white/5 pointer-events-none'
                }`}
                style={{ 
                  boxShadow: name.trim() ? `0 10px 30px ${selectedGradient.start}44` : 'none'
                }}
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
