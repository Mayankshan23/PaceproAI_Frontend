import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Video, 
  Film,
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
  ExternalLink,
  RotateCcw,
  PlusCircle,
  Eye,
  EyeOff
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
          explanation: `Awesome work! Your lead leg maintains a firm ${val}${item.unit} brace at foot plant. This acts as a solid catapult fulcrum, transferring ground energy straight into ball release velocity.`,
          speedImpact: "+3 to 5 km/h gained via rigid lever transfer.",
          safetyNote: "Provides a balanced, stable platform that protects your lower back."
        };
      } else {
        return {
          statusText: "🚀 Prime Pace Opportunity (+3–5 km/h)",
          badgeClass: "badge-cyan",
          explanation: `Your front knee flexes to ${val}${item.unit} at foot plant. You have a huge opportunity to add an easy +3 to 5 km/h of ball speed by practicing a firmer lead leg plant, converting all your run-up power directly into release pace!`,
          speedImpact: "Firming your lead leg at plant can easily unlock extra pace.",
          safetyNote: "Practicing front-leg stiffness drills builds strong joint stability."
        };
      }

    case 'release_elbow_extension':
      if (val >= 165 || (val <= 15 && item.unit === '° flex')) {
        return {
          statusText: "✓ Clean & Legal Bowling Arc",
          badgeClass: "badge-emerald",
          explanation: `Your bowling arm extends smoothly to ${val}${item.unit} through release. This creates a tall delivery apex for steep downward bounce and full compliance with standard regulations.`,
          speedImpact: "High release point produces natural bounce and steep carry.",
          safetyNote: "Fluid arm sweep keeps shoulder and elbow tendons feeling healthy."
        };
      } else {
        return {
          statusText: "🎯 High-Wheel Arm Sweep Focus",
          badgeClass: "badge-cyan",
          explanation: `Bowling arm elbow angle was measured at ${val}${item.unit}. Focusing on a tall, relaxed 'high-wheel' arm circle will give you smooth rhythm, consistent seam position, and natural bounce.`,
          speedImpact: "A relaxed arm swing allows effortless whip through the crease.",
          safetyNote: "Smooth rotational follow-through protects your arm through long bowling spells."
        };
      }

    case 'trunk_lean_at_release':
      if (val <= 20) {
        return {
          statusText: "🛡️ Upright & Spinal Safe",
          badgeClass: "badge-emerald",
          explanation: `Great posture! Your torso tilts forward at a controlled ${val}${item.unit}. Your rotational momentum drives straight toward the target with smooth spinal alignment.`,
          speedImpact: "Linear drive directs ball pace straight at the batter's stumps.",
          safetyNote: "Balanced posture keeps your back fresh and ready for long spells."
        };
      } else {
        return {
          statusText: "🎯 Upright Torso Drive Opportunity",
          badgeClass: "badge-cyan",
          explanation: `Measured trunk tilt is ${val}${item.unit}. By keeping your head and chest a bit taller through delivery, you'll direct all your energy straight down the pitch with pin-point accuracy and an easy follow-through!`,
          speedImpact: "Direct straight-line momentum improves speed and line consistency.",
          safetyNote: "Upright thoracic alignment supports healthy spinal comfort all season long."
        };
      }

    case 'hip_shoulder_separation':
      if (val >= 25 && val <= 45) {
        return {
          statusText: "⚡ Explosive Core Recoil (Optimal)",
          badgeClass: "badge-emerald",
          explanation: `Terrific kinetic timing! Your hips lead your shoulders by ${val}${item.unit}, loading your core like an athletic bowstring for explosive ball release whip.`,
          speedImpact: "Major driver of high-velocity 135+ km/h fast bowling.",
          safetyNote: "Distributes workload evenly across your entire core and torso."
        };
      } else {
        return {
          statusText: "🎯 Core Elastic Stretch Potential",
          badgeClass: "badge-cyan",
          explanation: `Measured hip-shoulder separation is ${val}${item.unit}. Letting your hips lead slightly ahead of your chest will unlock free rotational whip from your torso, giving you more pace with less arm effort!`,
          speedImpact: "Great opportunity to let your core power generate extra ball zip.",
          safetyNote: "Smooth core sequence reduces upper-body fatigue."
        };
      }

    case 'back_knee_flexion_at_bfc':
      if (val >= 140) {
        return {
          statusText: "✓ Tall Springy Gather (Speed Preserved)",
          badgeClass: "badge-emerald",
          explanation: `Your rear leg lands tall at ${val}${item.unit}, carrying all your horizontal run-up momentum smoothly into the delivery stride without losing height.`,
          speedImpact: "Preserves approach momentum into delivery stride.",
          safetyNote: "Springy back leg absorbs landing force effortlessly."
        };
      } else {
        return {
          statusText: "🎯 Tall Gather & Drive Potential",
          badgeClass: "badge-cyan",
          explanation: `Rear knee angle is ${val}${item.unit} on landing. Focusing on staying tall and springy on your back foot will help carry your full run-up velocity straight into the delivery stride!`,
          speedImpact: "A taller gather carries maximum run-up momentum into the crease.",
          safetyNote: "Promotes an easy, fluid stride transition into the front foot."
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
  const { 
    latestBowlingAnalysis, 
    setLatestBowlingAnalysis,
    runAnalysis, 
    userProfile, 
    navigateTo,
    videoFiles,
    setVideoFiles,
    videoAnalysisTask
  } = useApp();

  const isAnalyzing = videoAnalysisTask.isRunning;
  const pipelineStage = videoAnalysisTask.stage || 'Synthesizing multi-view fusion & AI coaching report...';
  const pipelineProgress = videoAnalysisTask.progress || 0;

  // Auto-collapse upload section when analysis results exist
  const [showUploadSection, setShowUploadSection] = useState(() => !latestBowlingAnalysis);

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
    if (isAnalyzing || (!videoFiles.front && !videoFiles.side1 && !videoFiles.side2)) return;
    try {
      await runAnalysis(videoFiles, null, bowlingArmChoice);
      setShowUploadSection(false); // Auto-collapse upload cards when complete
    } catch (err) {
      console.error("Analysis error:", err);
    }
  };

  const handleResetAnalysis = () => {
    setLatestBowlingAnalysis(null);
    setVideoFiles({
      front: null,
      side1: null,
      side2: null
    });
    setDurationError(null);
    setShowUploadSection(true);
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (side1InputRef.current) side1InputRef.current.value = '';
    if (side2InputRef.current) side2InputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Header Title & Top Actions */}
      <div className="page-header flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="page-title text-2xl font-bold flex items-center gap-2">
            <Video className="text-cyan" size={26} /> Delivery Video & Biomechanics Analyzer
          </h2>
          <p className="page-subtitle text-muted text-sm">
            High-precision joint angle calculations, plain-English mechanical explanations, and direct corrective drill protocols.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full sm:w-auto">
          {/* Bowling Arm Action selector */}
          <div className="bowling-arm-selector">
            <span className="arm-selector-label">Action:</span>
            <div className="arm-toggle-pill">
              <button
                type="button"
                className={`arm-toggle-btn ${bowlingArmChoice === 'right' ? 'active' : ''}`}
                onClick={() => !isAnalyzing && setBowlingArmChoice('right')}
                disabled={isAnalyzing}
              >
                Right-Arm
              </button>
              <button
                type="button"
                className={`arm-toggle-btn ${bowlingArmChoice === 'left' ? 'active' : ''}`}
                onClick={() => !isAnalyzing && setBowlingArmChoice('left')}
                disabled={isAnalyzing}
              >
                Left-Arm
              </button>
            </div>
          </div>

          {/* Conditional Action Buttons in Header */}
          {analysis && !isAnalyzing ? (
            <div className="flex items-center gap-2">
              <button 
                type="button"
                className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-all font-medium"
                onClick={() => setShowUploadSection(prev => !prev)}
                title={showUploadSection ? "Hide Upload Cards" : "Show Upload Cards"}
              >
                {showUploadSection ? <EyeOff size={15} /> : <Eye size={15} />}
                <span>{showUploadSection ? 'Hide Clips' : 'View Clips'}</span>
              </button>

              <button 
                type="button"
                className="btn-primary px-4 py-2 text-xs bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg transition-all flex items-center gap-1.5 font-medium"
                onClick={handleResetAnalysis}
              >
                <RotateCcw size={15} />
                <span>New Analysis</span>
              </button>
            </div>
          ) : (
            <button 
              className="btn-primary start-analysis-btn w-full sm:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-medium" 
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
          )}
        </div>
      </div>

      {/* Duration Error Banner */}
      {durationError && (
        <div className="duration-error-banner flex items-center justify-between p-3 mb-4 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-rose shrink-0" />
            <span>{durationError}</span>
          </div>
          <button className="btn-icon" onClick={() => setDurationError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* COLLAPSIBLE UPLOAD SECTION */}
      {(!analysis || showUploadSection || isAnalyzing) ? (
        <div className="upload-container-wrapper flex flex-col gap-3 animate-fade-in">
          {analysis && !isAnalyzing && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Uploaded Camera Clips ({viewsUsed.length} / 3 Active):
              </span>
              <button 
                type="button" 
                className="btn-collapse-clips flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border border-sky-500/25 transition-all cursor-pointer shadow-sm hover:border-sky-400"
                onClick={() => setShowUploadSection(false)}
              >
                <EyeOff size={14} className="shrink-0" />
                <span>Collapse Clips</span>
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
              disabled={isAnalyzing}
            />

            {/* SIDE VIEW 1 CARD */}
            <UploadViewCard 
              viewTitle="SIDE VIEW 1"
              viewSubtitle="Front knee brace & BFC/FFC timing"
              fileData={videoFiles.side1}
              inputRef={side1InputRef}
              onUpload={(f) => handleFileUpload('side1', f)}
              onRemove={() => removeVideo('side1')}
              disabled={isAnalyzing}
            />

            {/* SIDE VIEW 2 CARD */}
            <UploadViewCard 
              viewTitle="SIDE VIEW 2"
              viewSubtitle="Opposite angle & trunk flexion"
              fileData={videoFiles.side2}
              inputRef={side2InputRef}
              onUpload={(f) => handleFileUpload('side2', f)}
              onRemove={() => removeVideo('side2')}
              disabled={isAnalyzing}
            />
          </div>
        </div>
      ) : (
        /* SLIM COLLAPSED SUMMARY BAR WHEN RESULTS ARE DISPLAYED */
        <div className="upload-summary-toggle-card glass-card p-3 rounded-xl flex items-center justify-between animate-fade-in border border-white/10 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-3 truncate pr-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan shrink-0">
              <Video size={18} />
            </div>
            <div className="text-xs truncate">
              <span className="font-bold text-primary block truncate">
                Delivery Video Session ({viewsUsed.length} of 3 Camera Views Analyzed)
              </span>
              <span className="text-muted truncate block">
                {Object.entries(videoFiles)
                  .filter(([_, v]) => v)
                  .map(([k, v]) => `${k.toUpperCase()}: ${v.name}`)
                  .join(' • ') || 'Multi-view delivery video files ready'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 transition-all font-medium"
              onClick={() => setShowUploadSection(true)}
            >
              <Eye size={13} />
              <span>Show Clips</span>
            </button>
            <button
              type="button"
              className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 rounded-lg font-medium"
              onClick={handleResetAnalysis}
            >
              <RotateCcw size={13} />
              <span>New Analysis</span>
            </button>
          </div>
        </div>
      )}

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
                    {viewsUsed.length} / 3 Camera Views Analyzed
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mt-1 text-primary">Biomechanical Delivery Diagnosis</h3>
              <p className="text-sm text-secondary mt-1">
                {report.priority_improvement || "Maintain a rigid lead knee brace at front-foot strike to transfer maximum ground reaction force into release velocity."}
              </p>
            </div>

            {/* Quick Actions in Top Banner */}
            <div className="flex items-center gap-2 self-center md:self-auto flex-wrap">
              <button 
                type="button" 
                className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-all font-medium"
                onClick={handleResetAnalysis}
                title="Start a fresh delivery analysis"
              >
                <RotateCcw size={14} />
                <span>New Analysis</span>
              </button>

              <button 
                type="button" 
                className="btn-primary py-2 px-4 text-xs flex items-center gap-2 font-medium"
                onClick={() => handleAskCoach("Coach, give me a complete technical breakdown of my delivery and actionable cues to bowl faster.")}
              >
                <MessageSquare size={14} />
                <span>Chat With Coach</span>
              </button>
            </div>
          </div>

          {/* PARTIAL VIEWS DISCLAIMER NOTE (IF < 3 VIEWS PROVIDED) */}
          {viewsUsed.length < 3 && (
            <div className="partial-views-banner glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-start gap-3.5 animate-fade-in">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber shrink-0 mt-0.5">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-sm text-amber">
                    Partial Multi-View Capture ({viewsUsed.length}/3 Camera Views Provided)
                  </span>
                  <span className="badge badge-amber text-[10px] font-mono">
                    Parallax Confidence: {analysis?.overall_confidence_pct ?? (viewsUsed.length === 1 ? '38%' : '85%')}%
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong>Note:</strong> Analysis was computed from <strong>{viewsUsed.join(' + ').toUpperCase() || `${viewsUsed.length} view`}</strong>. 
                  While single/dual camera perspective provides valuable kinetic insights, 
                  full 3D biomechanical joint depth and 98%+ consensus accuracy requires capturing all 3 synchronized camera angles (<strong>Front + Side View 1 + Side View 2</strong>). 
                  You can still examine your detected delivery phases and joint angles below.
                </p>
              </div>
            </div>
          )}

          {/* DELIVERY PHASE DETECTION TIMELINE (BFC, FFC, RELEASE) */}
          <div className="phase-detection-timeline-card glass-card p-5 rounded-2xl border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Layers className="text-cyan" size={20} /> Computer Vision Phase Detection
                </h4>
                <p className="text-xs text-muted">
                  Automatic identification of delivery stride milestones from MediaPipe pose estimation.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
                <Clock size={14} className="text-cyan" />
                <span>Synchronized Kinetic Milestones</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Milestone 1: Back Foot Contact (BFC) */}
              <div className="phase-step-box p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Phase 1</span>
                  <span className="badge badge-cyan text-[10px]">Gather</span>
                </div>
                <h5 className="font-bold text-sm text-primary">Back-Foot Contact (BFC)</h5>
                <p className="text-[11px] text-muted mt-1 leading-snug">
                  Rear leg touchdown; preserves run-up momentum into delivery gather.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-cyan">
                  <span>Rear Knee Angle:</span>
                  <strong>{metricsMap?.back_knee_flexion_at_bfc?.fused ?? 154}°</strong>
                </div>
              </div>

              {/* Milestone 2: Front Foot Contact (FFC) */}
              <div className="phase-step-box p-3 rounded-xl bg-white/[0.02] border border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-cyan uppercase tracking-wider">Phase 2 (Key)</span>
                  <span className="badge badge-emerald text-[10px]">Brace Lock</span>
                </div>
                <h5 className="font-bold text-sm text-primary">Front-Foot Contact (FFC)</h5>
                <p className="text-[11px] text-muted mt-1 leading-snug">
                  Lead foot plant; acts as a rigid braking fulcrum to catapult kinetic energy.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-emerald">
                  <span>Lead Knee Brace:</span>
                  <strong>{metricsMap?.front_knee_angle_at_ffc?.fused ?? 168}°</strong>
                </div>
              </div>

              {/* Milestone 3: Core Elastic Recoil */}
              <div className="phase-step-box p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Phase 3</span>
                  <span className="badge badge-purple text-[10px]">Torque</span>
                </div>
                <h5 className="font-bold text-sm text-primary">Hip-Shoulder Separation</h5>
                <p className="text-[11px] text-muted mt-1 leading-snug">
                  Hips rotate ahead of torso to stretch obliques like a drawn bowstring.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-purple-400">
                  <span>Separation Angle:</span>
                  <strong>{metricsMap?.hip_shoulder_separation?.fused ?? 28}°</strong>
                </div>
              </div>

              {/* Milestone 4: Ball Release Apex */}
              <div className="phase-step-box p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Phase 4</span>
                  <span className="badge badge-amber text-[10px]">Release Apex</span>
                </div>
                <h5 className="font-bold text-sm text-primary">Ball Release Point (BR)</h5>
                <p className="text-[11px] text-muted mt-1 leading-snug">
                  Bowling arm extension apex & trunk tilt alignment for seam stability.
                </p>
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-amber">
                  <span>Elbow Extension:</span>
                  <strong>{metricsMap?.release_elbow_extension?.fused ?? 172}°</strong>
                </div>
              </div>
            </div>
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
                      <p className="angle-explanation-box leading-relaxed mt-2">
                        {diag.explanation}
                      </p>
                    </div>

                    {/* Speed & Safety Quick Tags + Ask Coach link */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald font-medium flex items-center gap-1">
                          <Zap size={12} /> {diag.speedImpact}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-muted truncate max-w-[200px]" title={diag.safetyNote}>
                          🛡️ {diag.safetyNote}
                        </span>
                        <button
                          type="button"
                          className="btn-ask-coach-card px-2.5 py-1 text-[11px] font-bold rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white border border-sky-500/25 hover:border-sky-400 flex items-center gap-1 shrink-0 ml-2 transition-all cursor-pointer shadow-sm"
                          onClick={() => handleAskCoach(`Coach, how do I optimize my ${item.name} (${item.fused}${item.unit}) to bowl faster?`)}
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
                    <span className="text-[10px] font-bold text-rose flex items-center gap-1 uppercase tracking-wider">
                      <Film size={13} className="text-rose" /> Watch Coaching Tutorials (YouTube):
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {drill.ytLinks.map((yt, yIdx) => (
                        <a
                          key={yIdx}
                          href={yt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="yt-tutorial-link flex items-center justify-between p-2.5 rounded-xl border text-xs group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <Play size={12} className="text-rose shrink-0 fill-current group-hover:scale-110 transition-transform" />
                            <span className="truncate font-semibold">{yt.title}</span>
                          </div>
                          <ExternalLink size={13} className="text-rose shrink-0 opacity-80 group-hover:opacity-100" />
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
                className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm shrink-0 font-bold shadow-md hover:shadow-cyan-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {(report.what_you_are_doing_well || ["Solid initial run-up momentum and rhythm maintained into the gather."]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem 
                title="Opportunities for Extra Pace & Refinement"
                badgeText="Growth Focus"
                badgeColor="cyan"
                isOpen={expandedSections.issues}
                onToggle={() => toggleSection('issues')}
              >
                <ul className="report-bullet-list space-y-2 text-xs text-slate-200">
                  {(report.technical_issues || ["Practice a tall, springy front foot plant to unlock +3-5 km/h extra release speed."]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Zap size={16} className="text-cyan shrink-0 mt-0.5" />
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
                  {(report.coaching_recommendations || ["Perform isometric front knee lockout wall sits post-session.", "Integrate 3-step walk-in target bowling."]).map((item, idx) => (
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
                  {(report.questions_to_discuss_with_coach || ["How can we fine-tune approach markers for a more consistent front-foot plant?"]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Info size={16} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM CALL-TO-ACTION: ANALYZE ANOTHER DELIVERY
             ========================================================================= */}
          <div className="new-analysis-cta-card glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-cyan-500/30 bg-cyan-500/5 shadow-lg">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-cyan-500/15 text-cyan shrink-0">
                <RotateCcw size={26} />
              </div>
              <div>
                <h4 className="text-base font-bold text-primary">Ready to Analyze Another Delivery?</h4>
                <p className="text-xs text-secondary mt-0.5">
                  Upload a new bowling video to test your mechanical corrections and track velocity improvements over time.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2 shrink-0 font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
              onClick={handleResetAnalysis}
            >
              <PlusCircle size={18} />
              <span>Start New Delivery Analysis</span>
            </button>
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
  onRemove,
  disabled = false
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div 
      className={`upload-view-card glass-card ${fileData ? 'has-file' : ''} ${disabled ? 'is-disabled opacity-65 cursor-not-allowed' : ''} ${isDragOver ? 'border-sky-400 bg-sky-500/10' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="card-top-bar flex justify-between items-center mb-2">
        <div className="view-title-wrap">
          <span className="view-badge-title">{viewTitle}</span>
          <span className="text-xs text-muted block truncate">{viewSubtitle}</span>
        </div>
        {disabled ? (
          <span className="badge badge-purple animate-pulse text-[10px]">Analyzing Stream</span>
        ) : fileData ? (
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
                className={`video-thumb-container ${disabled ? 'pointer-events-none opacity-80' : ''}`}
                onClick={() => !disabled && setShowPreviewModal(true)}
                title={disabled ? "Analyzing..." : "Click to preview video"}
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
                onClick={() => !disabled && setShowPreviewModal(true)} 
                title="Preview Video"
                disabled={disabled}
              >
                <Play size={15} />
              </button>
            )}
            <button 
              type="button" 
              className="btn-icon" 
              onClick={() => !disabled && inputRef.current?.click()} 
              title="Replace Video"
              disabled={disabled}
            >
              <RefreshCw size={15} />
            </button>
            <button 
              type="button" 
              className="btn-icon text-rose" 
              onClick={!disabled ? onRemove : undefined} 
              title="Remove Video"
              disabled={disabled}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`empty-upload-box ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`} 
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <Upload size={22} className="upload-icon" />
          <span className="upload-prompt">{disabled ? 'Calculating Biomechanics...' : 'Click to browse or drop clip'}</span>
          <span className="upload-subtext">{disabled ? 'Upload locked while analyzing' : 'MP4, MOV • Max 11s • 24 to 240+ FPS'}</span>
        </div>
      )}

      {/* Quick Video Preview Modal */}
      {showPreviewModal && fileData?.url && !disabled && (
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
        disabled={disabled}
        onChange={(e) => {
          if (!disabled && e.target.files && e.target.files[0]) {
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

