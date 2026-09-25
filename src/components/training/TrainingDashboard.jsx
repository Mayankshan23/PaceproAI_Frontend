import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Flame, Sparkles, Zap, HeartPulse } from 'lucide-react';
import { CombinedPlanner } from '../planner/CombinedPlanner';
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

          <div className="hub-segmented-tabs w-full overflow-x-auto scrollbar-none flex items-center gap-1.5 p-1 rounded-2xl sm:rounded-full bg-slate-900/60 border border-slate-800">
            <button
              type="button"
              className={`hub-segment-btn flex-1 min-w-0 sm:flex-none justify-center whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === 'workload' ? 'active bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => handleTabChange('workload')}
            >
              <Zap size={15} className="text-cyan shrink-0" />
              <span className="truncate">Workload Planner</span>
            </button>
            <button
              type="button"
              className={`hub-segment-btn flex-1 min-w-0 sm:flex-none justify-center whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === 'strength' ? 'active bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => handleTabChange('strength')}
            >
              <HeartPulse size={15} className="text-amber shrink-0" />
              <span className="truncate">Test Strength</span>
            </button>
            <button
              type="button"
              className={`hub-segment-btn flex-1 min-w-0 sm:flex-none justify-center whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === 'diet' ? 'active bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => handleTabChange('diet')}
            >
              <Flame size={15} className="text-emerald shrink-0" />
              <span className="truncate">Diet Planner</span>
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

