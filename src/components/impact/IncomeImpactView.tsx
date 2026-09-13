import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, Sliders, TrendingUp, Cpu, Info, Check, ShieldCheck, Droplets, Warehouse, Store, GraduationCap, ArrowRight } from 'lucide-react';
import { sampleFpos } from '../../data/mockData';
import { FpoData, WhatIfParams } from '../../types';
import { calculateCausalImpact, predictFpoIncome, simulateWhatIfScenario } from '../../services/aiMlEngine';

export function IncomeImpactView() {
  const [selectedFpoId, setSelectedFpoId] = useState<string>(sampleFpos[0].id);
  const [activeTab, setActiveTab] = useState<'attribution' | 'prediction' | 'simulation'>('attribution');

  const selectedFpo = useMemo(() => {
    return sampleFpos.find(f => f.id === selectedFpoId) || sampleFpos[0];
  }, [selectedFpoId]);

  const causal = useMemo(() => calculateCausalImpact(selectedFpo), [selectedFpo]);
  const prediction = useMemo(() => predictFpoIncome(selectedFpo, 3), [selectedFpo]);

  // What-If Sliders state
  const [whatIfParams, setWhatIfParams] = useState<WhatIfParams>({
    irrigationBoostPct: 20,
    marketLinkageBoostPct: 15,
    storageCapacityTons: 150,
    chcMachineryCount: 3,
    trainingSessionsCount: 5,
  });

  const simulation = useMemo(() => simulateWhatIfScenario(selectedFpo, whatIfParams), [selectedFpo, whatIfParams]);

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Core SIH1435 Intelligence Engine</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Income Impact & AI Simulation</h1>
          <p className="mt-1 text-slate-500">Measure intervention causality, project future earnings, and test what-if scenarios.</p>
        </div>

        {/* FPO Selector */}
        <div className="flex items-center gap-3 rounded-2xl bg-white border border-green-200 p-2 shadow-sm">
          <span className="text-xs font-bold text-slate-500 pl-2">Target FPO:</span>
          <select 
            value={selectedFpoId} 
            onChange={e => setSelectedFpoId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {sampleFpos.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.state})</option>
            ))}
          </select>
        </div>
      </section>

      {/* Sub-nav tabs */}
      <div className="mb-6 flex gap-2 border-b border-green-100 pb-3">
        <button 
          onClick={() => setActiveTab('attribution')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeTab === 'attribution' ? 'bg-green-700 text-white shadow-glow' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <TrendingUp size={16} /> 1. Income Impact Attribution
        </button>
        <button 
          onClick={() => setActiveTab('prediction')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeTab === 'prediction' ? 'bg-green-700 text-white shadow-glow' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <Cpu size={16} /> 2. AI Income Prediction
        </button>
        <button 
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeTab === 'simulation' ? 'bg-green-700 text-white shadow-glow' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <Sliders size={16} /> 3. What-If Scenario Simulator
        </button>
      </div>

      {/* TAB 1: Income Impact Attribution */}
      {activeTab === 'attribution' && (
        <div className="space-y-6">
          {/* Baseline vs Post-Intervention Overview */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass rounded-3xl p-6 lg:col-span-1">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                Verified Measurement
              </span>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{selectedFpo.name}</h2>
              <p className="mt-1 text-xs text-slate-500">{selectedFpo.district}, {selectedFpo.state} • {selectedFpo.membersCount} Members</p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase text-slate-400">Baseline Revenue (Before WDC 2.0)</p>
                  <b className="mt-1 block text-2xl text-slate-800">₹{selectedFpo.revenueBeforeIntervention} Lakhs</b>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-green-800 to-emerald-600 p-4 text-white">
                  <p className="text-xs font-bold uppercase text-green-100">Post-Intervention Revenue</p>
                  <b className="mt-1 block text-3xl">₹{selectedFpo.revenueAfterIntervention} Lakhs</b>
                  <span className="mt-1 block text-xs text-green-100 font-semibold">
                    Net Increase: +₹{causal.totalUpliftLakhs} Lakhs (+{selectedFpo.incomeGrowthPct}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Causal Breakdown Card */}
            <div className="glass rounded-3xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="section-label">Causal AI Decomposition</span>
                  <h2 className="text-xl font-bold text-slate-900">Intervention Uplift Contribution</h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <Sparkles size={14} /> Causal Attribution Model
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-green-50/70 p-4 border border-green-100">
                  <Droplets className="text-green-600 mb-2" size={22} />
                  <p className="text-xs font-bold text-slate-500">Irrigation</p>
                  <b className="mt-1 block text-2xl text-green-800">{causal.irrigationPct}%</b>
                  <span className="text-[11px] font-semibold text-green-700">Estimated Uplift</span>
                </div>

                <div className="rounded-2xl bg-blue-50/70 p-4 border border-blue-100">
                  <Store className="text-blue-600 mb-2" size={22} />
                  <p className="text-xs font-bold text-slate-500">Market Linkage</p>
                  <b className="mt-1 block text-2xl text-blue-800">{causal.marketLinkagePct}%</b>
                  <span className="text-[11px] font-semibold text-blue-700">Direct Buyers</span>
                </div>

                <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-100">
                  <Warehouse className="text-amber-600 mb-2" size={22} />
                  <p className="text-xs font-bold text-slate-500">CHC & Storage</p>
                  <b className="mt-1 block text-2xl text-amber-800">{causal.chcServicesPct}%</b>
                  <span className="text-[11px] font-semibold text-amber-700">Distress Avoided</span>
                </div>

                <div className="rounded-2xl bg-purple-50/70 p-4 border border-purple-100">
                  <GraduationCap className="text-purple-600 mb-2" size={22} />
                  <p className="text-xs font-bold text-slate-500">Yield & Training</p>
                  <b className="mt-1 block text-2xl text-purple-800">{causal.productionImprovementPct}%</b>
                  <span className="text-[11px] font-semibold text-purple-700">Production Gain</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed border border-slate-100">
                <b>Explainable Rationale:</b> Based on empirical field data for {selectedFpo.name}, access to solar drip irrigation and direct market contracts provided 70% of the net earnings uplift, while custom machinery and crop training contributed the remainder.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI Income Prediction */}
      {activeTab === 'prediction' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="glass rounded-3xl p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                <Cpu size={14} /> ML Forecasting Engine
              </span>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">3-Year Projection</h2>
              <p className="text-xs text-slate-500">FastAPI ML Backend Ready Interface</p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase text-slate-400">Current Revenue</p>
                  <b className="mt-1 block text-2xl text-slate-800">₹{prediction.currentIncomeLakhs} Lakhs</b>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 p-5 text-white">
                  <p className="text-xs font-bold uppercase text-blue-200">Predicted Revenue (2028)</p>
                  <b className="mt-1 block text-3xl">₹{prediction.predictedIncomeLakhs} Lakhs</b>
                  <p className="mt-2 text-xs font-semibold text-blue-200">
                    Confidence Range: ₹{prediction.lowerBoundLakhs}L – ₹{prediction.upperBoundLakhs}L ({prediction.confidencePct}% Confidence)
                  </p>
                </div>
              </div>
            </div>

            {/* Prediction Trend Chart */}
            <div className="glass rounded-3xl p-6 lg:col-span-2">
              <h2 className="font-bold text-slate-900 mb-1">Historical vs ML Predicted Trend</h2>
              <p className="text-xs text-slate-500 mb-4">Actual revenue up to 2025 and ML forecast for 2026–2028</p>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prediction.trend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={v => `₹${v}L`} />
                    <Tooltip formatter={(v: number) => [`₹${v} Lakhs`, '']} />
                    <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#16a34a" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="predicted" name="Predicted Revenue" stroke="#2563eb" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex justify-center gap-6 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-green-600" /> Historical Actuals</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-blue-600" /> ML Model Forecast</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: What-If Scenario Simulator */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Interactive Parameters Slider Box */}
            <div className="glass rounded-3xl p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Intervention Scenario Parameters</h2>
                  <p className="text-xs text-slate-500">Adjust sliders to simulate incremental intervention impact</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Interactive Simulator
                </span>
              </div>

              <div className="space-y-5 mt-6">
                {/* Irrigation Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1"><Droplets size={14} className="text-green-600" /> Drip Irrigation Coverage Boost</span>
                    <b className="text-green-700">+{whatIfParams.irrigationBoostPct}%</b>
                  </div>
                  <input 
                    type="range" min="0" max="50" step="5"
                    value={whatIfParams.irrigationBoostPct}
                    onChange={e => setWhatIfParams({ ...whatIfParams, irrigationBoostPct: Number(e.target.value) })}
                    className="w-full accent-green-600"
                  />
                </div>

                {/* Market Linkage Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1"><Store size={14} className="text-blue-600" /> Direct Market Contract Share</span>
                    <b className="text-blue-700">+{whatIfParams.marketLinkageBoostPct}%</b>
                  </div>
                  <input 
                    type="range" min="0" max="50" step="5"
                    value={whatIfParams.marketLinkageBoostPct}
                    onChange={e => setWhatIfParams({ ...whatIfParams, marketLinkageBoostPct: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* Storage Capacity Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1"><Warehouse size={14} className="text-amber-600" /> Additional Cold Storage Capacity</span>
                    <b className="text-amber-700">{whatIfParams.storageCapacityTons} Tons</b>
                  </div>
                  <input 
                    type="range" min="0" max="500" step="50"
                    value={whatIfParams.storageCapacityTons}
                    onChange={e => setWhatIfParams({ ...whatIfParams, storageCapacityTons: Number(e.target.value) })}
                    className="w-full accent-amber-600"
                  />
                </div>

                {/* CHC Machinery */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1"><Cpu size={14} className="text-purple-600" /> CHC Custom Harvesters & Tractors</span>
                    <b className="text-purple-700">{whatIfParams.chcMachineryCount} Units</b>
                  </div>
                  <input 
                    type="range" min="0" max="10" step="1"
                    value={whatIfParams.chcMachineryCount}
                    onChange={e => setWhatIfParams({ ...whatIfParams, chcMachineryCount: Number(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Simulation Results Box */}
            <div className="glass rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="section-label">Simulated Outcome</span>
                <h2 className="text-2xl font-bold text-slate-900">Projected Impact</h2>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <span className="text-xs font-bold uppercase text-slate-400">Current Projected Revenue</span>
                    <b className="mt-1 block text-2xl text-slate-800">₹{simulation.baselineRevenueLakhs} Lakhs</b>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-green-800 to-emerald-600 p-5 text-white shadow-glow">
                    <span className="text-xs font-bold uppercase text-green-100">Simulated Target Revenue</span>
                    <b className="mt-1 block text-3xl">₹{simulation.simulatedRevenueLakhs} Lakhs</b>
                    <div className="mt-2 flex items-center justify-between border-t border-green-600/50 pt-2 text-xs font-bold">
                      <span>Additional Gain: +₹{simulation.additionalIncomeLakhs} L</span>
                      <span>Growth: +{simulation.simulatedGrowthPct}%</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-purple-50 p-4 border border-purple-100 text-purple-900">
                    <span className="text-xs font-bold uppercase text-purple-600">Simulated Health Score</span>
                    <b className="mt-1 block text-2xl text-purple-800">{simulation.simulatedHealthScore} / 100</b>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-500 italic">
                * Simulated outcomes calculated via deterministic decision model.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
