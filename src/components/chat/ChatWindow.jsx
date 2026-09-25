import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  Bot, 
  RefreshCw, 
  Video, 
  Activity, 
  Dumbbell, 
  Flame, 
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  Mic,
  Plus,
  Languages,
  Globe,
  Trophy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sendChatMessageApi } from '../../services/api';
import { RichMessageCard } from './RichMessageCard';
import './ChatWindow.css';

export const ChatWindow = () => {
  const { 
    chatMessages, 
    addChatMessage, 
    navigateTo, 
    userProfile, 
    latestBowlingAnalysis, 
    activeDietPlan, 
    activeWorkplan,
    activeCombinedPlan,
    pendingChatPrompt,
    setPendingChatPrompt
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [chatLanguage, setChatLanguage] = useState(() => {
    return localStorage.getItem('pacepro_chat_language') || 'hinglish';
  });

  const handleLanguageChange = (newLang) => {
    setChatLanguage(newLang);
    try {
      localStorage.setItem('pacepro_chat_language', newLang);
    } catch(e) {}
  };

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const suggestedPrompts = chatLanguage === 'hinglish' ? [
    { 
      title: "Cricket Trials & Selection", 
      desc: "Mere area me fast bowling trials kab hote hain aur selection process kya hai?",
      icon: Trophy, 
      query: "Coach, mere area me cricket trials aur state/district team selection ka roadmap kya hai? Selectors kya dekhte hain?" 
    },
    { 
      title: "Bowling Video Analysis", 
      desc: "3-view video upload karke knee brace aur arm slot angles calculate karo",
      icon: Video, 
      action: () => navigateTo('analyzer') 
    },
    { 
      title: "Diet & Protein Fueling", 
      desc: "Bowling workload ke hisaab se calories, egg/paneer aur protein targets",
      icon: Flame, 
      query: "Coach, mera daily protein requirement aur match day nutrition explain karo" 
    },
    { 
      title: "130+ Speed & Seam Craft", 
      desc: "Outswing, wobble seam aur 130+ pace unlock karne ke key biomechanical cues",
      icon: Dumbbell, 
      query: "Coach, 130+ km/h pace ke sath outswing aur wobble seam bowl karne ki technique batao" 
    }
  ] : [
    { 
      title: "Cricket Trials & Selection", 
      desc: "Find fast bowling trials in my area & the district/state selection roadmap",
      icon: Trophy, 
      query: "Coach, how do I find fast bowling trials in my area and what is the state/district selection pathway?" 
    },
    { 
      title: "Analyze My Delivery", 
      desc: "Upload 3-view video clips to calculate knee brace & arm slot angles",
      icon: Video, 
      action: () => navigateTo('analyzer') 
    },
    { 
      title: "Explain Fueling & Macros", 
      desc: "How calories & daily protein match my current bowling overs",
      icon: Flame, 
      query: "Coach, breakdown my daily protein target and fueling strategy based on my bowling overs" 
    },
    { 
      title: "130+ Velocity & Seam Craft", 
      desc: "Mechanical adjustments for 130+ km/h pace, outswing & wobble seam",
      icon: Dumbbell, 
      query: "Coach, what specific mechanical adjustments unlock 130+ km/h pace with outswing and wobble seam?" 
    }
  ];

  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    if (chatMessages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const mainEl = document.querySelector('.main-content');
      if (mainEl) mainEl.scrollTop = 0;
      const chatBody = document.querySelector('.gemini-chat-body');
      if (chatBody) chatBody.scrollTop = 0;
      return;
    }

    if (chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages.length, isTyping]);

  useEffect(() => {
    if (pendingChatPrompt) {
      const promptToDispatch = pendingChatPrompt;
      setPendingChatPrompt(null);
      setTimeout(() => {
        handleSend(promptToDispatch);
      }, 150);
    }
  }, [pendingChatPrompt]);

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim() && !attachment) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachment ? { name: attachment.name, type: attachment.type } : null
    };

    addChatMessage(userMsg);
    if (!overrideText) setInputText('');
    setAttachment(null);
    setIsTyping(true);

    const lowerText = textToSend.toLowerCase();

    // Fast Client-Side Navigation Intercepts
    if (lowerText === 'analyze my bowling' || lowerText.includes('open video analyzer')) {
      setTimeout(() => {
        addChatMessage({
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: chatLanguage === 'hinglish' 
            ? "Video Analyzer open kar raha hoon... Yahan multi-view angles upload karke front-knee brace test karo!"
            : "Opening Video Analyzer... Ready to process multi-view bowling clips!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setIsTyping(false);
        navigateTo('analyzer');
      }, 500);
      return;
    }

    try {
      // Call backend context-aware endpoint
      const response = await sendChatMessageApi({
        message: textToSend,
        language: chatLanguage,
        history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
        athlete_profile: userProfile,
        latest_analysis: latestBowlingAnalysis,
        active_diet: activeDietPlan,
        active_workout: activeWorkplan,
        active_combined_plan: activeCombinedPlan
      });

      let richCard = null;
      if (lowerText.includes('show full analysis card') && latestBowlingAnalysis) {
        richCard = { type: 'bowling_summary', data: latestBowlingAnalysis };
      } else if (lowerText.includes('show full diet card') && activeDietPlan) {
        richCard = { type: 'diet_card', data: activeDietPlan };
      }

      // Intelligent Action CTA Detection (Backend suggestions + Client intent matching)
      let actions = response.action_suggestions || [];
      const queryLower = textToSend.toLowerCase();
      const isDietIntent = queryLower.includes('diet') || queryLower.includes('nutrition') || queryLower.includes('protein') || queryLower.includes('meal') || queryLower.includes('khana') || queryLower.includes('macro') || queryLower.includes('calorie') || queryLower.includes('bnwa') || queryLower.includes('bana') || queryLower.includes('chart') || queryLower.includes('khao');
      
      const isRecallingAnalysis = latestBowlingAnalysis && (
        queryLower.includes('tunai') || queryLower.includes('tune') || queryLower.includes('kri thi') || queryLower.includes('kari thi') ||
        queryLower.includes('pehle') || queryLower.includes('already') || queryLower.includes('purani') || queryLower.includes('result') ||
        queryLower.includes('score') || queryLower.includes('pta hai') || queryLower.includes('pata hai') || queryLower.includes('yaad hai')
      ) && (
        queryLower.includes('video') || queryLower.includes('analyse') || queryLower.includes('analyze') || queryLower.includes('analysis') || queryLower.includes('action') || queryLower.includes('report')
      );

      const isAnalyzerIntent = queryLower.includes('video') || queryLower.includes('analyse') || queryLower.includes('analyze') || queryLower.includes('analysis') || queryLower.includes('action') || queryLower.includes('clip') || queryLower.includes('angle') || queryLower.includes('brace') || queryLower.includes('stride');
      const isWorkoutIntent = queryLower.includes('workout') || queryLower.includes('workload') || queryLower.includes('gym') || queryLower.includes('schedule') || queryLower.includes('routine');

      if (actions.length === 0) {
        if (isRecallingAnalysis) {
          actions.push({
            id: 'view_analysis',
            type: 'navigate',
            tab: 'analyzer',
            label: chatLanguage === 'hinglish' ? '📊 Meri Analysis Report & Skeleton Video Kholo' : '📊 View My Analysis Report & Video',
            primary: true
          });
        } else if (isDietIntent) {
          actions.push({
            id: 'go_diet',
            type: 'navigate',
            tab: 'diet',
            label: chatLanguage === 'hinglish' ? '🥗 Diet & Nutrition Planner Kholo' : '🥗 Open Diet Planner',
            primary: true
          });
          actions.push({
            id: 'go_training',
            type: 'navigate',
            tab: 'training',
            label: chatLanguage === 'hinglish' ? '⚡ Workload & Fueling Sync' : '⚡ Combined Plan',
            primary: false
          });
        } else if (isAnalyzerIntent) {
          actions.push({
            id: 'go_analyzer',
            type: 'navigate',
            tab: 'analyzer',
            label: chatLanguage === 'hinglish' ? '🎥 Bowling Video Analyzer Kholo' : '🎥 Open Video Analyzer',
            primary: true
          });
        } else if (isWorkoutIntent) {
          actions.push({
            id: 'go_workout',
            type: 'navigate',
            tab: 'workout',
            label: chatLanguage === 'hinglish' ? '🏋️ 7-Day Fast Bowling Schedule' : '🏋️ Open Workout Planner',
            primary: true
          });
        }
      }

      addChatMessage({
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply || (chatLanguage === 'hinglish' ? "Bhai main tumhara plan check kar raha hoon..." : "Checking your athletic protocol..."),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        richCard,
        actions
      });
    } catch (err) {
      console.error("Chat API error:", err);
      const athleteFirst = (userProfile?.name || 'Bowler').split(' ')[0];
      const queryLower = textToSend.toLowerCase();

      const isRecallingAnalysis = latestBowlingAnalysis && (
        queryLower.includes('tunai') || queryLower.includes('tune') || queryLower.includes('kri thi') || queryLower.includes('kari thi') ||
        queryLower.includes('pehle') || queryLower.includes('already') || queryLower.includes('purani') || queryLower.includes('result') ||
        queryLower.includes('score') || queryLower.includes('pta hai') || queryLower.includes('pata hai') || queryLower.includes('yaad hai')
      ) && (
        queryLower.includes('video') || queryLower.includes('analyse') || queryLower.includes('analyze') || queryLower.includes('analysis') || queryLower.includes('action') || queryLower.includes('report')
      );

      let fallbackText = chatLanguage === 'hinglish'
        ? `Coach bol raha hoon ${athleteFirst}! Front knee brace lock rakho aur daily protein target pura karo. Batao aaj kis drill pe kaam karna hai?`
        : `Coach here ${athleteFirst}! Keep that front knee braced firm and hit your daily protein target. What drill are we locking in today?`;

      const fallbackActions = [];
      if (isRecallingAnalysis) {
        const braceVal = latestBowlingAnalysis?.final_measurements?.view_fusion?.measurements?.front_knee_brace_change?.fused || '18';
        const gradeVal = latestBowlingAnalysis?.llm_report?.grade || 'A-';
        fallbackText = chatLanguage === 'hinglish'
          ? `Arre ${athleteFirst} bhai, 100% yaad hai! Humne jo delivery clip analyze ki thi usme tera front-knee brace ${braceVal}° tha aur grade ${gradeVal} aya tha. Neeche button se apni full report aur skeleton video dobara dekh le!`
          : `Of course I remember, ${athleteFirst}! In our video analysis, your front-knee brace was ${braceVal}° with a ${gradeVal} rating. Click below to review your report and watch your skeleton video!`;
        fallbackActions.push({
          id: 'view_analysis',
          type: 'navigate',
          tab: 'analyzer',
          label: chatLanguage === 'hinglish' ? '📊 Meri Analysis Report & Skeleton Video Kholo' : '📊 View My Analysis Report & Video',
          primary: true
        });
      } else if (queryLower.includes('diet') || queryLower.includes('protein') || queryLower.includes('khana') || queryLower.includes('bnwa') || queryLower.includes('chart')) {
        fallbackActions.push({
          id: 'go_diet',
          type: 'navigate',
          tab: 'diet',
          label: chatLanguage === 'hinglish' ? '🥗 Diet & Nutrition Planner Kholo' : '🥗 Open Diet Planner',
          primary: true
        });
      } else if (queryLower.includes('video') || queryLower.includes('analyse') || queryLower.includes('analyze') || queryLower.includes('action')) {
        fallbackActions.push({
          id: 'go_analyzer',
          type: 'navigate',
          tab: 'analyzer',
          label: chatLanguage === 'hinglish' ? '🎥 Bowling Video Analyzer Kholo' : '🎥 Open Video Analyzer',
          primary: true
        });
      }

      addChatMessage({
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: fallbackActions
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainEl = document.querySelector('.main-content');
    if (mainEl) mainEl.scrollTop = 0;
  }, []);

  return (
    <div className="gemini-chat-container">
      {/* Active Conversation Sticky Header (Only shown during active chat) */}
      {chatMessages.length > 0 && (
        <div className="gemini-chat-header animate-fade-in">
          <div className="chat-header-brand">
            <div className="chat-bot-icon-circle">
              <Zap size={15} className="text-cyan" />
            </div>
            <div className="chat-brand-text">
              <div className="flex items-center gap-2">
                <span className="chat-header-name">PacePro AI Assistant</span>
                <span className="online-badge">
                  <span className="online-dot"></span> Online
                </span>
              </div>
            </div>
          </div>

          <div className="chat-header-actions">
            <div className="chat-language-selector">
              <Languages size={13} className="text-cyan" />
              <div className="lang-buttons-group">
                <button
                  type="button"
                  className={`lang-btn ${chatLanguage === 'hinglish' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('hinglish')}
                  title="Hinglish (Hindi + English mix in Roman script)"
                >
                  Hinglish
                </button>
                <button
                  type="button"
                  className={`lang-btn ${chatLanguage === 'english' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('english')}
                  title="Pure Professional English"
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Scrollable Chat Body */}
      <div className={`gemini-chat-body ${chatMessages.length === 0 ? 'home-greeting-view' : ''}`}>
        {/* Welcome Section (Shown when thread is empty) */}
        {chatMessages.length === 0 && (
          <div className="gemini-welcome-hero animate-fade-in">
            {/* Primary Headline Greeting */}
            <h1 className="hero-greeting-text">
              Welcome to the Nets, {userProfile.name?.split(' ')[0] || userProfile.name || 'Champ'} 🏏
            </h1>

            <p className="hero-tagline">
              {chatLanguage === 'hinglish'
                ? 'Tera all-in-one cricket coach aur mentor. Area me trials dhundna ho, match tactics, bowling video analysis, ya high-protein diet—kuch bhi pucho!'
                : 'Your all-in-one cricket coach & bowling biomechanist. Local trials & selection pathways, seam tactics, video analysis, or high-protein fueling—ask anything!'}
            </p>

            {/* Bowler Attributes & Language Controls */}
            <div className="hero-middle-controls flex items-center justify-center gap-3 flex-wrap my-2 w-full max-w-[800px]">
              <div className="hero-badge-row">
                <span className="hero-chip-pill">⚡ {userProfile.arm || 'Fast Bowler'}</span>
                <span className="hero-chip-pill">🎯 {userProfile.target || 'Pace & Lumbar Protection'}</span>
                {userProfile.isStudent && <span className="hero-chip-pill student">🎓 Student Athlete</span>}
                <span className="hero-chip-pill">🔥 PR: {userProfile.peakSpeed || '135+ km/h'}</span>
              </div>

              {/* Language Switcher Pill */}
              <div className="chat-language-selector">
                <Languages size={13} className="text-cyan" />
                <div className="lang-buttons-group">
                  <button
                    type="button"
                    className={`lang-btn ${chatLanguage === 'hinglish' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('hinglish')}
                    title="Hinglish (Hindi + English mix in Roman script)"
                  >
                    Hinglish
                  </button>
                  <button
                    type="button"
                    className={`lang-btn ${chatLanguage === 'english' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('english')}
                    title="Pure Professional English"
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Subsystem Sync Indicators */}
            {(latestBowlingAnalysis || activeDietPlan || activeCombinedPlan || activeWorkplan) && (
              <div className="chat-context-pills flex items-center justify-center gap-1.5 text-xs my-1">
                {latestBowlingAnalysis && (
                  <span className="badge badge-emerald py-0.5 px-2 text-[10px]" title="Latest Bowling Biomechanics Loaded">
                    • Video Synced
                  </span>
                )}
                {(activeDietPlan || activeCombinedPlan) && (
                  <span className="badge badge-cyan py-0.5 px-2 text-[10px]" title="Diet & Nutrition Protocol Active">
                    • Diet Synced
                  </span>
                )}
                {(activeWorkplan || activeCombinedPlan) && (
                  <span className="badge badge-purple py-0.5 px-2 text-[10px]" title="Weekly Workplan Active">
                    • Plan Synced
                  </span>
                )}
              </div>
            )}

            <div className="hero-goals-list my-2">
              <div className="goal-item"><span className="dot-cyan">•</span> Cricket Trials & State Selection</div>
              <div className="goal-item"><span className="dot-cyan">•</span> 3-Angle Bowling Biomechanics</div>
              <div className="goal-item"><span className="dot-cyan">•</span> Seam Craft & Match Tactics</div>
              <div className="goal-item"><span className="dot-cyan">•</span> High-Protein Macro Fueling</div>
            </div>

            {/* Gemini-Style 4 Prompt Cards Grid */}
            <div className="gemini-cards-grid mt-4">
              {suggestedPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="gemini-prompt-card"
                    onClick={() => {
                      if (p.action) p.action();
                      else if (p.query) handleSend(p.query);
                    }}
                  >
                    <div className="card-top flex justify-between items-center mb-3">
                      <span className="prompt-card-title">{p.title}</span>
                      <div className="card-icon-bg">
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="prompt-card-desc">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="chat-thread-stream">
          {chatMessages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`gemini-msg-row ${isAI ? 'ai' : 'user'} animate-fade-in`}>
                <div className="msg-avatar-cell">
                  {isAI ? (
                    <div className="gemini-spark-avatar">
                      <Sparkles size={18} />
                    </div>
                  ) : (
                    <img src={userProfile.avatar} alt="User" className="user-avatar" />
                  )}
                </div>

                <div className="msg-body-cell">
                  <div className="msg-header-line">
                    <span className="author-name">{isAI ? 'PacePro AI' : userProfile.name}</span>
                    <span className="msg-time">{msg.timestamp}</span>
                  </div>

                  {msg.attachment && (
                    <div className="msg-file-attachment">
                      <Video size={16} />
                      <span>{msg.attachment.name}</span>
                    </div>
                  )}

                  <div className="msg-text-paragraph">{msg.text}</div>

                  {/* Action CTA Buttons (e.g. Open Diet Planner, Open Video Analyzer) */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="chat-action-buttons-group">
                      {msg.actions.map((act) => (
                        <button
                          key={act.id || act.tab}
                          type="button"
                          className={`chat-cta-btn ${act.primary ? 'primary' : 'secondary'}`}
                          onClick={() => navigateTo(act.tab)}
                        >
                          <span>{act.label}</span>
                          <ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.richCard && <RichMessageCard card={msg.richCard} />}

                  {isAI && (
                    <div className="msg-footer-actions">
                      <button 
                        className="icon-action-btn" 
                        title="Regenerate" 
                        onClick={() => handleSend("Explain my bowling biomechanics in detail.")}
                      >
                        <RefreshCw size={14} /> <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Animation Indicator */}
          {isTyping && (
            <div className="gemini-msg-row ai animate-fade-in">
              <div className="msg-avatar-cell">
                <div className="gemini-spark-avatar spinning">
                  <Sparkles size={18} />
                </div>
              </div>
              <div className="msg-body-cell">
                <div className="typing-pulse flex items-center gap-2 text-sm text-muted">
                  <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                  <span>PacePro AI is generating plan...</span>
                </div>
              </div>
            </div>
          )}

          {chatMessages.length > 0 && <div ref={messagesEndRef} />}
        </div>
      </div>

      {/* Floating Gemini Input Bar at Bottom */}
      <div className="gemini-floating-input-container">
        {attachment && (
          <div className="attachment-chip">
            <Video size={14} />
            <span>{attachment.name}</span>
            <button className="btn-icon text-muted" onClick={() => setAttachment(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="gemini-input-pill">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="video/*,image/*" 
            onChange={handleFileSelect}
          />
          
          <button 
            className="input-btn-circle" 
            onClick={() => fileInputRef.current?.click()}
            title="Attach Video or File"
            disabled={isTyping}
          >
            <Plus size={18} />
          </button>

          <textarea
            className="gemini-textarea"
            placeholder="Ask PacePro anything..."
            rows={1}
            value={inputText}
            disabled={isTyping}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button 
            className="input-btn-circle voice-placeholder" 
            title="Voice input placeholder"
            type="button"
          >
            <Mic size={18} />
          </button>

          <button 
            className="send-circle-btn"
            onClick={() => handleSend()}
            disabled={isTyping || (!inputText.trim() && !attachment)}
          >
            <Send size={16} />
          </button>
        </div>

        <span className="input-disclaimer-text">
          PacePro AI processes 3D joint kinematics and pose vectors to optimize athletic fast bowling.
        </span>
      </div>
    </div>
  );
};
