export interface Exercise {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  howTo: string;
  why: string;
  benefits: string[];
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
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
  },
  {
    id: 'calm',
    name: 'Deep Calm',
    subtitle: 'Quick Reset',
    description: 'A simple rhythmic breathing pattern for general mindfulness and heart rate reduction.',
    howTo: 'Slow inhale for 5s, brief pause, then a very slow exhale for 5s.',
    why: 'Rhythmic breathing synchronizes heart rate and brain waves for a state of "coherence".',
    benefits: ['Blood pressure', 'Mindfulness', 'Emotional balance'],
    pattern: { inhale: 5, hold1: 2, exhale: 5, hold2: 2 }
  }
];
