'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Library, BarChart3, User, Target } from 'lucide-react';

export type TabType = 'explore' | 'library' | 'achievements' | 'journal' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs: { id: TabType, icon: any, label: string }[] = [
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'achievements', icon: Target, label: 'Goals' },
    { id: 'journal', icon: BarChart3, label: 'Journal' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[380px] px-4 z-[100]">
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[38px] p-1.5 flex items-center justify-between shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-white/10 rounded-2xl border border-white/10 shadow-lg"
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="relative z-10" />
              
              {/* Specialized visual for Achievements (Center) */}
              {tab.id === 'achievements' && (
                <div className={`absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] z-20 ${isActive ? 'animate-pulse' : 'opacity-40'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
