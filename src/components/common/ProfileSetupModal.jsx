import React, { useState, useEffect } from 'react';
import { 
  User, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Activity, 
  Scale, 
  Gauge, 
  Shield 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomSelect } from './CustomSelect';
import './ProfileSetupModal.css';

const BOWLING_ACTION_OPTIONS = [
  { value: 'semi_open', label: '⚖️ Semi-Open (Balanced Run-up)' },
  { value: 'side_on', label: '🎯 Side-On (Classic Swing & Seam)' },
  { value: 'front_on', label: '⚡ Front-On (Chest On / Sling Velocity)' }
];

const ATHLETIC_GOAL_OPTIONS = [
  { value: 'increase_speed', label: '⚡ Maximize Bowling Pace (135+ km/h)' },
  { value: 'injury_prevention', label: '🛡️ Lumbar & Knee Joint Protection' },
  { value: 'performance', label: '🎯 Match-Day Stamina & Spell Capacity' }
];

export const ProfileSetupModal = ({ isOpen, onClose }) => {
  const { userProfile, updateAthleteProfile } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [arm, setArm] = useState(userProfile?.arm || 'Right-Arm Fast');
  const [bowlingAction, setBowlingAction] = useState(userProfile?.bowlingAction || 'semi_open');
  const [peakSpeed, setPeakSpeed] = useState(userProfile?.peakSpeed || '135 km/h');
  const [age, setAge] = useState(userProfile?.age ?? 20);
  const [weight, setWeight] = useState(userProfile?.weight ?? 68);
  const [height, setHeight] = useState(userProfile?.height ?? 175);
  const [goal, setGoal] = useState(userProfile?.goal || 'increase_speed');

  // Initialize once when modal opens
  useEffect(() => {
    if (isOpen && userProfile) {
      setName(userProfile.name || '');
      setArm(userProfile.arm || 'Right-Arm Fast');
      setBowlingAction(userProfile.bowlingAction || 'semi_open');
      setPeakSpeed(userProfile.peakSpeed || '135 km/h');
      setAge(userProfile.age ?? 20);
      setWeight(userProfile.weight ?? 68);
      setHeight(userProfile.height ?? 175);
      setGoal(userProfile.goal || 'increase_speed');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSkip = () => {
    updateAthleteProfile({ isConfigured: true });
    onClose();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const updatedPayload = {
      name: name.trim() || 'Fast Bowler',
      arm: arm || 'Right-Arm Fast',
      bowlingAction: bowlingAction || 'semi_open',
      peakSpeed: peakSpeed.trim() || '135 km/h',
      age: Number(age) || 20,
      weight: Number(weight) || 68,
      height: Number(height) || 175,
      goal: goal || 'increase_speed',
      isConfigured: true
    };

    updateAthleteProfile(updatedPayload);
    onClose();
  };

  const isRightArm = (arm || '').toLowerCase().includes('right');

  return (
    <div 
      className="profile-modal-overlay animate-fade-in" 
      onClick={handleSkip}
    >
      <div 
        className="profile-modal-box" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="profile-modal-header">
          <div className="flex items-center gap-3">
            <div className="profile-badge-icon">
              <Sparkles size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="profile-modal-title">Fast Bowler Identity Setup</h2>
              <p className="profile-modal-subtitle">
                Configure your bowler profile for personalized AI analysis &amp; workload.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="profile-close-btn"
            onClick={handleSkip}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="profile-modal-form">
          <div className="profile-modal-scrollable">
            
            {/* Full Name */}
            <div className="profile-field-group">
              <label className="profile-field-label">
                <User size={14} className="text-cyan" />
                <span>Full Name / Bowler Alias</span>
              </label>
              <input
                type="text"
                className="profile-text-input"
                placeholder="e.g. Jasprit Bumrah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {/* Bowling Arm & Delivery Action */}
            <div className="profile-grid-2">
              {/* Arm Selector */}
              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Zap size={14} className="text-amber" />
                  <span>Bowling Arm</span>
                </label>
                <div className="profile-arm-toggle-row">
                  <button
                    type="button"
                    onClick={() => setArm('Right-Arm Fast')}
                    className={`profile-arm-btn ${isRightArm ? 'active' : ''}`}
                  >
                    <span>⚡ Right-Arm</span>
                    {isRightArm && <Check size={14} strokeWidth={3} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setArm('Left-Arm Fast')}
                    className={`profile-arm-btn ${!isRightArm ? 'active' : ''}`}
                  >
                    <span>⚡ Left-Arm</span>
                    {!isRightArm && <Check size={14} strokeWidth={3} />}
                  </button>
                </div>
              </div>

              {/* Action Dropdown */}
              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Activity size={14} className="text-cyan" />
                  <span>Delivery Action Style</span>
                </label>
                <CustomSelect
                  options={BOWLING_ACTION_OPTIONS}
                  value={bowlingAction}
                  onChange={(val) => setBowlingAction(val)}
                  placeholder="Select delivery action..."
                />
              </div>
            </div>

            {/* Biometrics (Age, Weight, Height) */}
            <div className="profile-field-group">
              <label className="profile-field-label">
                <Scale size={14} className="text-emerald" />
                <span>Physical Biometrics</span>
              </label>
              <div className="profile-grid-3">
                <div className="profile-num-box">
                  <span className="profile-num-tag">Age</span>
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      min="12"
                      max="60"
                      className="profile-num-input"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                    />
                    <span className="profile-unit-label">yrs</span>
                  </div>
                </div>

                <div className="profile-num-box">
                  <span className="profile-num-tag">Weight</span>
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      min="40"
                      max="140"
                      className="profile-num-input"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                    />
                    <span className="profile-unit-label">kg</span>
                  </div>
                </div>

                <div className="profile-num-box">
                  <span className="profile-num-tag">Height</span>
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      min="130"
                      max="230"
                      className="profile-num-input"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                    <span className="profile-unit-label">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Peak Pace & Goal */}
            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Gauge size={14} className="text-purple" />
                  <span>Target / Peak Pace</span>
                </label>
                <div className="profile-input-with-suffix">
                  <input
                    type="text"
                    className="profile-text-input"
                    placeholder="e.g. 138"
                    value={peakSpeed}
                    onChange={(e) => setPeakSpeed(e.target.value)}
                  />
                  <span className="profile-input-suffix">km/h</span>
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Shield size={14} className="text-emerald" />
                  <span>Primary Athletic Focus</span>
                </label>
                <CustomSelect
                  options={ATHLETIC_GOAL_OPTIONS}
                  value={goal}
                  onChange={(val) => setGoal(val)}
                  placeholder="Select athletic goal..."
                />
              </div>
            </div>

          </div>

          {/* Footer Bar - Always Pinned & Visible */}
          <div className="profile-modal-footer">
            <button
              type="button"
              className="btn-secondary profile-skip-btn"
              onClick={handleSkip}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="btn-primary profile-save-btn"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Save Bowler Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
