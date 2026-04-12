'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bookmark, Trash2, ChevronRight, Play, Info } from 'lucide-react';
import { Exercise, IconMap } from '../data';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: () => void;
  onDetails: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ExerciseCard({ 
  exercise, 
  onStart, 
  onDetails, 
  onDelete, 
  isCustom, 
  isFavorite, 
  onToggleFavorite 
}: ExerciseCardProps) {
  const Icon = (IconMap as any)[exercise.icon] || Activity;
  const level = exercise.isAdvanced ? 'Advanced' : 'Beginner';

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full bg-[#0A0A0A] border border-white/[0.08] rounded-[38px] p-1 overflow-hidden group transition-all duration-700 shadow-2xl"
    >
      {/* Inner Glow / Mesh Gradient Effect */}
      <div 
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 70% 30%, ${exercise.gradient.start} 0%, transparent 70%)` 
        }}
      />
      
      <div className="relative bg-[#111111] border border-white/[0.05] rounded-[34px] p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl group-hover:rotate-[5deg] transition-transform duration-500"
              style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
            >
              <div className="absolute inset-0 blur-xl opacity-40 rounded-full" style={{ background: exercise.gradient.start }} />
              <Icon className="text-white relative z-10" size={24} />
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-medium text-white/90 tracking-tight leading-tight group-hover:text-white transition-colors">
                {exercise.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">
                  {exercise.subtitle}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className={`text-[9px] uppercase tracking-widest font-bold ${exercise.isAdvanced ? 'text-orange-500' : 'text-emerald-500'}`}>
                  {level}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${
                  isFavorite 
                    ? 'bg-white border-white text-black' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Bookmark size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
              </button>
            )}
            {isCustom && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 flex items-center justify-center"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="relative">
          <p className="text-gray-400 text-[13px] leading-relaxed font-light line-clamp-2 pr-4 opacity-70 group-hover:opacity-100 transition-opacity">
            {exercise.description}
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-3 mt-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onStart(); }}
            className="flex-1 h-14 rounded-2xl bg-white text-black font-semibold text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Play size={14} fill="currentColor" />
            Start Session
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onDetails(); }}
            className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition-all"
          >
            <Info size={14} />
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
