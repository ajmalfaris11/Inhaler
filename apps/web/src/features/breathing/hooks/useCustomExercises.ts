'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '../data';

const STORAGE_KEY = 'inhale_custom_exercises';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'daily' | 'weekly' | 'milestone' | 'custom';
  type: 'streak' | 'duration' | 'sessions' | 'technique' | 'time' | 'manual';
  requirement: number;
  unlocked: boolean;
  progress?: number;
}

export interface CustomGoal {
  id: string;
  name: string;
  exerciseId: string;
  targetMinutes: number;
  currentMinutes: number;
}

export function useLibrary() {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sessions, setSessions] = useState<{ exerciseId: string; date: string; duration: number }[]>([]);
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([]);

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

    const savedGoals = localStorage.getItem('inhale_custom_goals');
    if (savedGoals) {
      try { setCustomGoals(JSON.parse(savedGoals)); } catch (e) {}
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

  const addCustomGoal = (goal: Omit<CustomGoal, 'currentMinutes'>) => {
    const newGoal = { ...goal, currentMinutes: 0 };
    const updated = [...customGoals, newGoal];
    setCustomGoals(updated);
    localStorage.setItem('inhale_custom_goals', JSON.stringify(updated));
  };

  const deleteCustomGoal = (id: string) => {
    const updated = customGoals.filter(g => g.id !== id);
    setCustomGoals(updated);
    localStorage.setItem('inhale_custom_goals', JSON.stringify(updated));
  };

  const calculateStats = () => {
    const totalMinutes = Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    const sessionCount = sessions.length;
    
    // Dates & Streaks
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    
    const dates = sessions.map(s => s.date.split('T')[0]);
    const uniqueDates = Array.from(new Set(dates)).sort().reverse();
    
    let streak = 0;
    if (uniqueDates.length > 0) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterday) {
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

    // Daily Stats
    const todaySessions = sessions.filter(s => s.date.startsWith(todayStr));
    const todayMinutes = Math.floor(todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60);

    // Weekly Stats
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo);
    const weekMinutes = Math.floor(weekSessions.reduce((acc, s) => acc + s.duration, 0) / 60);

    // Badge calculation
    const badges: Badge[] = [
      // DAILY
      {
        id: 'daily_first',
        name: 'First Breath',
        description: 'Complete one session today.',
        category: 'daily',
        type: 'sessions',
        requirement: 1,
        unlocked: todaySessions.length >= 1
      },
      {
        id: 'daily_10',
        name: 'Daily Focus',
        description: 'Practice for 10 minutes today.',
        category: 'daily',
        type: 'duration',
        requirement: 10,
        unlocked: todayMinutes >= 10,
        progress: Math.min(100, (todayMinutes / 10) * 100)
      },
      // WEEKLY
      {
        id: 'weekly_king',
        name: 'Consistency King',
        description: '7-day practice streak.',
        category: 'weekly',
        type: 'streak',
        requirement: 7,
        unlocked: streak >= 7,
        progress: Math.min(100, (streak / 7) * 100)
      },
      {
        id: 'weekly_60',
        name: 'Weekly Zen',
        description: '60 minutes of mindfulness this week.',
        category: 'weekly',
        type: 'duration',
        requirement: 60,
        unlocked: weekMinutes >= 60,
        progress: Math.min(100, (weekMinutes / 60) * 100)
      },
      // MILESTONES
      {
        id: 'milestone_master',
        name: 'Mindful Master',
        description: '100 total minutes practiced.',
        category: 'milestone',
        type: 'duration',
        requirement: 100,
        unlocked: totalMinutes >= 100,
        progress: Math.min(100, (totalMinutes / 100) * 100)
      },
      {
        id: 'milestone_explorer',
        name: 'Explorer',
        description: 'Try 3 different techniques.',
        category: 'milestone',
        type: 'technique',
        requirement: 3,
        unlocked: new Set(sessions.map(s => s.exerciseId)).size >= 3
      }
    ];

    // Map custom goals to badges with exercise-specific tracking
    const customGoalBadges: Badge[] = customGoals.map(goal => {
      // Calculate current progress for this specific exercise
      const exerciseMinutes = Math.floor(sessions
        .filter(s => s.exerciseId === goal.exerciseId || goal.exerciseId === 'all')
        .reduce((acc, s) => acc + s.duration, 0) / 60);

      return {
        id: goal.id,
        name: goal.name,
        description: `Target: ${goal.targetMinutes}m of ${goal.exerciseId === 'all' ? 'any practice' : goal.exerciseId}.`,
        category: 'custom',
        type: 'manual',
        requirement: goal.targetMinutes,
        unlocked: exerciseMinutes >= goal.targetMinutes,
        progress: Math.min(100, (exerciseMinutes / goal.targetMinutes) * 100)
      };
    });

    return { totalMinutes, sessionCount, streak, badges: [...badges, ...customGoalBadges], todayMinutes, weekMinutes };
  };

  return {
    customExercises,
    favorites,
    sessions,
    customGoals,
    stats: calculateStats(),
    addExercise,
    deleteExercise,
    toggleFavorite,
    recordSession,
    addCustomGoal,
    deleteCustomGoal
  };
}
