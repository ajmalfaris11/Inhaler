'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Trees, Sparkles, Waves, Volume2, X } from 'lucide-react';
import { SoundscapeType, soundscapes } from '../hooks/useSoundscape';

interface SoundscapeSelectorProps {
  activeSoundscape: SoundscapeType;
  onSelect: (id: SoundscapeType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const IconMap = {
  rain: CloudRain,
  forest: Trees,
  'deep-space': Sparkles,
  'zen-bowls': Waves,
  none: X,
};

export function SoundscapeSelector({ activeSoundscape, onSelect, isOpen, onClose }: SoundscapeSelectorProps) {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/10 rounded-t-[40px] z-[80] p-8 pb-12"
          >
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-light tracking-tight text-white">Ambient Soundscapes</h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Enhance your practice</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onSelect('none')}
                  className={`flex flex-col items-center justify-center p-6 rounded-[24px] border transition-all ${
                    activeSoundscape === 'none'
                      ? 'bg-white border-white text-black'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <X size={24} strokeWidth={1.5} className="mb-3" />
                  <span className="text-sm font-medium">None</span>
                </button>

                {soundscapes.map((s) => {
                  const Icon = IconMap[s.id as keyof typeof IconMap] || Volume2;
                  const isActive = activeSoundscape === s.id;

                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelect(s.id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-[24px] border transition-all ${
                        isActive
                          ? 'bg-white border-white text-black'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={24} strokeWidth={1.5} className="mb-3" />
                      <span className="text-sm font-medium">{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
