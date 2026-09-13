import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, CheckCircle, Sparkles, Filter } from 'lucide-react';
import { sampleFpos, sampleRiskIndicators, sampleAiRecommendations } from '../../data/mockData';

export function ReportsView() {
  const [reportType, setReportType] = useState<'performance' | 'impact' | 'district'>('performance');

  const downloadCsv = () => {
    let headers = "FPO ID,FPO Name,State,District,Members,Revenue (Lakhs),Growth Pct,Health Score\n";
    let rows = sampleFpos.map(f => `${f.id},"${f.name}",${f.state},${f.district},${f.membersCount},${f.revenueAfterIntervention},${f.incomeGrowthPct}%,${f.healthScore}`).join("\n");
    let blob = new Blob([headers + rows], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `kisan_saathi_fpo_${reportType}_report.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="section-label">Executive Reporting & Documentation</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Data Export</h1>
          <p className="mt-1 text-slate-500">Generate presentation-ready evaluation reports for government review.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={downloadCsv} className="flex items-center gap-2 rounded-xl bg-white border border-green-200 px-4 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-50 shadow-sm">
            <Download size={16} /> Export CSV Data
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-green-800">
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </section>

      {/* Report Selector Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 pb-3 print:hidden">
        <button 
          onClick={() => setReportType('performance')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${reportType === 'performance' ? 'bg-green-700 text-white shadow-glow' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <FileText size={14} /> FPO Performance Report
        </button>
        <button 
          onClick={() => setReportType('impact')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${reportType === 'impact' ? 'bg-green-700 text-white shadow-glow' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <FileText size={14} /> WDC 2.0 Impact Evaluation
        </button>
      </div>

      {/* Printable Report Paper Layout */}
      <div className="glass rounded-3xl p-8 max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl print:shadow-none print:border-none">
        {/* Printable Header */}
        <div className="border-b-2 border-green-700 pb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Kisan Saathi – Executive Evaluation Report</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Smart India Hackathon SIH1435 • WDC 2.0 Monitoring Division</p>
          </div>
          <div className="text-right">
            <span className="block text-xs font-bold text-slate-400 uppercase">Report Generated</span>
            <b className="text-sm text-slate-700">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b>
          </div>
        </div>

        {/* Disclaimer in Print */}
        <div className="my-4 rounded-xl bg-amber-50 p-3 text-center text-xs font-bold text-amber-800 border border-amber-200">
          "Prototype data – for demonstration only."
        </div>

        {/* Content based on selected tab */}
        {reportType === 'performance' && (
          <div className="space-y-6 mt-6">
            <h3 className="font-bold text-lg text-slate-900 border-l-4 border-green-700 pl-3">FPO Income & Performance Overview</h3>
            <table className="w-full text-left text-xs border border-slate-200 divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">FPO Name</th>
                  <th className="p-3">State</th>
                  <th className="p-3 text-right">Revenue (Lakhs)</th>
                  <th className="p-3 text-right">Growth %</th>
                  <th className="p-3 text-center">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleFpos.map(f => (
                  <tr key={f.id}>
                    <td className="p-3 font-semibold text-slate-600">{f.id}</td>
                    <td className="p-3 font-bold text-slate-800">{f.name}</td>
                    <td className="p-3 text-slate-600">{f.state}</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{f.revenueAfterIntervention} L</td>
                    <td className="p-3 text-right font-bold text-green-700">+{f.incomeGrowthPct}%</td>
                    <td className="p-3 text-center font-bold text-slate-800">{f.healthScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'impact' && (
          <div className="space-y-6 mt-6">
            <h3 className="font-bold text-lg text-slate-900 border-l-4 border-green-700 pl-3">Intervention Causal Impact Assessment</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Income Growth</span>
                <b className="mt-1 block text-2xl text-green-700">+34.8%</b>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Top Driver</span>
                <b className="mt-1 block text-2xl text-blue-700">Solar Drip Irrigation</b>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Active Beneficiaries</span>
                <b className="mt-1 block text-2xl text-slate-900">5,490 Farmers</b>
              </div>
            </div>
          </div>
        )}

        {/* Executive Sign-off */}
        <div className="mt-12 border-t border-slate-200 pt-6 flex justify-between text-xs text-slate-400">
          <span>Kisan Saathi Intelligence Platform • SIH1435</span>
          <span>Official Evaluation Copy</span>
        </div>
      </div>
    </>
  );
}
