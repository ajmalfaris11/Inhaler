'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Bookmark, Trash2, ChevronRight } from 'lucide-react';
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
      whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
      className="relative w-full bg-white/[0.03] border border-white/10 rounded-[32px] p-8 cursor-pointer group transition-all duration-500 overflow-hidden shadow-xl"
    >
      <div 
        className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
        style={{ background: exercise.gradient.start }}
      />
      
      {exercise.isAdvanced && !isCustom && (
        <div className="absolute top-6 left-6 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-full z-10">
          Advanced
        </div>
      )}

      <div className="absolute top-6 right-6 flex items-center gap-2 z-10 opacity-40 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-2.5 rounded-full transition-all duration-300 ${isFavorite ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Bookmark size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        )}
        {isCustom && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2.5 rounded-full bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-5">
          <div 
            className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-700"
            style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
          >
            <Icon className="text-white" size={28} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-xl font-light text-white mb-1 group-hover:translate-x-1 transition-transform duration-500">{exercise.name}</h3>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-medium">{exercise.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-2 px-1 opacity-60 group-hover:opacity-100 transition-opacity">
            {exercise.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex gap-2">
              {exercise.benefits.slice(0, 2).map((b: string, i: number) => (
                <span key={i} className="text-[9px] text-gray-600 bg-white/5 px-2 py-1 rounded-lg border border-white/5">{b}</span>
              ))}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDetails(); }}
              className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors"
            >
              Learn More
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
