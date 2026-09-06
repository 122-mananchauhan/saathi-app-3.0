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
    <div className="space-y-8 sm:space-y-10">
      {/* Storage Intelligence Calculator */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-emerald-800 space-y-7">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-emerald-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <Warehouse className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">WDRA Storage Profitability Intelligence</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Calculates whether warehouse holding generates positive net profit after fees</p>
          </div>
          <span className="text-xs font-bold text-emerald-200 bg-emerald-800/90 px-3.5 py-1.5 rounded-full border border-emerald-700">
            WDRA Accredited Warehouse
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Produce Quantity (q)</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-emerald-700 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Storage Holding (Days)</label>
            <input
              type="number"
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-emerald-700 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Base Mandi Price (₹/q)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-emerald-700 text-white font-bold"
            />
          </div>
        </div>

        {/* Calculation Rationale */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-slate-900/80 p-6 sm:p-7 rounded-2xl border border-emerald-700/50 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 font-medium">Total Storage Expenses</span>
            <p className="text-2xl font-black text-rose-400 mt-1.5">-₹{storageCost.toLocaleString()}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">₹45/q per month rate</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Projected Price Increase</span>
            <p className="text-2xl font-black text-emerald-400 mt-1.5">+₹{expectedPriceIncreasePerQuintal}/q</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">+3.3% projected 15-day rise</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Gross Additional Revenue</span>
            <p className="text-2xl font-black text-amber-300 mt-1.5">+₹{grossAdditionalValue.toLocaleString()}</p>
          </div>
          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-800 pt-4 sm:pt-0 sm:pl-6">
            <span className="text-slate-300 font-bold uppercase tracking-wider text-xs">NET ADDITIONAL PROFIT</span>
            <p className="text-3xl font-black text-emerald-400 mt-1">+₹{netAdditionalProfit.toLocaleString()}</p>
            <p className="text-xs text-emerald-200 font-semibold mt-1">
              {netAdditionalProfit > 0 ? '✓ Storage Economically Beneficial' : '⚠ Immediate Sale Recommended'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Logistics Trackers */}
      <div className="surface-card rounded-3xl p-7 sm:p-8 space-y-6">
        <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-3">
          <Truck className="w-6 h-6 text-emerald-600" />
          <span>Active Farm-Gate Logistics & Transit Tracking</span>
        </h3>

        <div className="space-y-5">
          {logistics.map(item => (
            <div key={item.id} className="surface-card-hover rounded-2xl p-6 border border-slate-200 text-xs sm:text-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-base font-serif">Vehicle: {item.vehicle_type}</h4>
                  <p className="text-slate-500 font-medium text-xs mt-0.5">Distance: {item.distance_km} km • Freight Cost: ₹{item.estimated_cost.toLocaleString()}</p>
                </div>
                <Badge type="status" value={item.vehicle_status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pickup Location: <strong className="text-slate-900">{item.pickup_location}</strong> ({item.pickup_date})</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Destination: <strong className="text-slate-900">{item.destination}</strong> ({item.delivery_date})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
