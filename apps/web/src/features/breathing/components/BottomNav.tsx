'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Library, Plus, User } from 'lucide-react';

type TabType = 'explore' | 'library' | 'create' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs: { id: TabType, icon: any, label: string }[] = [
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[340px] px-4 z-[100]">
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[38px] p-1.5 flex items-center justify-between shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
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
