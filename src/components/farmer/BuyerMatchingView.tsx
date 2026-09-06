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
    <div className="space-y-6">
      {/* Selector Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>AI Buyer Discovery & Quality Matcher</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated buyer matching based on grade, moisture %, price & logistics distance</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="font-semibold text-slate-700">Select Active Lot:</label>
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(Number(e.target.value))}
            className="p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
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
      <div className="space-y-4">
        {matches.map(m => (
          <div key={m.requirement_id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  {m.match.match_score}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{m.buyer_name}</h3>
                    <Badge type="verification" value={m.buyer_badge} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: <strong className="text-slate-700">{m.preferred_location}</strong> • Reliability: <span className="text-amber-600 font-bold">★ {m.buyer_reliability}/5</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <Badge type="quality" value={m.match.quality_match} />
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">₹{m.target_price.toLocaleString()} / q</p>
                <p className="text-[11px] text-slate-400 font-medium">Offered Purchase Price</p>
              </div>
            </div>

            {/* Match Breakdown & Reasons */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">WHY THIS BUYER RECEIVED A {m.match.match_score}% MATCH SCORE:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                {m.match.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
              <div className="flex items-center gap-4 text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Distance: {m.match.distance_km} km
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Delivery Deadline: {m.delivery_deadline}
                </span>
              </div>

              <button
                onClick={() => handleSendOfferRequest(m)}
                disabled={sentOfferId === m.requirement_id}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${
                  sentOfferId === m.requirement_id
                    ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
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
