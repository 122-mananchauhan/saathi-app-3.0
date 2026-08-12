import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Activity, AlertCircle, CheckCircle, TrendingDown, ArrowUpRight, Filter } from 'lucide-react';
import { sampleFpos, sampleRiskIndicators } from '../../data/mockData';
import { calculateFpoHealthScore } from '../../services/aiMlEngine';

export function HealthRiskMonitor() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const healthList = useMemo(() => {
    return sampleFpos.map(f => ({
      fpo: f,
      health: calculateFpoHealthScore(f)
    })).sort((a, b) => b.health.overallScore - a.health.overallScore);
  }, []);

  const filteredRisks = useMemo(() => {
    if (selectedSeverity === 'All') return sampleRiskIndicators;
    return sampleRiskIndicators.filter(r => r.severity === selectedSeverity);
  }, [selectedSeverity]);

  const stats = useMemo(() => {
    const excellent = healthList.filter(h => h.health.status === 'Excellent').length;
    const good = healthList.filter(h => h.health.status === 'Good').length;
    const moderate = healthList.filter(h => h.health.status === 'Moderate').length;
    const attention = healthList.filter(h => h.health.status === 'Needs Attention').length;

    return { excellent, good, moderate, attention };
  }, [healthList]);

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Institutional Stability & Early Warnings</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Health Score & Risk Intelligence</h1>
          <p className="mt-1 text-slate-500">Automated 6-pillar health index and early risk anomaly detection for WDC 2.0 FPOs.</p>
        </div>
      </section>

      {/* Health Overview Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="glass rounded-2xl p-5 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Excellent (80-100)</span>
            <CheckCircle className="text-emerald-500" size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.excellent} FPOs</p>
          <p className="mt-1 text-xs font-semibold text-emerald-700">Optimal revenue & market reach</p>
        </div>

        <div className="glass rounded-2xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Good (65-79)</span>
            <ShieldCheck className="text-blue-500" size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.good} FPOs</p>
          <p className="mt-1 text-xs font-semibold text-blue-700">Stable growth trajectory</p>
        </div>

        <div className="glass rounded-2xl p-5 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Moderate (50-64)</span>
            <AlertCircle className="text-amber-500" size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.moderate} FPOs</p>
          <p className="mt-1 text-xs font-semibold text-amber-700">Needs intervention boost</p>
        </div>

        <div className="glass rounded-2xl p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Needs Attention (&lt;50)</span>
            <AlertTriangle className="text-red-500" size={18} />
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.attention} FPOs</p>
          <p className="mt-1 text-xs font-semibold text-red-700">High risk flags active</p>
        </div>
      </section>

      {/* Main Grid: Risk Alerts & Health Table */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Risk Feed */}
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-600" size={20} /> Active Risk Alerts
              </h2>
              <p className="text-xs text-slate-500">Automated ML anomaly detection flags</p>
            </div>

            <select 
              value={selectedSeverity} 
              onChange={e => setSelectedSeverity(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredRisks.map(r => (
              <motion.div 
                key={r.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 border ${
                  r.severity === 'High' ? 'bg-red-50/60 border-red-200 text-red-950' : 'bg-amber-50/60 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    r.severity === 'High' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {r.severity} Severity Risk
                  </span>
                  <span className="text-xs font-bold text-slate-500">{r.riskType}</span>
                </div>

                <h3 className="mt-2 font-bold text-sm text-slate-900">{r.fpoName} ({r.state})</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{r.description}</p>

                <div className="mt-3 rounded-xl bg-white p-3 border border-slate-200/60 text-xs">
                  <b className="block text-green-800 font-bold mb-0.5">Recommended Mitigation:</b>
                  <p className="text-slate-700">{r.recommendedAction}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Health Score Pillar Table */}
        <div className="glass rounded-3xl p-6 lg:col-span-3">
          <h2 className="font-bold text-slate-900 mb-1">6-Pillar FPO Health Index Matrix</h2>
          <p className="text-xs text-slate-500 mb-4">Detailed scoring across revenue, profitability, yield, market linkage, membership, and CHC</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-green-100 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">FPO Name</th>
                  <th className="pb-3 font-semibold text-center">Score</th>
                  <th className="pb-3 font-semibold text-right">Rev Growth</th>
                  <th className="pb-3 font-semibold text-right">Profit</th>
                  <th className="pb-3 font-semibold text-right">Market</th>
                  <th className="pb-3 font-semibold text-right">CHC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {healthList.map(({ fpo, health }) => (
                  <tr key={fpo.id} className="transition hover:bg-green-50/40">
                    <td className="py-3 font-bold text-slate-800">
                      {fpo.name}
                      <span className="block text-[10px] font-normal text-slate-400">{fpo.state}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 font-bold ${
                        health.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                        health.overallScore >= 65 ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {health.overallScore}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-700">{health.pillars.revenueGrowth}%</td>
                    <td className="py-3 text-right font-semibold text-slate-700">{health.pillars.profitability}%</td>
                    <td className="py-3 text-right font-semibold text-slate-700">{health.pillars.marketLinkage}%</td>
                    <td className="py-3 text-right font-semibold text-slate-700">{health.pillars.chcUtilization}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
