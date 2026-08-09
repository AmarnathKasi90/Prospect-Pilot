import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileCode, Check, X } from 'lucide-react';
import { Lead } from '../types';

interface ExportModalProps {
  leads: Lead[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ leads, isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = [
      'Business Name',
      'Category',
      'Website',
      'City',
      'State',
      'Phone',
      'Found Email',
      'Audit Score',
      'Observation',
      'Insight',
      'Gap',
      'Subject Line',
      'Email Body',
      'Signature'
    ];

    const rows = leads.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.website || '').replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.state || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.foundEmail || '').replace(/"/g, '""')}"`,
      l.auditScore !== undefined ? l.auditScore : '',
      `"${(l.auditDetails?.observation || '').replace(/"/g, '""')}"`,
      `"${(l.auditDetails?.insight || '').replace(/"/g, '""')}"`,
      `"${(l.auditDetails?.gap || '').replace(/"/g, '""')}"`,
      `"${(l.emailDraft?.subject || '').replace(/"/g, '""')}"`,
      `"${(l.emailDraft?.body || '').replace(/"/g, '""')}"`,
      `"${(l.emailDraft?.signature || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ProspectPilot_Audited_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ProspectPilot_Leads_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <span>Export Audited Leads</span>
          </h3>
          <p className="text-xs text-slate-400">
            Export all {leads.length} scraped local leads, contact emails, audit scores, and personalized cold emails.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExportCSV}
            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 text-white font-medium text-xs transition-all cursor-pointer group"
          >
            <FileSpreadsheet className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>CSV Spreadsheet</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 flex flex-col items-center justify-center space-y-2 text-white font-medium text-xs transition-all cursor-pointer group"
          >
            <FileCode className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>JSON Object</span>
          </button>
        </div>

        {downloaded && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>File exported successfully! Check your downloads.</span>
          </div>
        )}
      </div>
    </div>
  );
};
