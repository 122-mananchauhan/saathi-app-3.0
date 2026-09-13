import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MapPin, Sprout, TrendingUp, ShieldCheck, Calendar, LandPlot, ArrowUpRight, Award, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FpoData } from '../../types';
import { calculateFpoHealthScore, calculateCausalImpact } from '../../services/aiMlEngine';

export function FpoProfileModal({ fpo, onClose, onNavigateToImpact }: { fpo: FpoData | null; onClose: () => void; onNavigateToImpact?: () => void }) {
  if (!fpo) return null;

  const health = calculateFpoHealthScore(fpo);
  const causal = calculateCausalImpact(fpo);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 15 }} 
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
            <X size={20} />
          </button>

          {/* Header info */}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-green-700 to-emerald-500 text-white shadow-glow">
                <Sprout size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{fpo.name}</h2>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                    {fpo.id}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={15} className="text-green-700" /> {fpo.block}, {fpo.district}, {fpo.state}
                  <span className="text-slate-300">•</span>
                  <Calendar size={15} className="text-slate-400" /> Est. {fpo.formationYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-green-100 bg-green-50/70 p-3 text-center">
                <p className="text-xs font-bold uppercase text-slate-400">Health Index</p>
                <b className="text-2xl font-bold text-green-800">{health.overallScore}/100</b>
                <span className="block text-[11px] font-bold text-green-700">{health.status}</span>
              </div>
            </div>
          </div>

          {/* Grid stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <Users size={14} className="text-green-600" /> Total Members
              </p>
              <b className="mt-1 block text-xl text-slate-900">{fpo.membersCount}</b>
              <span className="text-xs text-slate-500">{fpo.smallFarmersCount} smallholders</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <LandPlot size={14} className="text-blue-600" /> Primary Crops
              </p>
              <b className="mt-1 block text-sm font-bold text-slate-800 truncate">{fpo.primaryCrops.join(', ')}</b>
              <span className="text-xs text-slate-500">{fpo.annualProductionTonnes} Tonnes/yr</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400">Annual Revenue</p>
              <b className="mt-1 block text-xl text-slate-900">₹{fpo.revenueAfterIntervention} L</b>
              <span className="text-xs text-green-700 font-bold">+{fpo.incomeGrowthPct}% Growth</span>
            </div>

            <div className="rounded-2xl bg-green-700 p-4 text-white">
              <p className="text-xs font-bold uppercase text-green-100">Net Profit</p>
              <b className="mt-1 block text-xl text-white">₹{fpo.netIncomeLakhs} L</b>
              <span className="text-xs text-green-100">Expenses: ₹{fpo.expensesLakhs} L</span>
            </div>
          </div>

          {/* Historical chart & causal breakdown */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="font-bold text-slate-900 mb-1">Historical Revenue Growth</h3>
              <p className="text-xs text-slate-500 mb-3">5-year trajectory (₹ Lakhs)</p>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fpo.historicalIncome}>
                    <defs>
                      <linearGradient id="fpoRevFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={v => `₹${v}L`} />
                    <Tooltip formatter={(v: number) => [`₹${v} Lakhs`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fill="url(#fpoRevFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Causal impact */}
            <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>Intervention Attribution</span>
                <span className="text-xs font-bold text-green-800">Total Uplift: +₹{causal.totalUpliftLakhs} L</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">WDC 2.0 causal breakdown of income gain</p>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">💧 Irrigation Systems</span>
                    <b className="text-green-700">{causal.irrigationPct}%</b>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-green-600" style={{ width: `${causal.irrigationPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">🏪 Market Linkage</span>
                    <b className="text-blue-700">{causal.marketLinkagePct}%</b>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${causal.marketLinkagePct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">🌾 Yield & Seeds</span>
                    <b className="text-amber-700">{causal.productionImprovementPct}%</b>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-600" style={{ width: `${causal.productionImprovementPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interventions list */}
          <div className="mt-6">
            <h3 className="font-bold text-slate-900 mb-3">WDC 2.0 Active Interventions</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {fpo.interventions.map(item => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <b className="block text-sm text-slate-800">{item.name}</b>
                    <span className="text-xs text-slate-500">Beneficiaries: {item.beneficiaries} farmers</span>
                  </div>
                  <div className="text-right">
                    <b className="block text-sm text-green-700">₹{(item.investmentAmount / 100000).toFixed(1)} L</b>
                    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-50">
              Close Profile
            </button>
            {onNavigateToImpact && (
              <button onClick={onNavigateToImpact} className="rounded-xl bg-green-700 px-5 py-2.5 font-bold text-white shadow-glow hover:bg-green-800">
                Run Simulation for {fpo.name} →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
