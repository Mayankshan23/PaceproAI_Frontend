import React from 'react';
import { Award, ShieldCheck, Sparkles, Zap, ChevronRight } from 'lucide-react';

const DEFAULT_METRICS = [
  {
    id: 'front_knee_brace',
    landmark: 'Front Knee Brace',
    proStandard: '170° – 178°',
    bowlerValue: '172°',
    status: 'Optimal',
    statusType: 'optimal',
    category: 'Kinetic Chain'
  },
  {
    id: 'hip_shoulder_sep',
    landmark: 'Hip-Shoulder Separation',
    proStandard: '28° – 35°',
    bowlerValue: '31.4°',
    status: 'High Torque',
    statusType: 'optimal',
    category: 'Torque & Core'
  },
  {
    id: 'arm_slot_angle',
    landmark: 'Arm Slot Angle',
    proStandard: '10° – 18°',
    bowlerValue: '12.5°',
    status: 'High Arm',
    statusType: 'optimal',
    category: 'Release Trajectory'
  },
  {
    id: 'stride_length',
    landmark: 'Stride Length (% Height)',
    proStandard: '75% – 85%',
    bowlerValue: '81.2%',
    status: 'Balanced',
    statusType: 'optimal',
    category: 'Run-up & Stride'
  }
];

/**
 * SynchronizedMetricsTable
 * 
 * Fixes mobile horizontal bleed & column clipping:
 * - Uses `<div className="w-full overflow-x-auto -mx-1 px-1">` for standard table mode
 * - Provides responsive stacked cards on mobile viewports (<640px)
 * - Guarantees zero text/badge clipping for "YOUR VALUE" / status badges like "172° (Optimal)" and "31.4° (High Torque)"
 */
export const SynchronizedMetricsTable = ({
  metrics = DEFAULT_METRICS,
  quote = '"A 10° increase in knee brace stiffness increases ball release velocity by up to 5.4 km/h."',
  className = ''
}) => {
  return (
    <div className={`synchronized-metrics-container w-full max-w-full ${className}`}>
      {/* 1. Mobile Stacked Cards View (Displays on mobile screens < 640px without any clipping) */}
      <div className="block sm:hidden space-y-2.5 mb-5">
        {metrics.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#141418]/90 backdrop-blur-md shadow-xs flex flex-col gap-2 transition-all hover:border-sky-400/50"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 leading-snug">
                {item.landmark}
              </span>
              {item.category && (
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md shrink-0">
                  {item.category}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-white/5 items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Pro Standard
                </div>
                <div className="font-mono text-xs font-semibold text-slate-600 dark:text-zinc-400 mt-0.5">
                  {item.proStandard}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Your Value
                </div>
                <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2.5 py-1 rounded-lg mt-0.5 border border-sky-200 dark:border-sky-800/50">
                  <span>{item.bowlerValue}</span>
                  {item.status && <span className="font-sans font-medium text-[11px] opacity-90">({item.status})</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop & Tablet Table with Horizontal Overflow Guard */}
      <div className="hidden sm:block w-full overflow-x-auto -mx-1 px-1 mb-5 scrollbar-thin">
        <div className="min-w-[480px] w-full flex flex-col gap-2">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-white/5 select-none">
            <span className="col-span-5">Key Landmark</span>
            <span className="col-span-3 text-center">Pro Standard</span>
            <span className="col-span-4 text-right">Your Value / Target</span>
          </div>

          {/* Table Rows */}
          {metrics.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-3 px-4 py-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 items-center text-sm transition-all hover:bg-sky-50/50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-800/40"
            >
              <div className="col-span-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate" title={item.landmark}>
                  {item.landmark}
                </span>
              </div>

              <div className="col-span-3 text-center font-mono text-xs font-medium text-slate-500 dark:text-zinc-400">
                {item.proStandard}
              </div>

              <div className="col-span-4 flex items-center justify-end">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-100/70 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200/80 dark:border-sky-800/60 shadow-xs whitespace-nowrap">
                  <span>{item.bowlerValue}</span>
                  {item.status && (
                    <span className="font-sans font-medium text-[11px] text-sky-700 dark:text-sky-300">
                      ({item.status})
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Banner */}
      {quote && (
        <div className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/40 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 italic shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-400/10 flex items-center justify-center shrink-0 text-sky-500 dark:text-sky-400">
            <Award size={18} />
          </div>
          <span className="leading-relaxed">{quote}</span>
        </div>
      )}
    </div>
  );
};
