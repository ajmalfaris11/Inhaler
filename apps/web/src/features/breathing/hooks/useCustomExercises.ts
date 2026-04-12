'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '../data';

const STORAGE_KEY = 'inhale_custom_exercises';

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'duration' | 'sessions' | 'technique' | 'time';
  requirement: number;
  unlocked: boolean;
}

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
    
    // Streak calculation
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
          if (diff === 1) streak++;
          else break;
        }
      }
    }

    // Badge calculation
    const badges: Badge[] = [
      {
        id: 'first_breath',
        name: 'First Breath',
        description: 'Completed your first mindful session.',
        type: 'sessions',
        requirement: 1,
        unlocked: sessionCount >= 1
      },
      {
        id: 'deep_diver',
        name: 'Deep Diver',
        description: 'Completed a 10-minute session.',
        type: 'duration',
        requirement: 600,
        unlocked: sessions.some(s => s.duration >= 600)
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Maintained a 7-day streak.',
        type: 'streak',
        requirement: 7,
        unlocked: streak >= 7
      },
      {
        id: 'mindful_master',
        name: 'Mindful Master',
        description: 'Spent over 100 minutes in practice.',
        type: 'duration',
        requirement: 100,
        unlocked: totalMinutes >= 100
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Tried 3 different techniques.',
        type: 'technique',
        requirement: 3,
        unlocked: new Set(sessions.map(s => s.exerciseId)).size >= 3
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Completed a session after 10 PM.',
        type: 'time',
        requirement: 22,
        unlocked: sessions.some(s => new Date(s.date).getHours() >= 22)
      }
    ];

    return { totalMinutes, sessionCount, streak, badges };
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
