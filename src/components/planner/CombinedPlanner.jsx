import React, { useState } from 'react';
import { 
  Sparkles, 
  Dumbbell, 
  Calendar, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle, 
  AlertOctagon,
  Check, 
  Bookmark, 
  RefreshCw, 
  GraduationCap, 
  Activity, 
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sliders,
  HeartPulse,
  Award,
  Target,
  CheckCircle2,
  Compass,
  Gauge,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './CombinedPlanner.css';

export const CombinedPlanner = () => {
  const { 
    activeCombinedPlan, 
    runCombinedGeneration, 
    saveCombinedPlan, 
    addChatMessage, 
    navigateTo,
    userProfile,
    updateAthleteProfile,
    combinedTask
  } = useApp();

  // --- Athlete Status & Workload Parameters ---
  const [athleteStatus, setAthleteStatus] = useState(userProfile?.athleteStatus || 'student'); // 'student' | 'full_time_athlete'
  const [gymDays, setGymDays] = useState(userProfile?.gymDays ?? 3);
  const [groundDays, setGroundDays] = useState(userProfile?.groundDays ?? 4);
  const [weeklyBowlingDays, setWeeklyBowlingDays] = useState(userProfile?.weeklyBowlingDays ?? 3);
  const [maxOversPerSpell, setMaxOversPerSpell] = useState(userProfile?.maxOversPerSpell ?? 8);
  const [avgOversPerSession, setAvgOversPerSession] = useState(userProfile?.avgOversPerSession ?? 5);
  const [maxSpeed, setMaxSpeed] = useState(userProfile?.maxSpeed ?? 132);
  const [injuryStatus, setInjuryStatus] = useState(userProfile?.injuryStatus || 'none');
  const [bowlingArm, setBowlingArm] = useState(userProfile?.bowlingArm || 'right');
  const [bowlingAction, setBowlingAction] = useState(userProfile?.bowlingAction || 'semi_open');
  const [runupLength, setRunupLength] = useState(userProfile?.runupLength || 'medium');
  const [maxOversDays, setMaxOversDays] = useState(userProfile?.maxOversDays ?? 2);
  const [sessionGap, setSessionGap] = useState(userProfile?.sessionGap || 'Morning Ground (6:30 AM) • Evening Gym (5:30 PM) [7-8h Gap]');

  // --- Physical, Recovery & Lifestyle Baseline ---
  const [age, setAge] = useState(userProfile?.age ?? 20);
  const [weight, setWeight] = useState(userProfile?.weight ?? 68);
  const [height, setHeight] = useState(userProfile?.height ?? 175);
  const [sex, setSex] = useState(userProfile?.sex || 'male');
  const [goal, setGoal] = useState(userProfile?.goal || 'increase_speed');
  const [sleepHours, setSleepHours] = useState(userProfile?.sleepHours ?? 7.5);
  const [waterIntake, setWaterIntake] = useState(userProfile?.waterIntake ?? 3.5);

  // --- Fast Bowler Strength Baseline: Gym Lifting vs Ground Calisthenics ---
  const [strengthTrack, setStrengthTrack] = useState(userProfile?.strengthTrack || (gymDays === 0 ? 'calisthenics_ground' : 'gym_lifting')); // 'gym_lifting' | 'calisthenics_ground'
  const [doesDeadlifts, setDoesDeadlifts] = useState(userProfile?.doesDeadlifts ?? (strengthTrack === 'gym_lifting'));
  const [deadliftKg, setDeadliftKg] = useState(userProfile?.deadliftKg ?? 85);
  const [deadliftReps, setDeadliftReps] = useState(userProfile?.deadliftReps ?? 5);
  const [splitSquatKg, setSplitSquatKg] = useState(userProfile?.splitSquatKg ?? 14);
  const [splitSquatReps, setSplitSquatReps] = useState(userProfile?.splitSquatReps ?? 8);
  const [pullupsCount, setPullupsCount] = useState(userProfile?.pullupsCount ?? 6);
  const [plankSeconds, setPlankSeconds] = useState(userProfile?.plankSeconds ?? 60);

  // Bodyweight & Calisthenics Specific Inputs (For zero-gym / no-deadlift bowlers)
  const [bodyweightSquatsReps, setBodyweightSquatsReps] = useState(userProfile?.bodyweightSquatsReps ?? 35);
  const [pushupsReps, setPushupsReps] = useState(userProfile?.pushupsReps ?? 25);

  // --- UI States ---
  const isGenerating = combinedTask.isRunning;
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [configCollapsed, setConfigCollapsed] = useState(false);
  const [showDirectives, setShowDirectives] = useState(false);
  const [activeProtocolTab, setActiveProtocolTab] = useState('schedule'); // 'schedule' | 'coaching' | 'roadmap' | 'safety'

  const plan = activeCombinedPlan;

  // Safe Real-time Biometric & Strength Calculations (Graceful defaults if user leaves fields blank)
  const safeWeight = Number(weight) > 0 ? Number(weight) : 68;
  const safeHeight = Number(height) > 0 ? Number(height) : 175;
  const safeAge = Number(age) > 0 ? Number(age) : 20;
  const safeSleepHours = Number(sleepHours) > 0 ? Number(sleepHours) : 7.5;
  const safeWaterIntake = Number(waterIntake) > 0 ? Number(waterIntake) : 3.5;
  const safeDeadliftKg = Number(deadliftKg) > 0 ? Number(deadliftKg) : 85;
  const safeDeadliftReps = Number(deadliftReps) > 0 ? Number(deadliftReps) : 5;
  const safeSplitSquatKg = Number(splitSquatKg) >= 0 ? Number(splitSquatKg) : 14;
  const safeSplitSquatReps = Number(splitSquatReps) > 0 ? Number(splitSquatReps) : 8;
  const safePullupsCount = Number(pullupsCount) >= 0 ? Number(pullupsCount) : 6;
  const safePlankSeconds = Number(plankSeconds) > 0 ? Number(plankSeconds) : 60;
  const safeBodyweightSquatsReps = Number(bodyweightSquatsReps) > 0 ? Number(bodyweightSquatsReps) : 35;
  const safePushupsReps = Number(pushupsReps) > 0 ? Number(pushupsReps) : 25;

  const heightM = Math.max(1.2, safeHeight / 100);
  const calculatedBmi = Number((safeWeight / (heightM * heightM)).toFixed(1));
  const estimatedDeadlift1Rm = doesDeadlifts ? Math.round(safeDeadliftKg * (1 + safeDeadliftReps / 30)) : 0;
  const strengthRatio = doesDeadlifts ? Number((estimatedDeadlift1Rm / Math.max(35, safeWeight)).toFixed(2)) : 0;

  const handleGymDaysChange = (newDays) => {
    setGymDays(newDays);
    if (newDays === 0) {
      setStrengthTrack('calisthenics_ground');
      setDoesDeadlifts(false);
    }
  };

  const aiAssessment = plan?.ai_coaching_assessment || plan?.ai_assessment || {
    positives: [
      `Optimal athletic BMI (${calculatedBmi} kg/m²) provides a solid lean foundation and healthy power-to-weight ratio for explosive run-up acceleration without excess joint load.`,
      `Well-balanced training schedule: healthy ~4–5 hours weekly split between gym strength conditioning (${gymDays} days) and explosive on-ground bowling drills (${groundDays} days).`,
      `Calibrated ACWR workload score (${plan?.workload_summary?.acwr_score ?? 1.18}) in the safe adaptation zone (0.8 - 1.3), maintaining high bowling durability and preventing lumbar fatigue.`
    ],
    current_lacks: [
      waterIntake < 3.5
        ? `Hydration deficit: Consuming only ${waterIntake}L/day vs 3.8L+ target; intervertebral discs lose cushioning under delivery stride impact.`
        : `Recovery window gap: Ensure at least 48 hours buffer between heavy match-intensity spells to allow osteoblast bone remodeling.`,
      calculatedBmi < 18.5
        ? `Muscular armor deficit: BMI of ${calculatedBmi} leaves joints vulnerable to 8-9x bodyweight front foot contact forces.`
        : `Spinal shear vulnerability: High-velocity bowling requires continuous anti-rotation core stability.`,
      doesDeadlifts && strengthRatio < 1.40
        ? `Posterior chain capacity is below 1.5x bodyweight baseline, increasing risk of knee flexion collapse during ball release.`
        : `Eccentric hamstring resilience must be progressively overloaded to maintain high approach velocity through 8 overs.`
    ],
    required_needs: {
      daily_calories: `Caloric surplus & high-protein tissue repair to build muscular armor for front foot contact impact absorption.`,
      protein_target: `${Math.round(weight * 2.2)}g daily protein (2.2g/kg bodyweight) for knee brace tendon and myofibrillar repair.`,
      carbs_and_fueling: `Pre-spell glycogen loading 45 min before bowling to avert 5th-over velocity drops.`,
      recovery_and_joint_care: `${Math.max(3.8, (weight * 0.055)).toFixed(1)}L electrolyte water daily, plus spinal hanging for disc decompression.`
    },
    goal_action_directives: [
      "1. Mandatory 48h Spacing: Strictly maintain 48 hours between max-overs spells to prevent lumbar bone marrow edema.",
      doesDeadlifts
        ? "2. Front Knee Plant Rigidity: Perform Bulgarian Split Squats and isometric wall sits to lock a firm 165°-175° knee brace at release."
        : "2. Ground Isometric Rigidity: Perform partner/bed-anchored Nordic hamstring falls and 3x60s wall sits to lock knee brace firmness.",
      "3. Core Anti-Rotation: Integrate Pallof cable presses (or Ground Hollow Holds) to prevent counter-rotation lumbar twisting.",
      "4. Hydration Protocol: Drink 3.8L+ water daily with sodium/potassium electrolytes to protect intervertebral disc cushions."
    ],
    coach_summary: `Your workload engine is calibrated for ${goal.replace('_', ' ')}. Prioritize posterior chain strength, proper session spacing, and hydration to bowl at maximum pace without spinal injury.`
  };

  const injuryOptions = [
    { value: 'none', label: 'Fully Fit (No Niggles)' },
    { value: 'Lower Back / Lumbar Stiffness', label: 'Lower Back / Spine' },
    { value: 'Front Knee / Patellar Tendinopathy', label: 'Front Knee / Patella' },
    { value: 'Shin Splints / Tibial Soreness', label: 'Shin Splints / Tibia' },
    { value: 'Shoulder / Rotator Cuff Strain', label: 'Shoulder / Rotator' }
  ];

  const handleGenerate = async () => {
    setIsSaved(false);
    try {
      if (updateAthleteProfile) {
        updateAthleteProfile({
          athleteStatus,
          gymDays,
          groundDays,
          weeklyBowlingDays,
          maxOversPerSpell,
          avgOversPerSession,
          maxSpeed,
          injuryStatus,
          bowlingArm,
          bowlingAction,
          runupLength,
          maxOversDays,
          sessionGap,
          age: safeAge,
          weight: safeWeight,
          height: safeHeight,
          sex,
          goal,
          sleepHours: safeSleepHours,
          waterIntake: safeWaterIntake,
          strengthTrack,
          doesDeadlifts,
          deadliftKg: safeDeadliftKg,
          deadliftReps: safeDeadliftReps,
          splitSquatKg: safeSplitSquatKg,
          splitSquatReps: safeSplitSquatReps,
          pullupsCount: safePullupsCount,
          plankSeconds: safePlankSeconds,
          bodyweightSquatsReps: safeBodyweightSquatsReps,
          pushupsReps: safePushupsReps
        });
      }

      await runCombinedGeneration({
        athlete_status: athleteStatus,
        gym_days: gymDays,
        ground_days: groundDays,
        weekly_bowling_days: weeklyBowlingDays,
        max_overs_per_spell: maxOversPerSpell,
        avg_overs_per_session: avgOversPerSession,
        max_speed: maxSpeed,
        injury_status: injuryStatus,
        bowling_arm: bowlingArm,
        bowling_action: bowlingAction,
        runup_length: runupLength,
        max_overs_days: maxOversDays,
        session_gap: sessionGap,
        age: safeAge,
        weight: safeWeight,
        height: safeHeight,
        sex,
        goal,
        sleep_hours: safeSleepHours,
        water_intake_liters: safeWaterIntake,
        strength_track: strengthTrack,
        does_deadlifts: doesDeadlifts,
        deadlift_kg: safeDeadliftKg,
        deadlift_reps: safeDeadliftReps,
        split_squat_kg: safeSplitSquatKg,
        split_squat_reps: safeSplitSquatReps,
        pullups_reps: safePullupsCount,
        plank_seconds: safePlankSeconds,
        bodyweight_squats_reps: safeBodyweightSquatsReps,
        pushups_reps: safePushupsReps
      });
      setConfigCollapsed(true);
    } catch (err) {
      console.error("Error generating workload plan:", err);
    }
  };

  const handleSave = () => {
    if (plan) {
      saveCombinedPlan(plan);
      setIsSaved(true);
    }
  };

  const handleSendToChat = () => {
    if (!plan) return;
    addChatMessage({
      id: `m_${Date.now()}`,
      sender: 'ai',
      text: `Here is your customized Fast Bowler Workload & Strength Protocol (${athleteStatus === 'student' ? 'Student Bowler' : 'Full-Time Athlete'} Profile):`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      richCard: {
        type: 'combined_protocol_card',
        data: {
          title: plan.title,
          athlete_status: athleteStatus,
          workload_summary: plan.workload_summary,
          strength_assessment: plan.strength_assessment,
          sample_day: plan.schedule[selectedDayIdx]
        }
      }
    });
    navigateTo('chat');
  };

  const currentDay = plan?.schedule?.[selectedDayIdx] || plan?.schedule?.[0];

  return (
    <div className="combined-planner-container animate-fade-in">
      {/* Page Header */}
      <div className="planner-header glass-card">
        <div className="header-badge-row">
          <span className="badge badge-cyan flex items-center gap-1.5">
            <Zap size={13} className="text-cyan animate-pulse" /> Unified Performance Engine
          </span>
          <span className="badge badge-purple flex items-center gap-1.5">
            <ShieldCheck size={13} /> Workload, Biometrics & Strength Analyzer
          </span>
        </div>
        <div className="header-title-row">
          <div>
            <h2 className="planner-main-title">Fast Bowler Workload & Routine Engine</h2>
            <p className="planner-subtitle">
              Configure parameters across 4 structured sections below to calculate your ECB workload ratios, gym/ground periodization, and injury prevention protocol.
            </p>
          </div>
          <button 
            type="button" 
            className="btn-secondary toggle-config-btn"
            onClick={() => setConfigCollapsed(!configCollapsed)}
          >
            <Sliders size={16} />
            <span>{configCollapsed ? 'Edit Parameters' : 'Hide Controls'}</span>
          </button>
        </div>
      </div>

      {/* WORKLOAD & PROFILE CONFIGURATION PANEL - ALL SECTIONS ON SAME PAGE */}
      {!configCollapsed && (
        <div className="config-panel glass-card animate-fade-in">
          {/* =========================================================================
              SECTION 1: ATHLETE PROFILE & LIFESTYLE TIMETABLE
             ========================================================================= */}
          <div className="config-section-container">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge cyan">1</div>
                <div>
                  <h3 className="section-main-heading">Athlete Profile, Schedule & Goal</h3>
                  <p className="section-sub-heading">Occupation cadence, body biometrics, and performance targets.</p>
                </div>
              </div>
            </div>

            {/* Student vs Full-Time Athlete Selection */}
            <div className="athlete-status-toggle-grid mb-5">
              <div 
                className={`athlete-status-card ${athleteStatus === 'student' ? 'selected' : ''}`}
                onClick={() => setAthleteStatus('student')}
              >
                <div className="status-card-header">
                  <div className="icon-circle student">
                    <GraduationCap size={22} />
                  </div>
                  <div className="status-title-group">
                    <h4>Student Fast Bowler</h4>
                    <span className="status-pill">Academic Balance</span>
                  </div>
                </div>
                <p className="status-desc">
                  Adapts training schedule around college lectures & exams: Early morning ground spells (6:30–8:00 AM), evening gym/calisthenics slots, quick recovery routines, and study rest.
                </p>
                {athleteStatus === 'student' && <div className="selected-glow" />}
              </div>

              <div 
                className={`athlete-status-card ${athleteStatus === 'full_time_athlete' ? 'selected' : ''}`}
                onClick={() => setAthleteStatus('full_time_athlete')}
              >
                <div className="status-card-header">
                  <div className="icon-circle pro">
                    <Activity size={22} />
                  </div>
                  <div className="status-title-group">
                    <h4>Full-Time Athlete</h4>
                    <span className="status-pill pro">High Performance</span>
                  </div>
                </div>
                <p className="status-desc">
                  Maximum performance cadence: Mid-morning spell sessions, video biomechanics reviews, dedicated afternoon S&C, contrast water therapy, and nap cycles.
                </p>
                {athleteStatus === 'full_time_athlete' && <div className="selected-glow" />}
              </div>
            </div>

            {/* Biometrics & Goal Grid */}
            <div className="bio-inputs-grid">
              <div className="form-group">
                <label>Body Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))} 
                  className="input-field font-mono" 
                />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))} 
                  className="input-field font-mono" 
                />
              </div>
              <div className="form-group">
                <label>Age (years)</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))} 
                  className="input-field font-mono" 
                />
              </div>
              <div className="form-group">
                <label>Calculated BMI</label>
                <div className="input-field font-mono flex items-center justify-between bg-black/10">
                  <span>{calculatedBmi} kg/m²</span>
                  <span className="text-[11px] text-cyan font-sans uppercase font-bold">Healthy Baseline</span>
                </div>
              </div>
              <div className="form-group col-span-full sm:col-span-2">
                <label>Athletic Priority Goal</label>
                <select 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)} 
                  className="select-field"
                >
                  <option value="increase_speed">⚡ Increase Speed & Lumbar Power</option>
                  <option value="muscle_gain">💪 Fast Bowler Muscular Armor / Hypertrophy</option>
                  <option value="fat_loss">🔥 Lean Body Composition & Agility</option>
                  <option value="performance">🛡️ All-Round Athletic Durability</option>
                </select>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: CURRENT BOWLING & TRAINING WORKLOAD
             ========================================================================= */}
          <div className="config-section-container">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge amber">2</div>
                <div>
                  <h3 className="section-main-heading">Bowling Volume & Biomechanical Parameters</h3>
                  <p className="section-sub-heading">Session frequency, spell caps, delivery speeds, and action alignment.</p>
                </div>
              </div>
            </div>

            <div className="workload-controls-grid">
              {/* Total Ground Cricket Training Days */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Total Ground Sessions</label>
                  <span className="control-val-badge emerald">{groundDays} Days / Week</span>
                </div>
                <p className="control-hint">Net bowling, fielding drills, and match practice</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={groundDays <= 1} 
                    onClick={() => setGroundDays(prev => Math.max(1, prev - 1))}
                  >-</button>
                  <span className="step-val">{groundDays} Days</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={groundDays >= 6} 
                    onClick={() => setGroundDays(prev => Math.min(6, prev + 1))}
                  >+</button>
                </div>
              </div>

              {/* Weekly Bowling Frequency */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Weekly Bowling Days</label>
                  <span className="control-val-badge cyan">{weeklyBowlingDays} Days / Week</span>
                </div>
                <p className="control-hint">Ground days where bowling delivery strides are executed</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={weeklyBowlingDays <= 1} 
                    onClick={() => setWeeklyBowlingDays(prev => Math.max(1, prev - 1))}
                  >-</button>
                  <span className="step-val">{weeklyBowlingDays} Days</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={weeklyBowlingDays >= 6} 
                    onClick={() => setWeeklyBowlingDays(prev => Math.min(6, prev + 1))}
                  >+</button>
                </div>
              </div>

              {/* Max Overs in Single Spell */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Max Overs Per Spell</label>
                  <span className={`control-val-badge ${maxOversPerSpell > 8 ? 'red' : 'amber'}`}>
                    {maxOversPerSpell} Overs {maxOversPerSpell > 8 ? '• High Strain' : ''}
                  </span>
                </div>
                <p className="control-hint">Single continuous bowling spell limit in matches/nets</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={maxOversPerSpell <= 2} 
                    onClick={() => setMaxOversPerSpell(prev => Math.max(2, prev - 1))}
                  >-</button>
                  <span className="step-val">{maxOversPerSpell} Overs</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={maxOversPerSpell >= 16} 
                    onClick={() => setMaxOversPerSpell(prev => Math.min(16, prev + 1))}
                  >+</button>
                </div>
              </div>

              {/* Average Overs per Net Session */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Average Overs / Session</label>
                  <span className="control-val-badge cyan">{avgOversPerSession} Overs</span>
                </div>
                <p className="control-hint">Standard volume in daily cricket practice sessions</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={avgOversPerSession <= 2} 
                    onClick={() => setAvgOversPerSession(prev => Math.max(2, prev - 1))}
                  >-</button>
                  <span className="step-val">{avgOversPerSession} Overs</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={avgOversPerSession >= 14} 
                    onClick={() => setAvgOversPerSession(prev => Math.min(14, prev + 1))}
                  >+</button>
                </div>
              </div>

              {/* Top Bowling Velocity */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Top Bowling Speed</label>
                  <span className="control-val-badge amber">{maxSpeed} km/h</span>
                </div>
                <p className="control-hint">Ground reaction forces scale quadratically with bowling speed</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={maxSpeed <= 90} 
                    onClick={() => setMaxSpeed(prev => Math.max(90, prev - 2))}
                  >-</button>
                  <span className="step-val font-mono">{maxSpeed} km/h</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={maxSpeed >= 160} 
                    onClick={() => setMaxSpeed(prev => Math.min(160, prev + 2))}
                  >+</button>
                </div>
              </div>
            </div>

            {/* Bowling Biomechanics Triad Card */}
            <div className="control-card col-span-full mb-2">
              <div className="control-label-row">
                <label>Bowling Arm, Action Alignment & Run-Up Length</label>
                <span className="control-val-badge cyan font-mono">Biomechanical Triad</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div>
                  <span className="text-[11px] text-muted block mb-1">Bowling Arm:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`chip flex-1 text-xs justify-center ${bowlingArm === 'right' ? 'active' : ''}`}
                      onClick={() => setBowlingArm('right')}
                    >Right-Arm (RAF)</button>
                    <button
                      type="button"
                      className={`chip flex-1 text-xs justify-center ${bowlingArm === 'left' ? 'active' : ''}`}
                      onClick={() => setBowlingArm('left')}
                    >Left-Arm (LAF)</button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted block mb-1">Action Alignment:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { val: 'side_on', label: 'Side-On' },
                      { val: 'semi_open', label: 'Semi-Open' },
                      { val: 'front_on', label: 'Front-On' },
                      { val: 'mixed', label: 'Mixed (Risk)' }
                    ].map((act) => (
                      <button
                        key={act.val}
                        type="button"
                        className={`chip text-[11px] px-2 py-1 ${bowlingAction === act.val ? 'active' : ''} ${act.val === 'mixed' && bowlingAction === 'mixed' ? 'badge-rose' : ''}`}
                        onClick={() => setBowlingAction(act.val)}
                      >{act.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted block mb-1">Run-Up Approach:</span>
                  <div className="flex gap-1.5">
                    {['short', 'medium', 'long'].map((ru) => (
                      <button
                        key={ru}
                        type="button"
                        className={`chip flex-1 text-xs justify-center capitalize ${runupLength === ru ? 'active' : ''}`}
                        onClick={() => setRunupLength(ru)}
                      >{ru}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 3: RECOVERY, SPINAL SAFETY & SLEEP
             ========================================================================= */}
          <div className="config-section-container">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge emerald">3</div>
                <div>
                  <h3 className="section-main-heading">Recovery, Spinal Safety & Lifestyle Baseline</h3>
                  <p className="section-sub-heading">Session spacing buffers, active symptom monitoring, sleep, and hydration.</p>
                </div>
              </div>
            </div>

            <div className="workload-controls-grid">
              {/* Nightly Sleep Duration */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Nightly Sleep Duration</label>
                  <span className={`control-val-badge ${sleepHours < 6.5 ? 'red' : 'emerald'}`}>
                    {sleepHours}h / Night {sleepHours < 6.5 ? '• Deficit' : ''}
                  </span>
                </div>
                <p className="control-hint">Deep slow-wave sleep repairs spinal discs & triggers growth hormone (GH)</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={sleepHours <= 4.0} 
                    onClick={() => setSleepHours(prev => Number(Math.max(4.0, prev - 0.5).toFixed(1)))}
                  >-</button>
                  <span className="step-val">{sleepHours}h</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={sleepHours >= 11.0} 
                    onClick={() => setSleepHours(prev => Number(Math.min(11.0, prev + 0.5).toFixed(1)))}
                  >+</button>
                </div>
              </div>

              {/* Daily Hydration Intake */}
              <div className="control-card">
                <div className="control-label-row">
                  <label>Daily Water Intake</label>
                  <span className={`control-val-badge ${waterIntake < 3.5 ? 'red' : 'cyan'}`}>
                    {waterIntake}L / Day {waterIntake < 3.5 ? '• Dehydrated' : ''}
                  </span>
                </div>
                <p className="control-hint">Intervertebral disc cushioning & intra-spell cramp prevention (Min: 3.5L+)</p>
                <div className="stepper-row mt-2">
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={waterIntake <= 1.5} 
                    onClick={() => setWaterIntake(prev => Number(Math.max(1.5, prev - 0.5).toFixed(1)))}
                  >-</button>
                  <span className="step-val">{waterIntake}L</span>
                  <button 
                    type="button" 
                    className="step-btn" 
                    disabled={waterIntake >= 7.0} 
                    onClick={() => setWaterIntake(prev => Number(Math.min(7.0, prev + 0.5).toFixed(1)))}
                  >+</button>
                </div>
              </div>
            </div>

            {/* Current Injury Status Selector */}
            <div className="control-card mb-4">
              <div className="control-label-row">
                <label>Current Injury / Niggle Status</label>
                <span className={`control-val-badge ${injuryStatus === 'none' ? 'emerald' : 'red'}`}>
                  {injuryStatus === 'none' ? 'Fully Fit' : 'Active Symptom'}
                </span>
              </div>
              <p className="control-hint">Flags anatomical vulnerability to safeguard against chronic bone stress fractures</p>
              <div className="injury-chips-grid mt-2">
                {injuryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip injury-chip ${injuryStatus === opt.value ? 'active' : ''}`}
                    onClick={() => setInjuryStatus(opt.value)}
                  >
                    {opt.value !== 'none' && <AlertTriangle size={13} className="text-amber" />}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Gap Selector */}
            <div className="control-card mb-2">
              <div className="control-label-row">
                <label>Gap Between Training Sessions (Dual-Session Days)</label>
                <span className="control-val-badge purple">Spinal Health Buffer</span>
              </div>
              <p className="control-hint">Adequate rest gap allows spinal disc decompression between ground impact & gym loading</p>
              <div className="gap-options-grid">
                {[
                  'Morning Ground (6:30 AM) • Evening S&C (5:30 PM) [7-8h Gap]',
                  'Separate / Alternate Days (Strength on non-ground days)',
                  'Same Day: 3-4 Hours Split (Afternoon rest window)',
                  'Back-to-Back (< 1 Hour Gap • High CNS Fatigue)'
                ].map((gapOpt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`gap-option-btn ${sessionGap === gapOpt ? 'active' : ''}`}
                    onClick={() => setSessionGap(gapOpt)}
                  >
                    <Clock size={15} />
                    <span>{gapOpt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 4: ATHLETIC STRENGTH BASELINE & REPS ASSESSMENT
             ========================================================================= */}
          <div className="config-section-container">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge purple">4</div>
                <div>
                  <h3 className="section-main-heading">Fast Bowler Strength Baseline & Muscular Armor</h3>
                  <p className="section-sub-heading">Gym lifting loads or ground calisthenics capacity for front-knee deceleration.</p>
                </div>
              </div>
            </div>

            {/* Gym / Strength Training Days Stepper */}
            <div className="control-card mb-4">
              <div className="control-label-row">
                <label>Gym / Strength Conditioning Days</label>
                <span className={`control-val-badge ${gymDays === 0 ? 'amber' : 'purple'}`}>
                  {gymDays === 0 ? '0 Days • Ground Only Mode' : `${gymDays} Days / Week`}
                </span>
              </div>
              <p className="control-hint">
                {gymDays === 0 ? 'Zero gym days selected. Schedule will automatically use ground calisthenics & plyometrics.' : 'Posterior chain, single-leg power & rotational core sessions'}
              </p>
              <div className="stepper-row mt-2">
                <button 
                  type="button" 
                  className="step-btn" 
                  disabled={gymDays <= 0} 
                  onClick={() => handleGymDaysChange(Math.max(0, gymDays - 1))}
                >-</button>
                <span className="step-val">{gymDays} Days</span>
                <button 
                  type="button" 
                  className="step-btn" 
                  disabled={gymDays >= 6} 
                  onClick={() => handleGymDaysChange(Math.min(6, gymDays + 1))}
                >+</button>
              </div>
            </div>

            {/* Training Mode Switcher: Gym Weights vs Ground Bodyweight */}
            <div className="strength-mode-switch-grid grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                className={`chip py-2.5 px-3 justify-center text-xs font-semibold flex items-center gap-2 border ${strengthTrack === 'gym_lifting' ? 'active border-cyan-400' : 'border-white/10'}`}
                onClick={() => {
                  setStrengthTrack('gym_lifting');
                  setDoesDeadlifts(true);
                  if (gymDays === 0) setGymDays(3);
                }}
              >
                <Dumbbell size={15} className="text-cyan" />
                <span>🏋️ Gym Weights & Deadlift Access</span>
              </button>
              <button
                type="button"
                className={`chip py-2.5 px-3 justify-center text-xs font-semibold flex items-center gap-2 border ${strengthTrack === 'calisthenics_ground' ? 'active border-emerald-400' : 'border-white/10'}`}
                onClick={() => {
                  setStrengthTrack('calisthenics_ground');
                  setDoesDeadlifts(false);
                }}
              >
                <Activity size={15} className="text-emerald" />
                <span>🏃 Ground & Bodyweight (No Gym / No Deadlifts)</span>
              </button>
            </div>

            {/* Notice when Ground/Bodyweight Mode is Active */}
            {strengthTrack === 'calisthenics_ground' && (
              <div className="callout-card p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-2.5 mb-4">
                <Sparkles size={16} className="text-emerald shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200">
                  <strong className="block text-emerald font-semibold mb-0.5">No-Gym / Calisthenics Mode Active:</strong>
                  Fast bowling front-foot 8–9x bodyweight impacts will be conditioned using ground plyometrics (single-leg bounding, Nordic drops, isometric wall sits, and tempo push-ups).
                </div>
              </div>
            )}

            <div className="strength-inputs-grid mb-2">
              {strengthTrack === 'gym_lifting' ? (
                <>
                  {/* Trap Bar / Barbell Deadlift */}
                  <div className="strength-input-card highlight">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <Dumbbell size={16} className="text-cyan" /> Trap Bar / Deadlift
                      </span>
                      {doesDeadlifts && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan border border-cyan-800/40 shrink-0">
                          Est. 1RM: {estimatedDeadlift1Rm} kg ({strengthRatio}x BW)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 my-1">
                      <label className="text-[11px] text-muted flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={!doesDeadlifts} 
                          onChange={(e) => setDoesDeadlifts(!e.target.checked)}
                        />
                        <span>I don't do barbell deadlifts (Use DBs / Jump Squats)</span>
                      </label>
                    </div>
                    {doesDeadlifts ? (
                      <div className="grid grid-cols-2 gap-2 mt-1 w-full min-w-0">
                        <div className="min-w-0">
                          <label className="text-[11px] text-muted block mb-1">Working Weight (kg):</label>
                          <input 
                            type="number" 
                            value={deadliftKg} 
                            onChange={(e) => setDeadliftKg(Math.max(20, Number(e.target.value)))}
                            className="input-field font-mono text-sm py-1.5 w-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <label className="text-[11px] text-muted block mb-1">Completed Reps:</label>
                          <input 
                            type="number" 
                            value={deadliftReps} 
                            onChange={(e) => setDeadliftReps(Math.max(1, Number(e.target.value)))}
                            className="input-field font-mono text-sm py-1.5 w-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 w-full min-w-0">
                        <label className="text-[11px] text-muted block mb-1">Max Bodyweight Jump Squats (Reps):</label>
                        <input 
                          type="number" 
                          value={bodyweightSquatsReps} 
                          onChange={(e) => setBodyweightSquatsReps(Math.max(10, Number(e.target.value)))}
                          className="input-field font-mono text-sm py-1.5 w-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bulgarian Split Squats (Dumbbells) */}
                  <div className="strength-input-card">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <TrendingUp size={16} className="text-emerald" /> Bulgarian Split Squats
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald border border-emerald-800/40 shrink-0">
                        Lead-Leg Brake
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Unilateral quad/glute strength to prevent knee flexion collapse.</p>
                    <div className="grid grid-cols-2 gap-2 mt-1 w-full min-w-0">
                      <div className="min-w-0">
                        <label className="text-[11px] text-muted block mb-1">DB Weight / Hand (kg):</label>
                        <input 
                          type="number" 
                          value={splitSquatKg} 
                          onChange={(e) => setSplitSquatKg(Math.max(0, Number(e.target.value)))}
                          className="input-field font-mono text-sm py-1.5 w-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <label className="text-[11px] text-muted block mb-1">Reps per Leg:</label>
                        <input 
                          type="number" 
                          value={splitSquatReps} 
                          onChange={(e) => setSplitSquatReps(Math.max(1, Number(e.target.value)))}
                          className="input-field font-mono text-sm py-1.5 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pull-Ups / Chin-Ups */}
                  <div className="strength-input-card">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <Award size={16} className="text-amber" /> Pull-ups / Chin-ups
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber border border-amber-800/40 shrink-0">
                        Upper Body Pull
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Lats & rotator cuff pull-through power for ball delivery release.</p>
                    <div className="mt-1 w-full min-w-0">
                      <label className="text-[11px] text-muted block mb-1">Maximum Clean Reps:</label>
                      <input 
                        type="number" 
                        value={pullupsCount} 
                        onChange={(e) => setPullupsCount(Math.max(0, Number(e.target.value)))}
                        className="input-field font-mono text-sm py-1.5 w-full"
                      />
                    </div>
                  </div>

                  {/* Core Plank Hold */}
                  <div className="strength-input-card">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-purple" /> Core Plank Hold
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/40 text-purple border border-purple-800/40 shrink-0">
                        Anti-Extension
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Lumbar protection against hyperextension shear at delivery stride.</p>
                    <div className="mt-1 w-full min-w-0">
                      <label className="text-[11px] text-muted block mb-1">Hold Duration (Seconds):</label>
                      <input 
                        type="number" 
                        value={plankSeconds} 
                        onChange={(e) => setPlankSeconds(Math.max(15, Number(e.target.value)))}
                        className="input-field font-mono text-sm py-1.5 w-full"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* GROUND & CALISTHENICS MODE INPUTS */
                <>
                  {/* Bodyweight Squats / Jump Squats */}
                  <div className="strength-input-card highlight">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <Zap size={16} className="text-emerald" /> Bodyweight Squats / Jump Squats
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald border border-emerald-800/40 shrink-0">
                        Quad & Knee Armor
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Tests lower body endurance and eccentric landing shock absorption.</p>
                    <div className="mt-2 w-full min-w-0">
                      <label className="text-[11px] text-muted block mb-1">Max Bodyweight Squats (Continuous Reps):</label>
                      <input 
                        type="number" 
                        value={bodyweightSquatsReps} 
                        onChange={(e) => setBodyweightSquatsReps(Math.max(5, Number(e.target.value)))}
                        className="input-field font-mono text-sm py-1.5 w-full"
                      />
                    </div>
                  </div>

                  {/* Single-Leg Bodyweight Split Squats / Step-Ups */}
                  <div className="strength-input-card">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <TrendingUp size={16} className="text-cyan" /> Single-Leg Split Squats
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan border border-cyan-800/40 shrink-0">
                        Lead-Leg Brake
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Chair or ground step-ups for unilateral front knee plant lock.</p>
                    <div className="mt-2 w-full min-w-0">
                      <label className="text-[11px] text-muted block mb-1">Clean Reps per Leg:</label>
                      <input 
                        type="number" 
                        value={splitSquatReps} 
                        onChange={(e) => setSplitSquatReps(Math.max(3, Number(e.target.value)))}
                        className="input-field font-mono text-sm py-1.5 w-full"
                      />
                    </div>
                  </div>

                  {/* Max Push-ups */}
                  <div className="strength-input-card">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <Award size={16} className="text-amber" /> Push-Ups (Full Range)
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber border border-amber-800/40 shrink-0">
                        Torso & Chest Armor
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Upper body kinetic chain push power and anterior serratus stability.</p>
                    <div className="mt-2 w-full min-w-0">
                      <label className="text-[11px] text-muted block mb-1">Max Push-ups in Single Set:</label>
                      <input 
                        type="number" 
                        value={pushupsReps} 
                        onChange={(e) => setPushupsReps(Math.max(2, Number(e.target.value)))}
                        className="input-field font-mono text-sm py-1.5 w-full"
                      />
                    </div>
                  </div>

                  {/* Core Plank Hold */}
                  <div className="strength-input-card">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-semibold text-sm text-primary flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-purple" /> Core Plank Hold
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/40 text-purple border border-purple-800/40 shrink-0">
                        Lumbar Protection
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">Spinal endurance to prevent disc compression under bowling strides.</p>
                    <div className="mt-2 w-full min-w-0">
                      <label className="text-[11px] text-muted block mb-1">Hold Duration (Seconds):</label>
                      <input 
                        type="number" 
                        value={plankSeconds} 
                        onChange={(e) => setPlankSeconds(Math.max(15, Number(e.target.value)))}
                        className="input-field font-mono text-sm py-1.5 w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Trigger & Configuration Summary Bar */}
          <div className="action-row-footer flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-white/10 mt-2">
            <div className="config-summary-pills flex flex-wrap items-center gap-2 text-xs">
              <span className="summary-chip cyan">
                Status: <strong>{athleteStatus === 'student' ? 'Student Bowler' : 'Full-Time Pro'}</strong>
              </span>
              <span className="summary-chip amber">
                Bowling: <strong>{groundDays} Ground / {maxOversPerSpell} Overs</strong>
              </span>
              <span className="summary-chip emerald">
                Sleep: <strong>{sleepHours}h / Night</strong>
              </span>
              <span className="summary-chip purple">
                Strength: <strong>{strengthTrack === 'gym_lifting' ? 'Gym Deadlifts' : 'Ground Bodyweight'}</strong>
              </span>
            </div>

            <button 
              type="button" 
              className="btn-primary generate-combined-btn w-full sm:w-auto"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  <span>Synthesizing Fast Bowler Workload & Strength Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-cyan" />
                  <span>Analyze Routine & Generate Structured Workplan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* GENERATED WORKLOAD & STRENGTH DASHBOARD */}
      {plan && (
        <div className="protocol-results-wrapper animate-fade-in">
          {/* 1. Protocol Header & Quick Actions */}
          <div className="protocol-header-bar glass-card">
            <div className="protocol-header-left">
              <div className="protocol-badges-line">
                <span className="badge badge-cyan uppercase font-mono text-xs">
                  {plan?.athlete_status === 'student' ? '🎓 Student Bowler Protocol' : '⚡ Full-Time Pro Protocol'}
                </span>
                <span className="badge badge-emerald text-xs flex items-center gap-1.5">
                  <span className="pulse-dot"></span>
                  {plan?.workload_summary?.acwr_status || 'Optimal ACWR Load'}
                </span>
                <span className="badge badge-purple text-xs">
                  {strengthTrack === 'calisthenics_ground' ? '🏃 Ground / Calisthenics Conditioning' : '🏋️ Gym S&C Track'}
                </span>
              </div>
              <h3 className="protocol-title">{plan?.title || 'Fast Bowler Workload & Routine Protocol'}</h3>
              <p className="protocol-subtitle">
                Periodized fast-bowling workload & strength architecture calibrated for <strong>{weight} kg</strong> athlete bowling up to <strong>{plan?.workload_summary?.total_weekly_overs ?? 16} overs/week</strong>.
              </p>
              <div className="protocol-athlete-specs flex items-center gap-2 mt-2 flex-wrap text-xs">
                <span className="badge badge-cyan font-mono text-[11px]">
                  {bowlingArm === 'left' ? 'Left-Arm Fast (LAF)' : 'Right-Arm Fast (RAF)'}
                </span>
                <span className={`badge font-mono text-[11px] ${bowlingAction === 'mixed' ? 'badge-rose font-bold' : 'badge-purple'}`}>
                  {(bowlingAction || 'semi_open').replace('_', ' ').toUpperCase()} ACTION
                </span>
                <span className="badge badge-cyan font-mono text-[11px]">
                  {runupLength.toUpperCase()} RUN-UP
                </span>
                <span className={`badge font-mono text-[11px] ${calculatedBmi < 18.5 ? 'badge-rose' : 'badge-emerald'}`}>
                  ⚖️ BMI: {calculatedBmi} {calculatedBmi < 18.5 ? '(Underweight)' : ''}
                </span>
                {doesDeadlifts ? (
                  <span className={`badge font-mono text-[11px] ${strengthRatio < 1.4 ? 'badge-amber' : 'badge-emerald'}`}>
                    🏋️ DL: {strengthRatio}x BW
                  </span>
                ) : (
                  <span className="badge badge-emerald font-mono text-[11px]">
                    🏃 Calisthenics: {pushupsReps} Pushups
                  </span>
                )}
                <span className={`badge font-mono text-[11px] ${waterIntake < 3.5 ? 'badge-rose' : 'badge-cyan'}`}>
                  💧 {waterIntake}L Water {waterIntake < 3.5 ? '(Low)' : ''}
                </span>
                <span className={`badge font-mono text-[11px] ${sleepHours < 6.5 ? 'badge-rose' : 'badge-emerald'}`}>
                  😴 {sleepHours}h Sleep
                </span>
              </div>
            </div>

            <div className="protocol-header-actions">
              <button 
                type="button" 
                className={`btn-secondary ${isSaved ? 'text-emerald border-emerald' : ''}`}
                onClick={handleSave}
                disabled={isSaved}
              >
                {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                <span>{isSaved ? 'Saved' : 'Save Protocol'}</span>
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleSendToChat}
              >
                <MessageSquare size={16} className="text-cyan" />
                <span>Ask Coach AI</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfigCollapsed(!configCollapsed)}
                title="Adjust weight, overs or gym parameters"
              >
                <Sliders size={16} />
                <span>{configCollapsed ? 'Edit Parameters' : 'Hide Controls'}</span>
              </button>
            </div>
          </div>

          {/* 1.2 Executive KPI Strip */}
          <div className="protocol-kpi-strip">
            <div className="kpi-card">
              <span className="kpi-card-label">Weekly Bowling Overs</span>
              <div className="kpi-card-value text-cyan">
                {plan?.workload_summary?.total_weekly_overs ?? 16} 
                <span className="text-xs text-muted font-sans font-normal">/ {plan?.workload_summary?.overs_ceiling ?? 24} max</span>
              </div>
              <span className="kpi-card-sub text-emerald">✓ ECB Directive Compliant</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-card-label">ACWR Workload Ratio</span>
              <div className="kpi-card-value text-emerald">
                {plan?.workload_summary?.acwr_score ?? 1.15}
              </div>
              <span className="kpi-card-sub text-emerald">● Optimal Sweet Spot (0.8 - 1.3)</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-card-label">Daily Fueling Target</span>
              <div className="kpi-card-value text-amber">
                {plan?.nutrition_summary?.training_day_calories ?? 2800} 
                <span className="text-xs text-muted font-sans font-normal">kcal</span>
              </div>
              <span className="kpi-card-sub text-secondary">
                {plan?.nutrition_summary?.daily_protein_target_g ?? 150}g Protein Target
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-card-label">Hydration Minimum</span>
              <div className="kpi-card-value text-cyan">
                {waterIntake} 
                <span className="text-xs text-muted font-sans font-normal">L / day</span>
              </div>
              <span className="kpi-card-sub text-cyan">💧 Spinal Disc Cushioning</span>
            </div>
          </div>

          {/* 1.3 Segmented Navigation Tabs for Protocol Results */}
          <div className="protocol-tabs-nav">
            <button 
              type="button"
              className={`protocol-tab-btn schedule-tab ${activeProtocolTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveProtocolTab('schedule')}
            >
              <Calendar size={16} />
              <span>7-Day Schedule & Routine</span>
            </button>
            <button 
              type="button"
              className={`protocol-tab-btn coaching-tab ${activeProtocolTab === 'coaching' ? 'active' : ''}`}
              onClick={() => setActiveProtocolTab('coaching')}
            >
              <Sparkles size={16} />
              <span>AI Coaching Diagnostic</span>
            </button>
            <button 
              type="button"
              className={`protocol-tab-btn roadmap-tab ${activeProtocolTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveProtocolTab('roadmap')}
            >
              <Target size={16} />
              <span>Targets & Roadmap</span>
            </button>
            <button 
              type="button"
              className={`protocol-tab-btn safety-tab ${activeProtocolTab === 'safety' ? 'active' : ''}`}
              onClick={() => setActiveProtocolTab('safety')}
            >
              <ShieldCheck size={16} />
              <span>Workload & Safety Audit</span>
              {plan?.overload_warnings?.length > 0 && (
                <span className="badge badge-rose text-[10px] ml-1">{plan.overload_warnings.length}</span>
              )}
            </button>
          </div>

          {/* TAB 1: 7-DAY SCHEDULE & ROUTINE */}
          {activeProtocolTab === 'schedule' && (
            <div className="protocol-schedule-tab animate-fade-in">
              {/* 7-Day Interactive Matrix Selector */}
              <div className="days-nav-tabs glass-card mb-4">
                <div className="days-tab-header-row">
                  <span className="days-tab-header-label">
                    <Calendar size={15} className="text-cyan inline mr-1" />
                    Interactive 7-Day Workload Schedule:
                  </span>
                  <span className="days-tab-helper">Click any day to inspect spell limits, drills & gym session</span>
                </div>
                <div className="days-tab-scroller">
                  {(plan?.schedule || []).map((dayItem, idx) => {
                    const isSelected = idx === selectedDayIdx;
                    const isMax = dayItem.day_type === 'max_overs_bowling';
                    const isGym = dayItem.day_type === 'gym_strength' || dayItem.day_type === 'calisthenics_ground';
                    const isDual = dayItem.day_type === 'dual_session';
                    const isRec = dayItem.day_type === 'active_recovery';

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`day-tab-btn ${isSelected ? 'active' : ''} ${dayItem.day_type}`}
                        onClick={() => setSelectedDayIdx(idx)}
                      >
                        <div className="day-tab-icon">
                          {isMax ? <Zap size={15} className="text-rose-400" /> :
                           isGym ? <Dumbbell size={15} className="text-purple-400" /> :
                           isDual ? <Activity size={15} className="text-amber-400" /> :
                           isRec ? <ShieldCheck size={15} className="text-emerald-400" /> :
                           <Award size={15} className="text-cyan-400" />}
                        </div>
                        <span className="day-name">{dayItem.day.slice(0, 3).toUpperCase()}</span>
                        <span className="day-badge-text">{dayItem.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Detail Card */}
              {currentDay && (
                <div className="day-card workload-card glass-card animate-fade-in mb-4">
                  <div className="day-card-header">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="day-flag font-mono font-bold text-cyan">{currentDay.day.toUpperCase()}</span>
                        <span className={`pill-badge ${currentDay.day_type}`}>{currentDay.badge}</span>
                      </div>
                      <h4 className="day-headline">{currentDay.title}</h4>
                    </div>
                    <Dumbbell className="text-cyan" size={24} />
                  </div>

                  {/* Athlete Adaptable Daily Timetable */}
                  <div className="schedule-adaptability-box mb-4">
                    <div className="box-title flex items-center gap-2">
                      <Clock size={14} className="text-cyan" />
                      <span>{plan?.athlete_status === 'student' ? 'Student Timetable (Class-Friendly Structure)' : 'Pro Athlete Daily Schedule'}</span>
                    </div>
                    <p className="schedule-time-text">
                      {plan?.athlete_status === 'student' ? currentDay.student_schedule : currentDay.fulltime_schedule}
                    </p>
                    <div className="gap-advisory-note">
                      <HeartPulse size={13} className="text-emerald shrink-0" />
                      <span>{currentDay.session_gap_advisory}</span>
                    </div>
                  </div>

                  {/* Ground Bowling & Gym Session Grid */}
                  <div className="day-fullwidth-grid">
                    {/* Ground Session Details */}
                    {currentDay.workload?.ground_session ? (
                      <div className="training-subblock ground-block">
                        <div className="subblock-header">
                          <div className="flex items-center gap-2">
                            <Award size={16} className="text-amber" />
                            <strong className="text-primary text-sm">Ground Cricket Bowling Session</strong>
                          </div>
                          <span className="overs-counter font-mono">
                            {currentDay.workload.ground_session.overs} OVERS • {currentDay.workload.ground_session.intensity}
                          </span>
                        </div>
                        <p className="drill-focus-text">
                          <strong>Focus:</strong> {currentDay.workload.ground_session.focus}
                        </p>
                        <ul className="drills-checklist">
                          {(currentDay.workload.ground_session.drills || []).map((drill, dIdx) => (
                            <li key={dIdx} className="drill-item">
                              <Check size={13} className="text-cyan shrink-0" />
                              <span>{drill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="training-subblock rest-subblock">
                        <div className="flex items-center gap-2 mb-1 text-emerald">
                          <ShieldCheck size={16} />
                          <strong className="text-xs">Spine & Knee Brace Deload</strong>
                        </div>
                        <span className="text-xs text-muted">No ground bowling today to allow bone remodeling and disc decompression.</span>
                      </div>
                    )}

                    {/* Gym or Calisthenics Session Details */}
                    {currentDay.workload?.gym_session ? (
                      <div className="training-subblock gym-block">
                        <div className="subblock-header">
                          <div className="flex items-center gap-2">
                            <Dumbbell size={16} className="text-purple" />
                            <strong className="text-primary text-sm">{currentDay.workload.gym_session.status}</strong>
                          </div>
                          <span className="duration-counter font-mono">
                            {currentDay.workload.gym_session.duration}
                          </span>
                        </div>
                        <p className="drill-focus-text">
                          <strong>Focus:</strong> {currentDay.workload.gym_session.focus}
                        </p>
                        <div className="exercises-table">
                          {(currentDay.workload.gym_session.exercises || []).map((ex, eIdx) => (
                            <div key={eIdx} className="exercise-row">
                              <span className="ex-name">{ex.name}</span>
                              <span className="ex-metrics font-mono">{ex.sets} Sets × {ex.reps}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="training-subblock rest-subblock">
                        <div className="flex items-center gap-2 mb-1 text-purple">
                          <HeartPulse size={16} />
                          <strong className="text-xs">Central Nervous System Reset</strong>
                        </div>
                        <span className="text-xs text-muted">Full rest from high-impact physical loads today. Focus on myofascial foam rolling, passive stretching, and sleep.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI COACHING DIAGNOSTIC */}
          {activeProtocolTab === 'coaching' && (
            <div className="protocol-coaching-tab animate-fade-in space-y-4">
              {/* AI Sports-Science Coaching Assessment */}
              <div className="ai-coaching-card glass-card">
                <div className="ai-coaching-header">
                  <div className="flex items-center gap-3">
                    <div className="ai-badge-pulse">
                      <Sparkles size={18} className="text-cyan animate-pulse" />
                    </div>
                    <div>
                      <h3 className="ai-card-title">AI Sports-Science Routine Assessment</h3>
                      <p className="ai-card-subtitle">
                        Sports-science synthesis derived from ACWR Workload ({plan?.workload_summary?.acwr_score ?? 1.15}), {doesDeadlifts ? `Deadlift Strength (${strengthRatio}x BW)` : `Bodyweight Capacity (${pushupsReps} pushups)`}, and BMI ({calculatedBmi})
                      </p>
                    </div>
                  </div>
                  <div className="ai-status-tag">
                    <ShieldCheck size={14} className="text-emerald" />
                    <span>Verified Sports Science Foundation</span>
                  </div>
                </div>

                {/* Coach Summary Note */}
                {aiAssessment?.coach_summary && (
                  <div className="coach-summary-quote">
                    <div className="quote-icon-wrap">
                      <MessageSquare size={16} className="text-cyan" />
                    </div>
                    <div className="quote-body">
                      <span className="quote-label">Head Coach AI Directive:</span>
                      <p className="quote-text">{aiAssessment.coach_summary}</p>
                    </div>
                  </div>
                )}

                {/* Dual Column: Positives & Current Lacks */}
                <div className="coaching-columns-grid">
                  {/* Positives Card */}
                  <div className="coaching-col-card positives-card">
                    <div className="col-header flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <h4>Positives & Physical Baseline</h4>
                    </div>
                    <ul className="coaching-points-list">
                      {(aiAssessment?.positives || []).map((pos, idx) => (
                        <li key={idx} className="point-item positive">
                          <span className="point-bullet emerald">✓</span>
                          <span>{pos}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Current Lacks Card */}
                  <div className="coaching-col-card lacks-card">
                    <div className="col-header flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber" />
                      <h4>Current Lacks, Gaps & Risks</h4>
                    </div>
                    <ul className="coaching-points-list">
                      {(aiAssessment?.current_lacks || []).map((lack, idx) => (
                        <li key={idx} className="point-item lack">
                          <span className="point-bullet amber">!</span>
                          <span>{lack}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Goal Action Directives */}
                {(aiAssessment?.goal_action_directives || []).length > 0 && (
                  <div className="goal-directives-block">
                    <h4 className="directives-title flex items-center gap-2">
                      <Compass size={16} className="text-purple" />
                      <span>Action Plan: What You Should Do According to Your Goal ({goal.replace('_', ' ').toUpperCase()})</span>
                    </h4>
                    <div className="directives-list">
                      {aiAssessment.goal_action_directives.map((directive, idx) => (
                        <div key={idx} className="directive-row">
                          <span className="directive-step">{idx + 1}</span>
                          <p className="directive-text">{directive.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Mistakes & Gaps */}
              {plan?.current_mistakes_and_gaps && plan.current_mistakes_and_gaps.length > 0 && (
                <div className="mistakes-card glass-card">
                  <div className="mistakes-header-bar flex items-center justify-between pb-3 mb-4 border-b border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <div className="icon-wrap-amber">
                        <AlertTriangle className="text-amber animate-pulse" size={22} />
                      </div>
                      <div>
                        <h4 className="text-amber font-bold text-base tracking-wide flex items-center gap-2">
                          <span>⚠️ Current Training & Recovery Gaps</span>
                        </h4>
                        <p className="text-xs text-muted mt-0.5">
                          Specific assessment of your weekly bowling days ({weeklyBowlingDays}d), session spacing, and hydration.
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-amber text-xs font-mono font-bold">Analysis Feedback</span>
                  </div>

                  <div className="mistakes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plan.current_mistakes_and_gaps.map((item, mIdx) => (
                      <div key={mIdx} className="mistake-item-card">
                        <div>
                          <span className="mistake-category-badge">
                            {item.category}
                          </span>
                          <div className="mistake-detail-row">
                            <span className="mistake-label-red">
                              <XCircle size={13} className="shrink-0" /> Current Mistake:
                            </span>
                            <p className="mistake-text-primary">{item.mistake}</p>
                          </div>
                          <div className="mistake-detail-row">
                            <span className="mistake-label-amber">
                              <AlertOctagon size={13} className="shrink-0" /> Physiological Strain:
                            </span>
                            <p className="mistake-text-secondary">{item.why_harmful}</p>
                          </div>
                        </div>
                        <div className="mistake-fix-box">
                          <span className="fix-label">
                            <CheckCircle2 size={13} className="shrink-0" /> Actionable Fix:
                          </span>
                          <p>{item.correction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STAGED TARGETS & ROADMAP */}
          {activeProtocolTab === 'roadmap' && (
            <div className="protocol-roadmap-tab animate-fade-in space-y-4">
              {/* Staged Targets Roadmap */}
              <div className="staged-targets-card glass-card p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="ai-badge-pulse">
                      <Target size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-purple-300 font-bold text-base tracking-wide flex items-center gap-2">
                        <span>🎯 Staged Athletic Targets & Periodization Roadmap</span>
                      </h4>
                      <p className="text-xs text-muted mt-0.5">
                        Strategic 3-phase progression tailored to your BMI ({calculatedBmi}), {doesDeadlifts ? `Deadlift strength (${strengthRatio}x BW)` : `Bodyweight foundation (${pushupsReps} pushups)`}, and bowling volume.
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-purple font-mono text-xs">
                    Active: {plan?.staged_targets?.current_focus || 'Phase 1: Armor & Foundation'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Phase 1 */}
                  <div className="stage-phase-card active-phase">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-cyan uppercase tracking-wider">
                        {plan?.staged_targets?.phase_1?.title || 'Phase 1: Armor & Foundation'}
                      </span>
                      <span className="badge badge-cyan text-[10px] font-bold">WEEKS 1–4</span>
                    </div>
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                      {plan?.staged_targets?.phase_1?.summary || 'Build muscular armor and posterior chain capacity to absorb 8-9x BW delivery strides.'}
                    </p>
                    <div className="space-y-2">
                      {(plan?.staged_targets?.phase_1?.targets || [
                        calculatedBmi < 18.5 ? "First gain +3 to 4 kg lean muscular armor (Reach BMI > 19.5)" : "Solidify posterior chain foundation",
                        doesDeadlifts ? `Progress Trap Bar Deadlift to ${Math.round(weight * 1.5)}kg (1.5x BW)` : "Master partner/bed-anchored Nordic hamstring drops & 30+ pushups",
                        `Hydration Lock: Minimum 3.8L fluid intake daily with electrolytes`,
                        `Strict bowling cap at safe ceiling with 48h spacing`
                      ]).map((t, idx) => (
                        <div key={idx} className="milestone-item">
                          <div className="milestone-dot" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="stage-phase-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-emerald uppercase tracking-wider">
                        {plan?.staged_targets?.phase_2?.title || 'Phase 2: Lead-Leg Stiffness'}
                      </span>
                      <span className="badge badge-emerald text-[10px] font-bold">WEEKS 5–8</span>
                    </div>
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                      {plan?.staged_targets?.phase_2?.summary || 'Unilateral brake capacity on lead leg to convert horizontal speed into vertical pace.'}
                    </p>
                    <div className="space-y-2">
                      {(plan?.staged_targets?.phase_2?.targets || [
                        doesDeadlifts ? `Bulgarian Split Squats: 3x8 reps with ${Math.round(weight * 0.25)}kg DBs` : "Single-leg Bulgarian split squats (3x15 reps bodyweight)",
                        "Isometric Front-Knee Stiffness: 3x60s wall sits post-bowling",
                        "Core anti-rotation Paloff presses (or Ground Hollow Holds)",
                        "Spot bowling cadence drills for 165°-175° knee lock"
                      ]).map((t, idx) => (
                        <div key={idx} className="milestone-item">
                          <div className="milestone-dot" style={{ background: '#10b981' }} />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="stage-phase-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-purple uppercase tracking-wider">
                        {plan?.staged_targets?.phase_3?.title || 'Phase 3: Peak Velocity'}
                      </span>
                      <span className="badge badge-purple text-[10px] font-bold">WEEKS 9–12</span>
                    </div>
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                      {plan?.staged_targets?.phase_3?.summary || 'Translate strength gains into explosive bowling speed while keeping ACWR in sweet spot.'}
                    </p>
                    <div className="space-y-2">
                      {(plan?.staged_targets?.phase_3?.targets || [
                        "Overhead rotational medicine ball slams for kinetic whip",
                        `Full run-up velocity conversion: Target > ${maxSpeed} km/h`,
                        "ACWR regulation locked in sweet spot (0.90 - 1.25)",
                        "Maintain 48h spacing during high-overs tournament spells"
                      ]).map((t, idx) => (
                        <div key={idx} className="milestone-item">
                          <div className="milestone-dot" style={{ background: '#a855f7' }} />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strength Baseline & Muscular Armor */}
              <div className="analytics-card macros-analytics glass-card">
                <div className="analytics-card-header">
                  <div className="flex items-center gap-2">
                    <Gauge size={18} className="text-emerald" />
                    <h4>Strength Baseline & Muscular Armor ({weight} kg)</h4>
                  </div>
                  <span className={`zone-pill ${calculatedBmi < 18.5 ? 'red' : 'sweet-spot'}`}>
                    BMI: {calculatedBmi} {calculatedBmi < 18.5 ? '(Armor Deficit)' : '(Normal)'}
                  </span>
                </div>

                <div className="macro-spec-grid">
                  {doesDeadlifts ? (
                    <div className="macro-spec-item protein">
                      <div className="spec-top">
                        <span className="spec-name">Deadlift Capacity</span>
                        <strong className="spec-val text-cyan">{estimatedDeadlift1Rm} kg ({strengthRatio}x BW)</strong>
                      </div>
                      <div className="spec-bar-wrap">
                        <div className="spec-bar cyan" style={{ width: `${Math.min(100, (strengthRatio / 2.0) * 100)}%` }}></div>
                      </div>
                      <span className="spec-note">Target: 1.6x–2.0x bodyweight for rigid knee plant lock</span>
                    </div>
                  ) : (
                    <div className="macro-spec-item protein">
                      <div className="spec-top">
                        <span className="spec-name">Bodyweight Squats</span>
                        <strong className="spec-val text-cyan">{bodyweightSquatsReps} Reps</strong>
                      </div>
                      <div className="spec-bar-wrap">
                        <div className="spec-bar cyan" style={{ width: `${Math.min(100, (bodyweightSquatsReps / 45) * 100)}%` }}></div>
                      </div>
                      <span className="spec-note">Lower body endurance without gym weights</span>
                    </div>
                  )}

                  <div className="macro-spec-item carbs">
                    <div className="spec-top">
                      <span className="spec-name">Single-Leg Brake</span>
                      <strong className="spec-val text-amber">
                        {doesDeadlifts ? `${splitSquatKg} kg × ${splitSquatReps} r` : `${splitSquatReps} Reps / Leg`}
                      </strong>
                    </div>
                    <div className="spec-bar-wrap">
                      <div className="spec-bar amber" style={{ width: `${Math.min(100, (splitSquatReps / 12) * 100)}%` }}></div>
                    </div>
                    <span className="spec-note">Unilateral eccentric strength prevents knee brace buckling</span>
                  </div>

                  <div className="macro-spec-item fats">
                    <div className="spec-top">
                      <span className="spec-name">Anti-Extension Core</span>
                      <strong className="spec-val text-purple">{plankSeconds}s Hold</strong>
                    </div>
                    <div className="spec-bar-wrap">
                      <div className="spec-bar purple" style={{ width: `${Math.min(100, (plankSeconds / 90) * 100)}%` }}></div>
                    </div>
                    <span className="spec-note">Resists lumbar hyperextension shear at delivery stride</span>
                  </div>

                  <div className="macro-spec-item hydration">
                    <div className="spec-top">
                      <span className="spec-name">Hydration Status</span>
                      <strong className={`spec-val ${waterIntake < 3.5 ? 'text-rose-400' : 'text-emerald'}`}>
                        {waterIntake}L / {Math.max(3.8, (weight * 0.055)).toFixed(1)}L
                      </strong>
                    </div>
                    <div className="spec-bar-wrap">
                      <div className="spec-bar emerald" style={{ width: `${Math.min(100, (waterIntake / 4.5) * 100)}%` }}></div>
                    </div>
                    <span className="spec-note">{waterIntake < 3.5 ? '⚠️ High Cramp & Disc Risk' : 'Optimal Disc Cushioning'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORKLOAD & SAFETY AUDIT */}
          {activeProtocolTab === 'safety' && (
            <div className="protocol-safety-tab animate-fade-in space-y-4">
              {/* Overload Warnings (Red Theme Hazard) */}
              {plan?.overload_warnings && plan.overload_warnings.length > 0 && (
                <div className="overload-warning-banner glass-card p-5">
                  <div className="warning-banner-top flex items-center justify-between gap-4 pb-3 mb-4 border-b border-rose-500/30">
                    <div className="flex items-center gap-3">
                      <div className="warning-pulse-icon">
                        <ShieldAlert className="text-rose animate-pulse" size={24} />
                      </div>
                      <div>
                        <h4 className="text-rose font-bold text-base tracking-wide flex items-center gap-2">
                          <span>🚨 Workload Strain, Hydration & Biometric Alerts</span>
                          <span className="badge badge-rose text-xs font-mono font-bold">
                            {plan.overload_warnings.length} {plan.overload_warnings.length === 1 ? 'Alert' : 'Alerts'} Detected
                          </span>
                        </h4>
                        <p className="text-xs text-muted mt-0.5">
                          Follow immediate fixes to prevent lumbar stress fractures and joint fatigue.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="warning-cards-grid grid grid-cols-1 md:grid-cols-2 gap-3">
                    {plan.overload_warnings.map((warn, wIdx) => (
                      <div key={wIdx} className={`warning-item-card ${warn.severity}`}>
                        <div className="warning-item-header flex items-center justify-between mb-2">
                          <span className={`severity-tag ${warn.severity} uppercase text-[10px] font-bold px-2 py-0.5 rounded`}>
                            {warn.severity}
                          </span>
                          <span className="text-[11px] text-muted font-mono font-bold">{warn.type}</span>
                        </div>
                        <h5 className="warning-item-title mb-1.5">{warn.title}</h5>
                        <p className="warning-item-reason mb-2">
                          <strong className="text-primary">Reason:</strong> {warn.reason}
                        </p>
                        <div className="warning-risk-box mb-2">
                          <span className="risk-label">⚠️ Physiological Risk:</span>
                          <p>{warn.physiological_risk}</p>
                        </div>
                        <div className="warning-fix-box">
                          <span className="fix-label">🛠️ Actionable Correction:</span>
                          <p>{warn.actionable_fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workload & Strain (ACWR) */}
              <div className="analytics-card workload-analytics glass-card p-5">
                <div className="analytics-card-header">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-cyan" />
                    <h4>Current Workload & Strain (ACWR)</h4>
                  </div>
                  <span className="zone-pill sweet-spot">ACWR {plan?.workload_summary?.acwr_score ?? 1.15}</span>
                </div>

                <div className="acwr-meter-container">
                  <div className="acwr-scale-labels">
                    <span>&lt;0.8 Underload</span>
                    <span className="text-emerald font-bold">0.8 – 1.3 Sweet Spot</span>
                    <span>&gt;1.5 Danger</span>
                  </div>
                  <div className="acwr-gauge-bar">
                    <div className="gauge-zone underload" style={{ width: '25%' }}></div>
                    <div className="gauge-zone sweet-spot" style={{ width: '45%' }}></div>
                    <div className="gauge-zone warning" style={{ width: '15%' }}></div>
                    <div className="gauge-zone danger" style={{ width: '15%' }}></div>
                    <div 
                      className="gauge-pointer"
                      style={{ 
                        left: `${Math.min(95, Math.max(5, (((plan?.workload_summary?.acwr_score ?? 1.15) - 0.5) / 1.5) * 100))}%` 
                      }}
                      title={`Current ACWR: ${plan?.workload_summary?.acwr_score ?? 1.15}`}
                    ></div>
                  </div>
                  <p className="acwr-meter-caption">
                    Acute:Chronic Ratio is <strong>{plan?.workload_summary?.acwr_score ?? 1.15}</strong>. Safe conditioning for bowling stamina while protecting spinal health.
                  </p>
                </div>

                <div className="workload-stat-row">
                  <div className="workload-metric-box">
                    <span className="metric-label">Weekly Bowling Strain</span>
                    <div className="metric-num text-amber">{plan?.workload_summary?.total_weekly_overs ?? 16} Overs</div>
                    <div className="metric-progress-wrap">
                      <div 
                        className="metric-progress-fill amber" 
                        style={{ width: `${Math.min(100, ((plan?.workload_summary?.total_weekly_overs ?? 16) / (age < 19 ? 18 : 24)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="metric-sub">Recommended ceiling: {age < 19 ? 18 : 24} overs/wk ({age}y bowler)</span>
                  </div>

                  <div className="workload-metric-box">
                    <span className="metric-label">Weekly Schedule Density</span>
                    <div className="metric-num text-purple">{gymDays + groundDays} Sessions</div>
                    <div className="session-mini-tags">
                      <span className="tag-chip ground">{groundDays} Ground ({maxOversDays} Match)</span>
                      <span className="tag-chip gym">{gymDays === 0 ? 'Calisthenics Only' : `${gymDays} Gym Strength`}</span>
                    </div>
                    <span className="metric-sub">{sessionGap.split('•')[0].trim()}</span>
                  </div>
                </div>
              </div>

              {/* Fast Bowler Safety & Directives Accordion */}
              <div className="safety-directives-card glass-card">
                <button
                  type="button"
                  className="safety-toggle-header"
                  onClick={() => setShowDirectives(!showDirectives)}
                >
                  <div className="flex items-center gap-2 text-cyan font-bold text-sm">
                    <ShieldCheck size={18} />
                    <span>Fast Bowler Workload Directives & Lumbar Spine Protection Guidelines</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted font-semibold">
                    <span>{showDirectives ? 'Hide Guidelines' : 'View ECB Guidelines'}</span>
                    {showDirectives ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {showDirectives && (
                  <div className="safety-expanded-body animate-fade-in">
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                      Fast bowlers sustain ground reaction forces of up to <strong>8–9× bodyweight</strong> during front-foot contact. To prevent lumbar stress fractures (pars interarticularis) and patellar tendinopathy:
                    </p>
                    <div className="directives-bullets-grid grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="directive-item">
                        <span className="directive-number">01</span>
                        <div>
                          <strong className="text-xs text-primary block">48h Spacing for Max Overs</strong>
                          <span className="text-xs text-muted">Never bowl max-effort spell sessions on consecutive days to prevent bone edema.</span>
                        </div>
                      </div>
                      <div className="directive-item">
                        <span className="directive-number">02</span>
                        <div>
                          <strong className="text-xs text-primary block">Hydration & Electrolytes</strong>
                          <span className="text-xs text-muted">Drink 3.5L+ daily to maintain intervertebral disc height and prevent hamstring cramping.</span>
                        </div>
                      </div>
                      <div className="directive-item">
                        <span className="directive-number">03</span>
                        <div>
                          <strong className="text-xs text-primary block">Session Buffering</strong>
                          <span className="text-xs text-muted">Maintain at least 4–8 hours gap when scheduling ground and strength on the same date.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
