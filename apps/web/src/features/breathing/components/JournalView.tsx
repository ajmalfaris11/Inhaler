'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart3, Activity, Zap, History } from 'lucide-react';
import { exercises } from '../data';

interface JournalViewProps {
  sessions: { exerciseId: string; date: string; duration: number }[];
}

export function JournalView({ sessions }: JournalViewProps) {
  // Process sessions for insights
  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  
  // Find most used technique
  const counts: Record<string, number> = {};
  sessions.forEach(s => {
    counts[s.exerciseId] = (counts[s.exerciseId] || 0) + 1;
  });
  
  const mostUsedId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostUsedEx = exercises.find(e => e.id === mostUsedId) || exercises[0];

  const recentSessions = [...sessions].reverse().slice(0, 10);

  // Graph Data (Last 7 Days)
  const getGraphData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      
      const daySeconds = sessions
        .filter(s => s.date.startsWith(dateStr))
        .reduce((acc, s) => acc + s.duration, 0);
      
      data.push({
        label: dayName,
        minutes: Math.floor(daySeconds / 60),
        fullDate: dateStr
      });
    }
    return data;
  };

  const graphData = getGraphData();
  const maxMinutes = Math.max(...graphData.map(d => d.minutes), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="px-1 flex justify-between items-start mb-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Journal</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Progress Analytics</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
          <BarChart3 size={20} />
        </div>
      </div>

      {/* Graphical Representation (Custom Bar Chart) */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10 px-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Weekly Activity</span>
            <span className="text-[10px] text-gray-500 font-medium">Min / Day</span>
          </div>
          
          <div className="flex items-end justify-between h-40 gap-3 px-1">
            {graphData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all bg-white text-black text-[10px] font-black px-2.5 py-1.5 rounded-xl z-20 pointer-events-none whitespace-nowrap shadow-xl">
                    {day.minutes}m
                  </div>
                  
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                    transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                    className={`w-full rounded-full min-h-[4px] relative transition-all duration-700 ${
                      day.minutes > 0 
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_10px_30px_rgba(99,102,241,0.3)]' 
                        : 'bg-white/[0.05]'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${day.minutes > 0 ? 'text-white/80' : 'text-gray-800'}`}>
                  {day.label[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-2 gap-5 w-full">
        <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-[22px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 relative z-10 border border-indigo-500/10">
            <Clock size={24} strokeWidth={1.5} />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black">Total Mindful</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl font-light text-white tracking-tighter">{totalMinutes}</span>
              <span className="text-xs text-gray-500 font-light">min</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-[22px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 relative z-10 border border-emerald-500/10">
            <Activity size={24} strokeWidth={1.5} />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black">Top Practice</span>
            <div className="mt-2">
              <span className="text-sm font-medium text-white truncate block tracking-tight">{mostUsedEx.name}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{counts[mostUsedId] || 0} sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-6 pb-4 w-full">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Session History</span>
          <History size={16} className="text-gray-800" />
        </div>

        <div className="flex flex-col gap-4">
          {recentSessions.length > 0 ? (
            recentSessions.map((session, i) => {
              const ex = exercises.find(e => e.id === session.exerciseId) || exercises[0];
              const date = new Date(session.date);
              const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all duration-500 shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-14 h-14 rounded-[22px] flex items-center justify-center shadow-2xl relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }}
                    >
                      <Zap size={24} className="text-white relative z-10" />
                      <div className="absolute inset-0 blur-xl opacity-30 bg-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-light text-white tracking-tight leading-none mb-1">{ex.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formattedDate} • {formattedTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-light text-white tracking-tighter">
                      {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <p className="text-[9px] text-gray-700 uppercase tracking-[0.2em] font-black mt-1">Duration</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-16 flex flex-col items-center text-center gap-6 opacity-30">
              <History size={48} strokeWidth={1} />
              <p className="text-xs font-light tracking-widest leading-relaxed">No sessions recorded yet.<br/>Your journey begins with the first breath.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
