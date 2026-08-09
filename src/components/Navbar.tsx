import React, { useState } from 'react';
import { Target, Zap, ShieldCheck, Mail, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  senderName: string;
  setSenderName: (name: string) => void;
  totalLeads: number;
  emailsFound: number;
  avgScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  senderName,
  setSenderName,
  totalLeads,
  emailsFound,
  avgScore
}) => {
  const [isEditingSender, setIsEditingSender] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Target className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white tracking-tight">ProspectPilot</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Local Business Lead Scraper, Auditor & Cold Emailer
            </p>
          </div>
        </div>

        {/* Realtime Stats Bar */}
        {totalLeads > 0 && (
          <div className="hidden lg:flex items-center space-x-6 bg-slate-800/60 px-4 py-1.5 rounded-lg border border-slate-700/50 text-xs">
            <div className="flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Audited:</span>
              <span className="font-semibold text-white">{totalLeads}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Emails Found:</span>
              <span className="font-semibold text-emerald-400">{emailsFound}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Avg Score:</span>
              <span className="font-semibold text-white">{avgScore}/100</span>
            </div>
          </div>
        )}

        {/* Right Controls: Sender Signature Settings */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-slate-400 hidden md:inline">Signature:</span>
            {isEditingSender ? (
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                onBlur={() => setIsEditingSender(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingSender(false)}
                autoFocus
                className="bg-slate-900 text-white font-medium px-1.5 py-0.5 rounded outline-none border border-indigo-500 text-xs w-24"
              />
            ) : (
              <button
                onClick={() => setIsEditingSender(true)}
                className="text-white font-medium hover:text-indigo-300 transition-colors flex items-center space-x-1"
                title="Click to change your sender name signature"
              >
                <span>{senderName}</span>
                <span className="text-[10px] text-slate-500">(edit)</span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vision Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
