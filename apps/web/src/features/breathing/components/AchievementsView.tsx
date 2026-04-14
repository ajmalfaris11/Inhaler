'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, Trash2, Lock, Clock, Calendar, Sparkles, ChevronDown, CheckCircle2, Play, ChevronLeft, Target, Wind } from 'lucide-react';
import { Badge, CustomGoal } from '../hooks/useCustomExercises';
import { Exercise, exercises as defaultExercises } from '../data';

interface AchievementsViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
    todayMinutes: number;
    weekMinutes: number;
  };
  customGoals: CustomGoal[];
  customExercises: Exercise[];
  onAddGoal: (goal: { id: string; name: string; targetMinutes: number; exerciseId: string }) => void;
  onDeleteGoal: (id: string) => void;
  onStart: (ex: Exercise) => void;
}

const TargetArrow = ({ size = 20, strokeWidth = 2, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 12l7-7" />
    <path d="M19 8V5h-3" />
  </svg>
);

export function AchievementsView({ stats, customGoals, customExercises, onAddGoal, onDeleteGoal, onStart }: AchievementsViewProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('30');
  const [selectedExerciseId, setSelectedExerciseId] = useState('all');

  const allExercises = [...defaultExercises, ...customExercises];

  const categories = [
    { id: 'daily', label: 'Daily', icon: Clock, color: 'text-indigo-400' },
    { id: 'weekly', label: 'Weekly', icon: Calendar, color: 'text-emerald-400' },
    { id: 'milestone', label: 'Milestones', icon: Trophy, color: 'text-yellow-400' },
    { id: 'custom', label: 'Personal Goals', icon: TargetArrow, color: 'text-rose-400' }
  ];

  const handleAddGoal = () => {
    if (!newGoalName) return;
    onAddGoal({
      id: Math.random().toString(36).substr(2, 9),
      name: newGoalName,
      targetMinutes: parseInt(newGoalTarget) || 30,
      exerciseId: selectedExerciseId
    });
    setNewGoalName('');
    setIsAddingGoal(false);
  };

  const handleBadgeClick = (badge: Badge) => {
    const exercise = allExercises.find(e => e.id === badge.exerciseId);
    if (exercise) onStart(exercise);
    else {
      const boxEx = allExercises.find(e => e.id === 'box');
      if (boxEx) onStart(boxEx);
    }
  };

  if (isAddingGoal) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="fixed inset-0 z-[300] bg-black flex flex-col p-8 pb-32"
      >
        <div className="flex items-center gap-6 mb-12">
          <button 
            onClick={() => setIsAddingGoal(false)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="space-y-1">
            <h2 className="text-2xl font-light text-white tracking-tight">Set Ambition</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Biological Milestone</p>
          </div>
        </div>

        <div className="flex-1 space-y-10 overflow-y-auto pr-2 scrollbar-hide">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 px-2">Goal Identity</label>
            <input 
              type="text" 
              autoFocus
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g. Master Breath Control"
              className="w-full bg-transparent border-b border-white/10 rounded-none py-4 text-3xl font-light text-white placeholder:text-gray-800 focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 px-2">Select Technique</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedExerciseId('all')}
                className={`p-5 rounded-[28px] border transition-all text-left relative overflow-hidden group ${selectedExerciseId === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white'}`}
              >
                <div className="flex flex-col gap-2 relative z-10">
                  <Wind size={18} className={selectedExerciseId === 'all' ? 'text-black' : 'text-gray-500'} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Universal</span>
                </div>
                {selectedExerciseId === 'all' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={12} className="text-black" />
                  </div>
                )}
              </button>
              
              {allExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`p-5 rounded-[28px] border transition-all text-left relative overflow-hidden group ${selectedExerciseId === ex.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white'}`}
                >
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }} />
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{ex.name}</span>
                  </div>
                  {selectedExerciseId === ex.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 size={12} className="text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600 px-2">Target Duration</label>
            <div className="bg-white/[0.03] border border-white/5 rounded-[42px] p-8 space-y-8">
              <div className="flex justify-between items-baseline">
                <span className="text-6xl font-light text-rose-400 tabular-nums tracking-tighter">{newGoalTarget}</span>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">Minutes</span>
              </div>
              <input 
                type="range"
                min="5"
                max="120"
                step="5"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="w-full h-1 bg-white/10 rounded-full appearance-none accent-rose-500"
              />
              <div className="flex justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest px-1">
                <span>5m</span>
                <span>60m</span>
                <span>120m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10">
          <button 
            onClick={handleAddGoal}
            className="w-full py-7 rounded-[32px] text-[10px] font-black uppercase tracking-[0.5em] text-black bg-white hover:bg-rose-400 hover:text-white transition-all shadow-2xl active:scale-95"
          >
            Activate Goal
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-12 pb-10"
    >
      {/* Header */}
      <div className="w-full flex justify-between items-start mb-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Evolution</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">Biological Milestones</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-yellow-500">
          <Trophy size={20} />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-14">
        {categories.map((cat) => {
          const catBadges = stats.badges.filter(b => b.category === cat.id);
          const Icon = cat.icon;

          return (
            <div key={cat.id} className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 ${cat.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-700">{cat.label}</span>
                </div>
                {cat.id === 'custom' && (
                  <button 
                    onClick={() => setIsAddingGoal(true)}
                    className="p-2 rounded-xl bg-white/5 text-rose-400 hover:bg-white/10 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {catBadges.length > 0 ? (
                  catBadges.map((badge) => (
                    <motion.button
                      key={badge.id}
                      onClick={() => handleBadgeClick(badge)}
                      className={`relative w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-xl overflow-hidden group text-left ${!badge.unlocked && 'opacity-60'}`}
                    >
                      <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center relative overflow-hidden transition-all duration-700 ${
                            badge.unlocked ? 'bg-yellow-500/10 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-white/5 text-gray-600'
                          }`}>
                            {badge.unlocked ? <Sparkles size={24} /> : <Lock size={22} strokeWidth={1.5} />}
                          </div>
                          <div>
                            <h4 className={`text-lg font-light tracking-tight leading-none mb-1.5 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>
                              {badge.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{badge.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {badge.unlocked ? (
                            <div className="text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                              Practice Again
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xl font-light text-gray-400 tabular-nums">{Math.round(badge.progress || 0)}%</span>
                              <div className="flex items-center gap-1">
                                <Play size={8} className="text-indigo-400" />
                                <span className="text-[8px] text-indigo-400 uppercase tracking-widest font-black">Begin</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {!badge.unlocked && badge.progress !== undefined && (
                        <div className="mt-6 h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${badge.progress}%` }}
                            className={`h-full rounded-full ${badge.category === 'custom' ? 'bg-rose-500/40' : 'bg-white/20'}`}
                          />
                        </div>
                      )}

                      {cat.id === 'custom' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteGoal(badge.id); }}
                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-800 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-20 border border-dashed border-white/10 rounded-[42px]">
                    <p className="text-[10px] uppercase tracking-widest font-bold">No personal goals set</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
