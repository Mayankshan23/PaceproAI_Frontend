import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export const LandingNavbar = ({ onLaunchDashboard }) => {
  const { isSignedIn } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (isSignedIn && onLaunchDashboard) {
      onLaunchDashboard();
    }
  };

  return (
    <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="landing-navbar-container">
        {/* Brand Logo */}
        <a href="#" className="landing-brand">
          <div className="landing-logo-icon">
            <Zap size={22} className="logo-svg" />
          </div>
          <div className="landing-brand-text">
            <span className="brand-name">
              PACEPRO <span className="brand-highlight">AI</span>
            </span>
            <span className="brand-sub">BOWLING BIOMECHANICS</span>
          </div>
        </a>

        {/* Clean & Focused Navigation Links */}
        <nav className="landing-nav-links">
          <a 
            href="#features" 
            className="landing-nav-link"
            onClick={(e) => scrollToSection(e, '#features')}
          >
            {t('landingFeatures', 'Features')}
          </a>
          <a 
            href="#biomechanics" 
            className="landing-nav-link"
            onClick={(e) => scrollToSection(e, '#biomechanics')}
          >
            {t('landingBiomechanics', 'Biomechanics')}
          </a>
          <a 
            href="#training" 
            className="landing-nav-link"
            onClick={(e) => scrollToSection(e, '#training')}
          >
            {t('landingTraining', 'Training')}
          </a>
          <a 
            href="#faq" 
            className="landing-nav-link"
            onClick={(e) => scrollToSection(e, '#faq')}
          >
            {t('landingFaq', 'FAQ')}
          </a>
        </nav>

        {/* Right Actions: Context-Aware Get Started / Dashboard + Theme + Language */}
        <div className="landing-navbar-actions">
          {/* Language Toggle Pill */}
          <button
            type="button"
            className="landing-theme-toggle"
            onClick={() => setLanguage(language === 'hinglish' ? 'english' : 'hinglish')}
            title={`Switch to ${language === 'hinglish' ? 'English' : 'Hinglish'}`}
            style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 8px', width: 'auto' }}
          >
            {language === 'hinglish' ? '🇮🇳 Hin' : '🇬🇧 Eng'}
          </button>

          {/* Theme Toggle */}
          <button 
            className="landing-theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Context-Aware Action Button: Only Get Started / Go to Dashboard */}
          {isSignedIn ? (
            <div className="landing-authenticated-actions">
              <button 
                className="landing-btn-signup"
                onClick={handleCtaClick}
                title="Go to main home page dashboard"
              >
                <span>{t('landingGoToDashboard', 'Go to Dashboard')}</span>
                <ArrowRight size={15} />
              </button>
              <div className="landing-user-btn-wrapper">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          ) : (
            <div className="landing-auth-buttons">
              <SignUpButton mode="modal">
                <button className="landing-btn-signup">
                  <span>{t('landingGetStarted', 'Get Started')}</span>
                  <ArrowRight size={15} />
                </button>
              </SignUpButton>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="landing-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean & Minimal) */}
      {mobileMenuOpen && (
        <div className="landing-mobile-drawer minimal">
          <a 
            href="#features" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection(e, '#features')}
          >
            Features
          </a>
          <a 
            href="#biomechanics" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection(e, '#biomechanics')}
          >
            Biomechanics
          </a>
          <a 
            href="#training" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection(e, '#training')}
          >
            {t('landingTraining', 'Training & Workouts')}
          </a>
          <a 
            href="#faq" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection(e, '#faq')}
          >
            {t('landingFaq', 'FAQ')}
          </a>
          <div className="mobile-drawer-footer">
            {isSignedIn ? (
              <button 
                className="landing-btn-signup full-width"
                onClick={handleCtaClick}
              >
                <span>{t('landingGoToDashboard', 'Go to Dashboard')}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="landing-btn-signup full-width">
                  <span>{t('landingGetStarted', 'Get Started')}</span>
                  <ArrowRight size={16} />
                </button>
              </SignUpButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
