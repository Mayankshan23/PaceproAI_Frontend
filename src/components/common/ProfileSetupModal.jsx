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
  { value: 'semi_open', label: '⚖️ Semi-Open (Balanced Run-up & Follow-Through)' },
  { value: 'side_on', label: '🎯 Side-On (Classic Outswing & Seam Release)' },
  { value: 'front_on', label: '⚡ Front-On (Chest Drive / Sling Velocity)' }
];

const ATHLETIC_GOAL_OPTIONS = [
  { value: 'increase_speed', label: '⚡ Maximize Bowling Pace (135+ km/h)' },
  { value: 'injury_prevention', label: '🛡️ Lumbar Spine & Knee Joint Protection' },
  { value: 'performance', label: '🎯 Match-Day Stamina & 6-Over Spell Capacity' }
];

const cleanSpeedNumber = (val) => {
  if (!val) return '135';
  const digits = String(val).replace(/[^0-9.]/g, '');
  return digits || '135';
};

export const ProfileSetupModal = ({ isOpen, onClose }) => {
  const { userProfile, updateAthleteProfile, language, t } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [sex, setSex] = useState(userProfile?.sex || 'male');
  const [arm, setArm] = useState(userProfile?.arm || 'Right-Arm Fast');
  const [bowlingAction, setBowlingAction] = useState(userProfile?.bowlingAction || 'semi_open');
  const [peakSpeed, setPeakSpeed] = useState(() => cleanSpeedNumber(userProfile?.peakSpeed));
  const [age, setAge] = useState(userProfile?.age ?? 20);
  const [weight, setWeight] = useState(userProfile?.weight ?? 68);
  const [height, setHeight] = useState(userProfile?.height ?? 175);
  const [goal, setGoal] = useState(userProfile?.goal || 'increase_speed');

  const bowlingActionOptions = [
    { value: 'semi_open', label: language === 'hinglish' ? '⚖️ Semi-Open (Balanced Run-up)' : '⚖️ Semi-Open (Balanced Run-up & Follow-Through)' },
    { value: 'side_on', label: language === 'hinglish' ? '🎯 Side-On (Outswing aur Seam Action)' : '🎯 Side-On (Classic Outswing & Seam Release)' },
    { value: 'front_on', label: language === 'hinglish' ? '⚡ Front-On (Chest Drive aur Sling Pace)' : '⚡ Front-On (Chest Drive / Sling Velocity)' }
  ];

  const athleticGoalOptions = [
    { value: 'increase_speed', label: language === 'hinglish' ? '⚡ Bowling Raftaar Badhao (135+ km/h)' : '⚡ Maximize Bowling Pace (135+ km/h)' },
    { value: 'injury_prevention', label: language === 'hinglish' ? '🛡️ Lumbar Spine aur Ghutne Ka Bachav' : '🛡️ Lumbar Spine & Knee Joint Protection' },
    { value: 'performance', label: language === 'hinglish' ? '🎯 Match Stamina aur Lambe Spells' : '🎯 Match-Day Stamina & 6-Over Spell Capacity' }
  ];

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen && userProfile) {
      setName(userProfile.name || '');
      setSex(userProfile.sex || 'male');
      setArm(userProfile.arm || 'Right-Arm Fast');
      setBowlingAction(userProfile.bowlingAction || 'semi_open');
      setPeakSpeed(cleanSpeedNumber(userProfile.peakSpeed));
      setAge(userProfile.age ?? 20);
      setWeight(userProfile.weight ?? 68);
      setHeight(userProfile.height ?? 175);
      setGoal(userProfile.goal || 'increase_speed');
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleSkip = () => {
    updateAthleteProfile({ isConfigured: true });
    onClose();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const formattedSpeed = `${cleanSpeedNumber(peakSpeed)} km/h`;

    const updatedPayload = {
      name: name.trim() || 'Fast Bowler',
      sex: sex || 'male',
      arm: arm || 'Right-Arm Fast',
      bowlingAction: bowlingAction || 'semi_open',
      peakSpeed: formattedSpeed,
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
        {/* Sleek Top Glow Accent */}
        <div className="profile-modal-top-accent" />

        {/* Header */}
        <div className="profile-modal-header">
          <div className="flex items-center gap-3">
            <div className="profile-badge-icon">
              <Zap size={20} className="text-cyan" />
            </div>
            <div>
              <h2 className="profile-modal-title">{t('profileModalTitle', 'Fast Bowler Identity Setup')}</h2>
              <p className="profile-modal-subtitle">
                {t('profileModalSubtitle', 'Configure your bowler profile for personalized AI analysis & workload.')}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="profile-close-btn"
            onClick={handleSkip}
            title={t('cancel', 'Close')}
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
                <span>{t('fullNameLabel', 'Full Name / Bowler Alias')}</span>
              </label>
              <input
                type="text"
                className="profile-text-input"
                placeholder={t('fullNamePlaceholder', 'e.g. Jasprit Bumrah')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {/* Gender (Biological Sex) & Bowling Arm Grid */}
            <div className="profile-grid-2">
              {/* Gender Selector */}
              <div className="profile-field-group">
                <label className="profile-field-label">
                  <User size={14} className="text-cyan" />
                  <span>{t('sexLabel', 'Biological Sex / Gender')}</span>
                </label>
                <div className="profile-arm-toggle-row">
                  <button
                    type="button"
                    onClick={() => setSex('male')}
                    className={`profile-arm-btn ${sex === 'male' ? 'active' : ''}`}
                  >
                    <span>♂️ {t('male', 'Male')}</span>
                    {sex === 'male' && <Check size={14} strokeWidth={3} className="toggle-check-icon" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex('female')}
                    className={`profile-arm-btn ${sex === 'female' ? 'active' : ''}`}
                  >
                    <span>♀️ {t('female', 'Female')}</span>
                    {sex === 'female' && <Check size={14} strokeWidth={3} className="toggle-check-icon" />}
                  </button>
                </div>
              </div>

              {/* Arm Selector */}
              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Zap size={14} className="text-amber" />
                  <span>{t('bowlingArmLabel', 'Bowling Arm')}</span>
                </label>
                <div className="profile-arm-toggle-row">
                  <button
                    type="button"
                    onClick={() => setArm('Right-Arm Fast')}
                    className={`profile-arm-btn ${isRightArm ? 'active' : ''}`}
                  >
                    <span>⚡ {t('rightArmFast', 'Right-Arm Fast')}</span>
                    {isRightArm && <Check size={14} strokeWidth={3} className="toggle-check-icon" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setArm('Left-Arm Fast')}
                    className={`profile-arm-btn ${!isRightArm ? 'active' : ''}`}
                  >
                    <span>⚡ {t('leftArmFast', 'Left-Arm Fast')}</span>
                    {!isRightArm && <Check size={14} strokeWidth={3} className="toggle-check-icon" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Action Dropdown */}
            <div className="profile-field-group">
              <label className="profile-field-label">
                <Activity size={14} className="text-cyan" />
                <span>{t('deliveryActionLabel', 'Delivery Action Style')}</span>
              </label>
              <CustomSelect
                options={bowlingActionOptions}
                value={bowlingAction}
                onChange={(val) => setBowlingAction(val)}
                placeholder="Select delivery action..."
              />
            </div>

            {/* Biometrics (Age, Weight, Height) */}
            <div className="profile-field-group">
              <label className="profile-field-label">
                <Scale size={14} className="text-emerald" />
                <span>{t('biometricsLabel', 'Physical Biometrics')}</span>
              </label>
              <div className="profile-grid-3">
                <div className="profile-num-box">
                  <span className="profile-num-tag">{t('ageLabel', 'Age')}</span>
                  <div className="profile-num-inner">
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
                  <span className="profile-num-tag">{t('weightLabel', 'Weight')}</span>
                  <div className="profile-num-inner">
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
                  <span className="profile-num-tag">{t('heightLabel', 'Height')}</span>
                  <div className="profile-num-inner">
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

            {/* Peak Pace & Goal Grid */}
            <div className="profile-grid-2">
              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Gauge size={14} className="text-purple-400" />
                  <span>{t('targetPaceLabel', 'Target / Peak Pace')}</span>
                </label>
                <div className="profile-input-with-suffix">
                  <input
                    type="text"
                    className="profile-text-input"
                    placeholder="135"
                    value={peakSpeed}
                    onChange={(e) => setPeakSpeed(e.target.value.replace(/[^0-9.]/g, ''))}
                  />
                  <span className="profile-input-suffix">km/h</span>
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-field-label">
                  <Shield size={14} className="text-emerald" />
                  <span>{t('primaryGoalLabel', 'Primary Athletic Focus')}</span>
                </label>
                <CustomSelect
                  options={athleticGoalOptions}
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
              className="btn-outline profile-skip-btn"
              onClick={handleSkip}
            >
              {t('skipForNow', 'Skip for Now')}
            </button>
            <button
              type="submit"
              className="btn-primary profile-save-btn"
            >
              <Check size={16} strokeWidth={2.5} />
              <span>{t('saveBowlerProfileBtn', 'Save Bowler Profile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
