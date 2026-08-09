import React from 'react';
import { Search, Mail, Camera, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProgressBarProps {
  currentStep: ProcessingStep;
  progressPercent: number;
  currentLeadName?: string;
  processedCount: number;
  totalCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  progressPercent,
  currentLeadName,
  processedCount,
  totalCount
}) => {
  if (currentStep === 'idle') return null;

  const steps = [
    { id: 'scraping', label: 'Scraping Leads', icon: Search },
    { id: 'extracting_emails', label: 'Extracting Emails', icon: Mail },
    { id: 'capturing_screenshots', label: 'Capturing Screenshots', icon: Camera },
    { id: 'auditing', label: 'AI Web Audit', icon: Eye },
    { id: 'drafting', label: 'Drafting Emails', icon: Sparkles },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['scraping', 'extracting_emails', 'capturing_screenshots', 'auditing', 'drafting', 'completed'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (currentStep === 'completed' || stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-slate-800/95 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl shadow-indigo-950/50 mb-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Pipeline Status: {currentStep.replace('_', ' ')}
            </h3>
          </div>
          {currentLeadName && (
            <p className="text-xs text-indigo-300 mt-1">
              Currently processing: <span className="font-semibold text-white">{currentLeadName}</span> ({processedCount}/{totalCount})
            </p>
          )}
        </div>

        <div className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/60 self-start sm:self-auto">
          {Math.round(progressPercent)}% Completed
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-5">
        <div
          className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-indigo-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((s) => {
          const status = getStepStatus(s.id);
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                status === 'completed'
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : status === 'active'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Icon className={`w-4 h-4 shrink-0 ${status === 'active' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
              )}
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
