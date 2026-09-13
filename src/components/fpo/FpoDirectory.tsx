import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Users, TrendingUp, ShieldCheck, ExternalLink, ArrowUpDown } from 'lucide-react';
import { sampleFpos } from '../../data/mockData';
import { FpoData, PerformanceStatus, Page } from '../../types';
import { FpoProfileModal } from './FpoProfileModal';

export function FpoDirectory({ onNavigate, initialSelectedFpoId }: { onNavigate: (p: Page) => void; initialSelectedFpoId?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'health' | 'revenue' | 'growth' | 'members'>('health');
  const [selectedFpo, setSelectedFpo] = useState<FpoData | null>(
    initialSelectedFpoId ? sampleFpos.find(f => f.id === initialSelectedFpoId) || null : null
  );

  const states = useMemo(() => {
    return ['All', ...Array.from(new Set(sampleFpos.map(f => f.state)))];
  }, []);

  const filteredFpos = useMemo(() => {
    return sampleFpos.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.primaryCrops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchState = selectedState === 'All' || f.state === selectedState;
      const matchStatus = selectedStatus === 'All' || f.performanceStatus === selectedStatus;

      return matchSearch && matchState && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore;
      if (sortBy === 'revenue') return b.revenueAfterIntervention - a.revenueAfterIntervention;
      if (sortBy === 'growth') return b.incomeGrowthPct - a.incomeGrowthPct;
      if (sortBy === 'members') return b.membersCount - a.membersCount;
      return 0;
    });
  }, [searchTerm, selectedState, selectedStatus, sortBy]);

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">FPO Directory & Management</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Farmer Producer Organizations</h1>
          <p className="mt-1 text-slate-500">Search, filter, and inspect performance profiles of WDC 2.0 beneficiary FPOs.</p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="glass mb-6 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search FPO name, district, crop..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={selectedState} 
              onChange={e => setSelectedState(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-green-500 focus:outline-none"
            >
              {states.map(st => <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-green-500 focus:outline-none"
            >
              <option value="All">All Performance Status</option>
              <option value="High">High Performing</option>
              <option value="Moderate">Moderate</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1">
            <ArrowUpDown size={16} className="text-slate-400" />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 focus:border-green-500 focus:outline-none"
            >
              <option value="health">Sort: Health Score</option>
              <option value="revenue">Sort: Revenue (High to Low)</option>
              <option value="growth">Sort: Income Growth %</option>
              <option value="members">Sort: Members Count</option>
            </select>
          </div>
        </div>
      </section>

      {/* FPO Cards Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFpos.map(f => (
          <motion.article 
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="glass relative flex flex-col justify-between rounded-2xl p-5 transition hover:shadow-glow"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
                    {f.id}
                  </span>
                  <h3 className="mt-1 font-bold text-slate-900 leading-snug">{f.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={13} className="text-green-600" /> {f.district}, {f.state}
                  </p>
                </div>
                
                <span className={`inline-flex flex-col items-center rounded-xl px-2.5 py-1 text-center font-bold text-xs ${
                  f.healthScore >= 80 ? 'bg-green-100 text-green-800' :
                  f.healthScore >= 65 ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  <span className="text-[10px] uppercase opacity-70">Health</span>
                  <b>{f.healthScore}</b>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Revenue (Post-WDC)</span>
                  <b className="block text-slate-800 text-sm mt-0.5">₹{f.revenueAfterIntervention} Lakhs</b>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Income Uplift</span>
                  <b className="block text-green-700 text-sm mt-0.5">+{f.incomeGrowthPct}%</b>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <Users size={14} className="text-green-600" /> {f.membersCount} Members
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 truncate max-w-[150px]">
                  🌾 {f.primaryCrops.join(', ')}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-green-50 pt-3 flex items-center justify-between">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                f.performanceStatus === 'High' ? 'bg-green-100 text-green-800' :
                f.performanceStatus === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {f.performanceStatus} Status
              </span>

              <button 
                onClick={() => setSelectedFpo(f)} 
                className="inline-flex items-center gap-1 font-bold text-sm text-green-700 hover:text-green-900"
              >
                Inspect Profile <ExternalLink size={14} />
              </button>
            </div>
          </motion.article>
        ))}
      </section>

      {filteredFpos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
          <p className="font-bold text-slate-700">No FPOs found matching your filter criteria.</p>
          <p className="mt-1 text-sm">Try resetting search parameters or state filter.</p>
        </div>
      )}

      {/* Modal Profile View */}
      <FpoProfileModal 
        fpo={selectedFpo} 
        onClose={() => setSelectedFpo(null)} 
        onNavigateToImpact={() => {
          setSelectedFpo(null);
          onNavigate('impact');
        }}
      />
    </>
  );
}
