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
    <div className="page-shell space-y-5 sm:space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative isolate overflow-hidden bg-[#12362c] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="hero-orb absolute -right-16 -top-24 h-80 w-80 rounded-full pointer-events-none" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">Farmer workspace</span>
            <Badge type="verification" value={user?.verification_badge || 'VERIFIED'} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif leading-none">Good morning, {user?.name?.split(' ')[0] || 'Ramesh'}.</h1>
          <p className="text-xs text-emerald-100/75 mt-3">Ludhiana, Punjab <span className="mx-1.5 text-emerald-400">•</span> Wheat, Paddy & Soybean portfolio</p>
        </div>

        <div className="relative flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('matching')}
            className="px-4 py-2.5 rounded-xl bg-amber-300 text-emerald-950 font-bold hover:bg-amber-200 transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Buyer Matches</span>
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/15"
          >
            Compare Net Realization
          </button>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <nav className="tab-scroller text-xs font-bold" aria-label="Farmer dashboard sections">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === id ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </nav>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface-card-hover p-5 border-t-4 border-t-emerald-500">
              <div className="flex items-start justify-between"><span className="text-xs font-semibold text-slate-500">Current inventory</span><Boxes className="w-4 h-4 text-emerald-600" /></div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">{totalInventoryQuintals} <span className="text-sm font-semibold text-slate-500">q</span></p>
              <span className="text-[11px] text-emerald-700 font-semibold">{lots.length} active lots published</span>
            </div>

            <div className="surface-card-hover p-5 border-t-4 border-t-amber-400">
              <div className="flex items-start justify-between"><span className="text-xs font-semibold text-slate-500">Best direct offer</span><Tag className="w-4 h-4 text-amber-500" /></div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">₹2,580 <span className="text-sm font-semibold text-slate-500">/ q</span></p>
              <span className="text-[11px] text-slate-500">AgroCorp Foods · Karnal</span>
            </div>

            <div className="surface-card-hover p-5 border-t-4 border-t-teal-500">
              <div className="flex items-start justify-between"><span className="text-xs font-semibold text-slate-500">15-day forecast</span><TrendingUp className="w-4 h-4 text-teal-600" /></div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">₹2,530 <span className="text-sm font-semibold text-slate-500">/ q</span></p>
              <span className="text-[11px] text-teal-700 font-semibold">↑ 3.3% projected increase</span>
            </div>

            <div className="surface-card-hover p-5 border-t-4 border-t-indigo-500">
              <div className="flex items-start justify-between"><span className="text-xs font-semibold text-slate-500">Settled payments</span><Wallet className="w-4 h-4 text-indigo-600" /></div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">₹3.06L</p>
              <span className="text-[11px] text-emerald-700 font-semibold">100% verified through escrow</span>
            </div>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AI Advisor Preview */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#12362c] via-emerald-900 to-teal-900 text-white rounded-3xl p-6 shadow-lg border border-emerald-900 space-y-3">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-[0.18em]">AI sale timing</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="relative text-xl font-bold font-serif text-white">Wait 7–10 days</h3>
              <p className="relative text-xs text-emerald-50/75 leading-relaxed">
                Holding produce in accredited warehouse storage for 7–10 days is estimated to yield an additional net profit of +₹13,400 after warehouse fees.
              </p>
              <button
                onClick={() => setActiveTab('advisor')}
                className="relative text-xs font-bold text-emerald-200 hover:text-white flex items-center gap-1 pt-2"
              >
                View Full Rationale & Parameters <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Buyer Match Preview */}
            <div className="surface-card-hover rounded-3xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.18em]">Top buyer match</span>
                <Badge type="verification" value="TRUSTED" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">AgroCorp Foods <span className="text-emerald-700">· 94%</span></h3>
              <p className="text-xs text-slate-600">
                Offered Price: <strong>₹2,580/quintal</strong> • Grade A Sharbati Wheat • Distance: 42 km
              </p>
              <button
                onClick={() => setActiveTab('matching')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-2"
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
