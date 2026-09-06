import React, { useState, useEffect } from 'react';
import { BuyerRequirement, CropLot, Offer } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, Plus, Search, Filter, Send, ShieldCheck, CheckCircle2, 
  MapPin, Tag, Calendar, DollarSign, ArrowRightLeft, FileSpreadsheet
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'requirements' | 'my_offers'>('browse');

  const [lots, setLots] = useState<CropLot[]>([]);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Search & Filter state
  const [searchCrop, setSearchCrop] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [showPostReqModal, setShowPostReqModal] = useState(false);

  // Send offer modal
  const [selectedLotForOffer, setSelectedLotForOffer] = useState<CropLot | null>(null);
  const [offerPrice, setOfferPrice] = useState(2580);
  const [offerQty, setOfferQty] = useState(120);

  // New requirement form
  const [reqCrop, setReqCrop] = useState('Wheat');
  const [reqQty, setReqQty] = useState(1000);
  const [reqTargetPrice, setReqTargetPrice] = useState(2580);
  const [reqLocation, setReqLocation] = useState('Karnal Processing Facility');

  const loadData = async () => {
    const l = await api.getCropLots();
    const r = await api.getBuyerRequirements();
    const off = await api.getOffers();
    setLots(l);
    setRequirements(r);
    setOffers(off);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForOffer) return;

    await api.createOffer({
      lot_id: selectedLotForOffer.id,
      buyer_id: user?.id || 3,
      buyer_name: user?.name || 'AgroCorp Foods Pvt Ltd',
      seller_id: selectedLotForOffer.seller_id,
      seller_name: selectedLotForOffer.seller_name || 'Farmer Seller',
      crop_name: selectedLotForOffer.crop_name,
      offered_price: Number(offerPrice),
      offered_quantity: Number(offerQty),
      payment_terms: 'Instant Direct Escrow Transfer on Quality Check',
      pickup_date: new Date().toISOString().split('T')[0],
      notes: 'Direct buyer purchase offer submitted via Kisan Market.'
    });

    setSelectedLotForOffer(null);
    loadData();
    setActiveTab('my_offers');
  };

  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createBuyerRequirement({
      crop_name: reqCrop,
      quantity_quintals: Number(reqQty),
      grade: 'Grade A',
      max_moisture_pct: 12.0,
      target_price: Number(reqTargetPrice),
      preferred_location: reqLocation,
      max_distance_km: 150,
      delivery_deadline: '2026-09-25'
    }, user?.id || 3);

    setShowPostReqModal(false);
    loadData();
    setActiveTab('requirements');
  };

  const filteredLots = lots.filter(l => {
    const matchesCrop = !searchCrop || l.crop_name.toLowerCase().includes(searchCrop.toLowerCase());
    const matchesGrade = filterGrade === 'All' || l.grade === filterGrade;
    return matchesCrop && matchesGrade;
  });

  return (
    <div className="page-shell space-y-5 sm:space-y-6">
      {/* Buyer Hero Banner */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#102d4c] via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-sky-300/10 blur-2xl" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Procurement workspace</span>
            <Badge type="verification" value={user?.verification_badge || 'TRUSTED'} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif leading-none">{user?.name || 'AgroCorp Foods Pvt Ltd'}</h1>
          <p className="text-xs text-blue-100/70 mt-3">Karnal, Haryana <span className="mx-1.5 text-blue-300">•</span> <span className="text-emerald-300 font-bold">100% on-time escrow</span></p>
        </div>

        <button
          onClick={() => setShowPostReqModal(true)}
          className="relative px-5 py-2.5 rounded-xl bg-white text-blue-950 hover:bg-blue-50 text-xs font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Post Crop Requirement</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-scroller text-xs font-bold">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'browse' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Browse Farmer & FPO Lots ({filteredLots.length})
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'requirements' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Posted Requirements ({requirements.length})
        </button>
        <button
          onClick={() => setActiveTab('my_offers')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'my_offers' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sent Digital Offers ({offers.length})
        </button>
      </div>

      {/* BROWSE TAB */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="surface-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search crop name..."
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Filter Grade:</span>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="All">All Grades</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
              </select>
            </div>
          </div>

          {/* Produce Lots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map(lot => (
              <div key={lot.id} className="surface-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{lot.crop_name}</h3>
                      <p className="text-xs text-slate-500">{lot.variety} • {lot.grade}</p>
                    </div>
                    {lot.is_bulk && <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">FPO Bulk Lot</span>}
                  </div>

                  <div className="space-y-2 text-xs py-3 border-y border-slate-100 my-3">
                    <div className="flex justify-between text-slate-600">
                      <span>Available Volume:</span>
                      <span className="font-bold text-slate-900">{lot.quantity_quintals} Quintals ({lot.quantity_quintals / 10} Tons)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Moisture Content:</span>
                      <span className="font-bold text-blue-700">{lot.moisture_pct}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Seller Asking Price:</span>
                      <span className="font-extrabold text-slate-900">₹{lot.minimum_price} / quintal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lot.location}, {lot.district}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLotForOffer(lot);
                    setOfferPrice(lot.minimum_price);
                    setOfferQty(lot.quantity_quintals);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Offer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUIREMENTS TAB */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {requirements.map(req => (
            <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{req.crop_name} Requirement ({req.quantity_quintals} q)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Target Location: {req.preferred_location} • Deadline: {req.delivery_deadline}</p>
                </div>
                <Badge type="status" value={req.status} />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl">
                <span>Max Moisture Threshold: <strong>{req.max_moisture_pct}%</strong></span>
                <span>Target Price: <strong className="text-blue-700">₹{req.target_price}/quintal</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OFFERS TAB */}
      {activeTab === 'my_offers' && (
        <div className="space-y-4">
          {offers.map(off => (
            <div key={off.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Offer to {off.seller_name || 'Farmer Seller'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lot #{off.lot_id} • Date: {off.created_at}</p>
                </div>
                <Badge type="status" value={off.status} />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-700">
                <span>Offered Price: <strong className="text-blue-700 text-sm">₹{off.offered_price}/q</strong></span>
                <span>Volume: <strong>{off.offered_quantity} Quintals</strong></span>
                <span>Gross: <strong>₹{(off.offered_price * off.offered_quantity).toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send Offer Modal */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Send Offer to {selectedLotForOffer.seller_name || 'Farmer Seller'}</h3>
            <p className="text-xs text-slate-500 mb-4">Lot #{selectedLotForOffer.id}: {selectedLotForOffer.crop_name} ({selectedLotForOffer.grade})</p>

            <form onSubmit={handleSendOffer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Offered Price (₹ / quintal)</label>
                <input
                  type="number"
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  required
                  value={offerQty}
                  onChange={(e) => setOfferQty(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Requirement Modal */}
      {showPostReqModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">Post Procurement Requirement</h3>

            <form onSubmit={handlePostRequirement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Type</label>
                <select
                  value={reqCrop}
                  onChange={(e) => setReqCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Paddy (Rice)">Paddy (Rice)</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Qty (q)</label>
                  <input
                    type="number"
                    required
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Price (₹/q)</label>
                  <input
                    type="number"
                    required
                    value={reqTargetPrice}
                    onChange={(e) => setReqTargetPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Location</label>
                <input
                  type="text"
                  required
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPostReqModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
