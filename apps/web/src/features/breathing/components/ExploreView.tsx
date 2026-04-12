'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Settings } from 'lucide-react';
import { Exercise, exercises } from '../data';
import { ExerciseCard } from './ExerciseCard';

interface ExploreViewProps {
  onStart: (ex: Exercise) => void;
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function ExploreView({ 
  onStart, 
  onDetails, 
  customExercises, 
  favorites, 
  onToggleFavorite 
}: ExploreViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-light tracking-tight bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Inhaler</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1">Deep Breathing System</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
          <Settings size={20} />
        </div>
      </div>
      
      {customExercises.length > 0 && (
        <div className="mb-6 flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600">My Journeys</span>
          <span className="text-[10px] text-gray-500">{customExercises.length} items</span>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-12">
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

      <div className="mb-6 flex justify-between items-center px-1">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600">Global Practices</span>
        <span className="text-[10px] text-gray-500">{exercises.length} items</span>
      </div>
      
      <div className="flex flex-col gap-4">
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
    </motion.div>
  );
}
