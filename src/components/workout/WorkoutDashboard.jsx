import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Zap, 
  Flame, 
  Activity, 
  X,
  Sparkles,
  RefreshCw,
  Bookmark,
  Check,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './WorkoutDashboard.css';

export const WorkoutDashboard = () => {
  const { workoutsList, toggleExerciseDone, addWorkoutSession, saveWorkplan, runWorkplanGeneration, userProfile, updateAthleteProfile } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [generatedWorkplan, setGeneratedWorkplan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Dynamic Athlete Inputs (pre-filled from userProfile)
  const [athleteStatus, setAthleteStatus] = useState(userProfile?.athleteStatus || 'student');
  const [gymDays, setGymDays] = useState(userProfile?.gymDays ?? 3);
  const [groundDays, setGroundDays] = useState(userProfile?.groundDays ?? 4);
  const [maxOversDays, setMaxOversDays] = useState(userProfile?.maxOversDays ?? 2);
  const [age, setAge] = useState(userProfile?.age ?? 20);
  const [weight, setWeight] = useState(userProfile?.weight ?? 68);
  const [height, setHeight] = useState(userProfile?.height ?? 175);
  const [sex, setSex] = useState(userProfile?.sex || 'male');
  const [goal, setGoal] = useState(userProfile?.goal || 'increase_speed');

  // Calculate workload stats
  const totalWorkouts = workoutsList.length;
  const completedWorkouts = workoutsList.filter((w) => w.completed).length;
  const completionPct = Math.round((completedWorkouts / (totalWorkouts || 1)) * 100);

  const handleGenerateWorkplan = async () => {
    setIsGenerating(true);
    setIsSaved(false);
    try {
      // Sync athlete profile state globally
      if (updateAthleteProfile) {
        updateAthleteProfile({
          athleteStatus,
          gymDays,
          groundDays,
          maxOversDays,
          age,
          weight,
          height,
          sex,
          goal
        });
      }

      const result = await runWorkplanGeneration({
        athlete_status: athleteStatus,
        gym_days: gymDays,
        ground_days: groundDays,
        max_overs_days: maxOversDays,
        age,
        weight,
        height,
        sex,
        goal
      });
      setGeneratedWorkplan(result);
    } catch (error) {
      console.error('Workplan generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGeneratedPlan = () => {
    if (generatedWorkplan) {
      saveWorkplan(generatedWorkplan);
      setIsSaved(true);
    }
  };

  return (
    <div className="workout-page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2 className="page-title text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="text-amber" size={26} /> Fast Bowler Training & Workload
          </h2>
          <p className="page-subtitle text-muted text-sm">
            Explosive speed, front-leg brace power, thoracic mobility, and workload stress tracking.
          </p>
        </div>

        <div className="header-actions flex gap-3">
          <button 
            className={`btn-secondary ${showConfig ? 'active border-cyan text-cyan' : ''}`}
            onClick={() => setShowConfig(!showConfig)}
          >
            <Sliders size={16} />
            <span>Customize Training</span>
            {showConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button 
            className="btn-secondary" 
            onClick={handleGenerateWorkplan}
            disabled={isGenerating}
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} className="text-cyan" />}
            <span>Generate Workplan</span>
          </button>
          <button 
            className="btn-primary add-session-btn" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add Training Session
          </button>
        </div>
      </div>

      {/* ATHLETE CONFIGURATION PANEL */}
      {showConfig && (
        <div className="workout-config-panel glass-card p-6 mb-6 animate-fade-in border border-slate-700/40">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-divider">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-cyan" />
              <h3 className="font-bold text-base text-primary">Bowler Profile & Workload Constraints</h3>
            </div>
            <span className="text-xs text-muted">
              Dynamically synchronizes with Unified Training & Diet Protocols
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* Athlete Status */}
            <div>
              <label className="text-xs font-bold text-muted block mb-2">BOWLER STATUS</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`segment-btn ${athleteStatus === 'student' ? 'active' : ''}`}
                  onClick={() => setAthleteStatus('student')}
                >
                  Student Bowler
                </button>
                <button
                  type="button"
                  className={`segment-btn ${athleteStatus === 'full_time_athlete' ? 'active' : ''}`}
                  onClick={() => setAthleteStatus('full_time_athlete')}
                >
                  Full-Time Pro
                </button>
              </div>
            </div>

            {/* Target Goal */}
            <div>
              <label className="text-xs font-bold text-muted block mb-2">PRIMARY TRAINING FOCUS</label>
              <select
                className="custom-input text-sm"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="increase_speed">Explosive Arm Speed & Velocity (140+ km/h)</option>
                <option value="lumbar_spine_durability">Lumbar Spine & Stress Fracture Protection</option>
                <option value="front_leg_brace">Front-Leg Brace & Braking Force Power</option>
                <option value="match_endurance">Multi-Day Match Bowling Stamina</option>
              </select>
            </div>

            {/* Sex */}
            <div>
              <label className="text-xs font-bold text-muted block mb-2">GENDER DIVISION</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`segment-btn ${sex === 'male' ? 'active' : ''}`}
                  onClick={() => setSex('male')}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={`segment-btn ${sex === 'female' ? 'active' : ''}`}
                  onClick={() => setSex('female')}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Sliders Grid: Days & Biometrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">GYM DAYS</span>
                <span className="text-cyan font-mono">{gymDays} / wk</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                value={gymDays}
                onChange={(e) => setGymDays(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">GROUND DAYS</span>
                <span className="text-cyan font-mono">{groundDays} / wk</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={groundDays}
                onChange={(e) => setGroundDays(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">MAX SPELLS</span>
                <span className="text-amber font-mono">{maxOversDays} days</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={maxOversDays}
                onChange={(e) => setMaxOversDays(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">WEIGHT</span>
                <span className="text-cyan font-mono">{weight} kg</span>
              </div>
              <input
                type="range"
                min="45"
                max="115"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="custom-slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">HEIGHT</span>
                <span className="text-cyan font-mono">{height} cm</span>
              </div>
              <input
                type="range"
                min="150"
                max="215"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="custom-slider"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-divider">
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => setShowConfig(false)}
            >
              Close Panel
            </button>
            <button
              type="button"
              className="btn-primary text-xs flex items-center gap-1.5"
              onClick={() => {
                setShowConfig(false);
                handleGenerateWorkplan();
              }}
            >
              <Sparkles size={14} /> Apply & Generate Custom Workplan
            </button>
          </div>
        </div>
      )}

      {/* INLINE GENERATED WORKPLAN CARD */}
      {generatedWorkplan && (
        <div className="generated-workplan-banner glass-card p-6 mb-8 border border-cyan animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="badge badge-cyan flex items-center gap-1 mb-1">
                <Sparkles size={12} /> AI Generated Workplan
              </span>
              <h3 className="font-bold text-xl text-primary">{generatedWorkplan.title}</h3>
              <span className="text-xs text-muted">{generatedWorkplan.focus}</span>
            </div>

            <div className="flex gap-2">
              <button 
                className={`btn-secondary ${isSaved ? 'text-emerald border-emerald' : ''}`}
                onClick={handleSaveGeneratedPlan}
                disabled={isSaved}
              >
                {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                <span>{isSaved ? 'Saved' : 'Save Plan'}</span>
              </button>
              <button className="btn-secondary" onClick={handleGenerateWorkplan}>
                <RefreshCw size={16} /> Regenerate
              </button>
            </div>
          </div>

          <div className="weekly-schedule-grid grid grid-cols-7 gap-2">
            {generatedWorkplan.weeklySchedule.map((s, idx) => (
              <div key={idx} className="day-schedule-card glass-card p-3 text-left">
                <span className="text-xs font-bold text-cyan block mb-1">{s.day}</span>
                <strong className="text-xs text-primary block mb-2">{s.title}</strong>
                <ul className="text-xs text-muted list-disc list-inside">
                  {s.details.map((d, i) => (
                    <li key={i} className="py-0.5">{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Metric Banner Cards */}
      <div className="workout-stats-grid mb-6">
        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper amber">
            <Zap size={20} />
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Weekly Workload Score</span>
            <span className="stat-value font-mono text-amber">540 AU</span>
            <span className="stat-subtext text-emerald flex items-center gap-1">
              <TrendingUp size={12} /> Optimal ACWR (1.15)
            </span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper cyan">
            <Activity size={20} />
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Spells & Overs Bowled</span>
            <span className="stat-value font-mono text-cyan">18 Overs</span>
            <span className="stat-subtext text-muted">Target: 24 Overs/wk</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon-wrapper emerald">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Session Completion</span>
            <span className="stat-value font-mono text-emerald">{completionPct}%</span>
            <span className="stat-subtext text-muted">{completedWorkouts} of {totalWorkouts} sessions done</span>
          </div>
        </div>
      </div>

      {/* TODAY'S WORKPLAN SECTION */}
      <div className="todays-training-section mb-8">
        <h3 className="section-title mb-4">Today's Workplan</h3>

        <div className="workout-cards-grid">
          {workoutsList.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onToggleExercise={(exIndex) => toggleExerciseDone(workout.id, exIndex)} 
            />
          ))}
        </div>
      </div>

      {/* WEEKLY TRAINING LOAD CHART */}
      <div className="weekly-load-section glass-card p-6 mb-8">
        <div className="chart-header flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg text-primary">Weekly Training Load & Intensity Trend</h4>
            <span className="text-xs text-muted">Acute to Chronic Workload Ratio (ACWR) Monitor</span>
          </div>
          <div className="chart-legend flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1"><span className="legend-dot cyan" /> Bowling Overs</span>
            <span className="flex items-center gap-1"><span className="legend-dot amber" /> Gym & Speed Load</span>
          </div>
        </div>

        {/* SVG Workload Chart */}
        <div className="workload-svg-chart-container">
          <svg className="workload-chart-svg" viewBox="0 0 700 180" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

            {[
              { day: 'Mon', gym: 60, bowl: 30, x: 50 },
              { day: 'Tue', gym: 90, bowl: 0, x: 140 },
              { day: 'Wed', gym: 40, bowl: 80, x: 230 },
              { day: 'Thu', gym: 30, bowl: 0, x: 320 },
              { day: 'Fri', gym: 110, bowl: 40, x: 410 },
              { day: 'Sat', gym: 0, bowl: 120, x: 500 },
              { day: 'Sun', gym: 20, bowl: 0, x: 590 }
            ].map((d, i) => (
              <g key={i}>
                <rect x={d.x - 16} y={150 - d.gym} width="14" height={d.gym} rx="4" fill="url(#amberGrad)" />
                <rect x={d.x + 2} y={150 - d.bowl} width="14" height={d.bowl} rx="4" fill="url(#cyanGrad)" />
                <text x={d.x} y="170" fill="#64748b" fontSize="12" textAnchor="middle" fontWeight="600">{d.day}</text>
              </g>
            ))}

            <defs>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <AddSessionModal onClose={() => setShowAddModal(false)} onSave={addWorkoutSession} />
      )}
    </div>
  );
};

const WorkoutCard = ({ workout, onToggleExercise }) => {
  return (
    <div className={`workout-card glass-card ${workout.completed ? 'is-completed' : ''}`}>
      <div className="workout-card-header">
        <div>
          <span className="workout-category-badge">{workout.category}</span>
          <h4 className="workout-title-text">{workout.title}</h4>
        </div>
        <span className={`badge ${workout.completed ? 'badge-emerald' : 'badge-amber'}`}>
          {workout.completed ? 'Completed' : workout.intensity}
        </span>
      </div>

      <div className="workout-meta-strip text-xs text-muted flex gap-4 my-2">
        <span className="flex items-center gap-1"><Clock size={12} /> {workout.duration}</span>
        <span className="flex items-center gap-1"><Flame size={12} /> {workout.exercises.length} Exercises</span>
      </div>

      <div className="exercises-list mt-3 flex flex-col gap-2">
        {workout.exercises.map((ex, idx) => (
          <div 
            key={idx} 
            className={`exercise-row ${ex.done ? 'done' : ''}`}
            onClick={() => onToggleExercise(idx)}
          >
            <div className="flex items-center gap-2">
              {ex.done ? (
                <CheckCircle2 size={18} className="text-emerald shrink-0" />
              ) : (
                <Circle size={18} className="text-muted shrink-0" />
              )}
              <span className="exercise-name-text">{ex.name}</span>
            </div>
            <span className="exercise-sets-text">{ex.sets}x {ex.reps} • {ex.weight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddSessionModal = ({ onClose, onSave }) => {
  const [category, setCategory] = useState('Bowling & Plyometrics');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [intensity, setIntensity] = useState('High');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: `w_${Date.now()}`,
      category,
      title,
      duration,
      intensity,
      completed: false,
      exercises: [
        { name: "Specific Fast-Bowling Drill 1", sets: 3, reps: "8 reps", weight: "Standard", done: false },
        { name: "Thoracic Core Rotation", sets: 3, reps: "12 reps", weight: "15 kg", done: false }
      ]
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-primary">Log New Training Session</h3>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-muted block mb-1">SESSION TITLE</label>
            <input 
              type="text" 
              className="custom-input" 
              placeholder="e.g., Heavy Foot-Strike Landing Blocks"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted block mb-1">CATEGORY</label>
              <select 
                className="custom-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Bowling & Plyometrics</option>
                <option>Lower Body Strength</option>
                <option>Core & Thoracic Mobility</option>
                <option>Speed & Sprint Intervals</option>
                <option>Active Recovery</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1">INTENSITY</label>
              <select 
                className="custom-input" 
                value={intensity} 
                onChange={(e) => setIntensity(e.target.value)}
              >
                <option>Moderate</option>
                <option>High</option>
                <option>Very High</option>
              </select>
            </div>
          </div>

          <div className="modal-actions flex justify-end gap-3 mt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Session</button>
          </div>
        </form>
      </div>
    </div>
  );
};
