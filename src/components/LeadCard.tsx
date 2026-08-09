import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  Eye,
  Sparkles,
  Camera,
  Maximize2,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Lead } from '../types';
import { AuditDetailTab } from './AuditDetailTab';
import { ColdEmailTab } from './ColdEmailTab';

interface LeadCardProps {
  lead: Lead;
  index: number;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, index }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'email'>('audit');
  const [isScreenshotZoomed, setIsScreenshotZoomed] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'bg-slate-800 text-slate-400 border-slate-700';
    if (score >= 75) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  const getScoreBadgeText = (score?: number) => {
    if (score === undefined) return 'Auditing...';
    if (score >= 75) return 'Good Conversion';
    if (score >= 50) return 'Moderate Gaps';
    return 'Critical Revenue Leak';
  };

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-600 transition-all group"
      >
        {/* Lead Header */}
        <div className="p-5 border-b border-slate-700/60 bg-gradient-to-r from-slate-800/80 via-slate-800 to-slate-900/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {lead.category || 'Local Business'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lead.city}, {lead.state}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>{lead.name}</span>
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-mono"
                >
                  <span className="truncate max-w-[200px] sm:max-w-xs">{lead.website}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>

                {lead.phone && (
                  <span className="flex items-center space-x-1 text-slate-300">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{lead.phone}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right: Score & Email Indicator */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              {/* Audit Score Badge */}
              <div className={`px-3.5 py-2 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(lead.auditScore)}`}>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-extrabold leading-none">
                    {lead.auditScore !== undefined ? lead.auditScore : '--'}
                  </span>
                  <span className="text-[10px] opacity-75">/100</span>
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5">
                  {getScoreBadgeText(lead.auditScore)}
                </span>
              </div>

              {/* Email Extracted Status */}
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2 flex flex-col justify-center text-xs space-y-0.5 min-w-[170px]">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Contact Email
                </span>
                {lead.foundEmail ? (
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-emerald-400 font-mono font-medium truncate max-w-[130px]" title={lead.foundEmail}>
                      {lead.foundEmail}
                    </span>
                    <button
                      onClick={() => handleCopyEmail(lead.foundEmail!)}
                      className="text-slate-400 hover:text-emerald-300 p-1 rounded transition-colors cursor-pointer"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium text-[11px]">Email needed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot & Tab Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Screenshot Thumbnail Column */}
          <div className="lg:col-span-4 bg-slate-900/60 p-4 border-b lg:border-b-0 lg:border-r border-slate-700/60 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1 font-medium text-slate-300">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Microlink Screenshot</span>
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300 border border-slate-700">
                  Live Capture
                </span>
              </div>

              {/* Thumbnail Container */}
              <div className="relative group/thumb rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video flex items-center justify-center">
                {lead.screenshotUrl ? (
                  <>
                    <img
                      src={lead.screenshotUrl}
                      alt={`${lead.name} Screenshot`}
                      className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback screenshot placeholder
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => setIsScreenshotZoomed(true)}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1 cursor-pointer"
                    >
                      <Maximize2 className="w-5 h-5 text-indigo-300" />
                      <span className="text-xs font-semibold">Expand Screenshot</span>
                    </button>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs">
                    Screenshot capturing...
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span>Source Crawl:</span>
                <span className="text-slate-300 font-mono">/contact, /about</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Model:</span>
                <span className="text-indigo-400 font-medium">Gemini 3.6 Flash</span>
              </div>
            </div>
          </div>

          {/* Right Tabbed Content Column */}
          <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-3">
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Audit Findings</span>
              </button>

              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'email'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cold Email Draft</span>
                {lead.foundEmail && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Tab Panels */}
            <div className="min-h-[220px]">
              {activeTab === 'audit' ? (
                <AuditDetailTab lead={lead} />
              ) : (
                <ColdEmailTab lead={lead} />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Screenshot Expand Modal */}
      {isScreenshotZoomed && lead.screenshotUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{lead.name} - Website Screenshot</h4>
                <p className="text-xs text-slate-400 font-mono">{lead.website}</p>
              </div>
              <button
                onClick={() => setIsScreenshotZoomed(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-slate-950 flex justify-center">
              <img
                src={lead.screenshotUrl}
                alt="Full Screenshot"
                className="max-w-full h-auto rounded-lg shadow-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
