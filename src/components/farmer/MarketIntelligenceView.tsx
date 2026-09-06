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
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Net Realization & Market Discovery Engine</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Net Realization = Selling Revenue − Transportation − Storage Expenses − Mandi/Transaction Fees
            </p>
          </div>
          <Badge type="demo" value="Demo Data" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Crop</label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="Wheat">Wheat</option>
              <option value="Paddy (Rice)">Paddy (Rice)</option>
              <option value="Cotton">Cotton</option>
              <option value="Soybean">Soybean</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Produce Volume (Quintals)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Storage Holding (Days)</label>
            <input
              type="number"
              value={storageDays}
              onChange={(e) => setStorageDays(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Best Recommendation Highlight */}
      {bestMarket && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              RECOMMENDED BEST NET REALIZATION MARKET
            </span>
            <h3 className="text-2xl font-bold font-serif text-white">{bestMarket.mandi_name}</h3>
            <p className="text-slate-300 text-xs mt-1">
              Location: {bestMarket.district}, {bestMarket.state} • Distance: {bestMarket.distance_km} km • Demand: <strong className="text-amber-300">{bestMarket.demand_level}</strong>
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-900/60 p-4 rounded-2xl border border-emerald-700/50 min-w-[240px]">
            <p className="text-xs text-slate-400 font-medium">Effective Net Price / Quintal</p>
            <p className="text-3xl font-extrabold text-emerald-400">₹{bestMarket.net_realization.effective_net_price_per_quintal.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-200 font-semibold mt-1">
              Net Total Profit: ₹{bestMarket.net_realization.net_revenue.toLocaleString()} ({bestMarket.net_realization.profitability_percentage}% Margin)
            </p>
          </div>
        </div>
      )}

      {/* Side by Side Comparative Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Comparative Market Net Realization Matrix ({cropName} - {quantity} Quintals)</span>
          <span className="text-slate-400 font-normal">Sorted by Highest Net Revenue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Market / Mandi</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Mandi Price</th>
                <th className="p-3.5">Gross Revenue</th>
                <th className="p-3.5">Transport Cost</th>
                <th className="p-3.5">Storage & Fees</th>
                <th className="p-3.5 text-right">Net Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map((c, idx) => (
                <tr key={idx} className={idx === 0 ? 'bg-emerald-50/50 font-medium' : 'hover:bg-slate-50'}>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{c.mandi_name}</div>
                    <div className="text-[11px] text-slate-400">{c.district}, {c.state}</div>
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold">{c.distance_km} km</td>
                  <td className="p-3.5 font-bold text-slate-900">₹{c.modal_price.toLocaleString()} / q</td>
                  <td className="p-3.5 text-slate-700">₹{c.net_realization.gross_revenue.toLocaleString()}</td>
                  <td className="p-3.5 text-rose-600 font-semibold">-₹{c.net_realization.transport_cost.toLocaleString()}</td>
                  <td className="p-3.5 text-amber-700 font-semibold">
                    -₹{(c.net_realization.storage_cost + c.net_realization.transaction_fee).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="font-extrabold text-sm text-emerald-700">₹{c.net_realization.net_revenue.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">(₹{c.net_realization.effective_net_price_per_quintal}/q net)</div>
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
