'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '../data';

const STORAGE_KEY = 'inhale_custom_exercises';

export function useLibrary() {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [sessions, setSessions] = useState<{ exerciseId: string; date: string; duration: number }[]>([]);

  useEffect(() => {
    const savedCustom = localStorage.getItem(STORAGE_KEY);
    if (savedCustom) {
      try { setCustomExercises(JSON.parse(savedCustom)); } catch (e) {}
    }

    const savedFavs = localStorage.getItem('inhale_favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }

    const savedSessions = localStorage.getItem('inhale_sessions');
    if (savedSessions) {
      try { setSessions(JSON.parse(savedSessions)); } catch (e) {}
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

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('inhale_favorites', JSON.stringify(updated));
  };

  const recordSession = (exerciseId: string, duration: number) => {
    const newSession = { exerciseId, date: new Date().toISOString(), duration };
    const updated = [...sessions, newSession];
    setSessions(updated);
    localStorage.setItem('inhale_sessions', JSON.stringify(updated));
  };

  const calculateStats = () => {
    const totalMinutes = Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    const sessionCount = sessions.length;
    
    // Simple streak calculation
    const dates = sessions.map(s => s.date.split('T')[0]);
    const uniqueDates = Array.from(new Set(dates)).sort().reverse();
    
    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const d1 = new Date(uniqueDates[i]);
          const d2 = new Date(uniqueDates[i+1]);
          const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return { totalMinutes, sessionCount, streak };
  };

  return {
    customExercises,
    favorites,
    sessions,
    stats: calculateStats(),
    addExercise,
    deleteExercise,
    toggleFavorite,
    recordSession
  };
}
