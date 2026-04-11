'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Info, CheckCircle2, AlertTriangle, Trophy, Music, Settings, Activity } from 'lucide-react';
import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
import { exercises, Exercise, IconMap } from './data';
import { useSoundscape } from './hooks/useSoundscape';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useBinauralBeats } from './hooks/useBinauralBeats';
import { useLibrary } from './hooks/useCustomExercises';
import { SessionSettings } from './components/SessionSettings';
import { CustomBuilder } from './components/CustomBuilder';
import { Plus, Trash2, Home, Compass, User, Library, Heart as HeartIcon, Settings as SettingsIcon, LogOut, Target, Zap as ZapIcon } from 'lucide-react';

type TabType = 'explore' | 'library' | 'create' | 'profile';

export function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [view, setView] = useState<'home' | 'exercise' | 'details'>('home');
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const { customExercises, favorites, addExercise, deleteExercise, toggleFavorite } = useLibrary();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    // Register/Unregister Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'development') {
        // In development, unregister service workers to avoid stale cache issues with Turbopack
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
                <ProfileView key="profile" />
              )}
            </div>
          )}
          {view === 'exercise' && selectedExercise && (
            <ExerciseView key="exercise" exercise={selectedExercise} onBack={handleBack} />
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

function BottomNav({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  const tabs: { id: TabType, icon: any, label: string }[] = [
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-4 z-[100]">
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-between shadow-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-3 px-6 rounded-2xl transition-all duration-500 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-white/5 rounded-2xl border border-white/5"
                  transition={{ type: 'spring', duration: 0.6 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[9px] mt-1.5 uppercase tracking-widest font-medium transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 scale-90'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExploreView({ onStart, onDetails, customExercises, favorites, onToggleFavorite }: { 
  onStart: (ex: Exercise) => void; 
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}) {
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
          <SettingsIcon size={20} />
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
        {exercises.map((ex) => (
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

function LibraryView({ onStart, onDetails, customExercises, favorites, onToggleFavorite, onDeleteCustom }: { 
  onStart: (ex: Exercise) => void; 
  onDetails: (ex: Exercise) => void;
  customExercises: Exercise[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onDeleteCustom: (id: string) => void;
}) {
  const favoriteExercises = exercises.filter(ex => favorites.includes(ex.id));

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
          <p className="text-sm font-light text-gray-400">Your library is empty.<br/>Create a journey or favorite a practice.</p>
        </div>
      )}
      
      {customExercises.length > 0 && (
        <>
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 px-1">Created Collections</span>
          </div>
          <div className="flex flex-col gap-4 mb-10">
            {customExercises.map((ex) => (
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
            {favoriteExercises.map((ex) => (
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

function ProfileView() {
  const stats = [
    { label: 'Total Minutes', value: '124', icon: Target },
    { label: 'Deep Sessions', value: '42', icon: ZapIcon },
    { label: 'Current Streak', value: '7', icon: Trophy },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 mb-4 shadow-xl">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <User size={40} className="text-white/80" />
          </div>
        </div>
        <h2 className="text-2xl font-light text-white">Zen Practitioner</h2>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Journey Member since April 2026</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white/[0.03] border border-white/5 rounded-[32px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                <stat.icon size={20} />
              </div>
              <span className="text-sm font-light text-gray-400">{stat.label}</span>
            </div>
            <span className="text-2xl font-light text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button className="w-full h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between px-6 text-gray-300 hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3">
            <SettingsIcon size={18} />
            <span className="text-sm font-light">Account Settings</span>
          </div>
          <ArrowLeft size={16} className="rotate-180 opacity-30" />
        </button>
        <button className="w-full h-16 rounded-[24px] bg-red-500/5 border border-red-500/10 flex items-center justify-between px-6 text-red-400 hover:bg-red-500/10 transition-all">
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-sm font-light">Logout Journey</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function ExerciseCard({ exercise, onStart, onDetails, onDelete, isCustom, isFavorite, onToggleFavorite }: { 
  exercise: Exercise; 
  onStart: () => void; 
  onDetails: () => void; 
  onDelete?: () => void;
  isCustom?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <motion.div 
      whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
      className="relative w-full bg-white/[0.03] border border-white/10 rounded-[32px] p-8 cursor-pointer group transition-all duration-500 overflow-hidden shadow-xl"
    >
      {/* Accent Glow */}
      <div 
        className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
        style={{ background: exercise.gradient.start }}
      />
      
      {exercise.isAdvanced && !isCustom && (
        <div className="absolute top-6 left-6 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-full z-10">
          Advanced
        </div>
      )}

      <div className="absolute top-6 right-6 flex items-center gap-2 z-10 opacity-40 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-2.5 rounded-full transition-all duration-300 ${isFavorite ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Bookmark size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        )}
        {isCustom && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2.5 rounded-full bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-5">
          <div 
            className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-700"
            style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
          >
            <Icon className="text-white" size={28} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-xl font-light text-white mb-1 group-hover:translate-x-1 transition-transform duration-500">{exercise.name}</h3>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-medium">{exercise.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-2 px-1 opacity-60 group-hover:opacity-100 transition-opacity">
            {exercise.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex gap-2">
              {exercise.benefits.slice(0, 2).map((b, i) => (
                <span key={i} className="text-[9px] text-gray-600 bg-white/5 px-2 py-1 rounded-lg border border-white/5">{b}</span>
              ))}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDetails(); }}
              className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors"
            >
              Learn More
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailsView({ exercise, onBack, onStart }: { exercise: Exercise; onBack: () => void; onStart: () => void }) {
  const Icon = IconMap[exercise.icon as keyof typeof IconMap] || Activity;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-background z-[100] overflow-y-auto flex flex-col font-sans"
    >
      {/* Hero Section */}
      <div className="sticky top-0 z-20 h-[220px] sm:h-[280px] bg-surface flex flex-col items-center justify-center p-8 border-b border-white/5">
        <div className="absolute inset-0 opacity-40 z-[-1]" style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}22 0%, #000 100%)` }} />
        
        <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>
        
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
        >
          <Icon size={40} color="black" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-center leading-none">
          {exercise.name}
        </h1>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 sm:p-12 max-w-2xl mx-auto w-full font-light">
        {exercise.warning && (
          <div className="mb-10 p-5 bg-orange-500/5 border border-orange-500/20 rounded-[24px] flex gap-4 items-start">
            <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={20} />
            <div>
              <span className="block text-[10px] uppercase tracking-[0.1em] font-medium text-orange-500 mb-1">Safety Warning</span>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{exercise.warning}</p>
            </div>
          </div>
        )}

        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>The Essence</span>
          <p className="text-xl text-white leading-relaxed font-light">{exercise.description}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>Methodology</span>
          <p className="text-base text-gray-400 leading-relaxed">{exercise.howTo}</p>
        </div>
        
        <div className="mb-12">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>The Science</span>
          <p className="text-base text-gray-400 leading-relaxed">{exercise.why}</p>
        </div>
        
        <div className="mb-16">
          <span className="block text-[11px] uppercase tracking-[0.3em] font-medium mb-4 opacity-80" style={{ color: exercise.gradient.end }}>Core Benefits</span>
          <div className="flex flex-wrap gap-3">
            {exercise.benefits.map((b, i) => (
              <span key={i} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-xs font-light text-gray-300">
                <CheckCircle2 size={14} className="opacity-60" strokeWidth={1.5} style={{ color: exercise.gradient.end }} />
                {b}
              </span>
            ))}
          </div>
        </div>
        
        <div className="h-24" />
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-background via-background/95 to-transparent z-30 flex justify-center">
        <button 
          onClick={onStart}
          className="w-full max-w-md h-16 rounded-full text-black font-medium text-lg flex items-center justify-center gap-3 shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
          style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
        >
          <Play size={20} fill="black" />
          Begin Practice
        </button>
      </div>
    </motion.div>
  );
}

function ExerciseView({ exercise, onBack }: { exercise: Exercise; onBack: () => void }) {
  const { isActive, phase, timer, cycleCount, toggle, reset } = useBreathingTimer(exercise.pattern);
  const { activeSoundscape, toggleSoundscape, soundscapes, volume, setVolume } = useSoundscape();
  const { selectedProfileId, setSelectedProfileId, speak, testVoice, voiceVolume, setVoiceVolume, isEnabled, setIsEnabled } = useVoiceAssistant();
  const { activeBinaural, toggleBinaural, binauralVolume, setBinauralVolume } = useBinauralBeats();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const lastPhaseRef = useRef(phase);

  // Trigger speech on phase change
  useEffect(() => {
    if (isActive && phase !== lastPhaseRef.current) {
      speak(phase);
      lastPhaseRef.current = phase;
    }
  }, [phase, isActive, speak]);

  const handleToggle = () => {
    if (!isActive) {
      speak('Inhale');
      lastPhaseRef.current = 'Inhale';
    }
    toggle();
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Milestones for Breath Hold
  const milestones = [60, 45, 30, 15, 5];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-background z-[50] flex flex-col items-center justify-center overflow-hidden font-sans"
    >
      {/* Top Left Return Button */}
      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-[60]"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      {/* Top Right Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)} 
        className={`absolute top-8 right-8 p-3 rounded-full border transition-all z-[60] flex items-center gap-2 ${
          activeSoundscape !== 'none' || selectedProfileId !== 'deep-calm'
            ? 'bg-white border-white text-black' 
            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
        }`}
      >
        <Settings size={20} strokeWidth={1.5} />
        {(activeSoundscape !== 'none' || selectedProfileId !== 'deep-calm') && (
          <span className="text-[10px] font-bold uppercase tracking-wider pr-1">
            Session
          </span>
        )}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 pb-32">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-light tracking-tighter text-center leading-tight mb-2 font-sans"
        >
          {exercise.name}
        </motion.h1>
        <p className="text-[11px] uppercase tracking-[0.4em] font-medium mb-12 opacity-80" style={{ color: exercise.gradient.end }}>{exercise.subtitle}</p>

        <BreathingCircle phase={phase} timer={timer} gradient={exercise.gradient} />

        <div className="h-10 text-2xl font-light text-center mt-12 flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-light tracking-[0.2em] text-gray-200"
            >
              {isActive ? phase : 'Ready to Begin'}
            </motion.div>
          </AnimatePresence>
          
          {/* Milestone UI for Hold phase */}
          {isActive && phase === 'Hold' && exercise.id === 'deep-hold' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-2"
            >
              <Trophy size={12} className="text-yellow-500" />
              Target: {timer > 60 ? 'Mastery' : timer > 30 ? 'Advanced' : 'Beginner'}
            </motion.div>
          )}
        </div>
        
        <div className="mt-12 text-[11px] uppercase tracking-[0.5em] font-medium text-gray-700">
          {cycleCount} Cycles Completed
        </div>
      </div>

      {/* Sticky Bottom Row for Start and Reset */}
      <div className="absolute bottom-0 w-full p-6 sm:p-10 bg-gradient-to-t from-background via-background/95 to-transparent z-[60]">
        <div className="max-w-xl mx-auto flex gap-4 w-full">
          <button 
            onClick={handleToggle}
            className="flex-1 h-16 rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-black shadow-xl"
            style={{ 
              background: isActive 
                ? 'white' 
                : `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` 
            }}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} fill="black" />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button 
            onClick={reset}
            className="flex-1 h-16 rounded-full font-medium text-lg flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <RotateCcw size={24} />
            Restart
          </button>
        </div>
      </div>

      <SessionSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        activeSoundscape={activeSoundscape}
        onSelectSoundscape={toggleSoundscape}
        soundscapeVolume={volume}
        onSetSoundscapeVolume={setVolume}
        selectedVoiceId={selectedProfileId}
        onSelectVoice={setSelectedProfileId}
        voiceVolume={voiceVolume}
        onSetVoiceVolume={setVoiceVolume}
        isVoiceEnabled={isEnabled}
        onSetVoiceEnabled={setIsEnabled}
        onTestVoice={testVoice}
        activeBinaural={activeBinaural}
        onSelectBinaural={toggleBinaural}
        binauralVolume={binauralVolume}
        onSetBinauralVolume={setBinauralVolume}
      />
    </motion.div>
  );
}
