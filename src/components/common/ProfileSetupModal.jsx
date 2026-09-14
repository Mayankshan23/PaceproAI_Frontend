import React, { useState, useEffect } from 'react';
import { 
  User, 
  Check, 
  X, 
  Sparkles,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomSelect } from './CustomSelect';
import './ProfileSetupModal.css';

const BOWLING_ACTION_OPTIONS = [
  { value: 'semi_open', label: 'Semi-Open (Balanced Run-up)', icon: '⚖️' },
  { value: 'side_on', label: 'Side-On (Classic Swing & Seam)', icon: '🎯' },
  { value: 'front_on', label: 'Front-On (Chest On / Sling Velocity)', icon: '⚡' }
];

const ATHLETIC_GOAL_OPTIONS = [
  { value: 'increase_speed', label: '⚡ Maximize Bowling Pace (135+ km/h)', icon: '⚡' },
  { value: 'injury_prevention', label: '🛡️ Lumbar & Knee Joint Protection', icon: '🛡️' },
  { value: 'performance', label: '🎯 Match-Day Stamina & Spell Capacity', icon: '🎯' }
];

/**
 * ProfileSetupModal - Athlete Profile Configuration Modal
 * 
 * Fully responsive modal tailored for mobile viewports:
 * - Viewport bounds: max-h-[90dvh] flex flex-col
 * - Sticky header & sticky footer with safe-area padding: pb-[max(1.5rem,env(safe-area-inset-bottom))]
 * - Scrollable form body: flex-1 overflow-y-auto p-4 md:p-6 space-y-4
 * - Mobile select dropdowns: Custom portal dropdowns with z-50, no clipping, and min-h-[44px] touch targets
 * - Polished clean athletic buttons & toggle groups
 * - Synchronizes with FastAPI athlete profile schema
 */
export const ProfileSetupModal = ({ isOpen, onClose }) => {
  const { userProfile, updateAthleteProfile } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [arm, setArm] = useState(userProfile?.arm || 'Right-Arm Fast');
  const [bowlingAction, setBowlingAction] = useState(userProfile?.bowlingAction || 'semi_open');
  const [peakSpeed, setPeakSpeed] = useState(userProfile?.peakSpeed || '135 km/h');
  const [age, setAge] = useState(userProfile?.age || 20);
  const [weight, setWeight] = useState(userProfile?.weight || 68);
  const [height, setHeight] = useState(userProfile?.height || 175);
  const [goal, setGoal] = useState(userProfile?.goal || 'increase_speed');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setArm(userProfile.arm || 'Right-Arm Fast');
      setBowlingAction(userProfile.bowlingAction || 'semi_open');
      setPeakSpeed(userProfile.peakSpeed || '135 km/h');
      setAge(userProfile.age || 20);
      setWeight(userProfile.weight || 68);
      setHeight(userProfile.height || 175);
      setGoal(userProfile.goal || 'increase_speed');
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const handleSkip = () => {
    updateAthleteProfile({ isConfigured: true });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sync with FastAPI athlete profile Pydantic schema
    const updatedPayload = {
      name: name.trim() || 'Fast Bowler',
      arm,
      bowlingAction,
      peakSpeed: peakSpeed.trim() || '135 km/h',
      age: Number(age) || 20,
      weight: Number(weight) || 68,
      height: Number(height) || 175,
      goal,
      isConfigured: true
    };

    updateAthleteProfile(updatedPayload);
    onClose();
  };

  return (
    <div 
      className="profile-setup-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in" 
      onClick={handleSkip}
    >
      <div 
        className="profile-setup-modal glass-card w-full max-w-[580px] max-h-[90dvh] flex flex-col rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141418] shadow-2xl overflow-hidden relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="modal-header-banner sticky top-0 z-20 shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#141418]/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="profile-modal-icon-bg w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shrink-0">
              <Sparkles size={22} className="text-sky-500 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="modal-title font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Fast Bowler Identity Setup
              </h3>
              <p className="modal-subtitle text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 line-clamp-1">
                Configure athlete metrics for video analysis, workload & nutrition plans.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-icon text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            onClick={handleSkip}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 scrollbar-thin">
            {/* Athlete Name / Alias */}
            <div className="form-group">
              <label className="form-label flex items-center justify-between mb-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                <span>Full Name / Bowler Alias</span>
                <span className="text-[10px] sm:text-[11px] text-sky-500 font-medium font-mono lowercase">
                  synced with AI coach
                </span>
              </label>
              <div className="input-with-icon relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-[var(--bg-input)] text-[var(--text-primary)] text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40 transition-all font-medium"
                  placeholder="e.g. Mitchell Starc"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  required
                />
              </div>
            </div>

            {/* Bowling Arm & Delivery Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bowling Arm Toggle */}
              <div className="form-group flex flex-col justify-between">
                <label className="form-label block mb-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Bowling Arm
                </label>
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
                      arm.toLowerCase().includes('right')
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500 shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                    onClick={() => setArm('Right-Arm Fast')}
                  >
                    <span>⚡ Right-Arm (RAF)</span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 ${
                      arm.toLowerCase().includes('left')
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500 shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                    onClick={() => setArm('Left-Arm Fast')}
                  >
                    <span>⚡ Left-Arm (LAF)</span>
                  </button>
                </div>
              </div>

              {/* Delivery Action Style Custom Dropdown */}
              <div className="form-group flex flex-col justify-between">
                <label className="form-label block mb-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Delivery Action Style
                </label>
                <CustomSelect
                  options={BOWLING_ACTION_OPTIONS}
                  value={bowlingAction}
                  onChange={(val) => setBowlingAction(val)}
                  placeholder="Select bowling action..."
                />
              </div>
            </div>

            {/* Physical Biometrics: Age, Weight, Height */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="form-group">
                <label className="form-label block mb-1.5 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                  Age (yrs)
                </label>
                <input
                  type="number"
                  min="12"
                  max="55"
                  className="w-full min-h-[44px] px-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-[var(--bg-input)] text-[var(--text-primary)] text-sm text-center font-mono font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40 transition-all"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="form-group">
                <label className="form-label block mb-1.5 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="130"
                  className="w-full min-h-[44px] px-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-[var(--bg-input)] text-[var(--text-primary)] text-sm text-center font-mono font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40 transition-all"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="form-group">
                <label className="form-label block mb-1.5 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-center">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="130"
                  max="230"
                  className="w-full min-h-[44px] px-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-[var(--bg-input)] text-[var(--text-primary)] text-sm text-center font-mono font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40 transition-all"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Target Pace & Primary Athletic Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label block mb-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Target / Peak Pace
                </label>
                <input
                  type="text"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-[var(--bg-input)] text-[var(--text-primary)] text-sm font-mono font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/40 transition-all"
                  placeholder="e.g. 138 km/h"
                  value={peakSpeed}
                  onChange={(e) => setPeakSpeed(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="form-group">
                <label className="form-label block mb-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Primary Athletic Focus
                </label>
                <CustomSelect
                  options={ATHLETIC_GOAL_OPTIONS}
                  value={goal}
                  onChange={(val) => setGoal(val)}
                  placeholder="Select primary goal..."
                />
              </div>
            </div>
          </div>

          {/* Sticky Modal Footer Actions with Safe-Area Inset */}
          <div className="modal-footer sticky bottom-0 z-20 shrink-0 border-t border-slate-100 dark:border-white/10 bg-white/95 dark:bg-[#141418]/95 backdrop-blur-sm p-4 sm:p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              className="w-full sm:w-auto min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center"
              onClick={handleSkip}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] py-3 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>Save Bowler Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
