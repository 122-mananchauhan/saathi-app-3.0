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
    <div className="page-shell space-y-5 sm:space-y-6">
      {/* Admin Hero Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#321654] via-purple-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-fuchsia-300/10 blur-2xl" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-200">Government intelligence</span>
            <Badge type="verification" value="TRUSTED" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif leading-none">Ecosystem intelligence</h1>
          <p className="text-xs text-purple-100/70 mt-3">National transactions, market discovery & outcome analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="relative px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 text-xs font-bold shadow-lg transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV Report</span>
          </button>
        </div>
      </div>

      {/* State & District Filters */}
      <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">Filter Region:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
          >
            <option value="All">All States (National View)</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>

        <span className="text-slate-400 font-medium text-[11px]">Real-time aggregation across mandis & institutional buyers</span>
      </div>

      {/* Ecosystem Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
        <div className="surface-card-hover p-4 border-t-2 border-t-slate-300">
          <span className="text-slate-500 font-semibold">Registered Farmers</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{macroMetrics.farmers}</p>
        </div>

        <div className="surface-card-hover p-4 border-t-2 border-t-indigo-400">
          <span className="text-slate-500 font-semibold">Registered FPOs</span>
          <p className="text-xl font-extrabold text-indigo-700 mt-1">{macroMetrics.fpos}</p>
        </div>

        <div className="surface-card-hover p-4 border-t-2 border-t-blue-400">
          <span className="text-slate-500 font-semibold">Verified Buyers</span>
          <p className="text-xl font-extrabold text-blue-700 mt-1">{macroMetrics.buyers}</p>
        </div>

        <div className="surface-card-hover p-4 border-t-2 border-t-emerald-400">
          <span className="text-slate-500 font-semibold">Traded Volume</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">{macroMetrics.tradedVolumeTons} T</p>
        </div>

        <div className="surface-card-hover p-4 border-t-2 border-t-purple-400">
          <span className="text-slate-500 font-semibold">Transaction Value</span>
          <p className="text-xl font-extrabold text-purple-700 mt-1">₹{macroMetrics.tradedValueCr} Cr</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_30px_rgba(5,150,105,0.08)]">
          <span className="text-emerald-800 font-semibold">Net Price Realization Gain</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">+{macroMetrics.avgNetRealizationGainPct}%</p>
        </div>
      </div>

      {/* Regional Supply vs Demand Visualizer Chart */}
      <div className="surface-card rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Regional Produce Supply vs Institutional Demand (Tons)</h3>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            Ecosystem Liquidity Index: 98.2%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalSupplyDemand} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="region" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
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
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Regional Supply, Demand & Mandi vs Direct Buyer Price Realization Matrix
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3.5">Region / District</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5">Supply (Tons)</th>
                <th className="p-3.5">Demand (Tons)</th>
                <th className="p-3.5">Mandi Price</th>
                <th className="p-3.5">Direct Buyer Price</th>
                <th className="p-3.5 text-right">Farmer Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regionalSupplyDemand.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{r.region}</td>
                  <td className="p-3.5 text-slate-700">{r.crop}</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">{r.supply} T</td>
                  <td className="p-3.5 text-indigo-700 font-semibold">{r.demand} T</td>
                  <td className="p-3.5 text-slate-700">₹{r.mandiPrice}/q</td>
                  <td className="p-3.5 font-bold text-emerald-700">₹{r.buyerPrice}/q</td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-700">
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
