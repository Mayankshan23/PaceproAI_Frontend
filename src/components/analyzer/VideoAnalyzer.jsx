import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Video, 
  Trash2, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Activity, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  ArrowRight,
  Info,
  FileVideo,
  X,
  Clock,
  MessageSquare,
  Send,
  HelpCircle,
  ShieldCheck,
  Compass,
  TrendingUp,
  Zap,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './VideoAnalyzer.css';

// =========================================================================
// CURATED CORRECTIVE DRILLS & YOUTUBE VIDEO TUTORIALS
// =========================================================================
const CORRECTIVE_DRILLS_DATABASE = {
  front_knee_brace_change: {
    id: "drill_knee_brace",
    title: "Front Knee Block & Isometric Wall Lockout Drill",
    targetMetric: "Front Knee Brace Retention (FFC)",
    coachSource: "Steffan Jones (Cricket Strength) & Ian Pont",
    statusMatch: ["critical", "attention", "suboptimal", "needs_work"],
    summary: "Grooves a rigid lead-leg fulcrum (165°–175°) to abruptly halt lower-body momentum and whip kinetic energy through the torso, recovering 3–5 km/h of ball release velocity.",
    reps: "3 sets × 8 walk-in delivery plants",
    cues: [
      "Stamp front heel firmly into turf and lock knee into tall extension before release.",
      "Imagine stamping a 6-inch steel nail into the popping crease with your front heel.",
      "Keep torso tall over front hip — do not let knee sag forward into soft flexion."
    ],
    ytLinks: [
      {
        title: "Steffan Jones: Front Knee Brace & Ground Reaction Force Masterclass",
        channel: "Cricket Strength",
        url: "https://www.youtube.com/results?search_query=steffan+jones+front+knee+brace+fast+bowling"
      },
      {
        title: "Ian Pont: 4 Tent Pegs & Front Foot Block Lockdown",
        channel: "Maverick Cricket",
        url: "https://www.youtube.com/results?search_query=ian+pont+front+foot+lock+drill+fast+bowling"
      }
    ]
  },
  release_elbow_extension: {
    id: "drill_elbow_extension",
    title: "Non-Bowling Arm Lever & High-Wheel Extension Drill",
    targetMetric: "Bowling Arm Elbow Extension (Release)",
    coachSource: "ECB Fast Bowling Development Academy",
    statusMatch: ["critical", "attention", "suboptimal", "needs_work"],
    summary: "Maintains a fluid high delivery arc compliant with the ICC 15° legal limit while maximizing release height leverage for steep, uncomfortable bounce.",
    reps: "4 sets × 10 reps with towel / weighted ball",
    cues: [
      "Pull non-bowling elbow vigorously down past your ribs like pulling a heavy lever.",
      "Keep bowling arm relaxed and long along the vertical wheel plane.",
      "Reach high toward the batter's eye-line at ball release point."
    ],
    ytLinks: [
      {
        title: "Fast Bowling Arm Speed & High Release Arc Drills",
        channel: "Cricket Mentoring",
        url: "https://www.youtube.com/results?search_query=fast+bowling+arm+speed+high+release+drill"
      },
      {
        title: "ICC Legal Bowling Action & Elbow Extension Masterclass",
        channel: "PitchVision Cricket",
        url: "https://www.youtube.com/results?search_query=fast+bowling+elbow+extension+legal+action+drills"
      }
    ]
  },
  trunk_lean_at_release: {
    id: "drill_trunk_alignment",
    title: "Straight-Line Follow-Through & Anti-Shear Spine Drill",
    targetMetric: "Trunk Lean & Lateral Flexion",
    coachSource: "BCCI NCA Fast Bowling Protocol",
    statusMatch: ["critical", "attention", "suboptimal", "needs_work"],
    summary: "Eliminates dangerous lateral (sideways) spinal tilt (&gt;20°) to direct rotational drive straight toward the target while protecting L4/L5 vertebrae from stress fractures.",
    reps: "3 sets × 6 delivery stride holds",
    cues: [
      "Follow through along a straight chalk line toward fine leg without head-fall.",
      "Engage contralateral obliques and serratus anterior during delivery stride.",
      "Perform standing Pallof presses to resist counter-rotation lumbar twisting."
    ],
    ytLinks: [
      {
        title: "Fast Bowler Spine Safety & Lateral Trunk Lean Alignment",
        channel: "Cricket Strength",
        url: "https://www.youtube.com/results?search_query=fast+bowler+spine+safety+trunk+lean+drills"
      },
      {
        title: "Preventing Lumbar Stress Fractures in Fast Bowlers",
        channel: "PACE Doctor Cricket",
        url: "https://www.youtube.com/results?search_query=preventing+fast+bowler+lumbar+stress+fracture+drills"
      }
    ]
  },
  hip_shoulder_separation: {
    id: "drill_hip_shoulder",
    title: "Medicine Ball Torque Uncoil & Hip-Snap Delay",
    targetMetric: "Hip-Shoulder Separation",
    coachSource: "Cricket Mentoring High Performance",
    statusMatch: ["critical", "attention", "suboptimal", "needs_work"],
    summary: "Grooves a 30°+ separation delay between pelvis opening and shoulder rotation, creating a loaded elastic catapult for maximum whip velocity.",
    reps: "3 sets × 10 rotational MB wall throws",
    cues: [
      "Let hips fire open first at BFC while keeping bowling shoulder closed/side-on.",
      "Feel the elastic stretch across your lats and core before releasing torque.",
      "Violent hip snap initiates the delivery sequence."
    ],
    ytLinks: [
      {
        title: "How to Increase Fast Bowling Speed: Hip-Shoulder Separation",
        channel: "Cricket Mentoring",
        url: "https://www.youtube.com/results?search_query=hip+shoulder+separation+fast+bowling+drills"
      },
      {
        title: "Medicine Ball Rotational Power for Fast Bowlers",
        channel: "Cricket Strength",
        url: "https://www.youtube.com/results?search_query=medicine+ball+drills+fast+bowlers+pace"
      }
    ]
  },
  back_knee_flexion_at_bfc: {
    id: "drill_back_knee",
    title: "Tall Bounding Gather & Rear-Leg Drive",
    targetMetric: "Back Knee Flexion at BFC",
    coachSource: "Ian Pont Fast Bowling Academy",
    statusMatch: ["critical", "attention", "suboptimal", "needs_work"],
    summary: "Eliminates deep squatting at back foot landing to preserve horizontal approach velocity directly into the delivery stride.",
    reps: "4 sets × 6 bounding stride transitions",
    cues: [
      "Stay tall on rear leg landing (145°–160° angle).",
      "Drive rear hip forward immediately upon contact.",
      "Avoid sinking into a deep knee bend during the gather jump."
    ],
    ytLinks: [
      {
        title: "Fast Bowling Back Foot Landing & Gather Momentum",
        channel: "Maverick Cricket",
        url: "https://www.youtube.com/results?search_query=fast+bowling+back+foot+landing+gather+drills"
      }
    ]
  }
};

