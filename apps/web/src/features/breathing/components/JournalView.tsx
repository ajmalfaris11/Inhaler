'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, PieChart, Zap, Calendar } from 'lucide-react';
import { exercises } from '../data';
import { Badge } from '../hooks/useCustomExercises';

interface JournalViewProps {
  sessions: { exerciseId: string; date: string; duration: number }[];
  stats: {
    totalMinutes: number;
    sessionCount: number;
    streak: number;
    badges: Badge[];
  };
}

export function JournalView({ sessions, stats }: JournalViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to end on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  // Activity Map Helper
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach(s => {
      const dateKey = s.date.split('T')[0];
      map[dateKey] = (map[dateKey] || 0) + s.duration;
    });
    return map;
  }, [sessions]);

  // Generate 52 weeks of data for the heatmap
  const { weeks, monthLabels } = useMemo(() => {
    const weeksList = [];
    const months = [];
    const now = new Date();

    // Start from 51 weeks ago (most recent Sunday)
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
    startDate.setDate(startDate.getDate() - (51 * 7));

    let lastMonth = -1;

    for (let w = 0; w < 52; w++) {
      const weekDays = [];
      const firstDayOfWeek = new Date(startDate);
      firstDayOfWeek.setDate(startDate.getDate() + (w * 7));

      // Check if this week starts a new month
      const monthIndex = firstDayOfWeek.getMonth();
      if (monthIndex !== lastMonth) {
        months.push({
          label: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
          index: w
        });
        lastMonth = monthIndex;
      }

      for (let d = 0; d < 7; d++) {
        const targetDate = new Date(firstDayOfWeek);
        targetDate.setDate(firstDayOfWeek.getDate() + d);

        // Don't show future days (no border, no opacity)
        if (targetDate > now) {
          weekDays.push({ date: '', level: -1, duration: 0 });
          continue;
        }

        const dateKey = targetDate.toISOString().split('T')[0];
        const duration = activityMap[dateKey] || 0;

        let level = 0;
        if (duration > 0 && duration < 300) level = 1;
        else if (duration >= 300 && duration < 900) level = 2;
        else if (duration >= 900 && duration < 1800) level = 3;
        else if (duration >= 1800) level = 4;

        weekDays.push({ date: dateKey, level, duration });
      }
      weeksList.push(weekDays);
    }
    return { weeks: weeksList, monthLabels: months };
  }, [activityMap]);

  const { modelBreakdown } = useMemo(() => {
    const breakdown: Record<string, number> = {};
    sessions.forEach(s => {
      breakdown[s.exerciseId] = (breakdown[s.exerciseId] || 0) + s.duration;
    });
    return {
      modelBreakdown: Object.entries(breakdown)
        .map(([id, duration]) => ({
          exercise: exercises.find(e => e.id === id) || exercises[0],
          minutes: Math.floor(duration / 60),
          duration
        }))
        .sort((a, b) => b.duration - a.duration)
    };
  }, [sessions]);

  const recentSessions = [...sessions].reverse().slice(0, 5);

  const levelColors: Record<number, string> = {
    0: 'bg-white/[0.03] border-transparent', // No border for inactive past days
    1: 'bg-indigo-900 border-indigo-500/10',
    2: 'bg-indigo-700 border-indigo-400/20',
    3: 'bg-indigo-500 border-indigo-300/30',
    4: 'bg-indigo-400 border-indigo-200/40',
    '-1': 'bg-transparent border-white/[0.05] pointer-events-none' // Future days: completely invisible and no border
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-95 space-y-6"
    >
      {/* Header */}
      <div className="w-full flex justify-between items-start mb-2 px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-light tracking-tight text-white/90">Journal</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Progress Analytics</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
          <Calendar size={20} />
        </div>
      </div>

      {/* Contribution Heatmap Card */}
      <div className="w-full bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 shadow-2xl relative overflow-hidden group">
        <div className="flex justify-between items-center mb-8 px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Yearly Activity</span>
          <div className="flex items-center gap-2">
            <span className="text-[8px] uppercase tracking-widest text-gray-700 font-bold">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(l => (
                <div key={l} className={`w-2.5 h-2.5 rounded-sm ${levelColors[l]}`} />
              ))}
            </div>
            <span className="text-[8px] uppercase tracking-widest text-gray-700 font-bold">More</span>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 scrollbar-hide flex gap-4 mask-fade-edges"
          >
            {/* Day Labels (Side) */}
            <div className="grid grid-rows-7 gap-1.5 pt-6 pr-1 sticky left-0 bg-[#0D0D0D] z-20">
              {[0, 1, 2, 3, 4, 5, 6].map(d => (
                <div key={d} className="h-3.5 flex items-center justify-end">
                  {[1, 3, 5].includes(d) && (
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-700 mr-1">
                      {['Mon', 'Wed', 'Fri'][Math.floor(d / 2)]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Heatmap Grid with Month Labels (Top) */}
            <div className="flex flex-col gap-2">
              <div className="h-4 relative">
                {monthLabels.map((m, i) => (
                  <span
                    key={i}
                    className="absolute text-[8px] font-black uppercase tracking-widest text-gray-600 whitespace-nowrap"
                    style={{ left: `${m.index * 20}px` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-rows-7 gap-1.5">
                    {week.map((day, di) => (
                      <motion.div
                        key={di}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: (wi * 7 + di) * 0.0005 }}
                        className={`w-3.5 h-3.5 rounded-[4px] border transition-all hover:scale-125 hover:z-10 ${levelColors[day.level]}`}
                        title={day.date ? `${day.date}: ${Math.floor(day.duration / 60)} min` : undefined}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between px-1 border-t border-white/5 pt-6">
          <div className="flex flex-col">
            <span className="text-xl font-light text-white">{stats.sessionCount}</span>
            <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">Total Sessions</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-light text-white">{stats.streak} Days</span>
            <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold">Current Streak</span>
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
          {modelBreakdown.map((item) => (
            <div key={item.exercise.id} className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.exercise.gradient.start }} />
                  <span className="text-base font-light text-white/90 tracking-tight">{item.exercise.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-500 tracking-tighter">{item.minutes} min</span>
              </div>
              <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.duration / (stats.totalMinutes * 60 || 1)) * 100}%` }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${item.exercise.gradient.start}, ${item.exercise.gradient.end})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session History */}
      <div className="space-y-6 pb-4 w-full">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">Recent Sessions</span>
          <Zap size={16} className="text-gray-800" />
        </div>
        <div className="flex flex-col gap-4">
          {recentSessions.map((session, i) => {
            const ex = exercises.find(e => e.id === session.exerciseId) || exercises[0];
            const date = new Date(session.date);
            return (
              <motion.div key={i} className="bg-[#0D0D0D] border border-white/[0.06] rounded-[42px] p-8 flex items-center justify-between group shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[22px] flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ex.gradient.start}, ${ex.gradient.end})` }}>
                    <Zap size={24} className="text-white relative z-10" />
                    <div className="absolute inset-0 blur-xl opacity-30 bg-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-white tracking-tight leading-none mb-1">{ex.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-light text-white tracking-tighter">{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</span>
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
