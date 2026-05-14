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
  frequency?: 'once' | 'daily'; // Added to track daily personal goals
  exerciseId?: string; // Added for navigation
  iconId?: string; // Added for custom goal icons
}

export interface CustomGoal {
  id: string;
  name: string;
  exerciseId: string;
  targetMinutes: number;
  currentMinutes: number;
  frequency: 'once' | 'daily';
  iconId?: string; // Support for custom icons
}

export function useLibrary() {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sessions, setSessions] = useState<{ exerciseId: string; date: string; duration: number }[]>([]);
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([]);
  const [userName, setUserName] = useState('Zen Practitioner');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

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

    const savedName = localStorage.getItem('inhale_user_name');
    if (savedName) setUserName(savedName);

    const savedAvatar = localStorage.getItem('inhale_user_avatar');
    if (savedAvatar) setUserAvatar(savedAvatar);
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

  const updateUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem('inhale_user_name', name);
  };

  const updateAvatar = (avatar: string | null) => {
    setUserAvatar(avatar);
    if (avatar) localStorage.setItem('inhale_user_avatar', avatar);
    else localStorage.removeItem('inhale_user_avatar');
  };

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
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
      { id: 'daily_first', name: 'First Light', description: 'Complete your first session today.', category: 'daily', type: 'sessions', requirement: 1, unlocked: todaySessions.length >= 1, progress: todaySessions.length >= 1 ? 100 : 0, iconId: 'sun' },
      { id: 'daily_deep', name: 'Deep Diver', description: 'Complete 20 minutes of practice today.', category: 'daily', type: 'duration', requirement: 20, unlocked: todayMinutes >= 20, progress: Math.min(100, (todayMinutes / 20) * 100), iconId: 'activity' },
      { id: 'weekly_consistent', name: 'Weekly Warrior', description: 'Practice for 3 days this week.', category: 'weekly', type: 'streak', requirement: 3, unlocked: new Set(weekSessions.map(s => s.date.split('T')[0])).size >= 3, progress: Math.min(100, (new Set(weekSessions.map(s => s.date.split('T')[0])).size / 3) * 100), iconId: 'calendar' },
      { id: 'milestone_100', name: 'Centurion', description: 'Reach 100 total minutes of practice.', category: 'milestone', type: 'duration', requirement: 100, unlocked: totalMinutes >= 100, progress: Math.min(100, (totalMinutes / 100) * 100), iconId: 'trophy' },
      { id: 'milestone_1000', name: 'Zen Master', description: 'Reach 1000 total minutes of practice.', category: 'milestone', type: 'duration', requirement: 1000, unlocked: totalMinutes >= 1000, progress: Math.min(100, (totalMinutes / 1000) * 100), iconId: 'shield' },
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

    // Map custom goals to badges with frequency-specific tracking
    const customGoalBadges: Badge[] = customGoals.map(goal => {
      let exerciseMinutes = 0;
      
      if (goal.frequency === 'daily') {
        // Track minutes for TODAY only
        exerciseMinutes = Math.floor(sessions
          .filter(s => s.date.startsWith(todayStr) && (s.exerciseId === goal.exerciseId || goal.exerciseId === 'all'))
          .reduce((acc, s) => acc + s.duration, 0) / 60);
      } else {
        // Track LIFETIME minutes
        exerciseMinutes = Math.floor(sessions
          .filter(s => s.exerciseId === goal.exerciseId || goal.exerciseId === 'all')
          .reduce((acc, s) => acc + s.duration, 0) / 60);
      }

      return {
        id: goal.id,
        name: goal.name,
        description: goal.frequency === 'daily' 
          ? `Daily Target: ${goal.targetMinutes}m of ${goal.exerciseId === 'all' ? 'any practice' : goal.exerciseId}.`
          : `Milestone: Reach ${goal.targetMinutes}m total of ${goal.exerciseId === 'all' ? 'any practice' : goal.exerciseId}.`,
        category: 'custom',
        type: 'manual',
        frequency: goal.frequency, // Pass frequency to badge
        exerciseId: goal.exerciseId, // Ensure exerciseId is passed for navigation
        iconId: goal.iconId, // Pass custom icon ID to badge
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
    deleteCustomGoal,
    userName,
    userAvatar,
    updateUserName,
    updateAvatar,
    clearAllData
  };
}
