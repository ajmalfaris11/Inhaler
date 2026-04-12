'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bookmark, Trash2, ChevronRight, Play } from 'lucide-react';
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

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
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
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold mt-1">
                {exercise.subtitle}
              </span>
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

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.03]">
          <div className="flex gap-2">
            {exercise.benefits.slice(0, 2).map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.05]">
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-[9px] text-gray-500 font-medium">{b}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onDetails(); }}
              className="text-[11px] font-medium text-gray-600 hover:text-white transition-colors flex items-center gap-1"
            >
              Info
              <ChevronRight size={14} />
            </button>
            
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Play size={14} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {exercise.isAdvanced && !isCustom && (
        <div className="absolute top-1 right-1/2 translate-x-1/2 z-20">
          <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-500 text-[7px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-b-xl shadow-lg">
            Mastery
          </div>
        </div>
      )}
    </motion.div>
  );
}
