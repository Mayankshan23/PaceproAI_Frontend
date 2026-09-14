import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/common/Sidebar';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@clerk/react';
import { LandingPage } from './components/landing/LandingPage';
import './index.css';

// Lazy loading individual section pages so only the required page is loaded
const ChatWindow = lazy(() => import('./components/chat/ChatWindow').then(m => ({ default: m.ChatWindow })));
const VideoAnalyzer = lazy(() => import('./components/analyzer/VideoAnalyzer').then(m => ({ default: m.VideoAnalyzer })));
const TrainingDashboard = lazy(() => import('./components/training/TrainingDashboard').then(m => ({ default: m.TrainingDashboard })));
const HistoryTimeline = lazy(() => import('./components/history/HistoryTimeline').then(m => ({ default: m.HistoryTimeline })));
const SettingsPanel = lazy(() => import('./components/settings/SettingsPanel').then(m => ({ default: m.SettingsPanel })));

const PageLoader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    gap: '12px',
    padding: '40px'
  }}>
    <div style={{
      padding: '12px',
      borderRadius: '50%',
      background: 'rgba(56, 189, 248, 0.15)',
      color: 'var(--accent-primary)'
    }}>
      <Sparkles size={28} />
    </div>
    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
      Loading page...
    </span>
  </div>
);

const MainContentArea = () => {
  return (
    <main className="main-content">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<ChatWindow />} />
          <Route path="/analyzer" element={<VideoAnalyzer />} />
          <Route path="/training" element={<TrainingDashboard defaultTab="combined" />} />
          <Route path="/workout" element={<TrainingDashboard defaultTab="workout" />} />
          <Route path="/diet" element={<TrainingDashboard defaultTab="diet" />} />
          <Route path="/history" element={<HistoryTimeline />} />
          <Route path="/settings" element={<SettingsPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const [viewOverride, setViewOverride] = React.useState(null);

  // If user is logged in, render the main home page unless explicitly overridden
  const showApp = isSignedIn && viewOverride !== 'landing';

  return (
    <ThemeProvider>
      <Router>
        <AppProvider>
          {!isLoaded ? (
            <PageLoader />
          ) : !showApp ? (
            <LandingPage onEnterDashboard={() => setViewOverride('app')} />
          ) : (
            <div className="app-container w-full max-w-full overflow-x-hidden">
              <Sidebar />
              <MainContentArea />
            </div>
          )}
        </AppProvider>
      </Router>
    </ThemeProvider>
  );
}
