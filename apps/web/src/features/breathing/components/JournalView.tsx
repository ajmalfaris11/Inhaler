'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BarChart3, Activity, Zap, History } from 'lucide-react';
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
      className="w-full space-y-10"
    >
      {/* Header */}
      <div className="px-1 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white/90">Journal</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-1 font-bold">Progress Analytics</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
          <BarChart3 size={20} />
        </div>
      </div>

      {/* Graphical Representation (Custom Bar Chart) */}
      <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Weekly Activity</span>
          <span className="text-[10px] text-gray-500 font-medium">Minutes / Day</span>
        </div>
        
        <div className="flex items-end justify-between h-40 gap-2 px-1">
          {graphData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="relative w-full flex flex-col items-center justify-end h-full">
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[9px] font-black px-2 py-1 rounded-md z-20 pointer-events-none whitespace-nowrap">
                  {day.minutes} min
                </div>
                
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                  transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                  className={`w-full rounded-full min-h-[4px] relative transition-all duration-500 ${
                    day.minutes > 0 
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                      : 'bg-white/5'
                  }`}
                />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${day.minutes > 0 ? 'text-white' : 'text-gray-700'}`}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 flex flex-col gap-4 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-black">Total Mindful</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-light text-white">{totalMinutes}</span>
              <span className="text-xs text-gray-500 font-light">min</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 flex flex-col gap-4 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Activity size={20} />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-black">Top Technique</span>
            <div className="mt-1">
              <span className="text-sm font-medium text-white truncate block">{mostUsedEx.name}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{counts[mostUsedId] || 0} times</span>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-6 pb-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Recent Sessions</span>
          <History size={16} className="text-gray-700" />
        </div>

        <div className="flex flex-col gap-3">
          {recentSessions.length > 0 ? (
            recentSessions.map((session, i) => {
              const ex = exercises.find(e => e.id === session.exerciseId) || exercises[0];
              const date = new Date(session.date);
              const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-[28px] p-5 flex items-center justify-between group hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-[18px] flex items-center justify-center shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }}
                    >
                      <Zap size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{ex.name}</h4>
                      <p className="text-[10px] text-gray-500 font-light">{formattedDate} • {formattedTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-light text-white">{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</span>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Duration</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-12 flex flex-col items-center text-center gap-4 opacity-40">
              <History size={40} strokeWidth={1} />
              <p className="text-xs font-light tracking-wide">No sessions recorded yet.<br/>Your journey begins with the first breath.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
