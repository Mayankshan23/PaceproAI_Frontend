import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Sliders, 
  Server, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { testBackendConnection } from '../../services/api';
import './SettingsPanel.css';

export const SettingsPanel = () => {
  const { userProfile, updateAthleteProfile, openProfileSetupModal, apiState, updateApiConfigState } = useApp();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(userProfile.name || '');
  const [arm, setArm] = useState(userProfile.arm || 'Right-Arm Fast');
  const [peakSpeed, setPeakSpeed] = useState(userProfile.peakSpeed || '135 km/h');

  // Sync inputs if userProfile gets updated
  React.useEffect(() => {
    if (userProfile.name) {
      setName(userProfile.name);
    }
    if (userProfile.arm) {
      setArm(userProfile.arm);
    }
    if (userProfile.peakSpeed) {
      setPeakSpeed(userProfile.peakSpeed);
    }
  }, [userProfile]);

  const [baseUrl, setBaseUrl] = useState(apiState.baseUrl);
  const [testingConn, setTestingConn] = useState(false);
  const [connStatus, setConnStatus] = useState(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateAthleteProfile({
      name,
      arm,
      peakSpeed
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestingConn(true);
    setConnStatus(null);
    updateApiConfigState({ baseUrl });
    const ok = await testBackendConnection(baseUrl);
    setTestingConn(false);
    setConnStatus(ok ? 'connected' : 'failed');
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="page-header mb-6">
        <h2 className="page-title text-2xl font-bold flex items-center gap-2">
          <Settings className="text-cyan" size={26} /> Application Settings & Backend Diagnostics
        </h2>
        <p className="page-subtitle text-muted text-sm">
          Manage athlete identity, Python API server connection URLs, display units, and AI engine parameters.
        </p>
      </div>

      <div className="settings-sections flex flex-col gap-6">
        {/* SECTION 1: ATHLETE PROFILE */}
        <div className="settings-section-card glass-card p-6">
          <h3 className="section-title text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <User className="text-cyan" size={20} /> Athlete Identity & Profile
          </h3>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label mb-1">FULL ATHLETE NAME</label>
              <input 
                type="text" 
                className="custom-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div>
              <label className="input-label mb-1">BOWLING ARM SLOT</label>
              <select 
                className="custom-input" 
                value={arm} 
                onChange={(e) => setArm(e.target.value)}
              >
                <option>Right-Arm Fast</option>
                <option>Right-Arm Fast-Medium</option>
                <option>Left-Arm Fast</option>
                <option>Left-Arm Fast-Medium</option>
              </select>
            </div>

            <div>
              <label className="input-label mb-1">PEAK RECORDED SPEED</label>
              <input 
                type="text" 
                className="custom-input font-mono" 
                value={peakSpeed} 
                onChange={(e) => setPeakSpeed(e.target.value)} 
              />
            </div>

            <div className="flex items-end gap-2">
              <button type="submit" className="btn-primary flex-1">
                {savedSuccess ? <><Check size={16} /> Profile Saved</> : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn-secondary whitespace-nowrap text-xs"
                onClick={openProfileSetupModal}
              >
                Full Bowler Wizard
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: PYTHON BACKEND API INTEGRATION */}
        <div className="settings-section-card glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title text-lg font-bold text-primary flex items-center gap-2">
              <Server className="text-emerald" size={20} /> Python Backend Engine Connection
            </h3>
            <span className="badge badge-emerald">Live Endpoint Mode</span>
          </div>

          <div className="bg-input p-4 rounded-md border border-color mb-4">
            <div>
              <h4 className="font-bold text-sm text-primary">Backend data source</h4>
              <p className="text-xs text-muted">
                All analysis, nutrition, workload, and workout results are generated by the Python API server.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="input-label mb-1">PYTHON BACKEND BASE URL</label>
              <input 
                type="url" 
                className="custom-input font-mono" 
                value={baseUrl} 
                onChange={(e) => setBaseUrl(e.target.value)} 
                placeholder="http://localhost:8000"
              />
            </div>

            <button 
              className="btn-secondary" 
              onClick={handleTestConnection}
              disabled={testingConn}
            >
              {testingConn ? <RefreshCw className="animate-spin" size={16} /> : <Globe size={16} />}
              Test Connection
            </button>
          </div>

          {connStatus && (
            <div className={`mt-3 p-3 rounded-md text-xs font-bold flex items-center gap-2 ${connStatus === 'connected' ? 'bg-emerald/10 text-emerald border border-emerald/30' : 'bg-rose/10 text-rose border border-rose/30'}`}>
              {connStatus === 'connected' ? (
                <><Check size={16} /> Backend server online at {baseUrl}</>
              ) : (
                <><AlertCircle size={16} /> Could not reach backend server at {baseUrl}. Verify CORS & endpoint status.</>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: THEME & DISPLAY PREFERENCES */}
        <div className="settings-section-card glass-card p-6">
          <h3 className="section-title text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Sliders className="text-amber" size={20} /> Interface & Units Preferences
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-input rounded-md border border-color">
              <div>
                <span className="font-bold text-sm text-primary block">Color Theme</span>
                <span className="text-xs text-muted">Toggle interface dark/light palette</span>
              </div>

              <button className="btn-secondary text-xs" onClick={toggleTheme}>
                {theme === 'dark' ? <><Sun size={14} /> Light Mode</> : <><Moon size={14} /> Dark Mode</>}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-input rounded-md border border-color">
              <div>
                <span className="font-bold text-sm text-primary block">Measurement System</span>
                <span className="text-xs text-muted">Metric (km/h, kg) vs Imperial (mph, lbs)</span>
              </div>

              <select className="custom-input text-xs w-28">
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
