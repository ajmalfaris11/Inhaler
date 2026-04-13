'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Target, 
  Zap as ZapIcon, 
  Trophy, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Edit2, 
  Check, 
  X,
  Bell,
  Shield,
  Trash2,
  Info,
  ExternalLink
} from 'lucide-react';

interface ProfileViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
  userName: string;
  onUpdateName: (name: string) => void;
  onResetData: () => void;
}

export function ProfileView({ stats, userName, onUpdateName, onResetData }: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditingName(false);
    }
  };

  const menuGroups = [
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'Morning Mindful', color: 'bg-blue-500' },
        { icon: Shield, label: 'Privacy & Health', value: 'Connected', color: 'bg-emerald-500' },
        { icon: Target, label: 'Daily Goal', value: '15 Minutes', color: 'bg-orange-500' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: Info, label: 'About Inhale', value: 'v1.4.2', color: 'bg-purple-500' },
        { icon: ExternalLink, label: 'Resource Center', color: 'bg-gray-500' },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full pb-10"
    >
      {/* iOS Style Profile Header */}
      <div className="flex flex-col items-center mb-10 pt-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/10 to-white/5 p-1 mb-6 shadow-2xl relative">
            <div className="w-full h-full rounded-full bg-[#0D0D0D] flex items-center justify-center border border-white/10">
              <User size={48} className="text-white/40" />
            </div>
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl opacity-50" />
          </div>
          <button 
            className="absolute bottom-6 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            onClick={() => setIsEditingName(true)}
          >
            <Edit2 size={14} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isEditingName ? (
            <motion.div 
              key="edit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 mt-2"
            >
              <input
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-xl font-light text-white focus:outline-none focus:border-indigo-500/50 w-48 text-center"
              />
              <button onClick={handleSaveName} className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Check size={20} />
              </button>
              <button onClick={() => { setIsEditingName(false); setTempName(userName); }} className="p-2 rounded-xl bg-white/5 text-gray-400">
                <X size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="display"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <h2 className="text-3xl font-light text-white tracking-tight">{userName}</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600 mt-2">Zen Practitioner • Elite Tier</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* iOS Style Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { icon: Target, label: 'Minutes', value: stats.totalMinutes, color: 'text-orange-400' },
          { icon: ZapIcon, label: 'Sessions', value: stats.sessionCount, color: 'text-emerald-400' },
          { icon: Trophy, label: 'Streak', value: stats.streak, color: 'text-blue-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-[32px] flex flex-col items-center gap-2">
            <stat.icon size={18} className={stat.color} />
            <span className="text-xl font-light text-white">{stat.value}</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* iOS Style Settings Groups */}
      <div className="space-y-8">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="px-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">{group.title}</h3>
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-[32px] overflow-hidden">
              {group.items.map((item, idx) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.02] transition-colors ${idx !== group.items.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                      <item.icon size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-light text-white/80">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && <span className="text-sm text-gray-500 font-light">{item.value}</span>}
                    <ChevronRight size={14} className="text-gray-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="space-y-2">
          <h3 className="px-5 text-[10px] uppercase tracking-[0.2em] font-bold text-red-500/50">Danger Zone</h3>
          <div className="bg-red-500/[0.02] border border-red-500/10 rounded-[32px] overflow-hidden">
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-red-500/[0.05] transition-colors text-red-400"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={16} />
                </div>
                <span className="text-sm font-light">Reset All Local Data</span>
              </div>
              <ChevronRight size={14} className="opacity-30" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center px-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111] border border-white/10 p-8 rounded-[40px] w-full max-w-sm text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-2">
                <Shield size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-white">Reset Application?</h3>
                <p className="text-sm text-gray-500 font-light">This will permanently delete all your custom exercises, favorites, and statistics. This cannot be undone.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={onResetData}
                  className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-500/20"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full h-14 rounded-2xl bg-white/5 text-gray-400 font-bold text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
