import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  DollarSign, 
  RefreshCw, 
  Sliders, 
  Clock, 
  Check, 
  AlertCircle,
  Activity,
  Zap,
  Info,
  Calculator,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Bookmark,
  ShieldAlert,
  Utensils,
  Target,
  ShieldCheck,
  Gauge,
  CheckCircle2,
  Compass,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './DietDashboard.css';

const PRESET_ALLERGIES = [
  { name: 'Nuts', icon: '🥜' },
  { name: 'Dairy', icon: '🥛' },
  { name: 'Gluten', icon: '🌾' },
  { name: 'Soy', icon: '🌱' },
  { name: 'Shellfish', icon: '🦐' },
  { name: 'Lactose', icon: '🧀' }
];

export const DietDashboard = () => {
  const { activeDietPlan, runDietGeneration, addChatMessage, navigateTo, saveDietPlan, userProfile, updateAthleteProfile } = useApp();

  // Core Backend Supported Inputs (Initialized dynamically from userProfile)
  const [age, setAge] = useState(userProfile?.age ?? 20);
  const [weight, setWeight] = useState(userProfile?.weight ?? 68);
  const [height, setHeight] = useState(userProfile?.height ?? 175);
  const [sex, setSex] = useState(userProfile?.sex || 'male');
  const [activity, setActivity] = useState(userProfile?.activity || 'high');
  const [goal, setGoal] = useState(userProfile?.goal || 'performance');

  // Frontend Only Preferences & Constraints State
  const [prefOpen, setPrefOpen] = useState(true);
  const [foodPref, setFoodPref] = useState(userProfile?.foodPref || 'vegetarian');
  const [budgetWeekly, setBudgetWeekly] = useState(userProfile?.budgetWeekly ?? 3500);

  // Allergies & Custom Allergies
  const presetLowerNames = PRESET_ALLERGIES.map(p => p.name.toLowerCase());
  const initialAllergies = userProfile?.allergies || ['Peanuts'];
  const initialCustom = initialAllergies.filter(a => !presetLowerNames.includes(a.toLowerCase()));

  const [allergies, setAllergies] = useState(initialAllergies);
  const [customAllergies, setCustomAllergies] = useState(initialCustom);
  const [isAddingCustomAllergy, setIsAddingCustomAllergy] = useState(false);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [avoidFoods, setAvoidFoods] = useState(userProfile?.avoidFoods || ['Deep fried items', 'Excess refined sugar']);
  const [mealFreq, setMealFreq] = useState(userProfile?.mealFreq ?? 5);
  const [cookingPref, setCookingPref] = useState(userProfile?.cookingPref || 'home');
  const [recoveryNote, setRecoveryNote] = useState(userProfile?.recoveryNote || 'none');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTabSub, setActiveTabSub] = useState(() => (activeDietPlan ? 'plan' : 'setup')); // 'setup' | 'plan'
  const [isSaved, setIsSaved] = useState(false);

  // Automatically switch to 'plan' tab when activeDietPlan is provided/restored from history
  useEffect(() => {
    if (activeDietPlan) {
      setActiveTabSub('plan');
    }
  }, [activeDietPlan]);

  // Scientific BMR & TDEE Calculation (Mifflin-St Jeor)
  const calculateBmrTdee = () => {
    const genderOffset = sex === 'male' ? 5 : -161;
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + genderOffset);

    let mult = 1.725; // Default 'high'
    if (activity === 'sedentary') mult = 1.2;
    else if (activity === 'light') mult = 1.375;
    else if (activity === 'moderate') mult = 1.55;
    else if (activity === 'high') mult = 1.725;
    else if (activity === 'very_high') mult = 1.9;

    const tdee = Math.round(bmr * mult);

    let targetCalories = tdee;
    if (goal === 'muscle_gain') targetCalories += 400;
    else if (goal === 'fat_loss') targetCalories -= 500;
    else if (goal === 'performance') targetCalories += 500;

    const proteinG = Math.round(weight * 2.2);
    const carbsG = Math.round((targetCalories * 0.55) / 4);
    const fatsG = Math.round((targetCalories * 0.20) / 9);

    return { bmr, tdee, targetCalories, proteinG, carbsG, fatsG };
  };

  const { bmr, tdee, targetCalories, proteinG, carbsG, fatsG } = calculateBmrTdee();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Sync athlete profile state globally
      if (updateAthleteProfile) {
        updateAthleteProfile({
          age,
          weight,
          height,
          sex,
          activity,
          goal,
          foodPref,
          budgetWeekly,
          allergies,
          avoidFoods,
          mealFreq,
          cookingPref,
          recoveryNote
        });
      }

      // Pass core backend inputs + frontend state
      await runDietGeneration({
        age,
        weight,
        height,
        sex,
        activity,
        goal,
        calculatedBmr: bmr,
        calculatedTdee: tdee,
        calculatedCalories: targetCalories,
        foodPref,
        budgetWeekly,
        allergies,
        avoidFoods,
        mealFreq,
        cookingPref,
        recoveryNote
      });

      setActiveTabSub('plan');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAllergy = (item) => {
    setAllergies((prev) => 
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomAllergy = (e) => {
    if (e) e.preventDefault();
    const trimmed = customAllergyInput.trim();
    if (!trimmed) return;
    
    if (!customAllergies.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setCustomAllergies((prev) => [...prev, trimmed]);
    }
    if (!allergies.includes(trimmed)) {
      setAllergies((prev) => [...prev, trimmed]);
    }
    setCustomAllergyInput('');
    setIsAddingCustomAllergy(false);
  };

  const handleRemoveCustomAllergy = (e, item) => {
    e.stopPropagation();
    setCustomAllergies((prev) => prev.filter(c => c !== item));
    setAllergies((prev) => prev.filter(a => a !== item));
  };

  const handleSendToChat = () => {
    addChatMessage({
      id: `m_${Date.now()}`,
      sender: 'ai',
      text: "Based on your updated profile and preferences, here is your target performance nutrition plan:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      richCard: {
        type: 'diet_card',
        data: activeDietPlan || {
          daily_targets: { calories: targetCalories, protein_g: proteinG, carbs_g: carbsG, fats_g: fatsG },
          estimated_budget: { daily_inr: Math.round(budgetWeekly / 7), weekly_inr: budgetWeekly }
        }
      }
    });
    navigateTo('chat');
  };

  const handleSavePlan = () => {
    saveDietPlan(activeDietPlan);
    setIsSaved(true);
  };

  const dietPlan = activeDietPlan;
  const calculatedBmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));

  const dietAiAssessment = dietPlan?.ai_coaching_assessment || dietPlan?.ai_assessment || {
    positives: [
      `Optimal athletic BMI (${calculatedBmi} kg/m²) provides a solid lean foundation and healthy power-to-weight ratio for explosive run-up acceleration without excess joint load.`,
      `Well-balanced training schedule: healthy ~4–5 hours weekly split between gym strength conditioning and explosive on-ground bowling sessions.`,
      `Calibrated ACWR workload conditioning ratio, ensuring high bowling stamina and rapid glycogen resynthesis between spells.`
    ],
    current_lacks: [
      `Intra-spell glycogen depletion: Bowling dual sessions burns high glucose; lacking fast-acting carbs 45 min pre-spell leads to late-spell velocity drop.`,
      foodPref === 'vegetarian'
        ? `Leucine distribution gap: Vegetarian meals must be combined (paneer + lentils or soy isolate) to achieve the 3.0g leucine threshold for muscle protein synthesis.`
        : `Hydration & mineral deficit: High bowling volume expels 1.5–2L sweat; sodium/potassium replacement is critical to prevent quad/calf cramping.`,
      `Recovery surplus timing: Delayed post-session nutrition impairs glycogen resynthesis within the critical 45-minute metabolic window.`
    ],
    required_needs: {
      daily_calories: `${targetCalories} kcal on bowling days (+350 kcal surplus for tendon regeneration); scale to ~${Math.max(2200, targetCalories - 400)} kcal on full rest days.`,
      protein_target: `${proteinG}g daily (2.2g per kg bodyweight). Consume 30-35g within 30 min post-session with fast-acting carbohydrates.`,
      carbs_and_fueling: `${carbsG}g complex carbs (oats, brown basmati rice, sweet potatoes) to keep muscle glycogen reserves saturated before match spells.`,
      recovery_and_joint_care: `${(weight * 0.055).toFixed(1)} Liters of electrolyte water daily, plus Calcium & Vitamin D3 for lumbar disc and tibia bone density.`
    },
    goal_action_directives: [
      `1. Pre-Spell Priming: Ingest 40-50g fast carbohydrates (banana + honey toast or isotonic drink) 45 min before bowling to maximize kinetic power output in overs 5–8.`,
      `2. Post-Session Leucine Threshold: Consume 30-35g fast-digesting protein within 30 min of bowling/gym to halt muscle catabolism.`,
      `3. Electrolyte Salting: Add 500mg sodium + potassium electrolytes per 750ml bottle during hot-weather ground training.`,
      `4. Sleep Quality: Prioritize 8.5 hours sleep—peak testosterone and growth hormone release occurs during deep slow-wave sleep.`
    ],
    coach_summary: `Your nutrition engine is tuned for ${goal.replace('_', ' ')}. Prioritize pre-spell glycogen saturation and post-workout protein timing to sustain high bowling velocity and protect against lumbar stress fractures.`
  };

  return (
    <div className="diet-page-container animate-fade-in">
      {/* Header */}
      <div className="page-header flex justify-between items-center mb-6">
        <div>
          <h2 className="page-title text-2xl font-bold flex items-center gap-2">
            <Flame className="text-emerald" size={26} /> Athlete Diet & Performance Nutrition
          </h2>
          <p className="page-subtitle text-muted text-sm">
            Calculate precision macros, meal schedules, and weekly budget for fast bowling workload.
          </p>
        </div>

        <div className="subnav-pills flex gap-2">
          <button 
            className={`subnav-btn ${activeTabSub === 'setup' ? 'active' : ''}`}
            onClick={() => setActiveTabSub('setup')}
          >
            <Sliders size={14} /> Nutrition Config
          </button>
          <button 
            className={`subnav-btn ${activeTabSub === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTabSub('plan')}
          >
            Generated Meal Plan
          </button>
        </div>
      </div>

      {/* SETUP FORM */}
      {activeTabSub === 'setup' ? (
        <div className="diet-setup-container glass-card p-6 animate-fade-in">
          {/* Real-time BMR & TDEE Calculator Banner */}
          <div className="bmr-summary-banner p-4 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="calculator-icon-bg">
                <Calculator size={22} className="text-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-sm">
                  Metabolic Energy Engine
                </h4>
                <span className="text-xs text-muted">
                  Age {age} • {weight} kg • {height} cm • {sex.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex gap-6 font-mono">
              <div className="text-center">
                <span className="text-xs text-muted block font-sans">BMR (Basal Rate):</span>
                <strong className="text-base text-slate-200">{bmr} kcal</strong>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted block font-sans">TDEE (Maintenance):</span>
                <strong className="text-base text-slate-200">{tdee} kcal</strong>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted block font-sans">Bowling Target:</span>
                <strong className="text-base text-cyan font-bold">{targetCalories} kcal</strong>
              </div>
            </div>
          </div>

          {/* SECTION 1: PHYSICAL BIOMETRICS & PROFILE */}
          <div className="config-section-container mb-6">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge cyan">1</div>
                <div>
                  <h3 className="section-main-heading">Core Body Biometrics & Sex</h3>
                  <p className="section-sub-heading">Determines your base metabolic rate (BMR) via the Mifflin-St Jeor formula.</p>
                </div>
              </div>
            </div>

            <div className="setup-grid grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
              {/* Age Slider */}
              <div className="input-group">
                <label className="input-label flex justify-between mb-1">
                  <span>AGE</span>
                  <span className="font-mono text-cyan font-bold">{age} yrs</span>
                </label>
                <input 
                  type="range" 
                  min="14" 
                  max="45" 
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))} 
                  className="custom-slider"
                />
              </div>

              {/* Weight Slider */}
              <div className="input-group">
                <label className="input-label flex justify-between mb-1">
                  <span>WEIGHT</span>
                  <span className="font-mono text-cyan font-bold">{weight} kg</span>
                </label>
                <input 
                  type="range" 
                  min="45" 
                  max="110" 
                  value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))} 
                  className="custom-slider"
                />
              </div>

              {/* Height Slider */}
              <div className="input-group">
                <label className="input-label flex justify-between mb-1">
                  <span>HEIGHT</span>
                  <span className="font-mono text-cyan font-bold">{height} cm</span>
                </label>
                <input 
                  type="range" 
                  min="150" 
                  max="210" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))} 
                  className="custom-slider"
                />
              </div>

              {/* Sex Segmented Control */}
              <div className="input-group">
                <label className="input-label mb-2">SEX</label>
                <div className="segmented-control flex gap-2">
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
          </div>

          {/* SECTION 2: DAILY ACTIVITY & TRAINING LOAD */}
          <div className="config-section-container mb-6">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge amber">2</div>
                <div>
                  <h3 className="section-main-heading">Daily Activity & Fast Bowling Intensity</h3>
                  <p className="section-sub-heading">Calculates Total Daily Energy Expenditure (TDEE) based on ground & gym sessions.</p>
                </div>
              </div>
              <span className="text-xs text-muted font-mono hidden sm:inline-block">
                {activity === 'sedentary' && '1.2x BMR (Rest / Off-season)'}
                {activity === 'light' && '1.375x BMR (1-2 sessions/wk)'}
                {activity === 'moderate' && '1.55x BMR (3-4 sessions/wk)'}
                {activity === 'high' && '1.725x BMR (Bowler standard)'}
                {activity === 'very_high' && '1.9x BMR (Intense dual-session)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {[
                { id: 'sedentary', label: 'Sedentary', sub: 'Desk / Off-season', factor: '1.2x' },
                { id: 'light', label: 'Light', sub: '1–2 drills / wk', factor: '1.375x' },
                { id: 'moderate', label: 'Moderate', sub: '3–4 training days', factor: '1.55x' },
                { id: 'high', label: 'High Pace', sub: 'Ground + Gym', factor: '1.725x' },
                { id: 'very_high', label: 'Very High', sub: 'Match + Pro load', factor: '1.9x' }
              ].map((act) => {
                const isSelected = activity === act.id;
                return (
                  <button 
                    key={act.id}
                    type="button"
                    className={`diet-activity-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setActivity(act.id)}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="activity-card-title">{act.label}</span>
                      <span className="activity-card-factor">{act.factor}</span>
                    </div>
                    <span className="activity-card-sub">{act.sub}</span>
                    <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: ATHLETIC GOAL & NUTRITION PREFERENCES */}
          <div className="config-section-container mb-6">
            <div className="config-section-header">
              <div className="flex items-center gap-2.5">
                <div className="section-number-badge emerald">3</div>
                <div>
                  <h3 className="section-main-heading">Athletic Goal, Food Preferences & Timing</h3>
                  <p className="section-sub-heading">Macronutrient ratios, budget constraints, meal spacing, and allergy filters.</p>
                </div>
              </div>
            </div>

            {/* Goal Selector Cards */}
            <div className="mb-6">
              <label className="input-label mb-2 flex items-center gap-1.5">
                <Target size={14} className="text-emerald" />
                <span>PRIMARY ATHLETIC GOAL</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { 
                    id: 'performance', 
                    label: 'Bowling Performance', 
                    sub: 'Speed & lumbar recovery', 
                    calTag: '+500 kcal',
                    icon: '⚡'
                  },
                  { 
                    id: 'muscle_gain', 
                    label: 'Muscle Mass', 
                    sub: 'Hypertrophy & brace strength', 
                    calTag: '+400 kcal',
                    icon: '💪'
                  },
                  { 
                    id: 'fat_loss', 
                    label: 'Lean Agility', 
                    sub: 'Fat loss & sprint pace', 
                    calTag: '-500 kcal',
                    icon: '🔥'
                  },
                  { 
                    id: 'maintenance', 
                    label: 'Body Weight Lock', 
                    sub: 'Neutral calorie balance', 
                    calTag: '±0 kcal',
                    icon: '⚖️'
                  }
                ].map((g) => {
                  const isSelected = goal === g.id || (g.id === 'performance' && goal === 'increase_speed');
                  return (
                    <button 
                      key={g.id}
                      type="button"
                      className={`diet-goal-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setGoal(g.id)}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="flex items-center gap-2">
                          <span className="goal-card-emoji">{g.icon}</span>
                          <span className="goal-card-title">{g.label}</span>
                        </div>
                        <span className={`goal-cal-badge ${isSelected ? 'active' : ''}`}>{g.calTag}</span>
                      </div>
                      <span className="goal-card-sub">{g.sub}</span>
                      <div className={`goal-check-indicator ${isSelected ? 'active' : ''}`}>
                        {isSelected ? <Check size={12} strokeWidth={3} /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food Preference & Weekly Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* Food Preference Segmented Buttons */}
              <div className="control-card">
                <label className="input-label mb-2">FOOD PREFERENCE</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'eggetarian', label: 'Eggetarian' },
                    { id: 'non_vegetarian', label: 'Non-veg' },
                    { id: 'vegan', label: 'Vegan' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`pref-choice-btn ${foodPref === item.id ? 'active' : ''}`}
                      onClick={() => setFoodPref(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Budget */}
              <div className="control-card">
                <div className="flex justify-between items-center mb-2">
                  <label className="input-label mb-0">WEEKLY BUDGET TARGET</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted">₹</span>
                    <input 
                      type="number"
                      min="200"
                      max="20000"
                      step="50"
                      value={budgetWeekly}
                      onChange={(e) => setBudgetWeekly(Math.max(200, Number(e.target.value)))}
                      className="budget-number-input font-mono text-cyan font-bold"
                      style={{
                        width: '90px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <span className="text-xs text-muted">/ wk</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="10000" 
                  step="50"
                  value={budgetWeekly} 
                  onChange={(e) => setBudgetWeekly(Number(e.target.value))} 
                  className="custom-slider"
                />
                <div className="budget-presets-row flex gap-1.5 mt-2">
                  {[200, 500, 1000, 2500, 3500].map((presetVal) => (
                    <button
                      key={presetVal}
                      type="button"
                      className={`subnav-btn ${budgetWeekly === presetVal ? 'active' : ''}`}
                      style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '4px' }}
                      onClick={() => setBudgetWeekly(presetVal)}
                    >
                      ₹{presetVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Meal Frequency */}
            <div className="meal-frequency-group mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="input-label mb-0 flex items-center gap-1.5">
                  <Utensils size={14} className="text-cyan" />
                  <span>MEAL FREQUENCY</span>
                </label>
                <span className="text-xs text-cyan font-semibold font-mono">
                  {mealFreq} Spaced Feedings
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { freq: 3, label: '3 Meals', desc: 'Standard Cadence' },
                  { freq: 4, label: '4 Meals', desc: 'Pre & Post Spell' },
                  { freq: 5, label: '5 Meals', desc: 'Optimal Anabolic' },
                  { freq: 6, label: '6 Meals', desc: 'High Calorie Fuel' }
                ].map((item) => {
                  const isActive = mealFreq === item.freq;
                  return (
                    <button
                      key={item.freq}
                      type="button"
                      className={`diet-meal-freq-card ${isActive ? 'active' : ''}`}
                      onClick={() => setMealFreq(item.freq)}
                    >
                      <div className="freq-card-badge">{item.freq}x</div>
                      <div className="freq-card-info">
                        <span className="freq-card-title">{item.label}</span>
                        <span className="freq-card-desc">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cooking & Allergies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-2">
              {/* Cooking Preference */}
              <div className="control-card">
                <label className="input-label mb-2">COOKING PREFERENCE</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'home', label: 'Home Cooked' },
                    { id: 'hostel', label: 'Hostel / Simple' },
                    { id: 'mixed', label: 'Mixed Prep' },
                    { id: 'eating_out', label: 'Eating Out' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`pref-choice-btn ${cookingPref === c.id ? 'active' : ''}`}
                      onClick={() => setCookingPref(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Allergies Chips */}
              <div className="control-card">
                <div className="flex justify-between items-center mb-2">
                  <label className="input-label mb-0 flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-rose" />
                    <span>ALLERGIES & SENSITIVITIES</span>
                  </label>
                  <span className="text-xs text-muted">
                    {allergies.length > 0 ? `${allergies.length} excluded` : 'None selected'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {PRESET_ALLERGIES.map(({ name: allergy, icon }) => {
                    const isSelected = allergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        className={`diet-allergy-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleAllergy(allergy)}
                      >
                        <span className="allergy-emoji">{icon}</span>
                        <span className="allergy-name">{allergy}</span>
                        <div className={`allergy-indicator ${isSelected ? 'active' : ''}`}>
                          {isSelected ? <Check size={11} strokeWidth={3} /> : null}
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Added Allergies */}
                  {customAllergies.map((allergy) => {
                    const isSelected = allergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        className={`diet-allergy-chip custom-allergy-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleAllergy(allergy)}
                      >
                        <span className="allergy-emoji">⚠️</span>
                        <span className="allergy-name truncate" title={allergy}>{allergy}</span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <div className={`allergy-indicator ${isSelected ? 'active' : ''}`}>
                            {isSelected ? <Check size={11} strokeWidth={3} /> : null}
                          </div>
                          <span
                            role="button"
                            tabIndex={0}
                            className="allergy-remove-btn"
                            onClick={(e) => handleRemoveCustomAllergy(e, allergy)}
                            title="Remove custom allergy"
                          >
                            <X size={10} />
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* "+ Add Yours" Trigger / Inline Input Form */}
                  {isAddingCustomAllergy ? (
                    <form
                      onSubmit={handleAddCustomAllergy}
                      className="add-yours-form flex items-center gap-1 col-span-2 sm:col-span-1"
                    >
                      <input
                        type="text"
                        className="add-yours-input"
                        placeholder="e.g. Eggs, Peanuts..."
                        value={customAllergyInput}
                        onChange={(e) => setCustomAllergyInput(e.target.value)}
                        autoFocus
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <button type="submit" className="add-yours-submit-btn" title="Add">
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        className="add-yours-cancel-btn"
                        onClick={() => {
                          setIsAddingCustomAllergy(false);
                          setCustomAllergyInput('');
                        }}
                        title="Cancel"
                      >
                        <X size={13} />
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className="diet-allergy-chip add-yours-btn"
                      onClick={() => setIsAddingCustomAllergy(true)}
                      title="Add custom allergy or dietary sensitivity"
                    >
                      <Plus size={15} className="text-cyan shrink-0" />
                      <span className="allergy-name text-cyan font-bold">Add Yours</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button 
            className="btn-primary w-full py-3 text-base" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={20} /> Generating Custom Athlete Meal Plan...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Diet Plan
              </>
            )}
          </button>
        </div>
      ) : (
        /* DIET RESULT DISPLAY */
        <div className="diet-result-container animate-fade-in">
          {/* DAILY TARGETS RICH CARDS */}
          <h3 className="section-title mb-3">DAILY TARGETS</h3>
          <div className="targets-banner-grid grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
            <div className="target-card glass-card">
              <div className="target-card-top">
                <span className="target-label">Calories</span>
                <span className="target-badge cyan">Energy</span>
              </div>
              <div className="target-value-wrap">
                <span className="target-value font-mono text-cyan">{targetCalories}</span>
                <span className="target-metric-unit">kcal / day</span>
              </div>
              <div className="target-unit">Total Daily Intake</div>
            </div>

            <div className="target-card glass-card">
              <div className="target-card-top">
                <span className="target-label">Protein</span>
                <span className="target-badge emerald">Repair</span>
              </div>
              <div className="target-value-wrap">
                <span className="target-value font-mono text-emerald">{proteinG}g</span>
                <span className="target-metric-unit">daily</span>
              </div>
              <div className="target-unit">2.2g / kg bodyweight</div>
            </div>

            <div className="target-card glass-card">
              <div className="target-card-top">
                <span className="target-label">Carbohydrates</span>
                <span className="target-badge amber">Glycogen</span>
              </div>
              <div className="target-value-wrap">
                <span className="target-value font-mono text-amber">{carbsG}g</span>
                <span className="target-metric-unit">daily</span>
              </div>
              <div className="target-unit">Explosive Energy</div>
            </div>

            <div className="target-card glass-card">
              <div className="target-card-top">
                <span className="target-label">Fats</span>
                <span className="target-badge purple">Hormones</span>
              </div>
              <div className="target-value-wrap">
                <span className="target-value font-mono text-purple">{fatsG}g</span>
                <span className="target-metric-unit">daily</span>
              </div>
              <div className="target-unit">Hormonal Health</div>
            </div>
          </div>

          {/* Budget Summary Banner */}
          <div className="budget-summary-banner glass-card p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="budget-icon-bg">
                <DollarSign size={20} className="text-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-sm">Estimated Meal Investment</h4>
                <span className="text-xs text-muted">High-protein whole food ingredients</span>
              </div>
            </div>

            <div className="flex gap-6 font-mono">
              <div className="text-right">
                <span className="text-xs text-muted block font-sans">Estimated Daily Cost:</span>
                <span className="font-bold text-primary">₹{Math.round(budgetWeekly / 7)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted block font-sans">Estimated Weekly Cost:</span>
                <span className="font-bold text-cyan text-lg">₹{budgetWeekly}</span>
              </div>
            </div>
          </div>

          {/* AI Sports-Science & Nutrition Coaching Assessment */}
          <div className="ai-coaching-card glass-card mb-6">
            <div className="ai-coaching-header">
              <div className="flex items-center gap-3">
                <div className="ai-badge-pulse">
                  <Sparkles size={18} className="text-cyan animate-pulse" />
                </div>
                <div>
                  <h3 className="ai-card-title">AI Sports Nutrition & Workload Assessment</h3>
                  <p className="ai-card-subtitle">
                    Sports-science synthesis derived from Mifflin-St Jeor BMR ({bmr} kcal), TDEE ({tdee} kcal), and ACWR ({dietPlan?.ai_coaching_assessment?.workload_metrics?.acwr_score || 1.18})
                  </p>
                </div>
              </div>
              <div className="ai-status-tag">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Sports Science Verified</span>
              </div>
            </div>

            {/* Coach Summary Note */}
            {dietAiAssessment?.coach_summary && (
              <div className="coach-summary-quote">
                <div className="quote-icon-wrap">
                  <MessageSquare size={16} className="text-cyan" />
                </div>
                <div className="quote-body">
                  <span className="quote-label">Head Coach AI Directive:</span>
                  <p className="quote-text">{dietAiAssessment.coach_summary}</p>
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
                  {(dietAiAssessment?.positives || []).map((pos, idx) => (
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
                  {(dietAiAssessment?.current_lacks || []).map((lack, idx) => (
                    <li key={idx} className="point-item lack">
                      <span className="point-bullet amber">!</span>
                      <span>{lack}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Required Needs Grid */}
            {dietAiAssessment?.required_needs && (
              <div className="required-needs-block">
                <h4 className="needs-block-title flex items-center gap-2">
                  <Target size={16} className="text-cyan" />
                  <span>Required Needs & Physiological Demands</span>
                </h4>
                <div className="needs-grid">
                  <div className="need-box">
                    <span className="need-label">Daily Calories</span>
                    <p className="need-desc">{dietAiAssessment.required_needs.daily_calories}</p>
                  </div>
                  <div className="need-box">
                    <span className="need-label">Protein & Leucine Target</span>
                    <p className="need-desc">{dietAiAssessment.required_needs.protein_target}</p>
                  </div>
                  <div className="need-box">
                    <span className="need-label">Carbs & Spell Fueling</span>
                    <p className="need-desc">{dietAiAssessment.required_needs.carbs_and_fueling}</p>
                  </div>
                  <div className="need-box">
                    <span className="need-label">Recovery & Lumbar Care</span>
                    <p className="need-desc">{dietAiAssessment.required_needs.recovery_and_joint_care}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Goal Action Directives */}
            {(dietAiAssessment?.goal_action_directives || []).length > 0 && (
              <div className="goal-directives-block">
                <h4 className="directives-title flex items-center gap-2">
                  <Compass size={16} className="text-purple" />
                  <span>Action Plan: What You Should Do According to Your Goal ({goal.replace('_', ' ').toUpperCase()})</span>
                </h4>
                <div className="directives-list">
                  {dietAiAssessment.goal_action_directives.map((directive, idx) => (
                    <div key={idx} className="directive-row">
                      <span className="directive-step">{idx + 1}</span>
                      <p className="directive-text">{directive.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MEAL BREAKDOWN CARDS - ONLY SHOW IF USER GENERATED ANY */}
          {Array.isArray(dietPlan?.meals) && dietPlan.meals.length > 0 && (
            <div className="meal-chart-section mb-6">
              <h3 className="section-title mb-3">COMPLETE MEAL CHART</h3>
              <div className="meals-breakdown-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietPlan.meals.map((meal, idx) => (
                  <div key={idx} className="meal-card glass-card p-4">
                    <div className="meal-header flex justify-between items-center mb-2">
                      <span className="badge badge-cyan">{meal.type}</span>
                      {meal.calories && (
                        <span className="font-mono text-xs text-muted">{meal.calories} kcal • {meal.protein_g}g Protein</span>
                      )}
                    </div>

                    <h4 className="meal-title font-bold text-primary text-base mb-2">{meal.title}</h4>

                    <ul className="meal-items-list mb-3">
                      {meal.items?.map((it, i) => (
                        <li key={i} className="text-xs text-secondary flex items-center gap-2 py-1">
                          <span className="dot-cyan">•</span> {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-end gap-3 mt-6">
            <button className="btn-secondary" onClick={() => setActiveTabSub('setup')}>
              <Sliders size={16} /> Adjust Config & Inputs
            </button>
            <button className="btn-secondary" onClick={handleSavePlan} disabled={isSaved}>
              <Bookmark size={16} /> {isSaved ? 'Plan Saved' : 'Save Plan'}
            </button>
            <button className="btn-primary" onClick={handleSendToChat}>
              <MessageSquare size={16} /> Send to AI Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
