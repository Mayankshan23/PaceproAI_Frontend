import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { ProfileSetupModal } from '../components/common/ProfileSetupModal';
import { 
  analyzeBowlingPipeline, 
  generateDietPlanApi, 
  generateCombinedPlanApi, 
  generateWorkoutPlanApi, 
  fetchHistoryApi,
  saveHistoryApi,
  deleteHistoryApi,
  setApiConfig, 
  getApiConfig 
} from '../services/api';

const AppContext = createContext();

const TAB_TO_PATH = {
  chat: '/',
  analyzer: '/analyzer',
  training: '/training',
  workout: '/workout',
  diet: '/diet',
  history: '/history',
  settings: '/settings'
};

const PATH_TO_TAB = {
  '/': 'chat',
  '/analyzer': 'analyzer',
  '/training': 'training',
  '/workout': 'workout',
  '/diet': 'diet',
  '/history': 'history',
  '/settings': 'settings'
};

const defaultProfile = {
  name: 'Fast Bowler',
  role: 'Fast Bowler',
  arm: 'Right-Arm Fast',
  bowlingAction: 'semi_open',
  peakSpeed: '135 km/h',
  target: 'Explosive Velocity & Lumbar Protection',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  // Athlete Physiological Parameters
  age: 20,
  weight: 68,
  height: 175,
  sex: 'male',
  activity: 'high',
  goal: 'increase_speed',
  // Workload Parameters
  athleteStatus: 'student',
  gymDays: 3,
  groundDays: 4,
  maxOversDays: 2,
  sessionGap: 'Morning Ground (6:30 AM) • Evening Gym (5:30 PM) [7-8h Gap]',
  // Dietary Parameters
  foodPref: 'vegetarian',
  budgetWeekly: 3500,
  allergies: ['Peanuts'],
  avoidFoods: ['Deep fried items', 'Excess refined sugar'],
  mealFreq: 5,
  cookingPref: 'home',
  recoveryNote: 'none',
  isConfigured: false
};

