import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Users, Sprout, TrendingUp, ShieldCheck, ArrowRight, Activity, MapPin, Building2 } from 'lucide-react';
import { sampleFpos } from '../../data/mockData';
import { Page } from '../../types';

export function DashboardView({ onNavigate, onSelectFpo }: { onNavigate: (p: Page) => void; onSelectFpo: (id: string) => void }) {
  const stats = useMemo(() => {
    const totalFpos = sampleFpos.length;
    const totalMembers = sampleFpos.reduce((acc, f) => acc + f.membersCount, 0);
    const totalRevenueLakhs = sampleFpos.reduce((acc, f) => acc + f.revenueAfterIntervention, 0);
    const avgGrowthPct = Number((sampleFpos.reduce((acc, f) => acc + f.incomeGrowthPct, 0) / totalFpos).toFixed(1));
    const avgHealthScore = Math.round(sampleFpos.reduce((acc, f) => acc + f.healthScore, 0) / totalFpos);

    const highCount = sampleFpos.filter(f => f.performanceStatus === 'High').length;
    const modCount = sampleFpos.filter(f => f.performanceStatus === 'Moderate').length;
    const lowCount = sampleFpos.filter(f => f.performanceStatus === 'Needs Attention').length;

    return { totalFpos, totalMembers, totalRevenueLakhs, avgGrowthPct, avgHealthScore, highCount, modCount, lowCount };
  }, []);

  const chartData = useMemo(() => {
    return sampleFpos.slice(0, 8).map(f => ({
      name: f.name.replace(' Producer Co.', '').replace(' Farmer', ''),
      before: f.revenueBeforeIntervention,
      after: f.revenueAfterIntervention,
      growth: f.incomeGrowthPct
    }));
  }, []);

  const pieData = [
    { name: 'Irrigation', value: 38, color: '#22c55e' },
    { name: 'Storage & Cold Chain', value: 24, color: '#2563eb' },
    { name: 'CHC Services', value: 21, color: '#f59e0b' },
    { name: 'Market Linkage', value: 17, color: '#a855f7' },
  ];

  const statePerformance = useMemo(() => {
    const map: Record<string, { fpoCount: number; avgGrowth: number }> = {};
    sampleFpos.forEach(f => {
      if (!map[f.state]) map[f.state] = { fpoCount: 0, avgGrowth: 0 };
      map[f.state].fpoCount += 1;
      map[f.state].avgGrowth += f.incomeGrowthPct;
    });
    return Object.entries(map).map(([state, data]) => ({
      state,
      fpoCount: data.fpoCount,
      avgGrowth: Math.round(data.avgGrowth / data.fpoCount)
    }));
  }, []);

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">National FPO Impact Overview</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-500">Real-time WDC 2.0 intervention monitoring and income uplift analytics across India.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onNavigate('fpos')} className="rounded-xl bg-white border border-green-200 px-4 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-50 shadow-sm">
            View FPO Directory
          </button>
          <button onClick={() => onNavigate('impact')} className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-green-800">
            Run AI Impact Simulation <ArrowRight className="ml-1 inline" size={15} />
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="metric-card">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700">
              <Building2 size={20} />
            </div>
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">Portfolio</span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Total FPOs Monitored</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{stats.totalFpos}</p>
          <p className="mt-2 text-xs font-semibold text-green-700">{stats.totalMembers.toLocaleString()} active smallholders</p>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="metric-card">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700">
              <TrendingUp size={20} />
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">FY 2024–25</span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Total Portfolio Revenue</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">₹{(stats.totalRevenueLakhs / 100).toFixed(2)} Cr</p>
          <p className="mt-2 text-xs font-semibold text-blue-700">₹{stats.totalRevenueLakhs.toFixed(1)} Lakhs combined</p>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} className="metric-card">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Activity size={20} />
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Growth</span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Avg Farmer Income Uplift</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">+{stats.avgGrowthPct}%</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">Post WDC 2.0 Intervention</p>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="metric-card">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700">
              <ShieldCheck size={20} />
            </div>
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">Health Index</span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Avg FPO Health Score</p>
          <p className="mt-1 text-3xl font-bold text-purple-700">{stats.avgHealthScore} / 100</p>
          <div className="mt-2 flex gap-2 text-[11px] font-bold">
            <span className="text-green-700">{stats.highCount} High</span> ·
            <span className="text-amber-700">{stats.modCount} Mod</span> ·
            <span className="text-red-600">{stats.lowCount} Risk</span>
          </div>
        </motion.article>
      </section>

      {/* Charts Section */}
      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <article className="chart-card lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">FPO Revenue Before vs After Interventions</h2>
              <p className="mt-1 text-xs text-slate-500">Revenue in ₹ Lakhs for top demonstration FPOs</p>
            </div>
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-800">Causal Impact</span>
          </div>
          <div className="mt-4 h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcebe0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={v => `₹${v}L`} />
                <Tooltip formatter={(v: number) => [`₹${v} Lakhs`, '']} />
                <Bar dataKey="before" name="Before WDC 2.0" fill="#b7d6c0" radius={[6, 6, 0, 0]} />
                <Bar dataKey="after" name="After WDC 2.0" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-6 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#b7d6c0]" /> Baseline Revenue</span>
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-green-500" /> Post-Intervention Revenue</span>
          </div>
        </article>

        <article className="chart-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Intervention Share</h2>
              <p className="mt-1 text-xs text-slate-500">Primary driver distribution</p>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {pieData.map(x => <Cell key={x.name} fill={x.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
            {pieData.map(x => (
              <span key={x.name} className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: x.color }} /> {x.name} ({x.value}%)
              </span>
            ))}
          </div>
        </article>
      </section>

      {/* State Breakdown & Top FPOs */}
      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <article className="chart-card lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900">FPO Directory Snapshot</h2>
              <p className="mt-1 text-xs text-slate-500">Quick status and health ratings for sample FPOs</p>
            </div>
            <button onClick={() => onNavigate('fpos')} className="text-xs font-bold text-green-700 hover:text-green-800">
              View all {sampleFpos.length} FPOs →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-green-100 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">FPO Name</th>
                  <th className="pb-3 font-semibold">State</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                  <th className="pb-3 font-semibold text-right">Growth</th>
                  <th className="pb-3 font-semibold text-center">Health</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {sampleFpos.slice(0, 5).map(f => (
                  <tr key={f.id} className="transition hover:bg-green-50/40">
                    <td className="py-3 font-bold text-slate-800">
                      {f.name}
                      <span className="block text-xs font-normal text-slate-400">{f.district}, {f.state}</span>
                    </td>
                    <td className="py-3 text-slate-600 font-medium">{f.state}</td>
                    <td className="py-3 text-right font-semibold text-slate-700">₹{f.revenueAfterIntervention} L</td>
                    <td className="py-3 text-right font-bold text-green-700">+{f.incomeGrowthPct}%</td>
                    <td className="py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        f.healthScore >= 80 ? 'bg-green-100 text-green-800' :
                        f.healthScore >= 65 ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {f.healthScore}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => { onSelectFpo(f.id); onNavigate('fpos'); }} className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-800 hover:bg-green-100">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="chart-card lg:col-span-2">
          <h2 className="font-bold text-slate-900 mb-1">State Growth Performance</h2>
          <p className="text-xs text-slate-500 mb-4">Average growth % by state</p>
          <div className="space-y-4">
            {statePerformance.slice(0, 5).map(s => (
              <div key={s.state}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin size={13} className="text-green-600" /> {s.state}
                  </span>
                  <b className="text-green-700">+{s.avgGrowth}%</b>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-green-50">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, s.avgGrowth * 1.8)}%` }} className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
