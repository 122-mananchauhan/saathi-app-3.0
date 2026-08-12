import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, CheckCircle2, ArrowRight, Filter, Store, Droplets, Warehouse, Cpu, DollarSign } from 'lucide-react';
import { sampleAiRecommendations } from '../../data/mockData';
import { AiRecommendation } from '../../types';

export function RecommendationView() {
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredRecs = useMemo(() => {
    return sampleAiRecommendations.filter(r => {
      const matchPriority = selectedPriority === 'All' || r.priority === selectedPriority;
      const matchCategory = selectedCategory === 'All' || r.category === selectedCategory;
      return matchPriority && matchCategory;
    });
  }, [selectedPriority, selectedCategory]);

  const categoryIcons: Record<string, React.ReactNode> = {
    'Market Linkage': <Store size={20} className="text-blue-600" />,
    'Irrigation Infrastructure': <Droplets size={20} className="text-green-600" />,
    'Storage & Processing': <Warehouse size={20} className="text-amber-600" />,
    'Financial Management': <DollarSign size={20} className="text-purple-600" />
  };

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Explainable Decision Support</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Recommendation Engine</h1>
          <p className="mt-1 text-slate-500">Actionable intervention strategies generated from FPO operational and causal data.</p>
        </div>
      </section>

      {/* Hero Highlight Card */}
      <section className="glass overflow-hidden rounded-3xl mb-6 shadow-xl">
        <div className="grid gap-8 bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 p-7 text-white lg:grid-cols-[1fr_auto]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-green-100 backdrop-blur-md">
              <Sparkles size={15} /> Top Portfolio Priority Recommendation
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-snug">
              Prioritize Solar Cold-Chain & Direct B2B Market Bundles
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-green-100/90">
              Aggregated causal analysis shows FPOs with both solar drip irrigation and direct B2B market linkage achieve 24% higher net profit margins than single-intervention FPOs.
            </p>
          </div>
          <div className="self-center rounded-2xl bg-white/10 p-6 text-center backdrop-blur-md border border-white/20">
            <p className="text-xs font-semibold text-green-100 uppercase tracking-wider">Avg Expected Income Uplift</p>
            <b className="mt-2 block text-4xl font-extrabold text-white">+22.5%</b>
            <span className="mt-1 block text-[11px] text-green-200">Across 12 Beneficiary FPOs</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="glass mb-6 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Filter Priority:</span>
            <select 
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Category:</span>
            <select 
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Market Linkage">Market Linkage</option>
              <option value="Irrigation Infrastructure">Irrigation Infrastructure</option>
              <option value="Storage & Processing">Storage & Processing</option>
              <option value="Financial Management">Financial Management</option>
            </select>
          </div>
        </div>
      </section>

      {/* Recommendation Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        {filteredRecs.map((rec, i) => (
          <motion.article 
            key={rec.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-3xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                    {categoryIcons[rec.category] || <Lightbulb size={20} className="text-green-600" />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{rec.category}</span>
                    <h3 className="font-bold text-slate-900 text-lg">{rec.title}</h3>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>

              {rec.fpoName && (
                <p className="mt-3 text-xs font-semibold text-green-700">Target: {rec.fpoName}</p>
              )}

              <p className="mt-3 text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                <b className="text-slate-800 font-bold block mb-1">AI Rationale:</b> {rec.reason}
              </p>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Actionable Implementation Steps:</p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {rec.actionableSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Expected Income Gain</span>
              <b className="text-lg font-bold text-green-700">+{rec.expectedImpactPct}%</b>
            </div>
          </motion.article>
        ))}
      </section>
    </>
  );
}
