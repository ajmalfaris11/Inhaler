'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Activity } from 'lucide-react';
import { Exercise, IconMap } from '../data';

interface DetailsViewProps {
  exercise: Exercise;
  onBack: () => void;
  onStart: () => void;
}

export function DetailsView({ exercise, onBack, onStart }: DetailsViewProps) {
  const Icon = (IconMap as any)[exercise.icon] || Activity;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="bg-surface border border-white/10 rounded-[48px] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-hide"
      >
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="p-8 sm:p-12">
          <div className="flex flex-col items-center text-center mb-10 pt-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
            >
              <Icon className="text-white" size={40} />
            </div>
            <h2 className="text-4xl font-light text-white mb-2">{exercise.name}</h2>
            <p className="text-gray-400 text-sm font-light tracking-wide">{exercise.subtitle}</p>
          </div>

          <div className="space-y-10">
            <section>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 mb-4">Focus</h4>
              <p className="text-gray-300 leading-relaxed font-light">{exercise.description}</p>
            </section>

            <section>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 mb-4">How to practice</h4>
              <p className="text-gray-300 leading-relaxed font-light">{exercise.howTo}</p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              {exercise.benefits.map((b: string, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-4 rounded-3xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-xs text-gray-400 font-light">{b}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onStart}
              className="w-full h-16 rounded-full bg-white text-black font-medium text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <Play size={20} fill="currentColor" />
              Begin Journey
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
