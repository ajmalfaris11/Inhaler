import { Moon, Zap, Activity, ShieldAlert, Wind, Heart } from 'lucide-react';

export interface Exercise {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  howTo: string;
  why: string;
  warning?: string;
  benefits: string[];
  icon: string;
  isAdvanced?: boolean;
  gradient: {
    start: string;
    end: string;
  };
  pattern: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
}

export const exercises: Exercise[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    subtitle: 'Focus & Stress Relief',
    description: 'A powerful technique used by Navy SEALs to stay calm and focused under pressure.',
    howTo: 'Inhale for 4s, hold for 4s, exhale for 4s, and hold for 4s. Repeat the cycle.',
    why: 'It regulates the autonomic nervous system by balancing the sympathetic and parasympathetic branches.',
    benefits: ['Lowers cortisol', 'Improves concentration', 'Instant calm'],
    icon: 'Zap',
    gradient: {
      start: '#0082ff',
      end: '#00ffd5'
    },
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  },
  {
    id: '478',
    name: '4-7-8 Sleep',
    subtitle: 'Anxiety & Better Sleep',
    description: 'A natural tranquilizer for the nervous system that helps you fall asleep faster.',
    howTo: 'Inhale through nose for 4s, hold breath for 7s, exhale forcefully through mouth for 8s.',
    why: 'The long exhale triggers the vagus nerve, signaling the body to switch into rest mode.',
    benefits: ['Reduces anxiety', 'Cures insomnia', 'Deep relaxation'],
    icon: 'Moon',
    gradient: {
      start: '#a855f7',
      end: '#6366f1'
    },
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
  },
  {
    id: 'deep-hold',
    name: 'Deep Breath Hold',
    subtitle: 'Endurance & Vitality',
    description: 'An advanced technique to increase CO2 tolerance and boost cellular oxygenation.',
    howTo: 'Take 30 deep breaths, then on the last one, exhale halfway and hold for as long as possible. Reach milestones of 60s, 90s, and 120s.',
    why: 'Intermittent hypoxia triggers a survival response that strengthens the immune system and increases red blood cell count.',
    warning: 'NEVER perform this in water, while driving, or standing up. You may experience lightheadedness or temporary fainting.',
    benefits: ['Immune boost', 'Increased energy', 'pH balancing'],
    icon: 'ShieldAlert',
    isAdvanced: true,
    gradient: {
      start: '#ef4444',
      end: '#f59e0b'
    },
    pattern: { inhale: 2, hold1: 60, exhale: 5, hold2: 0 }
  },
  {
    id: 'calm',
    name: 'Deep Calm',
    subtitle: 'Quick Reset',
    description: 'A simple rhythmic breathing pattern for general mindfulness and heart rate reduction.',
    howTo: 'Slow inhale for 5s, brief pause, then a very slow exhale for 5s.',
    why: 'Rhythmic breathing synchronizes heart rate and brain waves for a state of "coherence".',
    benefits: ['Blood pressure', 'Mindfulness', 'Emotional balance'],
    icon: 'Activity',
    gradient: {
      start: '#14b8a6',
      end: '#10b981'
    },
    pattern: { inhale: 5, hold1: 2, exhale: 5, hold2: 2 }
  },
  {
    id: 'energy',
    name: "Lion's Breath",
    subtitle: 'Tension Release',
    description: 'A vigorous breathing technique that helps release tension in the face and chest.',
    howTo: 'Inhale deeply through the nose. Exhale forcefully through the mouth while sticking out your tongue and making a "ha" sound.',
    why: 'Stimulates the facial muscles and the thyroid gland while providing a cathartic emotional release.',
    benefits: ['Relieves jaw tension', 'Boosts confidence', 'Clears airways'],
    icon: 'Wind',
    gradient: {
      start: '#f97316',
      end: '#fbbf24'
    },
    pattern: { inhale: 4, hold1: 1, exhale: 6, hold2: 1 }
  }
];
