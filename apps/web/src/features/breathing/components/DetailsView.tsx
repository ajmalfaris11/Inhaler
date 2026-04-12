'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Activity, Info, ShieldAlert, Zap, Heart, CheckCircle2 } from 'lucide-react';
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
      className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        className="bg-[#0D0D0D] border border-white/[0.08] rounded-[48px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative scrollbar-hide"
      >
        {/* Hero Header */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 blur-[100px]"
            style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0D]/40 to-[#0D0D0D]" />
          
          <button 
            onClick={onBack}
            className="absolute top-8 left-8 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all z-20"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl relative"
              style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
            >
              <div className="absolute inset-0 blur-2xl opacity-50" style={{ background: exercise.gradient.start }} />
              <Icon className="text-white relative z-10" size={40} />
            </motion.div>
            <h2 className="text-4xl font-light text-white mt-6 tracking-tight">{exercise.name}</h2>
            <p className="text-gray-500 text-xs uppercase tracking-[0.4em] mt-2 font-semibold">{exercise.subtitle}</p>
          </div>
        </div>

        <div className="px-8 sm:px-12 pb-12 space-y-12">
          {/* Summary */}
          <section className="text-center max-w-lg mx-auto">
            <p className="text-gray-300 text-lg leading-relaxed font-light italic">
              "{exercise.description}"
            </p>
          </section>

          {/* Grid Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-indigo-400">
                <Info size={18} />
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">The Science</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                {exercise.why}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Zap size={18} />
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Technique</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                {exercise.howTo}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <section className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-6 flex items-center gap-2">
              <Heart size={14} className="text-pink-500" />
              Primary Benefits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exercise.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-300 font-light">{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Warnings */}
          {exercise.warning && (
            <section className="bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-8">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-orange-500 mb-3 flex items-center gap-2">
                <ShieldAlert size={14} />
                Safety Warning
              </h4>
              <p className="text-sm text-orange-200/60 leading-relaxed font-light">
                {exercise.warning}
              </p>
            </section>
          )}

          {/* Pattern Preview */}
          <section className="flex items-center justify-center gap-8 py-4 px-8 bg-white/[0.02] border border-white/[0.05] rounded-full">
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-widest text-gray-600 mb-1">Inhale</span>
              <span className="text-lg font-light text-white">{exercise.pattern.inhale}s</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-widest text-gray-600 mb-1">Hold</span>
              <span className="text-lg font-light text-white">{exercise.pattern.hold1}s</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-widest text-gray-600 mb-1">Exhale</span>
              <span className="text-lg font-light text-white">{exercise.pattern.exhale}s</span>
            </div>
          </section>

          {/* Final CTA */}
          <button 
            onClick={onStart}
            className="w-full h-20 rounded-full bg-white text-black font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
          >
            <Play size={20} fill="currentColor" />
            Begin Journey Now
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
