import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Flame, Sparkles, Zap, HeartPulse } from 'lucide-react';
import { CombinedPlanner } from '../planner/CombinedPlanner';
import { WorkoutDashboard } from '../workout/WorkoutDashboard';
import { DietDashboard } from '../diet/DietDashboard';
import { StrengthCheck } from './StrengthCheck';
import './TrainingDashboard.css';

export const TrainingDashboard = ({ defaultTab = 'workload' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tab') === 'strength') return 'strength';
    if (location.pathname === '/diet') return 'diet';
    return 'workload';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tab') === 'strength') {
      setActiveTab('strength');
    } else if (location.pathname === '/diet') {
      setActiveTab('diet');
    } else {
      setActiveTab('workload');
    }
  }, [location.pathname, location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'diet') {
      navigate('/diet', { replace: true });
    } else if (tab === 'strength') {
      navigate('/training?tab=strength', { replace: true });
    } else {
      navigate('/training', { replace: true });
    }
  };

  return (
    <div className="training-hub-wrapper animate-fade-in">
      {/* Top Hub Navigation Bar */}
      <div className="training-hub-topbar">
        <div className="hub-topbar-inner">
          <div className="hub-brand-info">
            <span className="hub-badge">
              <Sparkles size={13} className="text-cyan" /> Unified Fast Bowler Hub
            </span>
            <h1 className="hub-main-title">Workload & Training Hub</h1>
          </div>

          <div className="hub-segmented-tabs">
            <button
              type="button"
              className={`hub-segment-btn ${activeTab === 'workload' ? 'active' : ''}`}
              onClick={() => handleTabChange('workload')}
            >
              <Zap size={16} className="text-cyan" />
              <span>Workload & Routine Planner</span>
            </button>
            <button
              type="button"
              className={`hub-segment-btn ${activeTab === 'strength' ? 'active' : ''}`}
              onClick={() => handleTabChange('strength')}
            >
              <HeartPulse size={16} className="text-amber" />
              <span>Strength & Muscle Check</span>
            </button>
            <button
              type="button"
              className={`hub-segment-btn ${activeTab === 'diet' ? 'active' : ''}`}
              onClick={() => handleTabChange('diet')}
            >
              <Flame size={16} className="text-emerald" />
              <span>Diet & Macros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Dashboard */}
      <div className="hub-content-view">
        {activeTab === 'workload' && <CombinedPlanner />}
        {activeTab === 'strength' && <StrengthCheck />}
        {activeTab === 'diet' && <DietDashboard />}
      </div>
    </div>
  );
};

