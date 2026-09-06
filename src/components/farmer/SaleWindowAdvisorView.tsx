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
    <div className="space-y-8 sm:space-y-10">
      {/* Input Parameters Card */}
      <div className="surface-card p-7 sm:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-3">
              <Clock className="w-6 h-6 text-emerald-600" />
              <span>Event-Aware AI Sale Window Advisor</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Optimizes harvest sale timing & risk hedging based on price trajectory & event volatility</p>
          </div>
          <Badge type="demo" value="Demo Data" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Crop Type</label>
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
            <label className="block font-bold text-slate-700 mb-1.5">Produce Quantity (q)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Current Price (₹/q)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Active Event Filter</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
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
      <div className={`${style.bg} ${style.border} border text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-7`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 border-b border-white/10 pb-7">
          <div className="space-y-2">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${style.badgeBg}`}>
              DECISION-SUPPORT RECOMMENDATION
            </span>
            <h3 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">{advice.recommendation}</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Suggested Window: <strong className="text-white">{advice.window}</strong></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-left sm:text-right min-w-[240px] space-y-1">
            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Estimated Net Gain</p>
            <p className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">+₹{advice.estimated_net_gain_rs.toLocaleString()}</p>
            <p className="text-xs text-slate-300 font-medium">After warehouse holding expenses</p>
          </div>
        </div>

        {/* Reason Explanation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm sm:text-base">
            <Lightbulb className="w-5 h-5" />
            <span>AI Analytical Rationale & Decision Factors</span>
          </div>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/10 font-medium">
            "{advice.reason}"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Current Mandi Price</span>
            <p className="font-extrabold text-lg text-white mt-1">₹{advice.current_price} / quintal</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Projected 15-Day Range</span>
            <p className="font-extrabold text-lg text-emerald-300 mt-1">{advice.projected_15d_range || '₹2,515–₹2,692'}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 font-medium">Forecast Confidence</span>
            <p className="font-extrabold text-lg text-amber-300 mt-1">{advice.confidence_level || 'Medium'} Confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
};
