'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe, ChevronLeft, User } from 'lucide-react';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthView({ onBack, onSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[300] flex flex-col overflow-hidden"
    >
      <div className="max-w-[480px] mx-auto w-full px-8 py-6 flex flex-col h-full">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors mb-6 self-start"
        >
          <ChevronLeft size={18} className="text-gray-400" />
        </button>

        <div className="flex-1 flex flex-col justify-center space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20"
            >
              <Lock size={28} className="text-white" />
            </motion.div>
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight text-white">
                {mode === 'login' ? 'Welcome Back' : 'Join Inhaler'}
              </h1>
              <p className="text-gray-500 font-light text-xs">
                {mode === 'login' 
                  ? 'Sign in to continue your journey.' 
                  : 'Start your journey to mindfulness today.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {mode === 'signup' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative group"
                  >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                      <User size={16} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={16} />
                </div>
                <input 
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={16} />
                </div>
                <input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                />
              </div>

              {mode === 'login' && (
                <div className="flex justify-end px-2">
                  <button className="text-[10px] uppercase tracking-widest font-black text-gray-600 hover:text-emerald-400 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={onSuccess}
              className="w-full h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] uppercase tracking-widest text-gray-700 font-bold">Or continue with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <button className="h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-95 group">
              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe size={16} className="text-white" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Google</span>
            </button>
            <button className="h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95 group">
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="14" height="14" viewBox="0 0 256 315" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.394-27.815-12.44-51.848-12.44-24.032 0-31.504 12.047-51.456 12.834-20.741.786-36.64-21.123-49.854-40.215-27.017-39.041-47.652-110.192-19.828-158.451 13.82-24.02 38.53-39.223 65.333-39.617 20.346-.393 39.512 13.71 52.032 13.71 12.522 0 35.844-16.913 60.604-14.44 10.387.43 39.589 4.184 58.293 31.593-1.496.932-34.881 20.32-34.453 60.038zM174.17 49.303c11.091-13.43 18.594-32.131 16.554-50.803-16.038.645-35.414 10.68-46.913 24.11-10.313 11.954-19.34 31.065-16.902 49.336 17.904 1.389 36.174-9.213 47.261-22.643z"/>
                </svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-black">Apple ID</span>
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="text-center pt-2">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-light text-gray-600 hover:text-emerald-400 transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-auto text-center text-[9px] text-gray-800 font-medium tracking-tighter pt-8">
          By continuing, you agree to our <span className="text-gray-700">Terms</span> and <span className="text-gray-700">Privacy</span>.
        </p>
      </div>

      {/* Decorative Blur Elements */}
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
    </motion.div>
  );
}
