import React, { useState } from 'react';
import { 
  Dumbbell, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Award, 
  Zap, 
  Clock, 
  Check, 
  RefreshCw, 
  ChevronRight, 
  MessageSquare, 
  Bookmark, 
  HeartPulse, 
  Flame 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { assessStrengthApi } from '../../services/api';
import './StrengthCheck.css';

export const StrengthCheck = () => {
  const { 
    userProfile, 
    updateAthleteProfile, 
    navigateTo, 
    addChatMessage, 
    strengthTask, 
    runStrengthAssessment 
  } = useApp();

  // Test setup parameters
  const [track, setTrack] = useState(userProfile?.strengthTrack || 'gym_lifting');
  const [weightKg, setWeightKg] = useState(userProfile?.weight ?? 68);
  const [bowlingArm, setBowlingArm] = useState(userProfile?.arm || 'Right-Arm Fast');
  const [bowlingSpeed, setBowlingSpeed] = useState(132);

  // Test 1: Lead-Leg Knee Brace
  const [splitSquatKg, setSplitSquatKg] = useState(userProfile?.splitSquatKg ?? 14);
  const [splitSquatReps, setSplitSquatReps] = useState(userProfile?.splitSquatReps ?? 8);
  const [wallSitSec, setWallSitSec] = useState(40);

  // Test 2: Posterior Chain
  const [doesDeadlifts, setDoesDeadlifts] = useState(userProfile?.doesDeadlifts ?? (track === 'gym_lifting'));
  const [deadliftKg, setDeadliftKg] = useState(userProfile?.deadliftKg ?? 85);
  const [deadliftReps, setDeadliftReps] = useState(userProfile?.deadliftReps ?? 5);
  const [jumpSquatsReps, setJumpSquatsReps] = useState(userProfile?.bodyweightSquatsReps ?? 25);

  // Test 3: Core Anti-Rotation & Lumbar Shield
  const [plankSec, setPlankSec] = useState(userProfile?.plankSeconds ?? 60);
  const [sidePlankSec, setSidePlankSec] = useState(40);

  // Test 4: Scapular Deceleration & Shoulder Pull
  const [pullups, setPullups] = useState(userProfile?.pullupsCount ?? 6);
  const [pushups, setPushups] = useState(userProfile?.pushupsReps ?? 25);

  // Test 5: Ankle & Achilles
  const [calfRaises, setCalfRaises] = useState(18);

  // Active Niggles / Discomfort
  const [niggle, setNiggle] = useState('none');

  // UI state
  const isAnalyzing = strengthTask.isRunning;
  const results = strengthTask.results;
  const [isSaved, setIsSaved] = useState(false);

  const handleRunAssessment = async (e) => {
    if (e) e.preventDefault();
    setIsSaved(false);

    const payload = {
      user_id: userProfile?.id || 'default_athlete',
      weight_kg: Number(weightKg),
      strength_track: track,
      bowling_arm: bowlingArm,
      bowling_speed_kph: Number(bowlingSpeed),
      split_squat_kg: Number(splitSquatKg),
      split_squat_reps: Number(splitSquatReps),
      wall_sit_seconds: Number(wallSitSec),
      does_deadlifts: doesDeadlifts,
      deadlift_kg: Number(deadliftKg),
      deadlift_reps: Number(deadliftReps),
      bodyweight_squats_reps: Number(jumpSquatsReps),
      plank_seconds: Number(plankSec),
      side_plank_seconds: Number(sidePlankSec),
      pullups_count: Number(pullups),
      pushups_reps: Number(pushups),
      calf_raises_reps: Number(calfRaises),
      reported_niggle: niggle
    };

    try {
      await runStrengthAssessment(payload);

      if (updateAthleteProfile) {
        updateAthleteProfile({
          strengthTrack: track,
          splitSquatKg,
          splitSquatReps,
          doesDeadlifts,
          deadliftKg,
          deadliftReps,
          plankSeconds: plankSec,
          pullupsCount: pullups,
          pushupsReps: pushups
        });
      }
    } catch (err) {
      console.error("Failed to run strength assessment:", err);
    }
  };

  const handleSaveToHistory = async () => {
    if (!results) return;
    const historyItem = {
      type: 'strength_test',
      title: `Strength Check: ${results.primary_weakness?.name}`,
      subtitle: `Score ${results.kinetic_chain_score}/100 • Target: ${results.primary_weakness?.affected_muscles?.split(',')[0]}`,
      status: results.overall_rating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      detail: results
    };
    if (addHistoryItem) {
      await addHistoryItem(historyItem);
    }
    setIsSaved(true);
  };

  const handleConsultCoach = () => {
    if (!results) return;
    const weaknessName = results.primary_weakness?.name || 'Kinetic Chain';
    const muscles = results.primary_weakness?.affected_muscles || '';
    if (addChatMessage) {
      addChatMessage({
        role: 'user',
        text: `Coach, my fast-bowler strength test diagnosed weakness in ${weaknessName} (${muscles}). How can I adjust my bowling run-up and delivery stride while performing this corrective protocol?`
      });
    }
    navigateTo('chat');
  };

  return (
    <div className="strength-check-container animate-fade-in">
      {/* Header */}
      <div className="strength-header glass-card">
        <div className="strength-badge-row">
          <span className="badge badge-cyan flex items-center gap-1.5">
            <HeartPulse size={13} className="text-cyan animate-pulse" /> Musculoskeletal Diagnostic Engine
          </span>
          <span className="badge badge-emerald flex items-center gap-1.5">
            <ShieldCheck size={13} /> 5-Pillar Fast Bowling Kinetic Chain
          </span>
        </div>
        <div className="strength-header-title-row">
          <div>
            <h2 className="strength-main-title">Fast Bowler Strength & Muscle Weakness Test</h2>
            <p className="strength-subtitle">
              Fast bowling puts 8–10x bodyweight braking forces on your front foot and up to 2500°/s rotational shear on your lumbar spine. 
              Complete this 5-pillar test to diagnose your weakest muscle links and generate a tailored corrective workout routine.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Gym vs Ground */}
      <div className="strength-track-selector glass-card p-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="text-xs font-semibold text-primary block">Select Your Assessment Testing Setup:</span>
            <span className="text-[11px] text-muted">Test benchmarks calibrate automatically for gym weights or bodyweight ground tests</span>
          </div>
          <div className="flex gap-2">
            <button 
              type="button" 
              className={`chip py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 ${track === 'gym_lifting' ? 'active' : ''}`}
              onClick={() => { setTrack('gym_lifting'); setDoesDeadlifts(true); }}
            >
              <Dumbbell size={14} className="text-cyan" /> Gym Weights Mode
            </button>
            <button 
              type="button" 
              className={`chip py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 ${track === 'calisthenics_ground' ? 'active' : ''}`}
              onClick={() => { setTrack('calisthenics_ground'); setDoesDeadlifts(false); }}
            >
              <Activity size={14} className="text-emerald" /> Ground & Bodyweight Mode
            </button>
          </div>
        </div>
      </div>

      {/* 5-PILLAR INPUT TEST FORM */}
      <form onSubmit={handleRunAssessment} className="strength-form-grid">
        {/* Test 1: Lead-Leg Knee Brace */}
        <div className="test-card glass-card">
          <div className="test-card-header">
            <div className="test-number">1</div>
            <div>
              <h3 className="test-title">Lead-Leg Knee Plant Rigidity</h3>
              <span className="test-target-muscle">Quads (VMO) & Patellar Tendon Deceleration</span>
            </div>
          </div>
          <p className="test-desc">
            Prevents knee flexion collapse (bending past 150°) at Front-Foot Contact (FFC).
          </p>
          {track === 'gym_lifting' ? (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="input-label-sm">DB Wt / Hand (kg):</label>
                <input 
                  type="number" 
                  value={splitSquatKg} 
                  onChange={(e) => setSplitSquatKg(e.target.value)} 
                  className="custom-input text-xs font-mono" 
                  min="0"
                />
              </div>
              <div>
                <label className="input-label-sm">Reps per Leg:</label>
                <input 
                  type="number" 
                  value={splitSquatReps} 
                  onChange={(e) => setSplitSquatReps(e.target.value)} 
                  className="custom-input text-xs font-mono" 
                  min="1"
                />
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <label className="input-label-sm">Single-Leg Wall Sit Hold (Seconds):</label>
              <input 
                type="number" 
                value={wallSitSec} 
                onChange={(e) => setWallSitSec(e.target.value)} 
                className="custom-input text-xs font-mono" 
                min="5"
              />
            </div>
          )}
        </div>

        {/* Test 2: Posterior Chain & Hip Drive */}
        <div className="test-card glass-card">
          <div className="test-card-header">
            <div className="test-number">2</div>
            <div>
              <h3 className="test-title">Posterior Chain & Crease Propulsion</h3>
              <span className="test-target-muscle">Gluteus Maximus & Hamstrings</span>
            </div>
          </div>
          <p className="test-desc">
            Supplies takeoff drive from run-up into crease and absorbs horizontal deceleration.
          </p>
          {track === 'gym_lifting' && doesDeadlifts ? (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="input-label-sm">Deadlift Weight (kg):</label>
                <input 
                  type="number" 
                  value={deadliftKg} 
                  onChange={(e) => setDeadliftKg(e.target.value)} 
                  className="custom-input text-xs font-mono" 
                  min="20"
                />
              </div>
              <div>
                <label className="input-label-sm">Completed Reps:</label>
                <input 
                  type="number" 
                  value={deadliftReps} 
                  onChange={(e) => setDeadliftReps(e.target.value)} 
                  className="custom-input text-xs font-mono" 
                  min="1"
                />
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <label className="input-label-sm">Max Bodyweight Jump Squats (Reps):</label>
              <input 
                type="number" 
                value={jumpSquatsReps} 
                onChange={(e) => setJumpSquatsReps(e.target.value)} 
                className="custom-input text-xs font-mono" 
                min="5"
              />
            </div>
          )}
        </div>

        {/* Test 3: Core Anti-Rotation & Spine Shield */}
        <div className="test-card glass-card">
          <div className="test-card-header">
            <div className="test-number">3</div>
            <div>
              <h3 className="test-title">Core Anti-Rotation & Lumbar Shield</h3>
              <span className="test-target-muscle">Transverse Abdominis & Obliques</span>
            </div>
          </div>
          <p className="test-desc">
            Protects L4/L5 lumbar vertebrae from counter-rotation shear and stress fractures.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="input-label-sm">Forearm Plank (Sec):</label>
              <input 
                type="number" 
                value={plankSec} 
                onChange={(e) => setPlankSec(e.target.value)} 
                className="custom-input text-xs font-mono" 
                min="10"
              />
            </div>
            <div>
              <label className="input-label-sm">Side Plank / Side (Sec):</label>
              <input 
                type="number" 
                value={sidePlankSec} 
                onChange={(e) => setSidePlankSec(e.target.value)} 
                className="custom-input text-xs font-mono" 
                min="5"
              />
            </div>
          </div>
        </div>

        {/* Test 4: Scapular Pull-Through & Shoulder Armor */}
        <div className="test-card glass-card">
          <div className="test-card-header">
            <div className="test-number">4</div>
            <div>
              <h3 className="test-title">Shoulder Pull & Scapular Deceleration</h3>
              <span className="test-target-muscle">Lats, Rotator Cuff, Posterior Deltoid</span>
            </div>
          </div>
          <p className="test-desc">
            Whips bowling arm through release window and decelerates 2000°/s arm swing safely.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="input-label-sm">Strict Pull-ups (Reps):</label>
              <input 
                type="number" 
                value={pullups} 
                onChange={(e) => setPullups(e.target.value)} 
                className="custom-input text-xs font-mono" 
                min="0"
              />
            </div>
            <div>
              <label className="input-label-sm">Max Push-ups (Reps):</label>
              <input 
                type="number" 
                value={pushups} 
                onChange={(e) => setPushups(e.target.value)} 
                className="custom-input text-xs font-mono" 
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Test 5: Ankle Stiffness & Achilles Shock Absorption */}
        <div className="test-card glass-card">
          <div className="test-card-header">
            <div className="test-number">5</div>
            <div>
              <h3 className="test-title">Ankle Spring & Achilles Stiffness</h3>
              <span className="test-target-muscle">Soleus, Achilles Tendon, Tibialis</span>
            </div>
          </div>
          <p className="test-desc">
            Cushions Back-Foot landing impact (4x BW) and averts shin splints and heel crashing.
          </p>
          <div className="mt-2">
            <label className="input-label-sm">Single-Leg Calf Raises (Continuous Reps):</label>
            <input 
              type="number" 
              value={calfRaises} 
              onChange={(e) => setCalfRaises(e.target.value)} 
              className="custom-input text-xs font-mono" 
              min="5"
            />
          </div>
        </div>

        {/* Current Joint Discomfort / Niggles */}
        <div className="test-card glass-card flex flex-col justify-between">
          <div>
            <div className="test-card-header">
              <div className="test-number alert">!</div>
              <div>
                <h3 className="test-title">Active Joint Niggles / Soreness</h3>
                <span className="test-target-muscle">Biomechanical Vulnerability Check</span>
              </div>
            </div>
            <p className="test-desc">
              Do you feel any soreness after bowling 6+ overs? Engine will apply immediate clinical protection.
            </p>
            <div className="mt-2">
              <select 
                value={niggle} 
                onChange={(e) => setNiggle(e.target.value)} 
                className="custom-input text-xs"
              >
                <option value="none">No Niggles (Fully Fit & Pain Free)</option>
                <option value="knee">Front Knee / Patellar Tendon Soreness</option>
                <option value="lumbar">Lower Back / Lumbar Stiffness Post-Spell</option>
                <option value="shin">Shin Splints / Tibia Soreness</option>
                <option value="shoulder">Shoulder / Rotator Cuff Pinching</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-color flex items-center justify-between gap-3">
            <span className="text-[11px] text-muted">Weight: {weightKg}kg • Arm: {bowlingArm}</span>
            <button 
              type="submit" 
              disabled={isAnalyzing}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
            >
              {isAnalyzing ? (
                <><RefreshCw size={14} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Zap size={14} /> Diagnose Muscle Weakness</>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* DIAGNOSTIC RESULTS SECTION */}
      {results && (
        <div className="strength-results-wrapper glass-card p-6 mt-6 animate-fade-in">
          {/* Top Rating Banner */}
          <div className="results-top-banner">
            <div className="flex items-center gap-3">
              <div className="score-badge-circle">
                <span className="score-num">{results.kinetic_chain_score}</span>
                <span className="score-label">/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${results.kinetic_chain_score >= 80 ? 'badge-emerald' : results.kinetic_chain_score >= 60 ? 'badge-cyan' : 'badge-amber'}`}>
                    {results.overall_rating}
                  </span>
                  <span className="text-xs text-muted">5-Pillar Kinetic Evaluation</span>
                </div>
                <h3 className="text-lg font-bold text-primary mt-1">Biomechanical Muscular Assessment</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={handleSaveToHistory}
                disabled={isSaved}
                className="btn-secondary text-xs"
              >
                {isSaved ? <><Check size={14} className="text-emerald" /> Saved to History</> : <><Bookmark size={14} /> Save to History</>}
              </button>
              <button 
                type="button" 
                onClick={handleConsultCoach}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <MessageSquare size={14} /> Discuss with AI Coach
              </button>
            </div>
          </div>

          {/* PRIMARY WEAKNESS ALERT BOX */}
          <div className="primary-weakness-banner mt-6">
            <div className="flex items-start gap-3">
              <div className="weakness-alert-icon">
                <ShieldAlert size={24} className="text-amber" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="weakness-tag">PRIMARY DIAGNOSED WEAK LINK</span>
                  <span className="text-xs font-mono text-amber font-semibold">
                    Strength Score: {results.primary_weakness.score}/100 ({results.primary_weakness.status})
                  </span>
                </div>
                <h4 className="text-base font-bold text-primary mt-1">
                  {results.primary_weakness.name}
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  <strong>Affected Muscles:</strong> {results.primary_weakness.affected_muscles}
                </p>
                <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                  <strong>Bowling Impact:</strong> {results.primary_weakness.bowling_impact}
                </p>
                {results.primary_weakness.clinical_notes && results.primary_weakness.clinical_notes.length > 0 && (
                  <div className="clinical-notes-box mt-2">
                    {results.primary_weakness.clinical_notes.map((note, idx) => (
                      <span key={idx} className="block text-[11px] text-amber-300">• {note}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5 MUSCLE CHAIN BREAKDOWN RADAR */}
          <div className="muscle-chains-grid mt-6">
            <h4 className="col-span-full text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              Kinetic Chain Muscle Integrity Breakdown:
            </h4>
            {results.all_muscle_chains.map((chain) => (
              <div key={chain.id} className={`chain-mini-card ${chain.id === results.primary_weakness.id ? 'weak-highlight' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-primary truncate max-w-[200px]" title={chain.name}>{chain.name}</span>
                  <span className={`text-xs font-mono font-bold ${chain.score >= 80 ? 'text-emerald' : chain.score >= 60 ? 'text-cyan' : 'text-amber'}`}>
                    {chain.score}/100
                  </span>
                </div>
                <div className="chain-progress-track">
                  <div 
                    className={`chain-progress-bar ${chain.score >= 80 ? 'emerald' : chain.score >= 60 ? 'cyan' : 'amber'}`}
                    style={{ width: `${Math.min(100, chain.score)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-[10px] text-muted">
                  <span>{chain.status}</span>
                  <span className="truncate max-w-[150px]">{chain.muscles.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* INJURY RISK ADVISORY */}
          {results.injury_risk_advisory && (
            <div className="injury-advisory-card mt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-rose" />
                <h4 className="text-sm font-bold text-primary">
                  Vulnerability Risk: {results.injury_risk_advisory.vulnerability}
                </h4>
                <span className="badge badge-rose text-[10px]">{results.injury_risk_advisory.risk_level}</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {results.injury_risk_advisory.biomechanical_cause}
              </p>
              <div className="mt-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-primary leading-relaxed">
                <strong className="text-cyan">Corrective Bowling Technique Cue:</strong> {results.injury_risk_advisory.priority_cue}
              </div>
            </div>
          )}

          {/* TARGETED CORRECTIVE WORKOUT ROUTINE */}
          {results.corrective_workout_routine && (
            <div className="corrective-routine-section mt-6">
              <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
                <div>
                  <span className="badge badge-cyan text-[10px] uppercase">Prescribed Corrective Protocol</span>
                  <h4 className="text-base font-bold text-primary mt-1">
                    {results.corrective_workout_routine.protocol_name}
                  </h4>
                  <span className="text-xs text-muted">
                    Frequency: {results.corrective_workout_routine.frequency} • Focus: {results.corrective_workout_routine.target_focus}
                  </span>
                </div>
              </div>

              <div className="phases-container flex flex-col gap-4">
                {results.corrective_workout_routine.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="phase-card">
                    <div className="phase-card-header">
                      <span className="font-bold text-xs text-cyan">{phase.phase_name}</span>
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <Clock size={12} /> {phase.duration}
                      </span>
                    </div>
                    <div className="exercises-grid mt-3">
                      {phase.exercises.map((ex, eIdx) => (
                        <div key={eIdx} className="exercise-detail-box">
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="font-bold text-sm text-primary">{ex.name}</h5>
                            <span className="badge badge-cyan text-[10px] shrink-0">{ex.sets} × {ex.reps}</span>
                          </div>
                          <p className="text-xs text-muted mt-1">
                            <strong>Technique Cue:</strong> {ex.coaching_cue}
                          </p>
                          <div className="mt-2 text-[11px] text-emerald font-semibold flex items-center gap-1">
                            <Sparkles size={12} /> {ex.benefit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
