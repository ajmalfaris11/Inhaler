'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BarChart3, Activity, Zap, History, PieChart } from 'lucide-react';
import { Exercise, exercises } from '../data';

interface JournalViewProps {
  sessions: { exerciseId: string; date: string; duration: number }[];
}

type TimeRange = 'week' | 'month' | 'year';

export function JournalView({ sessions }: JournalViewProps) {
  const [range, setRange] = useState<TimeRange>('week');

  // Total Timing & Technique Breakdown
  const { totalMinutes, modelBreakdown } = useMemo(() => {
    const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
    const breakdown: Record<string, number> = {};
    
    sessions.forEach(s => {
      breakdown[s.exerciseId] = (breakdown[s.exerciseId] || 0) + s.duration;
    });

    const modelList = Object.entries(breakdown)
      .map(([id, duration]) => ({
        exercise: exercises.find(e => e.id === id) || exercises[0],
        minutes: Math.floor(duration / 60),
        duration
      }))
      .sort((a, b) => b.duration - a.duration);

    return { 
      totalMinutes: Math.floor(totalSeconds / 60),
      modelBreakdown: modelList 
    };
  }, [sessions]);

  // Graph Data Processing
  const graphData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    if (range === 'week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const daySeconds = sessions.filter(s => s.date.startsWith(dateStr)).reduce((acc, s) => acc + s.duration, 0);
        data.push({ label: days[d.getDay()], value: Math.floor(daySeconds / 60) });
      }
    } else if (range === 'month') {
      for (let i = 3; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - (i + 1) * 7);
        const end = new Date(now);
        end.setDate(end.getDate() - i * 7);
        const weekSeconds = sessions
          .filter(s => {
            const d = new Date(s.date);
            return d >= start && d < end;
          })
          .reduce((acc, s) => acc + s.duration, 0);
        data.push({ label: `W${4-i}`, value: Math.floor(weekSeconds / 60) });
      }
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const monthIdx = d.getMonth();
        const monthSeconds = sessions
          .filter(s => {
            const sd = new Date(s.date);
            return sd.getMonth() === monthIdx && sd.getFullYear() === d.getFullYear();
          })
          .reduce((acc, s) => acc + s.duration, 0);
        data.push({ label: months[monthIdx], value: Math.floor(monthSeconds / 60) });
      }
    }
    return data;
  }, [range, sessions]);

  const maxVal = Math.max(...graphData.map(d => d.value), 1);
  const yAxisTicks = [Math.floor(maxVal), Math.floor(maxVal / 2), 0];
  const recentSessions = [...sessions].reverse().slice(0, 5);

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

      {/* Graphical Representation Card - Full Width Thicker Bars with Y-Axis */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-1.5 bg-white/[0.03] p-1 rounded-[20px] border border-white/5">
              {(['week', 'month', 'year'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-5 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    range === r ? 'bg-white text-black shadow-xl scale-105' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex h-52 relative">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between pr-4 pb-10 text-[9px] font-black text-gray-700 uppercase tracking-widest h-full text-right w-10">
              {yAxisTicks.map((tick, i) => (
                <span key={i}>{tick}m</span>
              ))}
            </div>

            {/* Graph Area */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 flex items-end justify-between gap-4 px-2 relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-x-0 top-0 h-px bg-white/[0.02]" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.02]" />
                
                {graphData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group/bar">
                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                      <AnimatePresence>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all bg-white text-black text-[10px] font-black px-3 py-2 rounded-2xl z-20 pointer-events-none whitespace-nowrap shadow-2xl scale-110">
                          {day.value}m
                        </div>
                      </AnimatePresence>
                      
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.value / maxVal) * 100}%` }}
                        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                        className={`w-full rounded-[14px] min-h-[6px] relative transition-all duration-700 ${
                          day.value > 0 
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_15px_40px_rgba(99,102,241,0.4)]' 
                            : 'bg-white/[0.04]'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between gap-4 px-2 pt-4">
                {graphData.map((day, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${day.value > 0 ? 'text-white/90' : 'text-gray-800'}`}>
                      {day.label[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Breakdown Section */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
        <div className="flex justify-between items-center mb-8 px-1 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Technique Breakdown</span>
          <PieChart size={14} className="text-gray-700" />
        </div>
        
        <div className="space-y-8 relative z-10">
          {modelBreakdown.length > 0 ? (
            modelBreakdown.map((item, i) => (
              <div key={item.exercise.id} className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.exercise.gradient.start }} />
                    <span className="text-base font-light text-white/90 tracking-tight">{item.exercise.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500 tracking-tighter">{item.minutes} min</span>
                </div>
                <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.duration / (totalMinutes * 60)) * 100}%` }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${item.exercise.gradient.start}, ${item.exercise.gradient.end})` }}
                  />
                </div>
              </div>
            ))
          ) : (
             <p className="text-xs text-gray-600 font-light text-center py-4 italic">No data yet</p>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="space-y-6 pb-4 w-full">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Recent Sessions</span>
          <History size={16} className="text-gray-800" />
        </div>

        <div className="flex flex-col gap-4">
          {recentSessions.map((session, i) => {
            const ex = exercises.find(e => e.id === session.exerciseId) || exercises[0];
            const date = new Date(session.date);
            return (
              <motion.div
                key={i}
                className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 flex items-center justify-between group shadow-xl hover:bg-white/[0.02] transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[22px] flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }}>
                    <Zap size={24} className="text-white relative z-10" />
                    <div className="absolute inset-0 blur-xl opacity-30 bg-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-white tracking-tight leading-none mb-1">{ex.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
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
          })}
        </div>
      </div>
    </motion.div>
  );
}
