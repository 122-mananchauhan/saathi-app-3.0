import React, { useState, useEffect } from 'react';
import { MarketComparison } from '../../types';
import { api } from '../../services/api';
import { Calculator, ArrowRight, Truck, Warehouse, DollarSign, Award, Layers } from 'lucide-react';
import { Badge } from '../common/Badge';

export const MarketIntelligenceView: React.FC = () => {
  const [cropName, setCropName] = useState('Wheat');
  const [quantity, setQuantity] = useState(120);
  const [storageDays, setStorageDays] = useState(0);
  const [comparisons, setComparisons] = useState<MarketComparison[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComparisons = async () => {
    setLoading(true);
    const res = await api.getNetRealizationComparison(cropName, quantity, storageDays);
    setComparisons(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchComparisons();
  }, [cropName, quantity, storageDays]);

  const bestMarket = comparisons[0];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header & Controls */}
      <div className="surface-card p-7 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-emerald-600" />
              <span>Net Realization & Market Discovery Engine</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Net Realization = Selling Revenue − Transportation − Storage Expenses − Mandi/Transaction Fees
            </p>
          </div>
          <Badge type="demo" value="Demo Data" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Select Crop</label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            >
              <option value="Wheat">Wheat</option>
              <option value="Paddy (Rice)">Paddy (Rice)</option>
              <option value="Cotton">Cotton</option>
              <option value="Soybean">Soybean</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Produce Volume (Quintals)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Storage Holding (Days)</label>
            <input
              type="number"
              value={storageDays}
              onChange={(e) => setStorageDays(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Best Recommendation Highlight */}
      {bestMarket && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/90 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              RECOMMENDED BEST NET REALIZATION MARKET
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-serif text-white">{bestMarket.mandi_name}</h3>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Location: {bestMarket.district}, {bestMarket.state} • Distance: {bestMarket.distance_km} km • Demand: <strong className="text-amber-300">{bestMarket.demand_level}</strong>
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-900/80 p-6 rounded-2xl border border-emerald-700/50 min-w-[260px] space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Effective Net Price / Quintal</p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">₹{bestMarket.net_realization.effective_net_price_per_quintal.toLocaleString()}</p>
            <p className="text-xs text-emerald-200 font-semibold pt-1">
              Net Total Profit: ₹{bestMarket.net_realization.net_revenue.toLocaleString()} ({bestMarket.net_realization.profitability_percentage}% Margin)
            </p>
          </div>
        </div>
      )}

      {/* Side by Side Comparative Table */}
      <div className="surface-card rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
          <span>Comparative Market Net Realization Matrix ({cropName} - {quantity} Quintals)</span>
          <span className="text-slate-400 font-medium">Sorted by Highest Net Revenue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Market / Mandi</th>
                <th className="p-4">Distance</th>
                <th className="p-4">Mandi Price</th>
                <th className="p-4">Gross Revenue</th>
                <th className="p-4">Transport Cost</th>
                <th className="p-4">Storage & Fees</th>
                <th className="p-4 text-right">Net Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map((c, idx) => (
                <tr key={idx} className={idx === 0 ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50 transition-colors'}>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{c.mandi_name}</div>
                    <div className="text-xs text-slate-500">{c.district}, {c.state}</div>
                  </td>
                  <td className="p-4 text-slate-700 font-semibold">{c.distance_km} km</td>
                  <td className="p-4 font-bold text-slate-900">₹{c.modal_price.toLocaleString()} / q</td>
                  <td className="p-4 text-slate-700 font-medium">₹{c.net_realization.gross_revenue.toLocaleString()}</td>
                  <td className="p-4 text-rose-600 font-bold">-₹{c.net_realization.transport_cost.toLocaleString()}</td>
                  <td className="p-4 text-amber-700 font-bold">
                    -₹{(c.net_realization.storage_cost + c.net_realization.transaction_fee).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-black text-base text-emerald-700">₹{c.net_realization.net_revenue.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 font-medium">(₹{c.net_realization.effective_net_price_per_quintal}/q net)</div>
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
