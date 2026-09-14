import React, { useState } from 'react';
import { 
  History, 
  Video, 
  Dumbbell, 
  Flame, 
  Bot, 
  ChevronRight, 
  Calendar,
  Sparkles,
  Trash2,
  ExternalLink,
  Utensils,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './HistoryTimeline.css';

export const HistoryTimeline = () => {
  const { historyList, navigateTo, removeHistoryItem } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'bowling' | 'workout' | 'diet' | 'chat'
  const [expandedDietMeals, setExpandedDietMeals] = useState({});

  const toggleMealsExpand = (e, itemId) => {
    e.stopPropagation();
    setExpandedDietMeals((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const filteredItems = historyList.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'workout' && item.type === 'combined_plan') return true;
    return item.type === filter;
  });

  const handleItemClick = (item) => {
    if (item.type === 'bowling') {
      navigateTo('analyzer', { analysis: item.detail });
    } else if (item.type === 'workout') {
      navigateTo('workout', { workout: item.detail });
    } else if (item.type === 'diet') {
      navigateTo('diet', { diet: item.detail });
    } else if (item.type === 'combined_plan') {
      navigateTo('training', { combined: item.detail });
    } else if (item.type === 'chat') {
      navigateTo('chat');
    }
  };

  const handleDelete = (e, itemId) => {
    e.stopPropagation();
    if (window.confirm("Remove this generation record from history and database?")) {
      removeHistoryItem(itemId);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'bowling': return <Video size={18} className="text-cyan" />;
      case 'workout': 
      case 'combined_plan': return <Dumbbell size={18} className="text-amber" />;
      case 'diet': return <Flame size={18} className="text-emerald" />;
      default: return <Bot size={18} className="text-purple-400" />;
    }
  };

  return (
    <div className="history-page-container">
      {/* Header */}
      <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="page-title text-2xl font-bold flex items-center gap-2">
              <History className="text-cyan" size={26} /> Performance History Timeline
            </h2>
            <span className="auto-prune-pill flex items-center gap-1">
              <Sparkles size={12} className="text-cyan" />
              Auto-Retains 3 Generations
            </span>
          </div>
          <p className="page-subtitle text-muted text-sm mt-1">
            Persisted in MongoDB Atlas. Automatically stores your newest reports while pruning older generations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs-pills flex gap-2">
          {['all', 'bowling', 'workout', 'diet', 'chat'].map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="history-timeline-list flex flex-col gap-4">
        {filteredItems.map((item) => {
          const isDiet = item.type === 'diet';
          const dietMeals = isDiet ? (item.detail?.meals || item.detail?.meal_plan || []) : null;

          const isMealsExpanded = expandedDietMeals[item.id];

          return (
            <div 
              key={item.id} 
              className={`history-item-card glass-card glass-card-interactive p-4 animate-fade-in ${isDiet ? 'diet-history-card' : ''}`}
              onClick={() => handleItemClick(item)}
              title="Click to view and restore this generation into active dashboard"
            >
              <div className="history-item-main-row flex items-center justify-between gap-4">
                <div className="history-item-left flex items-center gap-4">
                  <div className={`item-type-icon-wrapper ${item.type}`}>
                    {getIconForType(item.type)}
                  </div>

                  <div className="item-details flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="item-date text-xs font-bold text-muted flex items-center gap-1">
                        <Calendar size={12} /> {item.date}
                      </span>
                      <span className="badge badge-cyan uppercase text-xs">
                        {item.type === 'combined_plan' ? 'Workload & Diet' : item.type}
                      </span>
                    </div>
                    <h4 className="item-title font-bold text-primary text-base mt-1 flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="item-subtitle text-xs text-secondary">{item.subtitle}</p>
                  </div>
                </div>

                <div className="history-item-right flex items-center gap-3">
                  <span className="badge badge-emerald text-xs">{item.status}</span>
                  {isDiet && dietMeals && (
                    <button 
                      type="button"
                      className="history-expand-meals-btn"
                      onClick={(e) => toggleMealsExpand(e, item.id)}
                      title={isMealsExpanded ? "Hide meals" : "View generated meals"}
                    >
                      <Utensils size={13} className="text-emerald" />
                      <span>{isMealsExpanded ? "Hide Meals" : "View Meals"}</span>
                      {isMealsExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}
                  <button 
                    className="history-delete-icon-btn"
                    title="Delete this record"
                    onClick={(e) => handleDelete(e, item.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                  <div className="view-link-badge flex items-center gap-1 text-xs text-cyan font-bold">
                    <span>Open</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>

              {/* GENERATED MEALS DISPLAY FOR DIET ITEMS */}
              {isDiet && dietMeals && (
                <div className="history-diet-meals-section mt-3 pt-3 border-t border-white/5">
                  <div className="history-meals-preview-pills flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                      <Utensils size={12} className="text-emerald" /> Generated Meals:
                    </span>
                    {dietMeals.slice(0, 4).map((meal, mIdx) => (
                      <span key={mIdx} className="history-meal-pill" title={meal.items?.join(', ')}>
                        <span className="meal-pill-type">{meal.type}:</span>
                        <span className="meal-pill-title truncate max-w-[140px]">{meal.title || meal.items?.[0] || 'Nutrient fuel'}</span>
                        {meal.protein_g && <span className="meal-pill-protein">{meal.protein_g}g P</span>}
                      </span>
                    ))}
                    {dietMeals.length > 4 && (
                      <span className="text-[11px] text-muted font-mono">+{dietMeals.length - 4} more</span>
                    )}
                  </div>

                  {/* EXPANDABLE MEALS BREAKDOWN DRAWER */}
                  {isMealsExpanded && (
                    <div className="history-meals-expanded-drawer mt-3 p-3.5 rounded-xl bg-black/20 border border-white/10 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs font-bold text-emerald flex items-center gap-1.5">
                          <Flame size={14} /> Complete Generated Daily Meal Schedule
                        </span>
                        <span className="text-[11px] text-muted">
                          Click 'Open' to view full nutrition macros & coach assessment
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {dietMeals.map((meal, mIdx) => (
                          <div key={mIdx} className="history-meal-row p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                            <div className="flex justify-between items-center mb-1">
                              <span className="badge badge-cyan text-[10px]">{meal.type}</span>
                              {meal.time && (
                                <span className="text-[10px] text-muted flex items-center gap-1">
                                  <Clock size={10} /> {meal.time}
                                </span>
                              )}
                              {meal.calories && (
                                <span className="text-[10px] font-mono text-emerald font-bold">
                                  {meal.calories} kcal • {meal.protein_g}g P
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-primary truncate mb-1">{meal.title}</h5>
                            {Array.isArray(meal.items) && meal.items.length > 0 && (
                              <ul className="text-[11px] text-secondary pl-3 space-y-0.5 list-disc marker:text-emerald">
                                {meal.items.slice(0, 3).map((it, itIdx) => (
                                  <li key={itIdx} className="truncate">{it}</li>
                                ))}
                                {meal.items.length > 3 && (
                                  <li className="text-[10px] text-muted list-none">+{meal.items.length - 3} more items</li>
                                )}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                          onClick={() => handleItemClick(item)}
                        >
                          <span>Open in Diet Dashboard</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="empty-history-box glass-card p-10 text-center text-muted">
            <History size={40} className="mx-auto mb-3 opacity-30 text-cyan" />
            <h4 className="font-bold text-primary text-base mb-1">No Activity Records Found</h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Analyze a delivery in Video Analyzer or generate a 7-day Workout & Diet protocol to auto-populate your database history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
