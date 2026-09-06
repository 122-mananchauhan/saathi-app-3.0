import React, { useState, useEffect } from 'react';
import { CropLot, Offer, Order, Payment, LogisticsItem, Dispute } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, TrendingUp, Sparkles, Clock, ShieldCheck, Tag, Truck, 
  Warehouse, Wallet, AlertCircle, Layers, ArrowUpRight, ChevronRight, BarChart3,
  Bot, Handshake, PackageSearch, Boxes
} from 'lucide-react';
import { MyCropsLots } from './MyCropsLots';
import { MarketIntelligenceView } from './MarketIntelligenceView';
import { AIPricePredictionView } from './AIPricePredictionView';
import { SaleWindowAdvisorView } from './SaleWindowAdvisorView';
import { BuyerMatchingView } from './BuyerMatchingView';
import { FarmerOffersOrders } from './FarmerOffersOrders';
import { FarmerLogisticsStorage } from './FarmerLogisticsStorage';
import { Badge } from '../common/Badge';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'lots' | 'intelligence' | 'predictions' | 'advisor' | 'matching' | 'offers' | 'logistics'
  >('overview');

  const [lots, setLots] = useState<CropLot[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [logistics, setLogistics] = useState<LogisticsItem[]>([]);

  const loadData = async () => {
    const l = await api.getCropLots();
    const off = await api.getOffers();
    const ord = await api.getOrders();
    const pay = await api.getPayments();
    const log = await api.getLogistics();

    setLots(l);
    setOffers(off);
    setOrders(ord);
    setPayments(pay);
    setLogistics(log);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalInventoryQuintals = lots.reduce((sum, l) => sum + l.quantity_quintals, 0);

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'lots', label: `My lots · ${lots.length}`, icon: PackageSearch },
    { id: 'intelligence', label: 'Market intelligence', icon: TrendingUp },
    { id: 'predictions', label: 'Price forecast', icon: Bot },
    { id: 'advisor', label: 'Sale timing', icon: Clock },
    { id: 'matching', label: 'Buyer matches', icon: Handshake },
    { id: 'offers', label: `Offers · ${offers.length}`, icon: Tag },
    { id: 'logistics', label: 'Logistics', icon: Truck },
  ] as const;

  return (
    <div className="page-shell space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Top Welcome Banner */}
      <div className="relative isolate overflow-hidden bg-[#12362c] text-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl border border-emerald-900/80 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="hero-orb absolute -right-16 -top-24 h-96 w-96 rounded-full pointer-events-none" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Farmer workspace</span>
            <Badge type="verification" value={user?.verification_badge || 'VERIFIED'} />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-tight">Good morning, {user?.name?.split(' ')[0] || 'Ramesh'}.</h1>
          <p className="text-sm sm:text-base text-emerald-100/85 font-medium">Ludhiana, Punjab <span className="mx-2 text-emerald-400">•</span> Wheat, Paddy & Soybean portfolio</p>
        </div>

        <div className="relative flex flex-wrap gap-3 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('matching')}
            className="px-5 py-3 rounded-2xl bg-amber-300 hover:bg-amber-200 text-emerald-950 font-bold transition-all shadow-lg hover:shadow-amber-300/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Buyer Matches</span>
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/20"
          >
            Compare Net Realization
          </button>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <nav className="tab-scroller text-xs sm:text-sm font-bold" aria-label="Farmer dashboard sections">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === id ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/25' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 sm:space-y-10">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-emerald-500">
              <div className="flex items-center justify-between"><span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Current inventory</span><Boxes className="w-5 h-5 text-emerald-600" /></div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight my-2">{totalInventoryQuintals} <span className="text-base font-semibold text-slate-500">q</span></p>
              <span className="text-xs sm:text-sm text-emerald-700 font-semibold">{lots.length} active lots published</span>
            </div>

            <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-amber-400">
              <div className="flex items-center justify-between"><span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Best direct offer</span><Tag className="w-5 h-5 text-amber-500" /></div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight my-2">₹2,580 <span className="text-base font-semibold text-slate-500">/ q</span></p>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">AgroCorp Foods · Karnal</span>
            </div>

            <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-teal-500">
              <div className="flex items-center justify-between"><span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">15-day forecast</span><TrendingUp className="w-5 h-5 text-teal-600" /></div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight my-2">₹2,530 <span className="text-base font-semibold text-slate-500">/ q</span></p>
              <span className="text-xs sm:text-sm text-teal-700 font-semibold">↑ 3.3% projected increase</span>
            </div>

            <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-indigo-500">
              <div className="flex items-center justify-between"><span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Settled payments</span><Wallet className="w-5 h-5 text-indigo-600" /></div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight my-2">₹3.06L</p>
              <span className="text-xs sm:text-sm text-emerald-700 font-semibold">100% verified through escrow</span>
            </div>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* AI Advisor Preview */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#12362c] via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-900 space-y-4 flex flex-col justify-between min-h-[260px]">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-[0.2em]">AI sale timing</span>
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="relative text-2xl sm:text-3xl font-bold font-serif text-white">Wait 7–10 days</h3>
                <p className="relative text-sm text-emerald-100/80 leading-relaxed">
                  Holding produce in accredited warehouse storage for 7–10 days is estimated to yield an additional net profit of +₹13,400 after warehouse fees.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('advisor')}
                className="relative text-sm font-bold text-emerald-200 hover:text-white flex items-center gap-1.5 pt-3 transition-colors"
              >
                View Full Rationale & Parameters <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Buyer Match Preview */}
            <div className="surface-card-hover rounded-3xl p-8 sm:p-10 space-y-4 flex flex-col justify-between min-h-[260px]">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-[0.2em]">Top buyer match</span>
                  <Badge type="verification" value="TRUSTED" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">AgroCorp Foods <span className="text-emerald-700">· 94%</span></h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Offered Price: <strong className="text-slate-900">₹2,580/quintal</strong> • Grade A Sharbati Wheat • Distance: 42 km
                </p>
              </div>
              <button
                onClick={() => setActiveTab('matching')}
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 pt-3 transition-colors"
              >
                View Matched Buyer Rationale <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTHER TABS */}
      {activeTab === 'lots' && <MyCropsLots lots={lots} onRefresh={loadData} />}
      {activeTab === 'intelligence' && <MarketIntelligenceView />}
      {activeTab === 'predictions' && <AIPricePredictionView />}
      {activeTab === 'advisor' && <SaleWindowAdvisorView />}
      {activeTab === 'matching' && <BuyerMatchingView lots={lots} />}
      {activeTab === 'offers' && <FarmerOffersOrders offers={offers} orders={orders} payments={payments} onRefresh={loadData} />}
      {activeTab === 'logistics' && <FarmerLogisticsStorage logistics={logistics} />}
    </div>
  );
};
