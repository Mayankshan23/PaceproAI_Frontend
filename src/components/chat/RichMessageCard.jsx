import React, { useState } from 'react';
import { 
  Activity, 
  Dumbbell, 
  Flame, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Bookmark,
  Check,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './RichMessageCard.css';

export const RichMessageCard = ({ card }) => {
  const { navigateTo, saveWorkplan, saveDietPlan } = useApp();
  const [isSaved, setIsSaved] = useState(false);

  if (!card) return null;

  const handleSave = () => {
    if (card.type === 'workout_summary' || card.type === 'workplan_card') {
      saveWorkplan(card.data);
    } else if (card.type === 'diet_summary' || card.type === 'diet_card') {
      saveDietPlan(card.data);
    }
    setIsSaved(true);
  };

  /* 1. BOWLING BIOMECHANICS SUMMARY CARD */
  if (card.type === 'bowling_summary') {
    const data = card.data;
    const fusion = data?.final_measurements?.view_fusion?.measurements || {};
    
    return (
      <div className="rich-card bowling-summary-card glass-card animate-fade-in">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-badge cyan">
              <Activity size={18} />
            </div>
            <div>
              <h4 className="card-title">Bowling Biomechanics Analysis</h4>
              <span className="card-subtitle">
                Views Fused: {data?.views_used?.join(', ')?.toUpperCase() || 'FRONT, SIDE 1'}
              </span>
            </div>
          </div>
          <span className="badge badge-emerald">
            <CheckCircle2 size={12} /> {data?.llm_report?.grade || "A- (Elite Candidate)"}
          </span>
        </div>

        <div className="metrics-grid-mini">
          <div className="metric-pill">
            <span className="metric-label">Front Knee Brace</span>
            <span className="metric-value">{fusion.front_knee_brace_change?.fused ?? '—'}°</span>
          </div>
          <div className="metric-pill">
            <span className="metric-label">Arm Slot</span>
            <span className="metric-value">{fusion.arm_slot?.fused || '71.5'}°</span>
          </div>
          <div className="metric-pill">
            <span className="metric-label">Trunk Lean</span>
            <span className="metric-value">{fusion.trunk_lean_ffc?.fused || '9.0'}°</span>
          </div>
        </div>

        <p className="card-brief-text">
          "{data?.llm_report?.priority_improvement || 'Maintain front knee stiffness during foot contact.'}"
        </p>

        <div className="card-actions-row flex gap-2 mt-3">
          <button 
            className="btn-primary card-action-btn flex-1"
            onClick={() => navigateTo('analyzer', { analysis: data })}
          >
            View Detailed Analysis <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* 2. RICH WORKPLAN CARD */
  if (card.type === 'workout_summary' || card.type === 'workplan_card') {
    const workplan = card.data || {};
    const days = workplan.weeklySchedule || [
      { day: 'MONDAY', title: 'Speed + Acceleration', details: ['20m sprints × 6', 'Mobility', 'Bowling drills'] },
      { day: 'TUESDAY', title: 'Strength + Stability', details: ['Lower body heavy', 'Core stability'] },
      { day: 'WEDNESDAY', title: 'Recovery + Mobility', details: ['Thoracic foam rolling', 'Low-intensity walk'] },
      { day: 'THURSDAY', title: 'Explosive Power', details: ['Single-leg bounding', 'Overhead MB slams'] },
      { day: 'FRIDAY', title: 'Target Bowling & Spells', details: ['6 overs match speed', 'Video capture'] }
    ];

    return (
      <div className="rich-card workplan-full-card glass-card animate-fade-in">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-badge amber">
              <Dumbbell size={18} />
            </div>
            <div>
              <h4 className="card-title">WEEKLY WORKPLAN</h4>
              <span className="card-subtitle">{workplan.focus || 'Fast Bowler Performance Focus'}</span>
            </div>
          </div>
          <span className="badge badge-amber">
            <Sparkles size={12} /> AI Custom Plan
          </span>
        </div>

        <div className="weekly-schedule-container my-3">
          {days.map((d, i) => (
            <div key={i} className="day-schedule-row">
              <div className="day-name-col">
                <span className="day-badge-text">{d.day}</span>
              </div>
              <div className="day-content-col">
                <strong className="day-title-text">{d.title}</strong>
                <div className="day-bullets">
                  {d.details.map((item, idx) => (
                    <span key={idx} className="bullet-chip">• {item}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions-row flex gap-2 mt-4">
          <button 
            className="btn-primary flex-1"
            onClick={() => navigateTo('workout')}
          >
            View Full Plan <ArrowRight size={16} />
          </button>
          <button 
            className={`btn-secondary ${isSaved ? 'text-emerald border-emerald' : ''}`}
            onClick={handleSave}
            disabled={isSaved}
          >
            {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
            <span>{isSaved ? 'Saved' : 'Save Plan'}</span>
          </button>
        </div>
      </div>
    );
  }

  /* 3. PERFORMANCE DIET CARD */
  if (card.type === 'diet_summary' || card.type === 'diet_card') {
    const diet = card.data || {};
    const targets = diet.daily_targets || { calories: 2800, protein_g: 130, carbs_g: 350, fats_g: 80 };
    const meals = diet.meals || [
      { type: 'Breakfast', title: 'Oats + milk + banana + 4 eggs' },
      { type: 'Lunch', title: 'Rice + dal + chicken/paneer + salad' },
      { type: 'Pre-Workout', title: 'Toast + honey + almonds' },
      { type: 'Post-Workout', title: 'Whey protein + banana' },
      { type: 'Dinner', title: 'Roti + fish/dal curry + turmeric milk' }
    ];

    return (
      <div className="rich-card performance-diet-card glass-card animate-fade-in">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-badge emerald">
              <Flame size={18} />
            </div>
            <div>
              <h4 className="card-title">PERFORMANCE DIET</h4>
              <span className="card-subtitle">Precision Athlete Fueling</span>
            </div>
          </div>
          <span className="badge badge-cyan">₹{diet?.estimated_budget?.weekly_inr || '3,150'}/wk</span>
        </div>

        {/* Macros Summary Grid */}
        <div className="macros-grid-4 my-3">
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-cyan">{targets.calories}</span>
            <span className="macro-lbl">kcal / day</span>
          </div>
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-emerald">{targets.protein_g}g</span>
            <span className="macro-lbl">Protein</span>
          </div>
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-amber">{targets.carbs_g}g</span>
            <span className="macro-lbl">Carbs</span>
          </div>
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-purple">{targets.fats_g}g</span>
            <span className="macro-lbl">Fats</span>
          </div>
        </div>

        {/* Mini Meal Breakdown List */}
        <div className="mini-meals-list my-3">
          {meals.slice(0, 5).map((m, idx) => (
            <div key={idx} className="mini-meal-row">
              <span className="meal-tag-pill">{m.type}</span>
              <span className="meal-title-text">{m.title || m.items?.join(', ')}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="card-actions-row flex gap-2 mt-4">
          <button 
            className="btn-primary flex-1"
            onClick={() => navigateTo('diet')}
          >
            Open Full Diet <ArrowRight size={16} />
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigateTo('diet')}
          >
            Adjust Plan
          </button>
          <button 
            className={`btn-secondary ${isSaved ? 'text-emerald border-emerald' : ''}`}
            onClick={handleSave}
            disabled={isSaved}
          >
            {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    );
  }

  /* 4. UNIFIED WORKLOAD & DIET PROTOCOL CARD */
  if (card.type === 'combined_protocol_card') {
    const data = card.data || {};
    const wl = data.workload_summary || {};
    const nut = data.nutrition_summary || {};
    const isStudent = data.athlete_status === 'student';

    return (
      <div className="rich-card combined-protocol-card glass-card animate-fade-in border border-cyan/40">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-badge cyan">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="card-title">Unified Workload & Nutrition Protocol</h4>
              <span className="card-subtitle">
                {isStudent ? '🎓 Student Bowler Adaptive Schedule' : '⚡ Full-Time Pro Athlete Protocol'}
              </span>
            </div>
          </div>
          <span className="badge badge-emerald">
            {wl.acwr_status?.split(' ')[0] || 'Optimal'}
          </span>
        </div>

        <div className="macros-grid-4 my-3">
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-amber">{wl.total_weekly_overs || 22}</span>
            <span className="macro-lbl">Weekly Overs</span>
          </div>
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-purple">{wl.gym_days || 3}</span>
            <span className="macro-lbl">Gym Days</span>
          </div>
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-emerald">{nut.training_day_calories || 3350}</span>
            <span className="macro-lbl">Daily kcal</span>
          </div>
          <div className="macro-stat-box">
            <span className="macro-num font-mono text-cyan">{nut.daily_protein_target_g || 165}g</span>
            <span className="macro-lbl">Protein</span>
          </div>
        </div>

        <p className="text-xs text-muted my-2">
          <strong>Gap Buffer:</strong> {wl.session_gap || 'Morning Ground • Evening Gym'}
        </p>

        <div className="card-actions-row flex gap-2 mt-3">
          <button 
            className="btn-primary flex-1"
            onClick={() => navigateTo('training')}
          >
            Open Unified Planner <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
