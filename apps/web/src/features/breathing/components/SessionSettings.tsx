'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Trees, Sparkles, Waves, Volume2, X, Play, Check } from 'lucide-react';
import { SoundscapeType, soundscapes } from '../hooks/useSoundscape';
import { voiceProfiles } from '../hooks/useVoiceAssistant';

interface SessionSettingsProps {
  activeSoundscape: SoundscapeType;
  onSelectSoundscape: (id: SoundscapeType) => void;
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  onTestVoice: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const IconMap = {
  'zen-river': Waves,
  'zen-fountain': Wind,
  'winter-rain': CloudRain,
  'light-rain': CloudRain,
  'nature-birds': Trees,
  'hz-transformation': Sparkles,
  none: X,
};

export function SessionSettings({ 
  activeSoundscape, 
  onSelectSoundscape, 
  selectedVoiceId,
  onSelectVoice,
  onTestVoice,
  isOpen, 
  onClose 
}: SessionSettingsProps) {
  const [activeTab, setActiveTab] = useState<'sound' | 'voice'>('sound');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[70]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white/[0.05] backdrop-blur-[40px] border-t border-white/20 rounded-t-[40px] z-[80] p-6 pb-10 shadow-[0_-15px_50px_rgba(0,0,0,0.4)]"
          >
            {/* Visual Handle */}
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-6" />

            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="flex bg-white/10 p-1 rounded-full border border-white/10 shadow-inner">
                  <button 
                    onClick={() => setActiveTab('sound')}
                    className={`px-7 py-2 rounded-full text-sm font-medium transition-all duration-400 ${activeTab === 'sound' ? 'bg-white text-black shadow-md' : 'text-gray-300'}`}
                  >
                    Ambience
                  </button>
                  <button 
                    onClick={() => setActiveTab('voice')}
                    className={`px-7 py-2 rounded-full text-sm font-medium transition-all duration-400 ${activeTab === 'voice' ? 'bg-white text-black shadow-md' : 'text-gray-300'}`}
                  >
                    Guide
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-all"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">
                {activeTab === 'sound' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => onSelectSoundscape('none')}
                      className={`flex flex-col items-center justify-center p-6 rounded-[28px] border relative transition-all duration-400 ${
                        activeSoundscape === 'none'
                          ? 'bg-white/15 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <X size={24} strokeWidth={1.5} className="mb-2" />
                      <span className="text-xs font-medium">None</span>
                      {activeSoundscape === 'none' && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check size={12} className="text-black" strokeWidth={3} />
                        </div>
                      )}
                    </button>

                    {soundscapes.map((s) => {
                      const Icon = IconMap[s.id as keyof typeof IconMap] || Volume2;
                      const isActive = activeSoundscape === s.id;

                      return (
                        <button
                          key={s.id}
                          onClick={() => onSelectSoundscape(s.id)}
                          className={`flex flex-col items-center justify-center p-6 rounded-[28px] border relative transition-all duration-400 ${
                            isActive
                              ? 'bg-white/15 border-white/40 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <Icon size={24} strokeWidth={1.5} className="mb-2" />
                          <span className="text-xs font-medium">{s.name}</span>
                          {isActive && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <Check size={12} className="text-black" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {voiceProfiles.map((v) => {
                      const isActive = selectedVoiceId === v.id;
                      const isMale = v.id === 'atlas' || v.id === 'caspian';
                      return (
                        <div 
                          key={v.id}
                          className={`flex items-center gap-4 p-4 rounded-[28px] border relative transition-all duration-400 ${
                            isActive ? 'bg-white/15 border-white/40 shadow-xl' : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div 
                            onClick={() => onSelectVoice(v.id)}
                            className="flex-1 cursor-pointer"
                          >
                            <h4 className={`text-base font-normal ${isActive ? 'text-white' : 'text-gray-300'}`}>{v.name}</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                              {isMale ? 'Deep Velvet' : 'Smooth Ethereal'}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => onTestVoice(v.id)}
                              className="p-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-all"
                            >
                              <Play size={14} fill="currentColor" />
                            </button>
                            
                            <div 
                              onClick={() => onSelectVoice(v.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                                isActive ? 'border-white bg-white' : 'border-white/20'
                              }`}
                            >
                              {isActive && <Check size={14} className="text-black" strokeWidth={3} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
