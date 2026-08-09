import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, Sparkles, Building2 } from 'lucide-react';
import { US_CITIES } from '../data/cities';
import { BUSINESS_NICHES } from '../data/niches';
import { SearchParams } from '../types';

interface SearchSectionProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, isLoading }) => {
  const [selectedCityName, setSelectedCityName] = useState<string>("Austin");
  const [stateCode, setStateCode] = useState<string>("TX");
  const [stateName, setStateName] = useState<string>("Texas");
  const [selectedNicheId, setSelectedNicheId] = useState<string>("dentist");
  const [limit, setLimit] = useState<number>(6);

  // Update State automatically when City is selected
  useEffect(() => {
    const found = US_CITIES.find(c => c.city === selectedCityName);
    if (found) {
      setStateCode(found.state);
      setStateName(found.stateName);
    }
  }, [selectedCityName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      city: selectedCityName,
      state: stateCode,
      nicheId: selectedNicheId,
      limit
    });
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-950/40 relative overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-5 border-b border-slate-700/60 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Search & Audit Local Leads</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select a target niche and US city to scrape businesses, audit conversion gaps, and draft cold emails.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-lg self-start md:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Geoapify Scraper + Gemini Vision + Microlink</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        {/* Niche Dropdown */}
        <div className="lg:col-span-4 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Niche / Category</span>
          </label>
          <div className="relative">
            <select
              value={selectedNicheId}
              onChange={(e) => setSelectedNicheId(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none pr-8 cursor-pointer disabled:opacity-50"
            >
              {BUSINESS_NICHES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* City Dropdown (100+ US Cities) */}
        <div className="lg:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target City</span>
          </label>
          <div className="relative">
            <select
              value={selectedCityName}
              onChange={(e) => setSelectedCityName(e.target.value)}
              disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none pr-8 cursor-pointer disabled:opacity-50"
            >
              {US_CITIES.map((c) => (
                <option key={`${c.city}-${c.state}`} value={c.city}>
                  {c.city}, {c.state}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* State (Readonly/Disabled to enforce integrity) */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            State (Auto-mapped)
          </label>
          <input
            type="text"
            value={`${stateCode} (${stateName})`}
            readOnly
            disabled
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed font-medium select-none"
            title="State updates automatically when city is chosen to ensure data accuracy"
          />
        </div>

        {/* Lead Limit */}
        <div className="lg:col-span-1 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Limit
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value={3}>3 leads</option>
            <option value={6}>6 leads</option>
            <option value={10}>10 leads</option>
            <option value={15}>15 leads</option>
          </select>
        </div>

        {/* Submit Action Button */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-sm"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Processing...' : 'Scrape & Audit'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
