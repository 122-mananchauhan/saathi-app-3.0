import React, { useState, useEffect } from 'react';
import { ShieldCheck, BarChart3, TrendingUp, Users, Building2, MapPin, Download, AlertTriangle, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Badge } from '../common/Badge';

export const AdminDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const macroMetrics = {
    farmers: 1425,
    fpos: 48,
    buyers: 112,
    activeLots: 384,
    tradedVolumeTons: 5075.0,
    tradedValueCr: 16.45,
    avgNetRealizationGainPct: 11.4,
    postHarvestLossReductionPct: 8.2,
    disputeRatePct: 0.4
  };

  const regionalSupplyDemand = [
    { region: 'Punjab - Ludhiana', crop: 'Wheat', supply: 1850, demand: 2400, mandiPrice: 2450, buyerPrice: 2580 },
    { region: 'Punjab - Tarn Taran', crop: 'Paddy', supply: 2200, demand: 3100, mandiPrice: 3820, buyerPrice: 3950 },
    { region: 'Haryana - Karnal', crop: 'Wheat', supply: 1400, demand: 2800, mandiPrice: 2600, buyerPrice: 2680 },
    { region: 'MP - Indore', crop: 'Soybean', supply: 3500, demand: 4200, mandiPrice: 4720, buyerPrice: 4890 },
    { region: 'Maharashtra - Nashik', crop: 'Onion', supply: 4800, demand: 5000, mandiPrice: 2650, buyerPrice: 2780 },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Region,Crop,Supply_Tons,Demand_Tons,Avg_Mandi_Price,Direct_Buyer_Price\n"
      + regionalSupplyDemand.map(e => `${e.region},${e.crop},${e.supply},${e.demand},${e.mandiPrice},${e.buyerPrice}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kisan_market_admin_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-shell space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Admin Hero Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#321654] via-purple-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl border border-purple-900/80 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="absolute -right-10 -top-20 h-80 w-80 rounded-full bg-fuchsia-300/10 blur-3xl pointer-events-none" />
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Government intelligence</span>
            <Badge type="verification" value="TRUSTED" />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-tight">Ecosystem intelligence</h1>
          <p className="text-sm sm:text-base text-purple-100/80 font-medium">National transactions, market discovery & outcome analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="relative px-6 py-3.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 text-sm font-bold shadow-xl transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV Report</span>
          </button>
        </div>
      </div>

      {/* State & District Filters */}
      <div className="surface-card p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Filter Region:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold"
          >
            <option value="All">All States (National View)</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>

        <span className="text-slate-400 font-medium text-xs sm:text-sm">Real-time aggregation across mandis & institutional buyers</span>
      </div>

      {/* Ecosystem Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8">
        <div className="surface-card-hover p-6 min-h-[140px] flex flex-col justify-between border-t-4 border-t-slate-300">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Farmers</span>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight my-1">{macroMetrics.farmers}</p>
        </div>

        <div className="surface-card-hover p-6 min-h-[140px] flex flex-col justify-between border-t-4 border-t-indigo-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered FPOs</span>
          <p className="text-3xl sm:text-4xl font-black text-indigo-700 tracking-tight my-1">{macroMetrics.fpos}</p>
        </div>

        <div className="surface-card-hover p-6 min-h-[140px] flex flex-col justify-between border-t-4 border-t-blue-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Buyers</span>
          <p className="text-3xl sm:text-4xl font-black text-blue-700 tracking-tight my-1">{macroMetrics.buyers}</p>
        </div>

        <div className="surface-card-hover p-6 min-h-[140px] flex flex-col justify-between border-t-4 border-t-emerald-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Traded Volume</span>
          <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight my-1">{macroMetrics.tradedVolumeTons} T</p>
        </div>

        <div className="surface-card-hover p-6 min-h-[140px] flex flex-col justify-between border-t-4 border-t-purple-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Transaction Value</span>
          <p className="text-3xl sm:text-4xl font-black text-purple-700 tracking-tight my-1">₹{macroMetrics.tradedValueCr} Cr</p>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 min-h-[140px] flex flex-col justify-between shadow-[0_10px_35px_rgba(5,150,105,0.08)]">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Net Realization Gain</span>
          <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight my-1">+{macroMetrics.avgNetRealizationGainPct}%</p>
        </div>
      </div>

      {/* Regional Supply vs Demand Visualizer Chart */}
      <div className="surface-card rounded-3xl p-7 sm:p-8 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900">Regional Produce Supply vs Institutional Demand (Tons)</h3>
          <span className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full">
            Ecosystem Liquidity Index: 98.2%
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalSupplyDemand} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="region" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="supply" fill="#059669" name="Farmer Supply (Tons)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="demand" fill="#4f46e5" name="Buyer Demand (Tons)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Heatmap Table */}
      <div className="surface-card rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-800">
          Regional Supply, Demand & Mandi vs Direct Buyer Price Realization Matrix
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="p-4">Region / District</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Supply (Tons)</th>
                <th className="p-4">Demand (Tons)</th>
                <th className="p-4">Mandi Price</th>
                <th className="p-4">Direct Buyer Price</th>
                <th className="p-4 text-right">Farmer Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionalSupplyDemand.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{r.region}</td>
                  <td className="p-4 text-slate-700 font-medium">{r.crop}</td>
                  <td className="p-4 text-emerald-700 font-bold">{r.supply} T</td>
                  <td className="p-4 text-indigo-700 font-bold">{r.demand} T</td>
                  <td className="p-4 text-slate-700 font-medium">₹{r.mandiPrice}/q</td>
                  <td className="p-4 font-black text-emerald-700 text-base">₹{r.buyerPrice}/q</td>
                  <td className="p-4 text-right font-black text-emerald-700 text-base">
                    +₹{r.buyerPrice - r.mandiPrice}/q ({Math.round(((r.buyerPrice - r.mandiPrice)/r.mandiPrice)*100)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
