'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserRound, 
  Target, 
  Zap as ZapIcon,
  Trophy,
  ChevronRight,
  Edit2,
  Check,
  X,
  Bell,
  Shield,
  Trash2,
  Info,
  ExternalLink,
  Camera,
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface ProfileViewProps {
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
  };
  userName: string;
  userAvatar: string | null;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatar: string | null) => void;
  onResetData: () => void;
}

export function ProfileView({
  stats,
  userName,
  userAvatar,
  onUpdateName,
  onUpdateAvatar,
  onResetData
}: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditingName(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height, 800);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;

        ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);

        let quality = 0.85;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (base64.length * 0.75 > 500000 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        // This will update the local storage and state via the hook
        onUpdateAvatar(base64);
        setIsSelectingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const suggestedAvatars = [
    { id: 'zen_stones', path: '/avatars/zen_stones.png', label: 'Zen' },
    { id: 'lotus', path: '/avatars/lotus.png', label: 'Lotus' },
    { id: 'aurora', path: '/avatars/aurora.png', label: 'Aurora' },
    { id: 'meditator', path: '/avatars/meditator.png', label: 'Peace' },
    { id: 'paper_crane', path: '/avatars/paper_crane.png', label: 'Hope' },
  ];

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
      className="w-95 pb-10 space-y-10"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      {/* Profile Header */}
      <div className="flex flex-col items-center pt-4">
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-50 h-50 rounded-full bg-gradient-to-br from-white/10 to-white/5 p-1 mb-6 shadow-2xl relative overflow-hidden cursor-pointer"
            onClick={() => setIsSelectingAvatar(true)}
          >
            <div className="w-full h-full rounded-full bg-[#0D0D0D] flex items-center justify-center border border-white/10 overflow-hidden relative">
              {userAvatar ? (
                <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserRound size={80} strokeWidth={1} className="text-white/20" />
              )}

              {/* Tap Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white mb-1" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white">Update Image</span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl opacity-50 pointer-events-none" />
          </motion.div>

          <button
            className="absolute bottom-10 right-1 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-4 border-[#0D0D0D]"
            onClick={() => setIsEditingName(true)}
          >
            <Edit2 size={16} />
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
                className="bg-white/5 border border-white/20 rounded-2xl px-4 py-2 text-2xl font-light text-white focus:outline-none focus:border-indigo-500/50 w-56 text-center"
              />
              <button onClick={handleSaveName} className="p-3 rounded-2xl bg-emerald-500 text-black">
                <Check size={20} />
              </button>
              <button onClick={() => { setIsEditingName(false); setTempName(userName); }} className="p-3 rounded-2xl bg-white/5 text-gray-400">
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
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles size={12} className="text-indigo-400" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Zen Practitioner • Elite Tier</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isSelectingAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0D0D0D] border border-white/10 p-10 rounded-[48px] w-full max-w-md space-y-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-light text-white tracking-tight">Identity</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">Choose your symbol</p>
                </div>
                <button
                  onClick={() => setIsSelectingAvatar(false)}
                  className="w-10 h-10 rounded-full bg-white/5 text-gray-500 flex items-center justify-center hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all group"
                >
                  <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                </button>
                <button
                  onClick={() => { onUpdateAvatar(null); setIsSelectingAvatar(false); }}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                >
                  <ImageIcon size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Default</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-2">
                <div className="flex flex-col items-center gap-3">
                  <button 
                    onClick={() => { onUpdateAvatar(null); setIsSelectingAvatar(false); }}
                    className={`w-full aspect-square rounded-[24px] border-2 flex items-center justify-center transition-all ${!userAvatar ? 'border-white bg-white/10' : 'border-white/5 bg-white/5 opacity-40 hover:opacity-100'}`}
                  >
                    <UserRound size={48} strokeWidth={1} className={!userAvatar ? 'text-white' : 'text-white/20'} />
                  </button>
                  <span className={`text-[8px] uppercase tracking-widest font-black ${!userAvatar ? 'text-white' : 'text-gray-600'}`}>Default</span>
                </div>
                {suggestedAvatars.map((avatar) => (
                  <div key={avatar.id} className="flex flex-col items-center gap-3">
                    <button
                      onClick={() => { onUpdateAvatar(avatar.path); setIsSelectingAvatar(false); }}
                      className={`w-full aspect-square rounded-[24px] border-2 overflow-hidden transition-all relative ${userAvatar === avatar.path ? 'border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <img src={avatar.path} alt={avatar.label} className="w-full h-full object-cover" />
                      {userAvatar === avatar.path && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Check size={10} className="text-black" strokeWidth={4} />
                        </div>
                      )}
                    </button>
                    <span className={`text-[8px] uppercase tracking-widest font-black ${userAvatar === avatar.path ? 'text-white' : 'text-gray-600'}`}>{avatar.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[9px] text-gray-500 font-medium text-center uppercase tracking-[0.2em] leading-relaxed">
                  Your identity is stored locally on your device for maximum privacy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-2xl">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600 mb-6 px-1">Mindfulness Journey</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Target, label: 'Minutes', value: stats.totalMinutes, color: 'text-orange-400' },
            { icon: ZapIcon, label: 'Sessions', value: stats.sessionCount, color: 'text-emerald-400' },
            { icon: Trophy, label: 'Streak', value: stats.streak, color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <stat.icon size={16} className={stat.color} />
              </div>
              <span className="text-xl font-light text-white">{stat.value}</span>
              <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Groups */}
      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-1 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">{group.title}</h3>
            <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] overflow-hidden shadow-2xl">
              {group.items.map((item, idx) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between px-8 py-6 hover:bg-white/[0.03] transition-all group/item ${idx !== group.items.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shadow-lg shadow-black/20 group-hover/item:scale-110 transition-transform`}>
                      <item.icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-light text-white/80 group-hover/item:text-white transition-colors">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && <span className="text-xs text-gray-500 font-medium group-hover/item:text-gray-400 transition-colors">{item.value}</span>}
                    <ChevronRight size={14} className="text-gray-700 group-hover/item:text-gray-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="space-y-4">
          <h3 className="px-1 text-[10px] uppercase tracking-[0.2em] font-bold text-red-500/50">Danger Zone</h3>
          <div className="bg-red-500/[0.02] border border-red-500/10 rounded-[42px] shadow-2xl">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between px-8 py-6 rounded-[42px] hover:bg-red-500/[0.05] transition-all text-red-400 group/item"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Trash2 size={18} />
                </div>
                <span className="text-sm font-light">Reset All Local Data</span>
              </div>
              <ChevronRight size={14} className="opacity-30 group-hover/item:opacity-100 transition-opacity" />
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
              className="bg-[#111] border border-white/10 p-8 rounded-[40px] w-full max-w-sm text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-2">
                <Shield size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-light text-white">Reset Application?</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">This will permanently delete all your custom exercises, favorites, and statistics. This cannot be undone.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={onResetData}
                  className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full h-14 rounded-2xl bg-white/5 text-gray-400 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
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
