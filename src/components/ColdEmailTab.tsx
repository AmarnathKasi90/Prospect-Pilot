import React, { useState, useEffect } from 'react';
import { Mail, Copy, Check, ExternalLink, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Lead } from '../types';

interface ColdEmailTabProps {
  lead: Lead;
  onUpdateDraft?: (leadId: string, updatedDraft: Lead['emailDraft']) => void;
}

export const ColdEmailTab: React.FC<ColdEmailTabProps> = ({ lead, onUpdateDraft }) => {
  const defaultDraft = lead.emailDraft || {
    toEmail: lead.foundEmail || '',
    subject: 'your hero section layout',
    body: 'I was looking at your site and the mobile hero section hides the main booking button below the fold. Usually, this makes it harder for mobile visitors to quickly schedule an appointment before bouncing.\n\nI recorded a 2-min video showing how adding a sticky tap-to-call header can fix this. Worth a look?',
    signature: 'Animesh, ProspectPilot'
  };

  const [toEmail, setToEmail] = useState<string>(defaultDraft.toEmail || lead.foundEmail || '');
  const [subject, setSubject] = useState<string>(defaultDraft.subject);
  const [body, setBody] = useState<string>(defaultDraft.body);
  const [signature, setSignature] = useState<string>(defaultDraft.signature || 'Animesh, ProspectPilot');
  const [copied, setCopied] = useState(false);

  // CRITICAL EMAIL PERSISTENCE RULE:
  // "In the UI, if `foundEmail` exists but the `manualEmail` state is empty (e.g. user deleted it),
  // a `useEffect` should re-populate it automatically."
  useEffect(() => {
    if (lead.foundEmail && (!toEmail || toEmail.trim() === '')) {
      setToEmail(lead.foundEmail);
    }
  }, [lead.foundEmail, toEmail]);

  // Keep local draft synced to lead state if changed externally
  useEffect(() => {
    if (lead.emailDraft) {
      if (lead.emailDraft.toEmail && !toEmail) setToEmail(lead.emailDraft.toEmail);
      if (lead.emailDraft.subject) setSubject(lead.emailDraft.subject);
      if (lead.emailDraft.body) setBody(lead.emailDraft.body);
      if (lead.emailDraft.signature) setSignature(lead.emailDraft.signature);
    }
  }, [lead.emailDraft]);

  const handleCopy = () => {
    const fullText = `To: ${toEmail}\nSubject: ${subject}\n\nHi ${lead.name.split(' ')[0] || 'there'},\n\n${body}\n\n${signature}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi ${lead.name.split(' ')[0] || 'there'},\n\n${body}\n\n${signature}`)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="space-y-4 text-xs text-slate-300">
      {/* Top Header info badge */}
      <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-800/40 px-3.5 py-2 rounded-xl text-indigo-300">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="font-medium text-[11px]">
            Observation → Insight → Gap Strategy Applied (No Flattery, Cold Persona)
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Full Email!' : 'Copy Draft'}</span>
        </button>
      </div>

      {/* Editable Fields Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5">
        {/* To Email Field */}
        <div className="space-y-1">
          <label className="block text-slate-400 font-semibold text-[11px] flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>To Email Address (Editable)</span>
            </span>
            {lead.foundEmail && (
              <span className="text-[10px] text-emerald-400 font-normal">
                ✓ Auto-populated from page crawl
              </span>
            )}
          </label>
          <input
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="e.g. contact@business.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Subject Line */}
        <div className="space-y-1">
          <label className="block text-slate-400 font-semibold text-[11px]">
            Subject Line (2-4 words, lowercase, specific)
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-indigo-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Email Body */}
        <div className="space-y-1">
          <label className="block text-slate-400 font-semibold text-[11px]">
            Email Body Text
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-sans text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Signature */}
        <div className="space-y-1">
          <label className="block text-slate-400 font-semibold text-[11px]">
            Signature
          </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-[11px] text-slate-500">
          Target recipient: <span className="text-slate-300 font-medium">{lead.name}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-2 rounded-lg text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>

          <button
            onClick={handleOpenMailto}
            disabled={!toEmail}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send via Email Client</span>
          </button>
        </div>
      </div>
    </div>
  );
};