const getProfileStorageKey = (uid) => uid ? `pacepro_user_profile_${uid}` : 'pacepro_user_profile_guest';
const getHistoryStorageKey = (uid) => uid ? `pacepro_history_cache_${uid}` : 'pacepro_history_cache_guest';

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = PATH_TO_TAB[location.pathname] || 'chat';
  
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useUser();

  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const activeUserRef = useRef(null);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('pacepro_user_profile_guest');
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const userId = clerkUser?.id || clerkUser?.primaryEmailAddress?.emailAddress || 'default_athlete';

  // Automatically update userProfile with authenticated user details from Clerk & isolate accounts
  useEffect(() => {
    if (isClerkLoaded) {
      const currentUid = isClerkSignedIn && clerkUser 
        ? (clerkUser.id || clerkUser.primaryEmailAddress?.emailAddress) 
        : 'default_athlete';

      const isUserSwitch = activeUserRef.current && activeUserRef.current !== currentUid;

      if (isUserSwitch) {
        // Account switched: Clear previous user's ephemeral session state
        setLatestBowlingAnalysis(null);
        setActiveDietPlan(null);
        setActiveCombinedPlan(null);
        setActiveWorkplan(null);
        setChatMessages([]);
      }
      activeUserRef.current = currentUid;

      if (isClerkSignedIn && clerkUser) {
        const storageKey = getProfileStorageKey(currentUid);
        const promptKey = `pacepro_profile_prompted_${currentUid}`;
        const alreadyPrompted = localStorage.getItem(promptKey) || sessionStorage.getItem(promptKey);
        const storedProfileStr = localStorage.getItem(storageKey);

        const clerkFullName = clerkUser.fullName || 
                              (clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null) || 
                              clerkUser.username || 
                              clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 
                              'Fast Bowler';

        if (storedProfileStr) {
          try {
            const parsed = JSON.parse(storedProfileStr);
            setUserProfile({
              ...defaultProfile,
              ...parsed,
              email: clerkUser.primaryEmailAddress?.emailAddress || parsed.email,
              avatar: clerkUser.imageUrl || parsed.avatar
            });
            // Only prompt ONCE upon initial sign-in if unconfigured
            if (!parsed.isConfigured && !alreadyPrompted) {
              setIsProfileSetupOpen(true);
              localStorage.setItem(promptKey, 'true');
              sessionStorage.setItem(promptKey, 'true');
            }
          } catch (e) {
            console.error("Error reading saved user profile:", e);
          }
        } else {
          // Brand new login with a new account
          const newProfile = {
            ...defaultProfile,
            name: clerkFullName,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            avatar: clerkUser.imageUrl || defaultProfile.avatar,
            isConfigured: false
          };
          setUserProfile(newProfile);
          try {
            localStorage.setItem(storageKey, JSON.stringify(newProfile));
          } catch (e) {}
          // Immediately prompt user with the setup modal ONCE
          if (!alreadyPrompted) {
            setIsProfileSetupOpen(true);
            localStorage.setItem(promptKey, 'true');
            sessionStorage.setItem(promptKey, 'true');
          }
        }
      }
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUser]);

  const updateAthleteProfile = (updates) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updates };
      const currentUid = clerkUser?.id || clerkUser?.primaryEmailAddress?.emailAddress || 'default_athlete';
      try {
        localStorage.setItem(getProfileStorageKey(currentUid), JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Backend API Status
  const [apiState, setApiState] = useState(getApiConfig());

  // App Data States
  const [latestBowlingAnalysis, setLatestBowlingAnalysis] = useState(null);
  const [activeDietPlan, setActiveDietPlan] = useState(null);
  const [activeCombinedPlan, setActiveCombinedPlan] = useState(null);
  const [activeWorkplan, setActiveWorkplan] = useState(null);
  const [workoutsList, setWorkoutsList] = useState([]);
  
  // Performance History Timeline (Persisted in MongoDB with 3-generation auto-retention)
  const [historyList, setHistoryList] = useState([]);

  // Load history from MongoDB on mount or when user changes
  useEffect(() => {
    let isMounted = true;
    const cacheKey = getHistoryStorageKey(userId);
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) setHistoryList(JSON.parse(cached));
      else setHistoryList([]);
    } catch { setHistoryList([]); }

    const loadHistory = async () => {
      try {
        const remote = await fetchHistoryApi(userId);
        if (isMounted && Array.isArray(remote)) {
          setHistoryList(remote);
          try { localStorage.setItem(cacheKey, JSON.stringify(remote)); } catch(e){}
        }
      } catch (err) {
        console.warn("Failed to load history from database:", err);
      }
    };
    loadHistory();
    return () => { isMounted = false; };
  }, [userId]);

  // AI Chat Messages & Prompt Handoff
  const [chatMessages, setChatMessages] = useState([]);
  const [pendingChatPrompt, setPendingChatPrompt] = useState(null);

  // Saved Plans
  const [savedWorkplans, setSavedWorkplans] = useState(() => {
    try {
      const stored = localStorage.getItem('pacepro_saved_workplans');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [savedDietPlans, setSavedDietPlans] = useState(() => {
    try {
      const stored = localStorage.getItem('pacepro_saved_diet_plans');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [savedCombinedPlans, setSavedCombinedPlans] = useState(() => {
    try {
      const stored = localStorage.getItem('pacepro_saved_combined_plans');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const saveWorkplan = (plan) => {
    const updated = [plan, ...savedWorkplans];
    setSavedWorkplans(updated);
    try { localStorage.setItem('pacepro_saved_workplans', JSON.stringify(updated)); } catch(e){}
  };

  const saveDietPlan = (plan) => {
    const updated = [plan, ...savedDietPlans];
    setSavedDietPlans(updated);
    try { localStorage.setItem('pacepro_saved_diet_plans', JSON.stringify(updated)); } catch(e){}
  };

  const saveCombinedPlan = (plan) => {
    const updated = [plan, ...savedCombinedPlans];
    setSavedCombinedPlans(updated);
    try { localStorage.setItem('pacepro_saved_combined_plans', JSON.stringify(updated)); } catch(e){}
  };

  const resetChat = () => {
    setChatMessages([]);
    navigate('/');
  };

  const updateApiConfigState = (newConfig) => {
    setApiConfig(newConfig);
    setApiState(getApiConfig());
  };

  const navigateTo = (tabOrPath, extraData = null) => {
    const targetPath = TAB_TO_PATH[tabOrPath] || (tabOrPath.startsWith('/') ? tabOrPath : '/');
    if (extraData) {
      if (extraData.analysis) setLatestBowlingAnalysis(extraData.analysis);
      if (extraData.diet) setActiveDietPlan(extraData.diet);
      if (extraData.workout) setActiveWorkplan(extraData.workout);
      if (extraData.combined) setActiveCombinedPlan(extraData.combined);
      if (extraData.prompt) setPendingChatPrompt(extraData.prompt);
    }
    navigate(targetPath);
  };

  const addChatMessage = (messageObj) => {
    setChatMessages((prev) => [...prev, messageObj]);
  };

  // Helper to add history item with auto-deletion keeping latest 3 generations
  const addHistoryItem = async (item) => {
    const itemWithUser = {
      ...item,
      user_id: userId,
      max_retained: 3
    };

    const cacheKey = getHistoryStorageKey(userId);

    // Optimistically update frontend state keeping at most 2 previous items of same category (total 3)
    setHistoryList((prev) => {
      const filtered = prev.filter(x => x.id !== itemWithUser.id);
      const sameCategory = filtered.filter(x => x.type === itemWithUser.type).slice(0, 2);
      const otherCategories = filtered.filter(x => x.type !== itemWithUser.type);
      const updated = [itemWithUser, ...sameCategory, ...otherCategories];
      try { localStorage.setItem(cacheKey, JSON.stringify(updated)); } catch(e){}
      return updated;
    });

    // Persist to MongoDB backend (which enforces DB-level auto-deletion of older generations)
    const res = await saveHistoryApi(itemWithUser);
    if (res && res.history && Array.isArray(res.history)) {
      setHistoryList(res.history);
      try { localStorage.setItem(cacheKey, JSON.stringify(res.history)); } catch(e){}
    }
  };

  const removeHistoryItem = async (historyId) => {
    const cacheKey = getHistoryStorageKey(userId);
    setHistoryList((prev) => {
      const updated = prev.filter(item => item.id !== historyId);
      try { localStorage.setItem(cacheKey, JSON.stringify(updated)); } catch(e){}
      return updated;
    });
    await deleteHistoryApi(historyId, userId);
  };

  // Run bowling analysis
  const runAnalysis = async (filesDict, onProgress, armOverride = null) => {
    try {
      const bowlingArm = armOverride || (userProfile?.arm?.toLowerCase().includes('left') ? 'left' : 'right');
      const result = await analyzeBowlingPipeline(filesDict, onProgress, bowlingArm, userId, userProfile?.name);
      setLatestBowlingAnalysis(result);
      
      // Add to MongoDB history with 3-generation auto-retention
      const braceVal = result?.final_measurements?.view_fusion?.measurements?.front_knee_brace_change?.fused ?? 'N/A';
      const newHistoryItem = {
        id: `h_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'bowling',
        title: `Multi-View Bowling Biomechanics (${userProfile?.name || 'Fast Bowler'})`,
        subtitle: `${result.views_used?.length ?? 1} views analyzed • Brace angle ${braceVal}°`,
        status: 'Completed',
        detail: result
      };
      await addHistoryItem(newHistoryItem);

      // Add notification in chat
      addChatMessage({
        id: `m_${Date.now()}`,
        sender: 'ai',
        text: `Analysis completed successfully using ${result.views_used.join(', ')} views. Here is your biomechanics summary:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        richCard: {
          type: 'bowling_summary',
          data: result
        }
      });

      return result;
    } catch (err) {
      console.error("Analysis execution error:", err);
      throw err;
    }
  };

  // Run Diet plan generation
  const runDietGeneration = async (dietInputs) => {
    try {
      const result = await generateDietPlanApi({ ...dietInputs, user_id: userId });
      setActiveDietPlan(result);

      // Add to MongoDB history with 3-generation auto-retention
      const newHistoryItem = {
        id: `h_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'diet',
        title: `Athlete Nutrition Plan (${userProfile?.name || 'Fast Bowler'})`,
        subtitle: `${result.daily_targets?.calories ?? 2800} kcal • ${result.daily_targets?.protein_g ?? 150}g Protein`,
        status: 'Active',
        detail: result
      };
      await addHistoryItem(newHistoryItem);

      return result;
    } catch (err) {
      console.error("Diet generation error:", err);
      throw err;
    }
  };

  // Run Combined Workload & Diet Generation
  const runCombinedGeneration = async (combinedInputs) => {
    try {
      const result = await generateCombinedPlanApi({ ...combinedInputs, user_id: userId });
      setActiveCombinedPlan(result);
      if (result?.workout_plan) {
        setActiveWorkplan(result.workout_plan);
      }

      // Add to MongoDB history with 3-generation auto-retention
      const newHistoryItem = {
        id: `h_${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'combined_plan',
        title: result?.title || 'Fast Bowler Unified Workload & Nutrition Protocol',
        subtitle: `${result?.workload_summary?.gym_days ?? 3} Gym • ${result?.workload_summary?.ground_days ?? 4} Ground (${result?.workload_summary?.max_overs_days ?? 2} Max Spells) • ${result?.nutrition_summary?.training_day_calories ?? 2800} kcal`,
        status: 'Active Protocol',
        detail: result
      };
      await addHistoryItem(newHistoryItem);

      return result;
    } catch (err) {
      console.error("Combined generation error:", err);
      throw err;
    }
  };

  const runWorkplanGeneration = async (workoutInputs) => {
    try {
      const result = await generateWorkoutPlanApi({ ...workoutInputs, user_id: userId });
      setActiveWorkplan(result);
      return result;
    } catch (err) {
      console.error("Workout generation error:", err);
      throw err;
    }
  };

  // Toggle exercise completion
  const toggleExerciseDone = (exerciseId) => {
    console.log("Toggle exercise:", exerciseId);
  };

  // Add new workout session
  const addWorkoutSession = async (newSession) => {
    setWorkoutsList((prev) => [newSession, ...prev]);
    const newHistoryItem = {
      id: `h_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'workout',
      title: newSession.title,
      subtitle: `${newSession.exercises?.length ?? 0} exercises • ${newSession.intensity} Intensity`,
      status: 'Logged',
      detail: newSession
    };
    await addHistoryItem(newHistoryItem);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        navigateTo,
        userProfile,
        setUserProfile,
        updateAthleteProfile,
        isProfileSetupOpen,
        setIsProfileSetupOpen,
        openProfileSetupModal: () => setIsProfileSetupOpen(true),
        apiState,
        updateApiConfigState,
        latestBowlingAnalysis,
        activeDietPlan,
        activeCombinedPlan,
        activeWorkplan,
        workoutsList,
        historyList,
        addHistoryItem,
        removeHistoryItem,
        chatMessages,
        addChatMessage,
        pendingChatPrompt,
        setPendingChatPrompt,
        resetChat,
        savedWorkplans,
        savedDietPlans,
        savedCombinedPlans,
        saveWorkplan,
        saveDietPlan,
        saveCombinedPlan,
        runAnalysis,
        runDietGeneration,
        runCombinedGeneration,
        runWorkplanGeneration,
        toggleExerciseDone,
        addWorkoutSession
      }}
    >
      {children}
      <ProfileSetupModal 
        isOpen={isProfileSetupOpen} 
        onClose={() => setIsProfileSetupOpen(false)} 
      />
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