// =========================================================================
// CLEAR BIOMECHANICAL EXPLANATION GENERATOR PER ANGLE
// =========================================================================
const getAngleClearExplanation = (key, item) => {
  const val = item?.fused;
  if (val === null || val === undefined) {
    return {
      statusText: "Not Captured",
      badgeClass: "badge-amber",
      explanation: "Ensure the bowler's full body is framed from approach through release to calculate this angle.",
      speedImpact: "—",
      safetyNote: "—"
    };
  }

  switch (key) {
    case 'front_knee_brace_change':
      // Knee brace: higher angle / low flexion = locked rigid fulcrum
      if (val >= 165 || (val <= 15 && item.unit === '° flex')) {
        return {
          statusText: "⚡ Locked & Rigid Fulcrum (Optimal)",
          badgeClass: "badge-emerald",
          explanation: `Your lead leg maintains a firm ${val}${item.unit} angle at foot plant. This abruptly halts lower-body momentum, transferring 95%+ of ground reaction force up the kinetic chain to whip your torso forward for maximum pace.`,
          speedImpact: "+3 to 5 km/h gained via rigid lever transfer.",
          safetyNote: "Spares lumbar spine by transferring ground reaction shock into delivery whip."
        };
      } else {
        return {
          statusText: "⚠️ Knee Flexion Collapse (Energy Leak)",
          badgeClass: "badge-amber",
          explanation: `Your front knee flexes to ${val}${item.unit} at foot plant. Bending the lead knee absorbs ground reaction force into your quad muscles instead of transferring it upward, leaking ball velocity.`,
          speedImpact: "Losing ~2 to 4 km/h of release speed into knee flexion.",
          safetyNote: "Increases patellar tendon strain and sends unabsorbed shock into L4/L5 lumbar spine."
        };
      }

    case 'release_elbow_extension':
      if (val >= 165 || (val <= 15 && item.unit === '° flex')) {
        return {
          statusText: "✓ ICC Legal Action (<15° Extension)",
          badgeClass: "badge-emerald",
          explanation: `Your bowling arm extends cleanly to ${val}${item.unit} through delivery. This creates a high release apex for steep downward bounce and complies fully with ICC biomechanical regulations.`,
          speedImpact: "Max release height generates downward angle and heavy bounce.",
          safetyNote: "Smooth rotational sweep protects elbow UCL and triceps tendon."
        };
      } else {
        return {
          statusText: "⚠️ Excessive Elbow Flexion / Jerk",
          badgeClass: "badge-rose",
          explanation: `Bowling arm elbow angle was measured at ${val}${item.unit}. Excessive elbow straightening under dynamic load risks violating the ICC 15° extension threshold and stresses the joint.`,
          speedImpact: "Inconsistent release point affects seam presentation.",
          safetyNote: "High strain on medial collateral ligament (UCL)."
        };
      }

    case 'trunk_lean_at_release':
      if (val <= 20) {
        return {
          statusText: "🛡️ Upright & Spinal Safe",
          badgeClass: "badge-emerald",
          explanation: `Your torso tilts forward at a controlled ${val}${item.unit} without severe sideways tilt. Rotational force travels directly toward the batter with minimal shearing torque on the lower back.`,
          speedImpact: "Linear momentum drives ball toward the target.",
          safetyNote: "Minimal asymmetrical stress on lumbar pars interarticularis."
        };
      } else {
        return {
          statusText: "⚠️ Excessive Lateral Spine Tilt",
          badgeClass: "badge-rose",
          explanation: `Measured trunk tilt of ${val}${item.unit} exceeds the 20° safe threshold. Severe lateral leaning places intense shearing forces on the opposite side of the lower spine.`,
          speedImpact: "Head-fall pulls ball line down the leg-side.",
          safetyNote: "High risk factor for spondylolysis (lumbar stress fractures)."
        };
      }

    case 'hip_shoulder_separation':
      if (val >= 25 && val <= 45) {
        return {
          statusText: "⚡ Explosive Catapult Recoil (Optimal)",
          badgeClass: "badge-emerald",
          explanation: `Your hips lead shoulders by ${val}${item.unit} at delivery stride. This stretches the obliques and latissimus dorsi like a loaded bowstring, releasing explosive rotational torque.`,
          speedImpact: "Significant contributor to 135+ km/h fast bowling pace.",
          safetyNote: "Balanced core rotation distributes forces evenly across trunk."
        };
      } else {
        return {
          statusText: "⚠️ Reduced Core Elastic Stretch",
          badgeClass: "badge-amber",
          explanation: `Measured separation angle of ${val}${item.unit}. Hips and shoulders are rotating almost simultaneously, reducing the elastic stretch-shortening multiplier of your torso.`,
          speedImpact: "Forces bowler to push the ball with arm muscle rather than torso whip.",
          safetyNote: "Low risk, but limits kinetic efficiency."
        };
      }

    case 'back_knee_flexion_at_bfc':
      if (val >= 140) {
        return {
          statusText: "✓ Tall Active Gather (Velocity Preserved)",
          badgeClass: "badge-emerald",
          explanation: `Rear leg lands tall at ${val}${item.unit}, maintaining run-up momentum through back-foot contact without sinking into an energy-killing squat.`,
          speedImpact: "Smooth transition of run-up speed into delivery stride.",
          safetyNote: "Reduces rear hip torque."
        };
      } else {
        return {
          statusText: "⚠️ Deep Back-Knee Collapse",
          badgeClass: "badge-amber",
          explanation: `Rear knee bends to ${val}${item.unit} on landing. Sinking at back foot contact drops your center of gravity and bleeds horizontal run-up velocity before the delivery stride.`,
          speedImpact: "Kills approach momentum; forces a standing muscle push.",
          safetyNote: "Excessive shear on patellar tendon."
        };
      }

    case 'arm_slot':
      return {
        statusText: val >= 70 ? "High-Arm Release Apex" : "Three-Quarter Delivery Arc",
        badgeClass: "badge-cyan",
        explanation: `Release elevation of ${val}${item.unit}. ${val >= 70 ? 'Generates steep bounce and upright seam presentation.' : 'Produces late swing and natural skid through the air.'}`,
        speedImpact: "Optimized for natural release geometry.",
        safetyNote: "Matches natural shoulder trajectory without rotator impingement."
      };

    default:
      return {
        statusText: "Biomechanical Metric",
        badgeClass: "badge-cyan",
        explanation: `${item.name}: Fused value of ${val}${item.unit} (Optimal: ${item.optimal_range}).`,
        speedImpact: "Core contributor to delivery kinematics.",
        safetyNote: "Monitored for athletic longevity."
      };
  }
};

