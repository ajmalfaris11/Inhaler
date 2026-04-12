'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Settings, Play, Sparkles, Trophy, Zap } from 'lucide-react';
import { Exercise, exercises } from '../data';
import { ExerciseCard } from './ExerciseCard';

interface ExploreViewProps {
  onStart: (ex: Exercise) => void;
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
}

export function ExploreView({ 
  onStart, 
  onDetails, 
  customExercises, 
  favorites, 
  onToggleFavorite,
  stats
}: ExploreViewProps) {
  const featuredExercise = exercises[0]; // Box Breathing as featured

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-10"
    >
      {/* Header & Streak */}
      <div className="flex justify-between items-start px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Inhaler</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Zen System</p>
        </div>
        <div className="flex gap-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-lg"
          >
            <Zap className="text-orange-500" size={14} fill="currentColor" />
            <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest">{stats.streak} Day Streak</span>
          </motion.div>
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all cursor-pointer">
            <Settings size={18} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full rounded-[48px] overflow-hidden group">
        <div 
          className="absolute inset-0 opacity-20 blur-[80px] group-hover:opacity-30 transition-opacity duration-1000"
          style={{ background: `linear-gradient(135deg, ${featuredExercise.gradient.start}, ${featuredExercise.gradient.end})` }}
        />
        
        <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-[48px] p-10 flex flex-col items-center text-center gap-6 overflow-hidden shadow-2xl">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-[28px] bg-white/[0.05] border border-white/10 flex items-center justify-center shadow-inner relative"
          >
            <Sparkles className="text-indigo-400" size={32} strokeWidth={1.5} />
            <div className="absolute inset-0 blur-2xl bg-indigo-500/20 rounded-full" />
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-4xl font-light text-white tracking-tight leading-tight">Master Your Breath</h2>
            <p className="text-gray-400 text-sm font-light max-w-[280px] leading-relaxed mx-auto">
              Synchronize your mind and body with professional breathing techniques.
            </p>
          </div>

          <button 
            onClick={() => onStart(featuredExercise)}
            className="h-16 px-10 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all mt-4"
          >
            <Play size={18} fill="currentColor" />
            Quick Start
          </button>

          {/* Decorative Elements */}
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
      </section>
      
      {/* Custom Section */}
      {customExercises.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Personal Journeys</span>
            <span className="text-[10px] text-gray-500 font-medium">{customExercises.length} sessions</span>
          </div>

          <div className="flex flex-col gap-5">
            {customExercises.map((ex) => (
              <ExerciseCard 
                key={ex.id} 
                exercise={ex} 
                onStart={() => onStart(ex)} 
                onDetails={() => onDetails(ex)}
                isFavorite={favorites.includes(ex.id)}
                onToggleFavorite={() => onToggleFavorite(ex.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Global Collection</span>
          <span className="text-[10px] text-gray-500 font-medium">{exercises.length} practices</span>
        </div>
        
        <div className="flex flex-col gap-5">
          {exercises.map((ex: Exercise) => (
            <ExerciseCard 
              key={ex.id} 
              exercise={ex} 
              onStart={() => onStart(ex)} 
              onDetails={() => onDetails(ex)}
              isFavorite={favorites.includes(ex.id)}
              onToggleFavorite={() => onToggleFavorite(ex.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
