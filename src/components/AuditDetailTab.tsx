import React from 'react';
import { Eye, AlertTriangle, Lightbulb, TrendingUp, CheckCircle, Smartphone, ShieldCheck, MousePointerClick } from 'lucide-react';
import { Lead } from '../types';

interface AuditDetailTabProps {
  lead: Lead;
}

export const AuditDetailTab: React.FC<AuditDetailTabProps> = ({ lead }) => {
  if (lead.auditStatus === 'pending' || lead.auditStatus === 'auditing') {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Gemini Vision is auditing website screenshot...</p>
      </div>
    );
  }

  if (!lead.auditDetails) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        No audit findings recorded yet.
      </div>
    );
  }

  const { observation, insight, gap, conversionBottlenecks, quickWins, mobileUsabilityScore, trustSignalScore, ctaClarityScore } = lead.auditDetails;

  return (
    <div className="space-y-5 text-xs text-slate-300">
      {/* Observation -> Insight -> Gap Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Observation */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
            <Eye className="w-4 h-4 shrink-0" />
            <span className="uppercase tracking-wider text-[11px]">1. Observation</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">{observation}</p>
        </div>

        {/* Insight */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span className="uppercase tracking-wider text-[11px]">2. Insight</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">{insight}</p>
        </div>

        {/* Gap */}
        <div className="bg-slate-900/80 border border-amber-500/30 bg-amber-950/10 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="uppercase tracking-wider text-[11px]">3. Revenue Gap</span>
          </div>
          <p className="text-slate-200 leading-relaxed text-xs font-medium">{gap}</p>
        </div>
      </div>

      {/* Breakdown Scores */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mobile Usability */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-1.5 text-slate-400 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mobile UX</span>
            </span>
            <span className="font-bold text-white">{mobileUsabilityScore || 65}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${mobileUsabilityScore || 65}%` }} />
          </div>
        </div>

        {/* Trust Signals */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-1.5 text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trust Signals</span>
            </span>
            <span className="font-bold text-white">{trustSignalScore || 70}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${trustSignalScore || 70}%` }} />
          </div>
        </div>

        {/* CTA Clarity */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="flex items-center space-x-1.5 text-slate-400 font-medium">
              <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
              <span>CTA Clarity</span>
            </span>
            <span className="font-bold text-white">{ctaClarityScore || 58}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${ctaClarityScore || 58}%` }} />
          </div>
        </div>
      </div>

      {/* Conversion Bottlenecks & Quick Wins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bottlenecks */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <h4 className="font-bold text-rose-400 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conversion Bottlenecks</span>
          </h4>
          <ul className="space-y-1.5">
            {conversionBottlenecks?.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-slate-300">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Wins */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <h4 className="font-bold text-emerald-400 flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Recommended Fixes</span>
          </h4>
          <ul className="space-y-1.5">
            {quickWins?.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
