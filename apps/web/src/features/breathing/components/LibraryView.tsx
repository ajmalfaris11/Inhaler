'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Library } from 'lucide-react';
import { Exercise, exercises } from '../data';
import { ExerciseCard } from './ExerciseCard';

interface LibraryViewProps {
  onStart: (ex: Exercise) => void;
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onDeleteCustom: (id: string) => void;
}

export function LibraryView({ 
  onStart, 
  onDetails, 
  customExercises, 
  favorites, 
  onToggleFavorite, 
  onDeleteCustom 
}: LibraryViewProps) {
  const favoriteExercises = exercises.filter((ex: Exercise) => favorites.includes(ex.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <h1 className="text-3xl font-light tracking-tight text-white mb-10">My Library</h1>

      {customExercises.length === 0 && favoriteExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Library size={48} strokeWidth={1} className="mb-4 text-gray-500" />
          <p className="text-sm font-light text-gray-400">Your library is empty.<br/>Create a journey or bookmark a practice.</p>
        </div>
      )}
      
      {customExercises.length > 0 && (
        <>
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 px-1">Created Collections</span>
          </div>
          <div className="flex flex-col gap-4 mb-10">
            {customExercises.map((ex: Exercise) => (
              <ExerciseCard 
                key={ex.id} 
                exercise={ex} 
                onStart={() => onStart(ex)} 
                onDetails={() => onDetails(ex)} 
                onDelete={() => onDeleteCustom(ex.id)}
                isCustom
              />
            ))}
          </div>
        </>
      )}

      {favoriteExercises.length > 0 && (
        <>
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 px-1">Saved Practices</span>
          </div>
          <div className="flex flex-col gap-4">
            {favoriteExercises.map((ex: Exercise) => (
              <ExerciseCard 
                key={ex.id} 
                exercise={ex} 
                onStart={() => onStart(ex)} 
                onDetails={() => onDetails(ex)}
                isFavorite
                onToggleFavorite={() => onToggleFavorite(ex.id)}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
