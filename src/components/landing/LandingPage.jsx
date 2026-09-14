import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Video,
  Activity,
  Dumbbell,
  Flame,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Camera,
  Layers,
  Gauge,
  Sliders,
  Play
} from 'lucide-react';
import { SignInButton, SignUpButton, useUser } from '@clerk/react';
import { LandingNavbar } from './LandingNavbar';
import { SynchronizedMetricsTable } from '../common/SynchronizedMetricsTable';
import './LandingPage.css';

export const LandingPage = ({ onEnterDashboard }) => {
  const { isSignedIn } = useUser();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What camera angles are required for 3-View Biomechanics?",
      a: "PacePro AI works best with three synchronized camera angles: Front (facing down the pitch), Side/Pop (square to the crease for knee brace & stride mechanics), and Rear (behind the bowler for arm slot & spine alignment). You can also upload a single side-view video for instant basic analysis."
    },
    {
      q: "How does PacePro calculate front-knee brace stiffness?",
      a: "Our computer vision pipeline tracks 33 kinematic landmarks per frame at up to 120 FPS. We triangulate the hip-knee-ankle vertices at the exact millisecond of Front-Foot Strike (FFS) to calculate angular deflection and measure whether the knee flexes or holds rigid."
    },
    {
      q: "How does PacePro AI prevent lumbar stress fractures?",
      a: "Lumbar stress fractures commonly occur when bowlers combine mixed actions (counter-rotation between hips and shoulders) with excessive hyperextension. PacePro monitors hip-shoulder separation angle in the horizontal plane and alerts bowlers before dangerous shear loads injure the spine."
    },
    {
      q: "Can coaches and academies use PacePro AI for multiple athletes?",
      a: "Yes! Coaches can track entire fast-bowling squads, compare release metrics across sessions, export PDF biomechanics audit cards, and generate tailored periodized strength & conditioning routines."
    },
    {
      q: "Do I need special sensors, gyros, or expensive wearable hardware?",
      a: "No special hardware required! PacePro AI uses pure computer vision and high-definition mobile/action camera video. Any 60fps or 120fps smartphone video from modern iPhones or Android devices is supported."
    }
  ];

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.querySelector('#features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page-root">
      {/* Navigation Header */}
      <LandingNavbar onLaunchDashboard={onEnterDashboard} />

      {/* Redesigned Centered Cinematic Hero Section */}
      <section className="landing-hero-section centered-hero">
        <div className="hero-background-glow">
          <div className="glow-sphere sphere-cyan"></div>
          <div className="glow-sphere sphere-blue"></div>
          <div className="glow-grid"></div>
        </div>

        <div className="landing-container hero-centered-layout">
          {/* Eyebrow Pill Badge */}
          <div className="hero-pill-badge">
            <Sparkles size={14} className="pill-icon" />
            <span>NEXT-GEN FAST-BOWLING BIOMECHANICS AI</span>
          </div>

          {/* Master Headline */}
          <h1 className="hero-headline centered">
            Master Fast Bowling <br />
            <span className="gradient-text">with Computer-Vision Biomechanics</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline centered">
            The premier cricket biomechanics platform engineered for fast bowlers, academies, and coaches.
            Multi-angle 3-view video triangulation, front-knee brace stiffness calculation,
            and kinetic energy sequencing to unlock maximum pace while protecting your spine from stress fractures.
          </p>

          {/* Exploratory CTA: Direct Scroll to Features (No auth buttons here) */}
          <div className="hero-explore-row">
            <a
              href="#features"
              className="hero-btn-explore"
              onClick={scrollToFeatures}
            >
              <Video size={18} />
              <span>Explore 3-View Biomechanics & Features</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="hero-trust-row centered">
            <div className="trust-item">
              <CheckCircle2 size={16} className="trust-icon" />
              <span>33 Joint Pose Estimation</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} className="trust-icon" />
              <span>120 FPS High-Speed CV Triangulation</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} className="trust-icon" />
              <span>Lumbar Spine Protection Matrix</span>
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} className="trust-icon" />
              <span>Zero Wearables or Sensors Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="landing-stats-bar">
        <div className="landing-container stats-grid">
          <div className="stat-box">
            <span className="stat-number">+6.8%</span>
            <span className="stat-label">Avg. Speed Increase</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">33</span>
            <span className="stat-label">Pose Keypoints Tracked</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">42%</span>
            <span className="stat-label">Lower Lumbar Shear Stress</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">&lt; 15s</span>
            <span className="stat-label">AI Multi-View Processing</span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="landing-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <div className="section-pill">ENGINEERED FOR FAST BOWLERS</div>
            <h2 className="section-title">
              Complete High-Performance <br />
              <span className="gradient-text">Bowling Intelligence Stack</span>
            </h2>
            <p className="section-subtitle">
              Every element of fast bowling broken down into actionable, science-backed improvements.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper cyan">
                <Video size={24} />
              </div>
              <h3 className="feature-title">3-View Multi-Angle Triangulation</h3>
              <p className="feature-desc">
                Front, Side, and Rear video feeds are synchronized to reconstruct full 3D body orientation,
                eliminating single-camera parallax distortion.
              </p>
              <div className="feature-tag">Side • Front • Rear Sync</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper emerald">
                <Activity size={24} />
              </div>
              <h3 className="feature-title">Kinetic Chain Energy Sequencer</h3>
              <p className="feature-desc">
                Tracks the kinetic wave from run-up deceleration through pelvis rotation, trunk flexion,
                and final wrist release to eliminate energy leaks.
              </p>
              <div className="feature-tag">Momentum Conservation</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper blue">
                <ShieldCheck size={24} />
              </div>
              <h3 className="feature-title">Spinal & Knee Injury Prevention</h3>
              <p className="feature-desc">
                Continuous detection of mixed bowling actions, counter-rotation, and knee collapse
                to safeguard lumbar vertebrae against stress fractures.
              </p>
              <div className="feature-tag">Safe Kinetic Load</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper amber">
                <Dumbbell size={24} />
              </div>
              <h3 className="feature-title">Periodized Fast-Bowling Workouts</h3>
              <p className="feature-desc">
                Targeted routines for thoracic spine mobility, single-leg eccentric strength,
                and rotator cuff stability calibrated to your bowling action.
              </p>
              <div className="feature-tag">Plyometrics & Mobility</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper rose">
                <Flame size={24} />
              </div>
              <h3 className="feature-title">Cricket Workload Nutrition Engine</h3>
              <p className="feature-desc">
                Calculates carbohydrate, protein, and electrolyte targets according to match spells,
                training overs bowled, and post-session recovery speed.
              </p>
              <div className="feature-tag">High-Workload Fueling</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper purple">
                <Sparkles size={24} />
              </div>
              <h3 className="feature-title">Conversational AI Bowling Coach</h3>
              <p className="feature-desc">
                Ask questions about your latest delivery analysis, run-up stride cadence, or ball seam mechanics
                and receive immediate biomechanical coaching guidance.
              </p>
              <div className="feature-tag">24/7 AI Coach</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-View Biomechanics Deep Dive Section */}
      <section id="biomechanics" className="landing-section dark-alt">
        <div className="landing-container">
          <div className="biomechanics-split">
            <div className="biomechanics-text">
              <div className="section-pill">MULTI-CAMERA COMPUTER VISION</div>
              <h2 className="section-title">
                3-View Synchronized <br />
                <span className="gradient-text">Kinematic Triangulation</span>
              </h2>
              <p className="section-desc">
                Single-camera apps suffer from angular perspective distortion. PacePro AI processes all three
                fundamental views of modern bowling analysis simultaneously:
              </p>

              <div className="camera-views-list">
                <div className="camera-view-item">
                  <div className="view-num">01</div>
                  <div className="view-content">
                    <h4>Side View (Crease Level)</h4>
                    <p>Measures front-knee brace stiffness, hip-shoulder angle separation, and stride length percentage.</p>
                  </div>
                </div>

                <div className="camera-view-item">
                  <div className="view-num">02</div>
                  <div className="view-content">
                    <h4>Front View (Pitch Alignment)</h4>
                    <p>Monitors head stability at release, non-bowling arm pull-down, and front foot landing alignment.</p>
                  </div>
                </div>

                <div className="camera-view-item">
                  <div className="view-num">03</div>
                  <div className="view-content">
                    <h4>Rear View (Grip & Slot)</h4>
                    <p>Tracks arm delivery trajectory, lateral trunk flexion, and pelvis orientation during back-foot impact.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="biomechanics-card-showcase">
              <div className="showcase-card">
                <div className="showcase-card-header">
                  <span className="showcase-tag">SYNCHRONIZED METRICS REPORT</span>
                  <span className="showcase-indicator">AI VERIFIED</span>
                </div>

                <SynchronizedMetricsTable />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kinetic Chain Interactive Explainer */}
      <section id="kinetic-chain" className="landing-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <div className="section-pill">KINETIC ENERGY TRANSFER</div>
            <h2 className="section-title">
              How the Kinetic Chain Works <br />
              <span className="gradient-text">From Crease to Crease</span>
            </h2>
            <p className="section-subtitle">
              Pace is generated through the ground up. PacePro tracks every link in your physiological chain.
            </p>
          </div>

          <div className="kinetic-steps-grid">
            <div className="kinetic-step-card">
              <div className="step-badge">Phase 1</div>
              <h4>Run-Up Velocity</h4>
              <p>Conversion of linear running momentum into angular torque without stuttering before the bound.</p>
            </div>
            <div className="kinetic-step-card">
              <div className="step-badge">Phase 2</div>
              <h4>Back-Foot Contact</h4>
              <p>Foot strikes perpendicular to create stable pivot base, loading torso musculature like an archery bow.</p>
            </div>
            <div className="kinetic-step-card highlight">
              <div className="step-badge">Phase 3</div>
              <h4>Front-Foot Rigid Brace</h4>
              <p>The front leg acts as an unyielding brake. All forward kinetic energy catapults upward through the torso.</p>
            </div>
            <div className="kinetic-step-card">
              <div className="step-badge">Phase 4</div>
              <h4>Ball Release Snap</h4>
              <p>Maximum arm extension, wrist snap, and safe decelerating follow-through across the body.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Training & Diet Section */}
      <section id="training" className="landing-section dark-alt">
        <div className="landing-container">
          <div className="section-header text-center">
            <div className="section-pill">HOLISTIC ATHLETE DEVELOPMENT</div>
            <h2 className="section-title">
              Personalized Training & <br />
              <span className="gradient-text">High-Workload Fueling Plans</span>
            </h2>
            <p className="section-subtitle">
              Combine world-class biomechanics with customized strength routines and nutrition.
            </p>
          </div>

          <div className="training-synergy-grid">
            <div className="synergy-card workout-card">
              <div className="synergy-header">
                <Dumbbell className="synergy-icon" size={26} />
                <div>
                  <h3>Fast-Bowling Workouts</h3>
                  <span className="synergy-sub">Speed, Power & Durability</span>
                </div>
              </div>
              <ul className="synergy-list">
                <li><CheckCircle2 size={16} /> <strong>Single-Leg Drop Jumps:</strong> Builds front-leg eccentric brace tolerance.</li>
                <li><CheckCircle2 size={16} /> <strong>Thoracic Rotational Slams:</strong> Enhances rotational torso snap.</li>
                <li><CheckCircle2 size={16} /> <strong>Rotator Cuff Deceleration:</strong> Safeguards shoulder against tearing forces.</li>
                <li><CheckCircle2 size={16} /> <strong>Sprint Mechanics:</strong> Optimizes approach speed and stride cadence.</li>
              </ul>
            </div>

            <div className="synergy-card diet-card">
              <div className="synergy-header">
                <Flame className="synergy-icon" size={26} />
                <div>
                  <h3>Cricket Macro Engine</h3>
                  <span className="synergy-sub">Fueling & Muscle Recovery</span>
                </div>
              </div>
              <ul className="synergy-list">
                <li><CheckCircle2 size={16} /> <strong>Over-Based Energy Scaling:</strong> Calibrated to 10-15 overs of high intensity.</li>
                <li><CheckCircle2 size={16} /> <strong>High-Leucine Protein Timing:</strong> Speeds micro-tear recovery in fast-twitch fibers.</li>
                <li><CheckCircle2 size={16} /> <strong>Electrolyte & Hydration:</strong> Prevents cramping during intense multi-spell spells.</li>
                <li><CheckCircle2 size={16} /> <strong>Anti-Inflammatory Nutrition:</strong> Protects joints, tendons, and spine.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="landing-section">
        <div className="landing-container faq-container">
          <div className="section-header text-center">
            <div className="section-pill">GOT QUESTIONS?</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about PacePro AI and how it analyzes your bowling.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item ${openFaq === idx ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openFaq === idx && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner (Only 1 of 2 places with auth buttons) */}
      <section className="landing-cta-banner">
        <div className="landing-container">
          <div className="cta-banner-box">
            <div className="cta-sphere"></div>
            <h2 className="cta-headline">
              Ready to Bowl Faster, Straighter, <br />
              and With Zero Knee Collapse?
            </h2>
            <p className="cta-sub">
              Join fast bowlers, cricket academies, and coaches taking their performance to professional heights.
            </p>

            <div className="cta-buttons">
              {isSignedIn ? (
                <button
                  className="hero-btn-primary"
                  onClick={onEnterDashboard}
                >
                  <span>Open Your Dashboard</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <button className="hero-btn-primary">
                      <span>Create Free Account</span>
                      <ArrowRight size={18} />
                    </button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <button className="hero-btn-secondary">
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div className="footer-brand-col">
            <div className="landing-brand">
              <div className="landing-logo-icon">
                <Zap size={20} />
              </div>
              <span className="brand-name">PACEPRO <span className="brand-highlight">AI</span></span>
            </div>
            <p className="footer-tagline">
              Olympic-grade cricket bowling biomechanics, multi-angle computer vision, and athletic performance intelligence.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#biomechanics">3-View Biomechanics</a>
            <a href="#kinetic-chain">Kinetic Chain</a>
            <a href="#training">Workout & Nutrition</a>
          </div>

          <div className="footer-links-col">
            <h4>Cricket Science</h4>
            <a href="#biomechanics">Front-Knee Brace</a>
            <a href="#biomechanics">Spine Injury Matrix</a>
            <a href="#features">Arm Slot Analysis</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <a href="#features">Pose Estimation AI</a>
            <a href="#biomechanics">Knee Brace Analysis</a>
            <a href="#kinetic-chain">Kinetic Sequencer</a>
            <a href="#training">Fast Bowling Drills</a>
          </div>
        </div>

        <div className="landing-container footer-bottom-bar">
          <span>&copy; {new Date().getFullYear()} PacePro AI. All rights reserved. Built with Clerk Authentication.</span>
          <span className="footer-badge">Cricket Biomechanics Intelligence Platform</span>
        </div>
      </footer>
    </div>
  );
};
