import React, { useState, useEffect } from 'react';
import { 
  User, 
  Check, 
  X, 
  Activity, 
  Flame, 
  Target, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './ProfileSetupModal.css';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAthleteProfile({
      name: name.trim() || 'Fast Bowler',
      arm,
      bowlingAction,
      peakSpeed: peakSpeed.trim() || '135 km/h',
      age: Number(age) || 20,
      weight: Number(weight) || 68,
      height: Number(height) || 175,
      goal,
      isConfigured: true
    });
    onClose();
  };

  return (
    <div className="profile-setup-backdrop animate-fade-in" onClick={onClose}>
      <div className="profile-setup-modal glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-banner flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="profile-modal-icon-bg">
              <Sparkles size={22} className="text-cyan" />
            </div>
            <div>
              <h3 className="modal-title font-bold text-lg text-primary flex items-center gap-2">
                Fast Bowler Identity Setup
              </h3>
              <p className="modal-subtitle text-xs text-muted">
                Configure your athlete metrics for personalized video analysis, workload ACWR, and nutrition plans.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-icon text-muted hover:text-primary"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form-body p-6 flex flex-col gap-5">
          {/* Athlete Name / Handle */}
          <div className="form-group">
            <label className="form-label flex items-center justify-between mb-1.5 text-xs font-bold text-muted uppercase">
              <span>Full Name / Bowler Alias</span>
              <span className="text-[11px] text-cyan font-normal font-mono">Synced across analysis & AI coach</span>
            </label>
            <div className="input-with-icon relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                className="profile-modal-input pl-9"
                placeholder="Enter your name (e.g. Vineet Sharma)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Bowling Arm & Action Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bowling Arm */}
            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Bowling Arm
              </label>
              <div className="segmented-toggle-grid grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`modal-toggle-btn ${arm.toLowerCase().includes('right') ? 'active' : ''}`}
                  onClick={() => setArm('Right-Arm Fast')}
                >
                  Right-Arm (RAF)
                </button>
                <button
                  type="button"
                  className={`modal-toggle-btn ${arm.toLowerCase().includes('left') ? 'active' : ''}`}
                  onClick={() => setArm('Left-Arm Fast')}
                >
                  Left-Arm (LAF)
                </button>
              </div>
            </div>

            {/* Bowling Action */}
            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Delivery Action Style
              </label>
              <select
                className="profile-modal-select"
                value={bowlingAction}
                onChange={(e) => setBowlingAction(e.target.value)}
              >
                <option value="semi_open">Semi-Open (Balanced)</option>
                <option value="side_on">Side-On (Classic Swing)</option>
                <option value="front_on">Front-On (Chest On / Sling)</option>
              </select>
            </div>
          </div>

          {/* Physical Metrics Row: Age, Weight, Height */}
          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Age (yrs)
              </label>
              <input
                type="number"
                min="12"
                max="50"
                className="profile-modal-input text-center font-mono font-bold"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Weight (kg)
              </label>
              <input
                type="number"
                min="40"
                max="120"
                className="profile-modal-input text-center font-mono font-bold"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Height (cm)
              </label>
              <input
                type="number"
                min="140"
                max="220"
                className="profile-modal-input text-center font-mono font-bold"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Target Pace & Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Target / Peak Bowling Pace
              </label>
              <input
                type="text"
                className="profile-modal-input font-mono"
                placeholder="e.g. 135 km/h"
                value={peakSpeed}
                onChange={(e) => setPeakSpeed(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label block mb-1.5 text-xs font-bold text-muted uppercase">
                Primary Athletic Focus
              </label>
              <select
                className="profile-modal-select"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="increase_speed">⚡ Maximize Bowling Pace (135+ km/h)</option>
                <option value="injury_prevention">🛡️ Lumbar & Knee Joint Protection</option>
                <option value="performance">🎯 Match-Day Stamina & Spell Capacity</option>
              </select>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer flex items-center justify-end gap-3 mt-2 pt-4 border-t border-white/10">
            <button
              type="button"
              className="btn-secondary text-xs py-2.5 px-4"
              onClick={onClose}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm"
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