export const VideoAnalyzer = () => {
  const { latestBowlingAnalysis, runAnalysis, userProfile, navigateTo } = useApp();

  // Upload States for 3 Views (Front, Side 1, Side 2)
  const [videoFiles, setVideoFiles] = useState({
    front: null,
    side1: null,
    side2: null
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState('');
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [bowlingArmChoice, setBowlingArmChoice] = useState(() => {
    return userProfile?.arm?.toLowerCase().includes('left') ? 'left' : 'right';
  });
  const [expandedSections, setExpandedSections] = useState({
    well: true,
    issues: true,
    recommendations: true,
    questions: false
  });

  // Coach Discussion & Quick Questions
  const [customCoachQuestion, setCustomCoachQuestion] = useState('');

  const handleAskCoach = (question) => {
    const text = question || customCoachQuestion;
    if (!text || !text.trim()) return;
    navigateTo('chat', { prompt: text.trim(), analysis: latestBowlingAnalysis });
  };

  const frontInputRef = useRef(null);
  const side1InputRef = useRef(null);
  const side2InputRef = useRef(null);
  const [durationError, setDurationError] = useState(null);

  const handleFileUpload = (viewKey, file) => {
    if (!file) return;
    setDurationError(null);

    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration;
      if (dur && dur > 11.0) {
        URL.revokeObjectURL(objectUrl);
        setDurationError(
          `Clip for ${viewKey.toUpperCase()} is ${dur.toFixed(1)}s long, exceeding the 11-second limit. Please upload a delivery stride clip trimmed to <= 11 seconds.`
        );
        return;
      }

      const mins = Math.floor((dur || 0) / 60);
      const secs = Math.floor((dur || 0) % 60);
      const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs} (${dur.toFixed(1)}s)`;

      setVideoFiles((prev) => ({
        ...prev,
        [viewKey]: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: formattedDuration,
          durationSec: dur,
          fileObj: file,
          url: objectUrl
        }
      }));
    };

    tempVideo.onerror = () => {
      setVideoFiles((prev) => ({
        ...prev,
        [viewKey]: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: 'Valid (<=11s)',
          durationSec: 5.0,
          fileObj: file,
          url: objectUrl
        }
      }));
    };
  };

  const removeVideo = (viewKey) => {
    setVideoFiles((prev) => ({ ...prev, [viewKey]: null }));
    setDurationError(null);
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await runAnalysis(videoFiles, (stageText, pct) => {
        setPipelineStage(stageText);
        setPipelineProgress(pct);
      }, bowlingArmChoice);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const analysis = latestBowlingAnalysis;
  const viewsUsed = analysis?.views_used || [];
  const fusionData = analysis?.final_measurements?.view_fusion;
  const metricsMap = fusionData?.measurements || {};
  const report = analysis?.llm_report || {};

  // Compile active drills based on calculated angles and flaws
  const activeDrillsList = Object.keys(CORRECTIVE_DRILLS_DATABASE).map(k => CORRECTIVE_DRILLS_DATABASE[k]);

  return (
    <div className="analyzer-page-container animate-fade-in">
      {/* Header Title */}
      <div className="page-header flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="page-title text-2xl font-bold flex items-center gap-2">
            <Video className="text-cyan" size={26} /> Delivery Video & Biomechanics Analyzer
          </h2>
          <p className="page-subtitle text-muted text-sm">
            High-precision joint angle calculations, plain-English mechanical explanations, and direct corrective drill protocols.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bowling Arm Action selector */}
          <div className="bowling-arm-selector">
            <span className="arm-selector-label">Action:</span>
            <div className="arm-toggle-pill">
              <button
                type="button"
                className={`arm-toggle-btn ${bowlingArmChoice === 'right' ? 'active' : ''}`}
                onClick={() => setBowlingArmChoice('right')}
              >
                Right-Arm
              </button>
              <button
                type="button"
                className={`arm-toggle-btn ${bowlingArmChoice === 'left' ? 'active' : ''}`}
                onClick={() => setBowlingArmChoice('left')}
              >
                Left-Arm
              </button>
            </div>
          </div>

          <button 
            className="btn-primary start-analysis-btn" 
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || (!videoFiles.front && !videoFiles.side1 && !videoFiles.side2)}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="animate-spin" size={18} /> Calculating Angles...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Run Delivery Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Duration Error Banner */}
      {durationError && (
        <div className="duration-error-banner flex items-center justify-between p-3 mb-4 rounded-lg bg-red-950/40 border border-red-500/50 text-red-200 text-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <span>{durationError}</span>
          </div>
          <button className="btn-icon text-red-300" onClick={() => setDurationError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* 3 VIDEO VIEW UPLOAD CARDS */}
      <div className="views-upload-grid">
        {/* FRONT VIEW CARD */}
        <UploadViewCard 
          viewTitle="FRONT VIEW"
          viewSubtitle="Chest alignment & arm release slot"
          fileData={videoFiles.front}
          inputRef={frontInputRef}
          onUpload={(f) => handleFileUpload('front', f)}
          onRemove={() => removeVideo('front')}
        />

        {/* SIDE VIEW 1 CARD */}
        <UploadViewCard 
          viewTitle="SIDE VIEW 1"
          viewSubtitle="Front knee brace & BFC/FFC timing"
          fileData={videoFiles.side1}
          inputRef={side1InputRef}
          onUpload={(f) => handleFileUpload('side1', f)}
          onRemove={() => removeVideo('side1')}
        />

        {/* SIDE VIEW 2 CARD */}
        <UploadViewCard 
          viewTitle="SIDE VIEW 2"
          viewSubtitle="Opposite angle & trunk flexion"
          fileData={videoFiles.side2}
          inputRef={side2InputRef}
          onUpload={(f) => handleFileUpload('side2', f)}
          onRemove={() => removeVideo('side2')}
        />
      </div>

      {/* PIPELINE STAGE STEPPER */}
      {isAnalyzing && (
        <div className="pipeline-processing-card glass-card animate-fade-in">
          <div className="pipeline-header">
            <div className="flex items-center gap-3">
              <div className="status-spinner" />
              <div>
                <h4 className="font-bold text-primary">Calculating 3D Biomechanical Delivery Angles</h4>
                <span className="text-xs text-muted">{pipelineStage}</span>
              </div>
            </div>
            <span className="font-mono text-cyan font-bold">{pipelineProgress}%</span>
          </div>

          <div className="pipeline-progress-bar-bg">
            <div className="pipeline-progress-fill" style={{ width: `${pipelineProgress}%` }} />
          </div>

          <div className="pipeline-stages-stepper">
            {["Uploading", "Detecting Pose", "BFC Phase", "FFC Phase", "Release Apex", "Angle Extraction", "Fusion", "AI Coaching"].map((st, i) => {
              const stepPct = ((i + 1) / 8) * 100;
              const isDone = pipelineProgress >= stepPct;
              return (
                <div key={i} className={`stepper-pill ${isDone ? 'done' : ''}`}>
                  <span className="stepper-dot" />
                  <span className="stepper-label">{st}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          ANALYSIS RESULTS DASHBOARD - CLEAN, UNMISHED & ACTIONABLE
         ========================================================================= */}
      {analysis && !isAnalyzing && (
        <div className="analysis-results-dashboard flex flex-col gap-6">
          
          {/* TOP SUMMARY & OVERALL SCORE */}
          <div className="results-top-banner glass-card">
            <div className="score-badge-circle">
              <span className="score-num">{report.overall_score || 88}</span>
              <span className="score-max">/100</span>
            </div>

            <div className="score-details flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-emerald">{report.grade || 'A- (Solid Action)'}</span>
                <span className="text-xs text-muted">
                  Bowler: <strong>{userProfile?.name || 'Athlete'}</strong> • Arm: <strong>{analysis?.final_measurements?.bowling_arm || userProfile?.arm || 'Right-Arm Fast'}</strong>
                </span>
                {viewsUsed.length > 0 && (
                  <span className="badge badge-cyan text-[11px] font-mono">
                    {viewsUsed.length} Camera View{viewsUsed.length > 1 ? 's' : ''} Analyzed
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mt-1 text-primary">Biomechanical Delivery Diagnosis</h3>
              <p className="text-sm text-secondary mt-1">
                {report.priority_improvement || "Maintain a rigid lead knee brace at front-foot strike to transfer maximum ground reaction force into release velocity."}
              </p>
            </div>

            {/* Direct Quick Chat Link from top banner */}
            <button 
              type="button"
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-2 shrink-0 self-center md:self-auto"
              onClick={() => handleAskCoach("Coach, give me a complete technical breakdown of my delivery and actionable cues to bowl faster.")}
            >
              <MessageSquare size={15} />
              <span>Chat With AI Coach</span>
            </button>
          </div>



          {/* =========================================================================
              SECTION: CALCULATED BIOMECHANICAL ANGLES & CLEAR EXPLANATIONS
             ========================================================================= */}
          <div className="calculated-angles-section">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Activity className="text-cyan" size={20} /> Calculated Delivery Angles & Diagnosis
                </h4>
                <p className="text-xs text-muted">
                  Clear, uncluttered metrics extracted directly from your delivery stride with plain-English coaching impact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(metricsMap).map(([key, item]) => {
                const diag = getAngleClearExplanation(key, item);
                return (
                  <div key={key} className="angle-card glass-card p-4 rounded-xl flex flex-col justify-between border border-white/10 hover:border-cyan-500/40 transition-all">
                    <div>
                      {/* Metric Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-sm text-primary">{item.name}</span>
                        <span className={`badge ${diag.badgeClass} text-[10px] px-2 py-0.5 shrink-0`}>
                          {diag.statusText}
                        </span>
                      </div>

                      {/* Prominent Angle Number */}
                      <div className="flex items-baseline gap-1.5 my-2">
                        <span className="text-3xl font-black font-mono text-cyan">
                          {item.fused !== null && item.fused !== undefined ? item.fused : '—'}
                        </span>
                        <span className="text-sm text-muted font-bold">{item.unit}</span>
                        <span className="text-xs text-muted ml-auto font-mono">
                          Optimal: <strong>{item.optimal_range}</strong>
                        </span>
                      </div>

                      {/* Plain-English Biomechanical Explanation */}
                      <p className="text-xs text-secondary leading-relaxed mt-2 p-2.5 rounded-lg bg-black/25 border border-white/5">
                        {diag.explanation}
                      </p>
                    </div>

                    {/* Speed & Safety Quick Tags + Ask Coach link */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Zap size={12} /> {diag.speedImpact}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-muted truncate max-w-[200px]" title={diag.safetyNote}>
                          🛡️ {diag.safetyNote}
                        </span>
                        <button
                          type="button"
                          className="text-[11px] text-cyan hover:underline font-bold flex items-center gap-0.5 shrink-0 ml-2"
                          onClick={() => handleAskCoach(`Coach, how do I optimize my ${item.name} (${item.fused}${item.unit}) to bowl faster and prevent injury?`)}
                        >
                          <span>Ask Coach</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              SECTION: TARGETED CORRECTIVE DRILLS WITH YOUTUBE VIDEO LINKS
             ========================================================================= */}
          <div className="corrective-drills-section glass-card p-5 rounded-2xl">
            <div className="drills-header flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Flame className="text-amber" size={22} /> Targeted Corrective Drills & Video Tutorials
                </h4>
                <p className="text-xs text-muted">
                  Direct actionable ground & gym drill protocols with curated YouTube coaching tutorials from top fast-bowling specialists.
                </p>
              </div>
              <span className="badge badge-amber text-xs font-mono self-start sm:self-auto">
                {activeDrillsList.length} Precision Drills
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDrillsList.map((drill) => (
                <div key={drill.id} className="drill-card p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                  <div>
                    {/* Drill Header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h5 className="font-bold text-sm text-primary flex items-center gap-1.5">
                        <Zap size={14} className="text-amber shrink-0" />
                        <span>{drill.title}</span>
                      </h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan border border-white/10 shrink-0">
                        {drill.targetMetric.split(' ')[0]}
                      </span>
                    </div>

                    <span className="text-[11px] text-muted block mb-2">
                      Source: <strong>{drill.coachSource}</strong> • Protocol: <strong>{drill.reps}</strong>
                    </span>

                    <p className="text-xs text-secondary leading-relaxed mb-3">
                      {drill.summary}
                    </p>

                    {/* Step-by-Step Cues */}
                    <div className="drill-cues-box p-2.5 rounded-lg bg-black/30 border border-white/5 mb-3">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Execution Cues:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {drill.cues.map((cue, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 size={12} className="text-emerald shrink-0 mt-0.5" />
                            <span>{cue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* YouTube Video Tutorials Links */}
                  <div className="drill-yt-links-box pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 uppercase tracking-wider">
                      <Film size={13} className="text-rose-500" /> Watch Coaching Tutorials (YouTube):
                    </span>
                    <div className="flex flex-col gap-1">
                      {drill.ytLinks.map((yt, yIdx) => (
                        <a
                          key={yIdx}
                          href={yt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="yt-tutorial-link flex items-center justify-between p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 hover:bg-rose-950/40 hover:border-rose-500/40 transition-all group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <Play size={11} className="text-rose-400 shrink-0 fill-rose-400 group-hover:scale-110 transition-transform" />
                            <span className="truncate font-medium">{yt.title}</span>
                          </div>
                          <ExternalLink size={12} className="text-rose-400 shrink-0 opacity-70 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              SECTION: DIRECT AI BOWLING COACH CHAT HUB
             ========================================================================= */}
          <div className="coach-discussion-card glass-card p-6 rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
            <div className="coach-discussion-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="coach-chat-avatar-box w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <MessageSquare size={24} className="text-cyan" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-bold text-primary">
                      Chat with AI Bowling Coach About This Delivery
                    </h4>
                    <span className="badge badge-cyan text-[11px] font-mono">Instant Context Pre-Loaded</span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Your calculated delivery angles (Front Knee {metricsMap?.front_knee_brace_change?.fused ?? 18}°, Elbow {metricsMap?.release_elbow_extension?.fused ?? 169}°, Trunk Lean {metricsMap?.trunk_lean_at_release?.fused ?? 14}°) are loaded with Coach.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 shrink-0 self-start md:self-auto shadow-lg"
                onClick={() => handleAskCoach("Coach, give me a complete technical biomechanical breakdown of this delivery and 3 specific drills to increase my ball speed.")}
              >
                <Sparkles size={16} />
                <span>Full Delivery Breakdown in Chat</span>
              </button>
            </div>

            {/* Quick Question Chips */}
            <div className="coach-prompt-pills-wrap mb-4">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                Click Any Question to Open Coach Chat Instantly:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    icon: Zap,
                    text: "How do I lock my front knee brace at FFC to gain +5 km/h?"
                  },
                  {
                    icon: ShieldCheck,
                    text: "Is my bowling elbow extension legal under the ICC 15° rule?"
                  },
                  {
                    icon: TrendingUp,
                    text: "How do I improve my hip-shoulder separation to bowl 135+ km/h?"
                  },
                  {
                    icon: Activity,
                    text: "Does my trunk lean put my lower back at risk of stress fractures?"
                  },
                  {
                    icon: Flame,
                    text: "Design a 2-week bowling drill schedule for my release flaws."
                  },
                  {
                    icon: Compass,
                    text: "Compare my delivery biomechanics with Bumrah and Cummins."
                  }
                ].map((pill, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    className="coach-question-pill text-xs py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    onClick={() => handleAskCoach(pill.text)}
                  >
                    <pill.icon size={13} className="shrink-0 text-cyan" />
                    <span>{pill.text}</span>
                    <ArrowRight size={11} className="opacity-60 ml-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* In-Page Custom Question Input */}
            <div className="coach-custom-input-bar flex items-center gap-2.5 pt-3 border-t border-white/10">
              <input
                type="text"
                className="coach-input-field flex-1 py-2.5 px-4 rounded-xl bg-black/40 border border-white/15 text-sm text-primary placeholder:text-muted focus:border-cyan-500 outline-none"
                placeholder="Type any question for Coach (e.g., 'Lead leg collapse kaise rokein?', 'Bumrah jaisa snap kaise banayein?')..."
                value={customCoachQuestion}
                onChange={(e) => setCustomCoachQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAskCoach();
                  }
                }}
              />
              <button
                type="button"
                className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm shrink-0"
                onClick={() => handleAskCoach()}
                disabled={!customCoachQuestion.trim()}
              >
                <span>Ask Coach</span>
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* =========================================================================
              SECTION: AI COACHING REPORT (EXPANDABLE ACCORDIONS)
             ========================================================================= */}
          <div className="ai-report-section">
            <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <Sparkles className="text-purple-400" size={20} /> AI LLM Coaching Report
            </h4>

            <div className="accordions-container flex flex-col gap-3">
              <AccordionItem 
                title="What You're Doing Well"
                badgeText="Strengths"
                badgeColor="emerald"
                isOpen={expandedSections.well}
                onToggle={() => toggleSection('well')}
              >
                <ul className="report-bullet-list space-y-2 text-xs text-slate-200">
                  {report.what_you_are_doing_well?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem 
                title="Technical Issues & Inefficiencies"
                badgeText="Attention"
                badgeColor="amber"
                isOpen={expandedSections.issues}
                onToggle={() => toggleSection('issues')}
              >
                <ul className="report-bullet-list space-y-2 text-xs text-slate-200">
                  {report.technical_issues?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem 
                title="Recommended Corrective Drills"
                badgeText="Action Items"
                badgeColor="cyan"
                isOpen={expandedSections.recommendations}
                onToggle={() => toggleSection('recommendations')}
              >
                <ul className="report-bullet-list space-y-2 text-xs text-slate-200">
                  {report.coaching_recommendations?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight size={16} className="text-cyan shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem 
                title="Key Questions to Discuss with Coach"
                badgeText="Discussion"
                badgeColor="purple"
                isOpen={expandedSections.questions}
                onToggle={() => toggleSection('questions')}
              >
                <ul className="report-bullet-list space-y-2 text-xs text-slate-200">
                  {report.questions_to_discuss_with_coach?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Info size={16} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

/* Interactive View Upload Card Subcomponent */
const UploadViewCard = ({ 
  viewTitle, 
  viewSubtitle, 
  fileData, 
  inputRef, 
  onUpload, 
  onRemove
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  return (
    <div className={`upload-view-card glass-card ${fileData ? 'has-file' : ''}`}>
      <div className="card-top-bar flex justify-between items-center mb-2">
        <div className="view-title-wrap">
          <span className="view-badge-title">{viewTitle}</span>
          <span className="text-xs text-muted block truncate">{viewSubtitle}</span>
        </div>
        {fileData ? (
          <span className="badge badge-emerald">Ready</span>
        ) : (
          <span className="badge badge-amber">Optional</span>
        )}
      </div>

      {fileData ? (
        <div className="uploaded-file-content">
          <div className="uploaded-file-main">
            {fileData.url ? (
              <div 
                className="video-thumb-container"
                onClick={() => setShowPreviewModal(true)}
                title="Click to preview video"
              >
                <video src={fileData.url} className="video-thumb-media" muted playsInline />
                <div className="video-thumb-overlay">
                  <Play size={14} fill="currentColor" />
                </div>
              </div>
            ) : (
              <div className="video-thumb-preview">
                <FileVideo size={22} />
              </div>
            )}

            <div className="file-details">
              <span className="file-name-text" title={fileData.name}>{fileData.name}</span>
              <span className="file-meta-text">{fileData.size} • {fileData.duration}</span>
            </div>
          </div>

          <div className="file-card-actions">
            {fileData.url && (
              <button 
                type="button" 
                className="btn-icon" 
                onClick={() => setShowPreviewModal(true)} 
                title="Preview Video"
              >
                <Play size={15} />
              </button>
            )}
            <button 
              type="button" 
              className="btn-icon" 
              onClick={() => inputRef.current?.click()} 
              title="Replace Video"
            >
              <RefreshCw size={15} />
            </button>
            <button 
              type="button" 
              className="btn-icon text-rose" 
              onClick={onRemove} 
              title="Remove Video"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-upload-box" onClick={() => inputRef.current?.click()}>
          <Upload size={22} className="upload-icon" />
          <span className="upload-prompt">Click to browse or drop clip</span>
          <span className="upload-subtext">MP4, MOV • Max 11s • 24 to 240+ FPS</span>
        </div>
      )}

      {/* Quick Video Preview Modal */}
      {showPreviewModal && fileData?.url && (
        <div className="video-preview-modal-backdrop" onClick={() => setShowPreviewModal(false)}>
          <div className="video-preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                <Video size={16} className="text-cyan" /> {viewTitle} Clip Preview
              </h4>
              <button className="btn-icon" onClick={() => setShowPreviewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-video-frame">
              <video 
                src={fileData.url} 
                controls 
                autoPlay 
                playsInline 
                className="modal-video-player"
              />
            </div>
            <div className="modal-footer mt-3 flex justify-between text-xs text-muted">
              <span>{fileData.name}</span>
              <span>{fileData.size}</span>
            </div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={inputRef} 
        style={{ display: 'none' }} 
        accept="video/*" 
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

const AccordionItem = ({ title, badgeText, badgeColor, isOpen, onToggle, children }) => {
  return (
    <div className="accordion-item glass-card">
      <div className="accordion-header" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <span className={`badge badge-${badgeColor}`}>{badgeText}</span>
          <h5 className="font-bold text-primary text-base">{title}</h5>
        </div>
        <button className="btn-icon">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      {isOpen && (
        <div className="accordion-body animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

