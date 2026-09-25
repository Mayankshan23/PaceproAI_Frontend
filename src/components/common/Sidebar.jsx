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
  Edit3
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
    strengthTask
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTrainingActive = dietTask?.isRunning || combinedTask?.isRunning || workoutTask?.isRunning || strengthTask?.isRunning;
  const isVideoActive = videoAnalysisTask?.isRunning;

  const mainNavItems = [
    { id: 'chat', path: '/', label: 'Home', icon: Home },
    { 
      id: 'analyzer', 
      path: '/analyzer', 
      label: 'Video Analyzer', 
      icon: Video, 
      badge: isVideoActive ? `${videoAnalysisTask.progress || 20}%` : '3-View',
      isGenerating: isVideoActive
    },
    { 
      id: 'training', 
      path: '/training', 
      label: 'Workout & Diet', 
      icon: Dumbbell,
      matchPaths: ['/training', '/workout', '/diet'],
      badge: isTrainingActive ? 'AI...' : null,
      isGenerating: isTrainingActive
    },
    { id: 'history', path: '/history', label: 'History', icon: History }
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
            {!collapsed && <span>New Chat</span>}
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

        {/* Bottom Section: Profile & Settings */}
        <div className="sidebar-footer">
          {/* Settings Button */}
          <button
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => {
              navigateTo('/settings');
              setMobileOpen(false);
            }}
            title={collapsed ? 'Settings' : ''}
          >
            <Settings size={20} className="nav-icon" />
            {!collapsed && <span className="nav-label">Settings</span>}
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
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Theme Toggle */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch Theme`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
