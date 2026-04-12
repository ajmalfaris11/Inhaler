'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Info, CheckCircle2, AlertTriangle, Trophy, 
  Music, Settings, Activity, Plus, Trash2, Home, Compass, User, Library, 
  Bookmark, Settings as SettingsIcon, LogOut, Target, Zap as ZapIcon, ChevronRight,
  ChevronLeft
} from 'lucide-react';

import { useBreathingTimer } from './hooks/useBreathingTimer';
import { BreathingCircle } from './components/BreathingCircle';
import { exercises, Exercise, IconMap } from './data';
import { useSoundscape, SoundscapeType } from './hooks/useSoundscape';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { useBinauralBeats, BinauralType } from './hooks/useBinauralBeats';
import { useLibrary } from './hooks/useCustomExercises';
import { SessionSettings } from './components/SessionSettings';
import { CustomBuilder } from './components/CustomBuilder';

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

function BottomNav({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  const tabs: { id: TabType, icon: any, label: string }[] = [
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[360px] px-6 z-[100]">
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center w-14 h-14 rounded-3xl transition-all duration-500 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-white/10 rounded-3xl border border-white/10 shadow-lg"
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
                />
              )}
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className="relative z-10" />
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
        {exercises.map((ex: Exercise) => (
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

function ProfileView({ stats }: { stats: { totalMinutes: number; sessionCount: number; streak: number } }) {
  const statItems = [
    { label: 'Total Minutes', value: stats.totalMinutes.toString(), icon: Target },
    { label: 'Deep Sessions', value: stats.sessionCount.toString(), icon: ZapIcon },
    { label: 'Current Streak', value: stats.streak.toString(), icon: Trophy },
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
        {statItems.map((stat) => (
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
  const Icon = (IconMap as any)[exercise.icon] || Activity;

  return (
    <motion.div 
      whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onStart}
      className="relative w-full bg-white/[0.03] border border-white/10 rounded-[32px] p-8 cursor-pointer group transition-all duration-500 overflow-hidden shadow-xl"
    >
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
              {exercise.benefits.slice(0, 2).map((b: string, i: number) => (
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
  const Icon = (IconMap as any)[exercise.icon] || Activity;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="bg-surface border border-white/10 rounded-[48px] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-hide"
      >
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="p-8 sm:p-12">
          <div className="flex flex-col items-center text-center mb-10 pt-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${exercise.gradient.start}, ${exercise.gradient.end})` }}
            >
              <Icon className="text-white" size={40} />
            </div>
            <h2 className="text-4xl font-light text-white mb-2">{exercise.name}</h2>
            <p className="text-gray-400 text-sm font-light tracking-wide">{exercise.subtitle}</p>
          </div>

          <div className="space-y-10">
            <section>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 mb-4">Focus</h4>
              <p className="text-gray-300 leading-relaxed font-light">{exercise.description}</p>
            </section>

            <section>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-600 mb-4">How to practice</h4>
              <p className="text-gray-300 leading-relaxed font-light">{exercise.howTo}</p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              {exercise.benefits.map((b: string, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-4 rounded-3xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-xs text-gray-400 font-light">{b}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onStart}
              className="w-full h-16 rounded-full bg-white text-black font-medium text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <Play size={20} fill="currentColor" />
              Begin Journey
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ExerciseView({ exercise, onBack, onRecordSession }: { 
  exercise: Exercise; 
  onBack: () => void;
  onRecordSession: (id: string, duration: number) => void;
}) {
  const timer = useBreathingTimer(exercise.pattern);
  const soundscape = useSoundscape(timer.isActive);
  const voice = useVoiceAssistant(timer.phase, timer.isActive);
  const binaural = useBinauralBeats(timer.isActive);

  // Record session on leave if any time was spent
  useEffect(() => {
    return () => {
      if (timer.totalTime > 10) { // Only record if spent more than 10 seconds
        onRecordSession(exercise.id, timer.totalTime);
      }
    };
  }, [timer.totalTime, exercise.id]);

  // Local settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [selectedVoiceId, setSelectedVoiceId] = useState('seraphina');

  const handleReset = () => {
    timer.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center w-full min-h-[80vh] justify-between py-8"
    >
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-light text-white tracking-tight">{exercise.name}</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{timer.phase}</p>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <SettingsIcon size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <BreathingCircle 
          phase={timer.phase} 
          timer={timer.timeLeft}
          gradient={exercise.gradient}
        />
      </div>

      <div className="w-full space-y-8 mt-12">
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handleReset}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            onClick={timer.toggle}
            className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            {timer.isActive ? <Pause size={32} fill="black" /> : <Play size={32} className="ml-1" fill="black" />}
          </button>

          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg">
            <Music size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[24px] flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest text-gray-600">Cycles</span>
            <span className="text-xl font-light text-white">{timer.cycles}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[24px] flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest text-gray-600">Duration</span>
            <span className="text-xl font-light text-white">
              {Math.floor(timer.totalTime / 60)}:{(timer.totalTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <SessionSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeSoundscape={soundscape.activeSoundscape}
        onSelectSoundscape={soundscape.toggleSoundscape}
        soundscapeVolume={soundscape.volume}
        onSetSoundscapeVolume={soundscape.setVolume}
        isVoiceEnabled={isVoiceEnabled}
        onSetVoiceEnabled={setIsVoiceEnabled}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={setSelectedVoiceId}
        voiceVolume={voiceVolume}
        onSetVoiceVolume={setVoiceVolume}
        onTestVoice={(id) => {
          if (typeof window !== 'undefined') {
            const utterance = new SpeechSynthesisUtterance("Inhale deeply through your nose.");
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.name.includes(id === 'atlas' ? 'Male' : 'Female'));
            if (voice) utterance.voice = voice;
            window.speechSynthesis.speak(utterance);
          }
        }}
        activeBinaural={binaural.activeBinaural}
        onSelectBinaural={binaural.toggleBinaural}
        binauralVolume={binaural.binauralVolume}
        onSetBinauralVolume={binaural.setBinauralVolume}
      />
    </motion.div>
  );
}
