'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Exercise } from './data';
import { useLibrary } from './hooks/useCustomExercises';
import { CustomBuilder } from './components/CustomBuilder';
import { BottomNav } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { LibraryView } from './components/LibraryView';
import { ProfileView } from './components/ProfileView';
import { ExerciseView } from './components/ExerciseView';
import { DetailsView } from './components/DetailsView';

type TabType = 'explore' | 'library' | 'create' | 'profile';

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<'home' | 'exercise' | 'details'>('home');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const { customExercises, favorites, stats, toggleFavorite, deleteExercise, addExercise, recordSession } = useLibrary();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    // Register/Unregister Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'development') {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      } else {
        const register = () => {
          navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.error('Service Worker registration failed:', err);
          });
        };

        if (document.readyState === 'complete') {
          register();
        } else {
          window.addEventListener('load', register);
        }
      }
    }
  }, []);

  const handleStart = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('exercise');
  };

  const handleDetails = (ex: Exercise) => {
    setSelectedExercise(ex);
    setView('details');
  };

  const handleBack = () => {
    setView('home');
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <div className="flex flex-col items-center w-full px-4 sm:px-0 max-w-[480px] mx-auto py-12 pb-32 font-sans">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <div key="home-tabs" className="w-full">
              {activeTab === 'explore' && (
                <ExploreView 
                  key="explore" 
                  onStart={handleStart} 
                  onDetails={handleDetails} 
                  customExercises={customExercises}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              {activeTab === 'library' && (
                <LibraryView 
                  key="library"
                  onStart={handleStart}
                  onDetails={handleDetails}
                  customExercises={customExercises}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onDeleteCustom={deleteExercise}
                />
              )}
              {activeTab === 'create' && (
                <CustomBuilder 
                  key="builder"
                  onBack={() => setActiveTab('explore')} 
                  onSave={addExercise} 
                />
              )}
              {activeTab === 'profile' && (
                <ProfileView key="profile" stats={stats} />
              )}
            </div>
          )}
          {view === 'exercise' && selectedExercise && (
            <ExerciseView key="exercise" exercise={selectedExercise} onBack={handleBack} onRecordSession={recordSession} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'details' && selectedExercise && (
            <DetailsView key="details" exercise={selectedExercise} onBack={handleBack} onStart={() => setView('exercise')} />
          )}
        </AnimatePresence>
      </div>

      {view === 'home' && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
