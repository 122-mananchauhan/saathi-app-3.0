import React, { useState, useEffect } from 'react';
import { SaleWindowAdvice } from '../../types';
import { api } from '../../services/api';
import { Clock, ShieldAlert, CheckCircle2, Warehouse, Lightbulb, Zap } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SaleWindowAdvisorView: React.FC = () => {
  const [cropName, setCropName] = useState('Wheat');
  const [quantity, setQuantity] = useState(120);
  const [currentPrice, setCurrentPrice] = useState(2450);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  
  const [advice, setAdvice] = useState<SaleWindowAdvice | null>(null);

  useEffect(() => {
    api.getSaleWindowAdvice(cropName, quantity, currentPrice, storageAvailable, selectedEvent || undefined)
      .then(setAdvice);
  }, [cropName, quantity, currentPrice, storageAvailable, selectedEvent]);

  if (!advice) return null;

  const recColorMap: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
    'WAIT 7–10 DAYS': { bg: 'bg-emerald-950', border: 'border-emerald-700', text: 'text-emerald-300', badgeBg: 'bg-emerald-800 text-emerald-100' },
    'SELL NOW': { bg: 'bg-rose-950', border: 'border-rose-700', text: 'text-rose-300', badgeBg: 'bg-rose-800 text-rose-100' },
    'SELL PARTIALLY / STORE NEARBY': { bg: 'bg-amber-950', border: 'border-amber-700', text: 'text-amber-300', badgeBg: 'bg-amber-800 text-amber-100' },
    'SELL PARTIALLY / HEDGE RISK': { bg: 'bg-amber-950', border: 'border-amber-500', text: 'text-amber-300', badgeBg: 'bg-amber-500 text-slate-950 font-bold' },
    'CONSIDER DISTANT PROCESSOR MARKET': { bg: 'bg-blue-950', border: 'border-blue-700', text: 'text-blue-300', badgeBg: 'bg-blue-800 text-blue-100' }
  };

  const style = recColorMap[advice.recommendation] || recColorMap['WAIT 7–10 DAYS'];

  return (
    <div className="space-y-6">
      {/* Input Parameters Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Event-Aware AI Sale Window Advisor</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Optimizes harvest sale timing & risk hedging based on price trajectory & event volatility</p>
          </div>
          <Badge type="demo" value="Demo Data" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Crop Type</label>
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
            <label className="block font-semibold text-slate-700 mb-1">Produce Quantity (q)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Price (₹/q)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Active Event Filter</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            >
              <option value="">No Active Event</option>
              <option value="Heavy Rainfall">Heavy Rainfall</option>
              <option value="Drought / Heatwave">Drought / Heatwave</option>
              <option value="Sudden Arrival Spike">Sudden Arrival Spike</option>
              <option value="Pest Outbreak">Pest Outbreak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main AI Advice Hero Card */}
      <div className={`${style.bg} ${style.border} border text-white rounded-3xl p-8 shadow-2xl space-y-6`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${style.badgeBg} mb-3`}>
              DECISION-SUPPORT RECOMMENDATION
            </span>
            <h3 className="text-3xl font-black font-serif text-white tracking-tight">{advice.recommendation}</h3>
            <p className="text-xs text-slate-300 mt-1">Suggested Window: <strong className="text-white">{advice.window}</strong></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-left sm:text-right min-w-[220px]">
            <p className="text-xs text-slate-300 font-medium">Estimated Net Gain</p>
            <p className="text-2xl font-extrabold text-amber-300">+₹{advice.estimated_net_gain_rs.toLocaleString()}</p>
            <p className="text-[11px] text-slate-300 mt-0.5">After warehouse holding expenses</p>
          </div>
        </div>

        {/* Reason Explanation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Lightbulb className="w-5 h-5" />
            <span>AI Analytical Rationale & Decision Factors</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed bg-black/30 p-5 rounded-2xl border border-white/10">
            "{advice.reason}"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400">Current Mandi Price</span>
            <p className="font-bold text-base text-white mt-0.5">₹{advice.current_price} / quintal</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400">Projected 15-Day Range</span>
            <p className="font-bold text-base text-emerald-300 mt-0.5">{advice.projected_15d_range || '₹2,515–₹2,692'}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400">Forecast Confidence</span>
            <p className="font-bold text-base text-amber-300 mt-0.5">{advice.confidence_level || 'Medium'} Confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
};
