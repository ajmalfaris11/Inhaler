'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Timer, RotateCcw, Infinity, Check } from 'lucide-react';
import { Exercise } from '../data';

interface SessionSetupProps {
  exercise: Exercise;
  onBack: () => void;
  onConfirm: (config: SessionConfig) => void;
}

export interface SessionConfig {
  mode: 'duration' | 'cycles' | 'infinite';
  value: number;
}

export function SessionSetup({ exercise, onBack, onConfirm }: SessionSetupProps) {
  const [mode, setMode] = useState<'duration' | 'cycles' | 'infinite'>('duration');
  const [value, setValue] = useState(5); // Default 5 mins or 10 cycles

  const durationOptions = [2, 5, 10, 15, 20];
  const cycleOptions = [10, 20, 30, 50, 100];

  const handleConfirm = () => {
    onConfirm({ mode, value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full flex flex-col min-h-[70vh] justify-between py-4"
    >
      <div className="space-y-12">
        {/* Header */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-light text-white tracking-tight">Setup Session</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">{exercise.name}</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-3 bg-white/[0.03] p-1.5 rounded-[32px] border border-white/[0.05]">
          {[
            { id: 'duration', icon: Timer, label: 'Time' },
            { id: 'cycles', icon: RotateCcw, label: 'Cycles' },
            { id: 'infinite', icon: Infinity, label: 'Free' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMode(item.id as any);
                if (item.id === 'duration') setValue(5);
                if (item.id === 'cycles') setValue(20);
              }}
              className={`relative py-4 rounded-[26px] flex flex-col items-center gap-2 transition-all duration-500 ${
                mode === item.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {mode === item.id && (
                <motion.div 
                  layoutId="active-mode-bg"
                  className="absolute inset-0 bg-white/10 rounded-[26px] border border-white/10 shadow-lg"
                />
              )}
              <item.icon size={20} className="relative z-10" />
              <span className="text-[10px] font-bold uppercase tracking-widest relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Value Selection */}
        <div className="space-y-6 px-2">
          {mode !== 'infinite' ? (
            <>
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Goal</span>
                <span className="text-4xl font-light text-white">
                  {value} <span className="text-lg text-gray-500">{mode === 'duration' ? 'min' : 'rounds'}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {(mode === 'duration' ? durationOptions : cycleOptions).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setValue(opt)}
                    className={`h-14 rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300 border ${
                      value === opt 
                        ? 'bg-white border-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.2)]' 
                        : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-[40px] p-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-indigo-400">
                <Infinity size={32} strokeWidth={1} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                Practice at your own pace.<br/>The session will continue until you manually stop it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <button 
        onClick={handleConfirm}
        className="w-full h-20 rounded-[32px] bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(255,255,255,0.2)] mt-12"
      >
        <Check size={24} />
        Confirm & Start
      </button>
    </motion.div>
  );
}
