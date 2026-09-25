import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Sparkles, Video, Dumbbell, Flame, HeartPulse, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './GlobalTaskBanner.css';

export const GlobalTaskBanner = () => {
  const { videoAnalysisTask, dietTask, combinedTask, workoutTask, strengthTask } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTasks = [];

  if (videoAnalysisTask.isRunning) {
    activeTasks.push({
      id: 'video',
      title: 'Bowling Biomechanics Engine',
      stage: videoAnalysisTask.stage || 'Calculating 3D joint angles & kinetic chain...',
      progress: videoAnalysisTask.progress || 20,
      path: '/analyzer',
      icon: Video,
      color: 'cyan'
    });
  }

  if (dietTask.isRunning) {
    activeTasks.push({
      id: 'diet',
      title: 'Nutrition & Macro Synthesis',
      stage: dietTask.stage || 'Structuring high-protein fast bowling meal schedule...',
      path: '/diet',
      icon: Flame,
      color: 'emerald'
    });
  }

  if (combinedTask.isRunning) {
    activeTasks.push({
      id: 'combined',
      title: 'Workload & Nutrition Protocol',
      stage: combinedTask.stage || 'Synthesizing bowling spell limits & recovery protocol...',
      path: '/training',
      icon: Dumbbell,
      color: 'sky'
    });
  }

  if (workoutTask.isRunning) {
    activeTasks.push({
      id: 'workout',
      title: 'Workout Periodization Plan',
      stage: workoutTask.stage || 'Designing gym & bowling schedule...',
      path: '/workout',
      icon: Dumbbell,
      color: 'amber'
    });
  }

  if (strengthTask.isRunning) {
    activeTasks.push({
      id: 'strength',
      title: 'Kinetic Strength & Injury Assessment',
      stage: strengthTask.stage || 'Evaluating lead leg brace & posterior chain capacity...',
      path: '/training?tab=strength',
      icon: HeartPulse,
      color: 'rose'
    });
  }

  if (activeTasks.length === 0) return null;

  return (
    <div className="global-tasks-floating-container">
      {activeTasks.map((task) => {
        const Icon = task.icon;
        const isCurrentPage = location.pathname === task.path || (task.path.includes('?') && location.search.includes('tab=strength'));

        return (
          <div 
            key={task.id} 
            className={`global-task-pill animate-fade-in ${task.color}`}
            onClick={() => !isCurrentPage && navigate(task.path)}
            style={{ cursor: isCurrentPage ? 'default' : 'pointer' }}
          >
            <div className="task-pill-left">
              <div className="task-spinner-icon">
                <RefreshCw size={14} className="animate-spin" />
              </div>
              <div className="task-info">
                <div className="task-title-row">
                  <Icon size={13} className="task-type-icon" />
                  <span className="task-title">{task.title}</span>
                  {task.progress !== undefined && (
                    <span className="task-pct">{task.progress}%</span>
                  )}
                </div>
                <span className="task-stage-text">{task.stage}</span>
              </div>
            </div>

            {!isCurrentPage && (
              <button 
                type="button" 
                className="task-view-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(task.path);
                }}
              >
                <span>View</span>
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
