import React, { useState, useEffect } from 'react';
import { UpgradedPrediction, ModelValidationStats } from '../../types';
import { api } from '../../services/api';
import { 
  Sparkles, AlertTriangle, Info, Calendar, ShieldCheck, RefreshCw, 
  TrendingUp, Layers, CheckCircle2, ChevronDown, ChevronUp, Zap, HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Badge } from '../common/Badge';

export const AIPricePredictionView: React.FC = () => {
  const [cropName, setCropName] = useState('Wheat');
  const [currentPrice, setCurrentPrice] = useState(2450);
  const [horizonDays, setHorizonDays] = useState<number>(15);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  
  const [forecast, setForecast] = useState<UpgradedPrediction | null>(null);
  const [modelStats, setModelStats] = useState<ModelValidationStats | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    const res = await api.getUpgradedPriceForecast(
      cropName, 
      currentPrice, 
      horizonDays, 
      selectedEvent || undefined
    );
    setForecast(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchForecast();
  }, [cropName, currentPrice, horizonDays, selectedEvent]);

  useEffect(() => {
    api.getModelValidationStats().then(setModelStats);
  }, []);

  if (!forecast) return null;

  const confidenceBadgeColor: Record<string, string> = {
    High: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 border-amber-300',
    Low: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Top Header & Horizon Tabs */}
      <div className="surface-card p-7 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">Event-Aware AI Price Forecasting Pipeline</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Integrates historical mandi prices, arrival trends, supply-demand data, weather events, and transport factors
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">{forecast.last_updated_timestamp}</span>
            <button
              onClick={fetchForecast}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Refresh Forecast"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Input Parameters & Horizon Selector */}
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
            <label className="block font-bold text-slate-700 mb-1.5">Current Base Price (₹/q)</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Forecast Horizon</label>
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl font-bold">
              {[7, 15, 30].map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizonDays(h)}
                  className={`py-2 rounded-xl transition-all ${
                    horizonDays === h ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  {h} Days
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive External Event Simulation Bar */}
      <div className="bg-slate-950 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
            <Zap className="w-4 h-4 animate-bounce" />
            <span>EVENT DETECTION & SIMULATION LAYER:</span>
            <span className="text-slate-300 font-normal hidden md:inline">Test how newly reported events dynamically recalibrate the forecast</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click event to apply</span>
        </div>

        <div className="flex flex-wrap gap-2.5 text-xs sm:text-sm">
          <button
            onClick={() => setSelectedEvent('')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedEvent === '' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            No Active Event (Normal Market)
          </button>
          {[
            'Heavy Rainfall', 
            'Drought / Heatwave', 
            'Sudden Arrival Spike', 
            'Pest Outbreak', 
            'Demand Spike', 
            'Transport Disruption'
          ].map(e => (
            <button
              key={e}
              onClick={() => setSelectedEvent(e)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedEvent === e ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Visible Market Event Alert Banner (If Event Active) */}
      {forecast.event_alert && (
        <div className="bg-amber-500/10 border-2 border-amber-500/60 rounded-3xl p-7 shadow-md text-amber-950 space-y-3 animate-in fade-in">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  ⚠️ MARKET ALERT: {forecast.event_alert.type.toUpperCase()} DETECTED
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{forecast.event_alert.headline}</h3>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
              {forecast.event_alert.status}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-10 font-medium">
            <strong>Impact Assessment:</strong> {forecast.event_alert.impact_summary}
          </p>

          <div className="pl-10 pt-1 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
            <span>Affected Region: {forecast.event_alert.region_affected}</span>
            <span>Confidence Rating: <strong className="text-amber-800">{forecast.confidence.level} ({forecast.confidence.score}%)</strong></span>
            <span className="text-emerald-800 font-bold">Action: Review sale window hedging</span>
          </div>
        </div>
      )}

      {/* Primary Forecast Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm">
        {/* Card 1: Current Price */}
        <div className="surface-card p-6 min-h-[160px] flex flex-col justify-between">
          <span className="font-bold uppercase tracking-wider text-slate-500 text-xs">Current Base Price</span>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight my-2">₹{currentPrice.toLocaleString()} <span className="text-base font-semibold text-slate-500">/ q</span></p>
          <span className="text-xs text-slate-400 font-medium">{forecast.region}</span>
        </div>

        {/* Card 2: Expected Price Range */}
        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200 shadow-sm min-h-[160px] flex flex-col justify-between">
          <span className="font-bold uppercase tracking-wider text-emerald-800 text-xs">{horizonDays}-Day Expected Price Range</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight my-2">
            ₹{forecast.expected_price_range.min.toLocaleString()} – ₹{forecast.expected_price_range.max.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-900 font-bold">
            Modal Target: ₹{forecast.expected_price_range.modal.toLocaleString()}/q ({forecast.expected_price_range.change_pct > 0 ? '+' : ''}{forecast.expected_price_range.change_pct}%)
          </p>
        </div>

        {/* Card 3: Confidence & Uncertainty */}
        <div className="surface-card p-6 min-h-[160px] flex flex-col justify-between">
          <span className="font-bold uppercase tracking-wider text-slate-500 text-xs">Forecast Confidence</span>
          <div className="flex items-center gap-3 my-2">
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{forecast.confidence.score}%</p>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${confidenceBadgeColor[forecast.confidence.level]}`}>
              {forecast.confidence.level} Confidence
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">{forecast.confidence.uncertainty_reason}</p>
        </div>

        {/* Card 4: Data Quality */}
        <div className="surface-card p-6 min-h-[160px] flex flex-col justify-between">
          <span className="font-bold uppercase tracking-wider text-slate-500 text-xs">Data Completeness Index</span>
          <p className="text-3xl sm:text-4xl font-black text-indigo-700 tracking-tight my-2">{forecast.data_quality_pct}%</p>
          <span className="text-xs text-slate-400 font-medium">Verified Market & Weather Data</span>
        </div>
      </div>

      {/* Interactive Recharts Visualization */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Price Movement Forecast & Confidence Area Band ({horizonDays}-Day Horizon)</h3>
          <span className="text-xs font-semibold text-slate-500">Probabilistic Trend Bounds</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceBandColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis domain={['dataMin - 60', 'dataMax + 60']} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="max" stroke="#94a3b8" fillOpacity={0} strokeDasharray="3 3" name="Upper Range (Max)" />
              <Area type="monotone" dataKey="price" stroke="#059669" strokeWidth={3} fill="url(#priceBandColor)" name="Expected Modal Price" />
              <Area type="monotone" dataKey="min" stroke="#cbd5e1" fillOpacity={0} strokeDasharray="3 3" name="Lower Range (Min)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* "Why is this price predicted?" Farmer-Friendly Rationale */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <Info className="w-5 h-5 text-emerald-600" />
          <span>Why is this price predicted? (Analytical Factor Breakdown)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {forecast.factors.map((f, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                f.type === 'positive' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}
            >
              <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                f.type === 'positive' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {f.type === 'positive' ? '+' : '–'}
              </span>
              <p className="font-medium leading-relaxed mt-0.5">{f.driver}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details Collapsible Panel */}
      <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex justify-between items-center text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Advanced Model Validation & Feature Metrics (For Technical Evaluators)</span>
          </div>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalDetails && (
          <div className="p-6 bg-white border-t border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold">Model MAE</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">₹{forecast.technical_details.mae} / q</p>
                <span className="text-[10px] text-slate-400">Mean Absolute Error</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold">Model RMSE</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">₹{forecast.technical_details.rmse} / q</p>
                <span className="text-[10px] text-slate-400">Root Mean Square Error</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold">Model MAPE</span>
                <p className="text-base font-bold text-emerald-700 mt-0.5">{forecast.technical_details.mape}%</p>
                <span className="text-[10px] text-slate-400">Percentage Error</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                <span className="text-indigo-800 font-semibold">Model Architecture</span>
                <p className="text-xs font-bold text-indigo-900 mt-0.5">{forecast.technical_details.model_type}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-2">Input Features & Variable Weights:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                {forecast.technical_details.features_used.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
