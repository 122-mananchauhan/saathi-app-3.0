import React, { useState } from 'react';
import { LogisticsItem } from '../../types';
import { Truck, Warehouse, MapPin, Calendar, DollarSign, ArrowUpRight, Calculator, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface FarmerLogisticsStorageProps {
  logistics: LogisticsItem[];
}

export const FarmerLogisticsStorage: React.FC<FarmerLogisticsStorageProps> = ({ logistics }) => {
  const [holdingDays, setHoldingDays] = useState(15);
  const [qty, setQty] = useState(120);
  const [currentPrice, setCurrentPrice] = useState(2450);

  // Storage Math Calculation
  const monthlyRate = 45; // ₹45 per quintal per month
  const storageCost = Math.round(qty * monthlyRate * (holdingDays / 30.0));
  const expectedPriceIncreasePerQuintal = Math.round(currentPrice * 0.033); // +3.3% in 15 days
  const grossAdditionalValue = expectedPriceIncreasePerQuintal * qty;
  const netAdditionalProfit = grossAdditionalValue - storageCost;

  return (
    <div className="space-y-6">
      {/* Storage Intelligence Calculator */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-emerald-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-serif text-white">WDRA Storage Profitability Intelligence</h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">Calculates whether warehouse holding generates positive net profit after fees</p>
          </div>
          <span className="text-xs font-bold text-emerald-200 bg-emerald-800 px-3 py-1 rounded-full">
            WDRA Accredited Warehouse
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Produce Quantity (q)</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Storage Holding (Days)</label>
            <input
              type="number"
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Base Mandi Price (₹/q)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-700 text-white font-bold"
            />
          </div>
        </div>

        {/* Calculation Rationale */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-700/50 text-xs">
          <div>
            <span className="text-slate-400">Total Storage Expenses</span>
            <p className="text-xl font-bold text-rose-400 mt-1">-₹{storageCost.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 font-medium">₹45/q per month rate</p>
          </div>
          <div>
            <span className="text-slate-400">Projected Price Increase</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">+₹{expectedPriceIncreasePerQuintal}/q</p>
            <p className="text-[10px] text-slate-400 font-medium">+3.3% projected 15-day rise</p>
          </div>
          <div>
            <span className="text-slate-400">Gross Additional Revenue</span>
            <p className="text-xl font-bold text-amber-300 mt-1">+₹{grossAdditionalValue.toLocaleString()}</p>
          </div>
          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-800 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-slate-300 font-bold">NET ADDITIONAL PROFIT</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">+₹{netAdditionalProfit.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-200 font-semibold mt-0.5">
              {netAdditionalProfit > 0 ? '✓ Storage Economically Beneficial' : '⚠ Immediate Sale Recommended'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Logistics Trackers */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span>Active Farm-Gate Logistics & Transit Tracking</span>
        </h3>

        <div className="space-y-4">
          {logistics.map(item => (
            <div key={item.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Vehicle: {item.vehicle_type}</h4>
                  <p className="text-slate-500 text-[11px]">Distance: {item.distance_km} km • Freight Cost: ₹{item.estimated_cost.toLocaleString()}</p>
                </div>
                <Badge type="status" value={item.vehicle_status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Pickup Location: <strong>{item.pickup_location}</strong> ({item.pickup_date})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Destination: <strong>{item.destination}</strong> ({item.delivery_date})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
