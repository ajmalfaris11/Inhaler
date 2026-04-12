'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Plus, Trash2, CheckCircle2, Lock, Clock, Calendar, Zap, Sparkles } from 'lucide-react';
import { Badge, CustomGoal } from '../hooks/useCustomExercises';

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
  onAddGoal: (goal: { id: string; name: string; targetMinutes: number }) => void;
  onDeleteGoal: (id: string) => void;
}

export function AchievementsView({ stats, customGoals, onAddGoal, onDeleteGoal }: AchievementsViewProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('30');

  const categories = [
    { id: 'daily', label: 'Daily', icon: Clock, color: 'text-indigo-400' },
    { id: 'weekly', label: 'Weekly', icon: Calendar, color: 'text-emerald-400' },
    { id: 'milestone', label: 'Milestones', icon: Trophy, color: 'text-yellow-400' },
    { id: 'custom', label: 'Personal Goals', icon: Target, color: 'text-rose-400' }
  ];

  const handleAddGoal = () => {
    if (!newGoalName) return;
    onAddGoal({
      id: Math.random().toString(36).substr(2, 9),
      name: newGoalName,
      targetMinutes: parseInt(newGoalTarget) || 30
    });
    setNewGoalName('');
    setIsAddingGoal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="w-full flex justify-between items-start mb-4 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Achievements</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Goals & Milestones</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Target size={20} />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-10">
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
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-600">{cat.label}</span>
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
                    <motion.div
                      key={badge.id}
                      className={`relative w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-xl overflow-hidden group ${!badge.unlocked && 'opacity-60 grayscale-[0.5]'}`}
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
                            <div className="text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                              Unlocked
                            </div>
                          ) : (
                            <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                              {badge.progress ? `${Math.round(badge.progress)}%` : 'Locked'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar (if not unlocked) */}
                      {!badge.unlocked && badge.progress !== undefined && (
                        <div className="mt-6 h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${badge.progress}%` }}
                            className="h-full bg-white/20 rounded-full"
                          />
                        </div>
                      )}

                      {/* Custom Goal Delete Button */}
                      {cat.id === 'custom' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteGoal(badge.id); }}
                          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-700 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-30 border border-dashed border-white/10 rounded-[42px]">
                    <p className="text-[10px] uppercase tracking-widest font-bold">No personal goals set</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Goal Modal */}
      <AnimatePresence>
        {isAddingGoal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[340px] bg-[#0D0D0D] border border-white/10 rounded-[42px] p-8 space-y-6 shadow-2xl"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-[22px] bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-light text-white tracking-tight">Set Personal Goal</h3>
                <p className="text-xs text-gray-500 font-light">Aim for a specific milestone in your mindfulness journey.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 px-1">Goal Name</label>
                  <input 
                    type="text" 
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder="e.g. Monthly Deep Calm"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-rose-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 px-1">Target Minutes</label>
                  <input 
                    type="number" 
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="30"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-rose-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={() => setIsAddingGoal(false)}
                  className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddGoal}
                  className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black bg-rose-400 hover:bg-rose-300 transition-colors shadow-lg shadow-rose-500/20"
                >
                  Create Goal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
