'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Target, Zap as ZapIcon, Trophy, Settings, LogOut, ArrowLeft } from 'lucide-react';

interface ProfileViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
}

export function ProfileView({ stats }: ProfileViewProps) {
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
            <Settings size={18} />
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
