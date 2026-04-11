'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '../data';

const STORAGE_KEY = 'inhale_custom_exercises';

export function useCustomExercises() {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomExercises(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse custom exercises', e);
      }
    }
  }, []);

  const addExercise = (exercise: Exercise) => {
    const updated = [...customExercises, exercise];
    setCustomExercises(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteExercise = (id: string) => {
    const updated = customExercises.filter(ex => ex.id !== id);
    setCustomExercises(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return {
    customExercises,
    addExercise,
    deleteExercise
  };
}
