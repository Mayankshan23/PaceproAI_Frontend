const getDefaultBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:8000`;
  }
  return 'http://localhost:8000';
};

let apiConfig = {
  baseUrl: getDefaultBaseUrl(),
  timeout: 15000
};

export const setApiConfig = (newConfig) => {
  apiConfig = { ...apiConfig, ...newConfig };
};

export const getApiConfig = () => ({ ...apiConfig });

/**
 * Send Bowling Videos to backend pipeline
 * Backend accepts: { front: File/path, side1: File/path, side2: File/path }
 */
export const analyzeBowlingPipeline = async (filesDict, onProgressStage, bowlingArm = null, userId = null, athleteName = null) => {
  if (onProgressStage) {
    onProgressStage("Uploading multi-view camera streams to PacePro server...", 20);
  }

  const formData = new FormData();
  ['front', 'side1', 'side2'].forEach((viewKey) => {
    const entry = filesDict[viewKey];
    if (entry) {
      const file = entry.fileObj || (entry instanceof Blob ? entry : null);
      if (file) {
        formData.append(viewKey, file, entry.name || `${viewKey}.mp4`);
      }
    }
  });

  if (bowlingArm) {
    formData.append('bowling_arm', bowlingArm);
  }
  if (userId) {
    formData.append('user_id', userId);
  }
  if (athleteName) {
    formData.append('athlete_name', athleteName);
  }

  if (onProgressStage) {
    onProgressStage("Processing pose estimation & biomechanical landmarks...", 60);
  }

  const res = await fetch(`${apiConfig.baseUrl}/api/analyze-bowling`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    throw new Error(`Backend Error ${res.status}: ${res.statusText}`);
  }

  if (onProgressStage) {
    onProgressStage("Synthesizing multi-view fusion & AI coaching report...", 90);
  }

  const result = await res.json();
  if (onProgressStage) {
    onProgressStage("Analysis complete!", 100);
  }
  return result;
};

/**
 * Generate Diet Plan
 * Accepts core backend inputs: age, weight, height, sex, activity, goal
 */
export const generateDietPlanApi = async (dietParams) => {
  const res = await fetch(`${apiConfig.baseUrl}/api/generate-diet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dietParams)
  });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return await res.json();
};

/**
 * Generate Unified Workload & Diet Plan
 * Synthesizes workload (gym days, ground days, max overs bowling days, gap)
 * with nutrition and timetable adapted to Student or Full-time Athlete status.
 */
export const generateCombinedPlanApi = async (inputParams) => {
  const res = await fetch(`${apiConfig.baseUrl}/api/generate-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputParams)
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return await res.json();
};

export const generateWorkoutPlanApi = async (inputParams) => {
  const res = await fetch(`${apiConfig.baseUrl}/api/generate-workout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputParams)
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return await res.json();
};

export const sendChatMessageApi = async (chatPayload) => {
  const res = await fetch(`${apiConfig.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatPayload)
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return await res.json();
};

/**
 * Performance History Timeline APIs (MongoDB Atlas with Auto-Pruning)
 */
export const fetchHistoryApi = async (userId = null, type = null) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (type && type !== 'all') params.append('type', type);
    const res = await fetch(`${apiConfig.baseUrl}/api/history?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  } catch (err) {
    console.warn("fetchHistoryApi error:", err);
    return [];
  }
};

export const saveHistoryApi = async (historyItem) => {
  try {
    const res = await fetch(`${apiConfig.baseUrl}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...historyItem, max_retained: 3 })
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("saveHistoryApi error:", err);
    return null;
  }
};

export const deleteHistoryApi = async (historyId, userId = null) => {
  try {
    const params = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${apiConfig.baseUrl}/api/history/${historyId}${params}`, {
      method: 'DELETE'
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.deleted || false;
  } catch (err) {
    console.warn("deleteHistoryApi error:", err);
    return false;
  }
};

/**
 * Test Connection to Python Backend URL
 */
export const testBackendConnection = async (url) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${url}/health`, { signal: controller.signal });
    clearTimeout(id);
    return response.ok;
  } catch (e) {
    return false;
  }
};

/**
 * Fast Bowler Musculoskeletal & Kinetic Chain Strength Assessment API
 */
export const assessStrengthApi = async (payload) => {
  try {
    const res = await fetch(`${apiConfig.baseUrl}/api/assess-strength`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("assessStrengthApi error:", err);
    throw err;
  }
};

