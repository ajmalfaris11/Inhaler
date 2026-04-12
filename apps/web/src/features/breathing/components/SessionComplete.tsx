'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Trophy, Clock, Zap, Target, Home, RotateCcw } from 'lucide-react';
import { Exercise } from '../data';

interface SessionCompleteProps {
  exercise: Exercise;
  duration: number;
  cycles: number;
  onHome: () => void;
  onRestart: () => void;
}

export function SessionComplete({ exercise, duration, cycles, onHome, onRestart }: SessionCompleteProps) {
  const stats = [
    { label: 'Time Mindful', value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`, icon: Clock, color: 'text-blue-400' },
    { label: 'Total Cycles', value: cycles.toString(), icon: RotateCcw, color: 'text-indigo-400' },
    { label: 'Focus Points', value: (cycles * 10).toString(), icon: Zap, color: 'text-amber-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-6 overflow-y-auto scrollbar-hide"
    >
      <div className="max-w-[480px] w-full space-y-10 py-10">
        {/* Lottie Celebration */}
        <div className="relative h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
          <DotLottieReact
            src="https://lottie.host/801a615e-49b8-4c28-9840-7e47268d0d6d/m0a6wMvA8A.json"
            loop
            autoplay
            style={{ width: '300px', height: '300px' }}
          />
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-light text-white tracking-tight">Well Done!</h2>
            <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mt-2 font-bold">Session Completed</p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-white/[0.03] border border-white/[0.05] rounded-[32px] p-6 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <span className="text-gray-400 font-light text-sm">{stat.label}</span>
              </div>
              <span className="text-2xl font-light text-white">{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Achievements / Level Up Concept */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[40px] p-8 flex flex-col items-center text-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Trophy size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-medium">Daily Streak Maintained</h4>
            <p className="text-xs text-indigo-300/60 leading-relaxed font-light">
              You've completed your practice today. Keep going to reach your weekly mindfulness goal.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-4">
          <button 
            onClick={onHome}
            className="w-full h-18 rounded-[30px] bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-2xl"
          >
            <Home size={20} />
            Back to Home
          </button>
          
          <button 
            onClick={onRestart}
            className="w-full h-18 rounded-[30px] bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
          >
            <RotateCcw size={18} />
            Practice Again
          </button>
        </div>
      </div>
    </motion.div>
  );
}
