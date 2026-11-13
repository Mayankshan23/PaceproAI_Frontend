import React, { useState } from 'react';
import { 
  Plus,
  Home, 
  Video, 
  Dumbbell, 
  Flame, 
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Activity, 
  User, 
  Moon, 
  Sun,
  Menu,
  X,
  Edit3,
  Globe
} from 'lucide-react';
import { UserButton } from '@clerk/react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

export const Sidebar = () => {
  const { 
    navigateTo, 
    userProfile, 
    resetChat, 
    openProfileSetupModal,
    videoAnalysisTask,
    dietTask,
    combinedTask,
    workoutTask,
    strengthTask,
    language,
    setLanguage,
    t
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTrainingActive = dietTask?.isRunning || combinedTask?.isRunning || workoutTask?.isRunning || strengthTask?.isRunning;
  const isVideoActive = videoAnalysisTask?.isRunning;

  const mainNavItems = [
    { id: 'chat', path: '/', label: t('navHome', 'Home'), icon: Home },
    { 
      id: 'analyzer', 
      path: '/analyzer', 
      label: t('navAnalyzer', 'Video Analyzer'), 
      icon: Video, 
      badge: isVideoActive ? `${videoAnalysisTask.progress || 20}%` : '3-View',
      isGenerating: isVideoActive
    },
    { 
      id: 'training', 
      path: '/training', 
      label: t('navWorkout', 'Workout & Diet'), 
      icon: Dumbbell,
      matchPaths: ['/training', '/workout', '/diet'],
      badge: isTrainingActive ? 'AI...' : null,
      isGenerating: isTrainingActive
    },
    { id: 'history', path: '/history', label: t('navHistory', 'History'), icon: History }
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <div className="mobile-logo" onClick={() => navigateTo('/')}>
          <div className="logo-icon-bg">
            <Zap className="logo-icon" />
          </div>
          <span className="logo-text">PACEPRO <span className="logo-highlight">AI</span></span>
        </div>
        <div className="mobile-header-actions">
          <UserButton afterSignOutUrl="/" />
          <button className="btn-icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Left Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand" onClick={() => { navigateTo('/'); setMobileOpen(false); }}>
            <div className="brand-icon-wrapper">
              <Zap size={22} className="brand-icon" />
            </div>
            {!collapsed && (
              <div className="brand-text">
                <span className="brand-title">PacePro AI</span>
                <span className="brand-tag">PERFORMANCE COACH</span>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn btn-icon desktop-only" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Gemini-style New Chat Button */}
        <div className="new-chat-container">
          <button 
            className="new-chat-btn" 
            onClick={() => {
              resetChat();
              setMobileOpen(false);
            }}
            title="Start New Chat"
          >
            <Plus size={18} />
            {!collapsed && <span>{t('newChat', 'New Chat')}</span>}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchPaths
              ? item.matchPaths.includes(location.pathname)
              : location.pathname === item.path;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigateTo(item.path);
                  setMobileOpen(false);
                }}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} className="nav-icon" />
                {!collapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`nav-badge ${item.isGenerating ? 'badge-generating animate-pulse' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Profile, Language & Settings */}
        <div className="sidebar-footer">
          {/* Settings Button */}
          <button
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => {
              navigateTo('/settings');
              setMobileOpen(false);
            }}
            title={collapsed ? t('navSettings', 'Settings') : ''}
          >
            <Settings size={20} className="nav-icon" />
            {!collapsed && <span className="nav-label">{t('navSettings', 'Settings')}</span>}
          </button>

          {/* Authenticated User Profile Summary & Clerk Controls */}
          <div className={`athlete-profile-card clerk-profile-card ${collapsed ? 'collapsed' : ''}`}>
            <div className="profile-card-inner">
              <div className="profile-avatar-wrap" title="Account Details">
                <UserButton 
                  afterSignOutUrl="/"
                  showName={false}
                  appearance={{
                    elements: {
                      userButtonAvatarBox: { width: 34, height: 34 },
                      userButtonBox: { margin: 0, padding: 0 }
                    }
                  }}
                />
              </div>

              {!collapsed && (
                <div className="profile-details-wrap">
                  <div className="profile-bowler-arm">
                    {userProfile?.arm?.includes('Left') ? '⚡ LAF' : '⚡ RAF'}
                  </div>
                  <div className="profile-bowler-pace">
                    {userProfile?.peakSpeed || '135 km/h'}
                  </div>
                </div>
              )}

              {!collapsed && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (openProfileSetupModal) openProfileSetupModal();
                  }}
                  className="profile-edit-btn"
                  title="Edit Bowler Attributes"
                >
                  <Edit3 size={12} />
                  <span>{t('edit', 'Edit')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Global Language Toggle */}
          <div className={`sidebar-language-control ${collapsed ? 'collapsed' : ''}`}>
            {collapsed ? (
              <button 
                type="button" 
                className="theme-toggle-btn lang-toggle-collapsed"
                onClick={() => setLanguage(language === 'hinglish' ? 'english' : 'hinglish')}
                title={language === 'hinglish' ? "Switch to English" : "Hinglish me badlein"}
              >
                <Globe size={16} />
              </button>
            ) : (
              <div className="sidebar-lang-pill-wrap">
                <button
                  type="button"
                  className={`sidebar-lang-btn ${language === 'hinglish' ? 'active' : ''}`}
                  onClick={() => setLanguage('hinglish')}
                  title="Hinglish (Hindi + English)"
                >
                  🇮🇳 Hinglish
                </button>
                <button
                  type="button"
                  className={`sidebar-lang-btn ${language === 'english' ? 'active' : ''}`}
                  onClick={() => setLanguage('english')}
                  title="Pure English"
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>

          {/* Quick Theme Toggle */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('lightTheme', 'Light Theme') : t('darkTheme', 'Dark Theme')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span>{theme === 'dark' ? t('lightTheme', 'Light Theme') : t('darkTheme', 'Dark Theme')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
