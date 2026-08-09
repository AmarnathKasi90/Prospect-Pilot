import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Sparkles,
  Download,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Mail,
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SearchSection } from './components/SearchSection';
import { ProgressBar } from './components/ProgressBar';
import { LeadCard } from './components/LeadCard';
import { ExportModal } from './components/ExportModal';
import { Lead, ProcessingStep, SearchParams } from './types';
import { BUSINESS_NICHES } from './data/niches';

export default function App() {
  const [senderName, setSenderName] = useState<string>('Animesh');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentProcessingLeadName, setCurrentProcessingLeadName] = useState<string>('');
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [totalToProcess, setTotalToProcess] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & Sort State
  const [filterEmailOnly, setFilterEmailOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'score_asc' | 'score_desc' | 'default'>('default');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Stats calculation
  const totalLeadsCount = leads.length;
  const emailsFoundCount = leads.filter(l => l.foundEmail && l.foundEmail.trim().length > 0).length;
  const validScores = leads.filter(l => l.auditScore !== undefined).map(l => l.auditScore!);
  const avgAuditScore = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;

  // Main Lead Processing Pipeline
  const handleStartSearch = async (params: SearchParams) => {
    setErrorMessage(null);
    setCurrentStep('scraping');
    setProgressPercent(10);
    setProcessedCount(0);
    setCurrentProcessingLeadName('');

    const targetNiche = BUSINESS_NICHES.find(n => n.id === params.nicheId);
    const nicheName = targetNiche ? targetNiche.name : 'Local Business';
    const nicheCategory = targetNiche ? targetNiche.category : 'service';

    try {
      // 1. Scraping Step
      const scrapeRes = await fetch('/api/scrape-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: params.city,
          state: params.state,
          nicheId: params.nicheId,
          category: nicheCategory,
          nicheName,
          limit: params.limit
        })
      });

      if (!scrapeRes.ok) {
        throw new Error('Failed to scrape leads from server');
      }

      const scrapeData = await scrapeRes.json();
      const initialLeads: Lead[] = scrapeData.leads || [];

      if (initialLeads.length === 0) {
        setErrorMessage(`No businesses found for ${nicheName} in ${params.city}, ${params.state}. Try increasing the limit or selecting another city.`);
        setCurrentStep('idle');
        setProgressPercent(0);
        return;
      }

      setLeads(initialLeads);
      setTotalToProcess(initialLeads.length);
      setProgressPercent(25);

      // Sequentially Process Each Lead
      const processedLeads: Lead[] = [...initialLeads];

      for (let i = 0; i < processedLeads.length; i++) {
        const lead = { ...processedLeads[i] };
        setCurrentProcessingLeadName(lead.name);
        setProcessedCount(i + 1);

        const leadProgressBase = 25 + Math.floor(((i + 1) / processedLeads.length) * 70);

        // 2. Extract Contact Email Step
        setCurrentStep('extracting_emails');
        try {
          const emailRes = await fetch('/api/extract-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadId: lead.id,
              website: lead.website,
              demoSeedEmail: (lead as any).demoSeedEmail
            })
          });

          if (emailRes.ok) {
            const emailData = await emailRes.json();
            lead.foundEmail = emailData.foundEmail;
            lead.emailSourceUrl = emailData.emailSourceUrl;
            lead.emailExtractionStatus = emailData.emailExtractionStatus;
            lead.allScrapedEmails = emailData.allScrapedEmails;
          }
        } catch (e) {
          console.warn(`Email extraction warning for ${lead.name}`, e);
          lead.emailExtractionStatus = 'error';
        }

        // 3. Microlink Screenshot Step
        setCurrentStep('capturing_screenshots');
        try {
          const screenshotRes = await fetch('/api/capture-screenshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadId: lead.id,
              website: lead.website
            })
          });

          if (screenshotRes.ok) {
            const ssData = await screenshotRes.json();
            lead.screenshotUrl = ssData.screenshotUrl;
            lead.screenshotStatus = ssData.screenshotStatus;
          }
        } catch (e) {
          console.warn(`Screenshot capture warning for ${lead.name}`, e);
          lead.screenshotStatus = 'failed';
        }

        // 4. Gemini Vision Audit & Cold Email Draft Step
        setCurrentStep('auditing');
        try {
          const auditRes = await fetch('/api/audit-and-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lead,
              screenshotUrl: lead.screenshotUrl,
              nicheName,
              foundEmail: lead.foundEmail,
              senderName
            })
          });

          if (auditRes.ok) {
            const auditData = await auditRes.json();
            lead.auditScore = auditData.auditScore;
            lead.auditDetails = auditData.auditDetails;
            lead.auditStatus = 'completed';
            lead.emailDraft = auditData.emailDraft;
          }
        } catch (e) {
          console.warn(`Audit warning for ${lead.name}`, e);
          lead.auditStatus = 'failed';
        }

        processedLeads[i] = lead;
        setLeads([...processedLeads]);
        setProgressPercent(leadProgressBase);
      }

      setCurrentStep('completed');
      setProgressPercent(100);
      setTimeout(() => {
        setCurrentStep('idle');
      }, 1500);

    } catch (err: any) {
      console.error('Pipeline error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during lead processing');
      setCurrentStep('error');
    }
  };

  // Filter & Sorting Logic for Lead Cards
  const displayedLeads = leads
    .filter(l => (filterEmailOnly ? !!l.foundEmail : true))
    .sort((a, b) => {
      if (sortBy === 'score_asc') return (a.auditScore || 0) - (b.auditScore || 0);
      if (sortBy === 'score_desc') return (b.auditScore || 0) - (a.auditScore || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20 selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Header */}
      <Navbar
        senderName={senderName}
        setSenderName={setSenderName}
        totalLeads={totalLeadsCount}
        emailsFound={emailsFoundCount}
        avgScore={avgAuditScore}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Search Controls Card */}
        <SearchSection
          onSearch={handleStartSearch}
          isLoading={currentStep !== 'idle' && currentStep !== 'completed' && currentStep !== 'error'}
        />

        {/* Animated Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          progressPercent={progressPercent}
          currentLeadName={currentProcessingLeadName}
          processedCount={processedCount}
          totalCount={totalToProcess}
        />

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results Header Bar & Filter Controls */}
        {leads.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                {displayedLeads.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Audited Lead Prospect Feed</h3>
                <p className="text-xs text-slate-400">
                  Showing {displayedLeads.length} of {leads.length} scraped businesses
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Filter Email Only Toggle */}
              <button
                onClick={() => setFilterEmailOnly(!filterEmailOnly)}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  filterEmailOnly
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>With Email Only</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value="default" className="bg-slate-900">Sort: Default</option>
                  <option value="score_asc" className="bg-slate-900">Lowest Score (Fix Opportunities)</option>
                  <option value="score_desc" className="bg-slate-900">Highest Score First</option>
                </select>
              </div>

              {/* Export Trigger Button */}
              <button
                onClick={() => setIsExportOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Leads</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Lead Cards Feed */}
        {leads.length > 0 ? (
          <div className="space-y-6">
            {displayedLeads.map((lead, idx) => (
              <LeadCard key={lead.id} lead={lead} index={idx} />
            ))}
          </div>
        ) : currentStep === 'idle' ? (
          /* Empty / Welcome State Banner */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Target className="w-8 h-8 text-white stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Hyper-Personalized Cold Outreach Engine
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                ProspectPilot scrapes local US business leads, crawls multi-page contact URLs for email addresses, captures high-res site screenshots via Microlink, and uses Gemini Vision to draft cold emails following the <span className="text-indigo-300 font-semibold">Observation → Insight → Gap</span> framework.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                  <span>1. Local Geo Scraper</span>
                </div>
                <p className="text-xs text-slate-400">
                  Target 100+ top US cities and high-value service niches.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>2. Gemini Vision Audit</span>
                </div>
                <p className="text-xs text-slate-400">
                  Audits conversion bottlenecks and CTA layout directly from screenshots.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <Mail className="w-4 h-4" />
                  <span>3. Cold Email Copywriter</span>
                </div>
                <p className="text-xs text-slate-400">
                  No flattery. Low-key 2-4 word subjects and video offer pitches.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Select a niche and city above to initiate your first audit run.
            </div>
          </div>
        ) : null}
      </main>

      {/* Export Modal */}
      <ExportModal
        leads={leads}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
