import React, { useState, useEffect } from 'react';
import { BuyerMatch, CropLot } from '../../types';
import { api } from '../../services/api';
import { ShieldCheck, CheckCircle2, MapPin, Calendar, Star, ArrowUpRight, Send, Check } from 'lucide-react';
import { Badge } from '../common/Badge';

interface BuyerMatchingViewProps {
  lots: CropLot[];
}

export const BuyerMatchingView: React.FC<BuyerMatchingViewProps> = ({ lots }) => {
  const [selectedLotId, setSelectedLotId] = useState<number>(lots[0]?.id || 1);
  const [matches, setMatches] = useState<BuyerMatch[]>([]);
  const [sentOfferId, setSentOfferId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedLotId) {
      api.getBuyerMatchesForLot(selectedLotId).then(setMatches);
    }
  }, [selectedLotId]);

  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];

  const handleSendOfferRequest = async (m: BuyerMatch) => {
    await api.createOffer({
      lot_id: selectedLotId,
      buyer_id: m.buyer_id,
      buyer_name: m.buyer_name,
      seller_id: activeLot.seller_id,
      seller_name: activeLot.seller_name || 'Farmer Seller',
      crop_name: activeLot.crop_name,
      offered_price: m.target_price,
      offered_quantity: activeLot.quantity_quintals,
      payment_terms: 'Instant Direct Escrow Transfer upon Delivery',
      pickup_date: m.delivery_deadline,
      notes: `Matched via Kisan Market AI (${m.match.match_score}% Score)`
    });
    setSentOfferId(m.requirement_id);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Selector Header */}
      <div className="surface-card p-7 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>AI Buyer Discovery & Quality Matcher</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Automated buyer matching based on grade, moisture %, price & logistics distance</p>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <label className="font-bold text-slate-700">Select Active Lot:</label>
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(Number(e.target.value))}
            className="p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
          >
            {lots.map(l => (
              <option key={l.id} value={l.id}>
                Lot #{l.id}: {l.crop_name} ({l.quantity_quintals} q) - ₹{l.minimum_price}/q
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buyer Match Cards List */}
      <div className="space-y-6">
        {matches.map(m => (
          <div key={m.requirement_id} className="surface-card-hover rounded-3xl p-7 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                  {m.match.match_score}%
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-slate-900 font-serif">{m.buyer_name}</h3>
                    <Badge type="verification" value={m.buyer_badge} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Location: <strong className="text-slate-800">{m.preferred_location}</strong> • Reliability: <span className="text-amber-600 font-bold">★ {m.buyer_reliability}/5</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <Badge type="quality" value={m.match.quality_match} />
                <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight mt-2">₹{m.target_price.toLocaleString()} <span className="text-base font-semibold text-slate-500">/ q</span></p>
                <p className="text-xs text-slate-400 font-medium">Offered Purchase Price</p>
              </div>
            </div>

            {/* Match Breakdown & Reasons */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-xs sm:text-sm space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">WHY THIS BUYER RECEIVED A {m.match.match_score}% MATCH SCORE:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                {m.match.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs sm:text-sm">
              <div className="flex items-center gap-5 text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Distance: {m.match.distance_km} km
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Delivery Deadline: {m.delivery_deadline}
                </span>
              </div>

              <button
                onClick={() => handleSendOfferRequest(m)}
                disabled={sentOfferId === m.requirement_id}
                className={`px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center gap-2 text-xs sm:text-sm ${
                  sentOfferId === m.requirement_id
                    ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                }`}
              >
                {sentOfferId === m.requirement_id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Digital Offer Request Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Deal Offer (₹{m.target_price}/q)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
