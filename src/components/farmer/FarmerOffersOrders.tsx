import React, { useState } from 'react';
import { Offer, Order, Payment } from '../../types';
import { api } from '../../services/api';
import { Tag, Check, X, ArrowRightLeft, CreditCard, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface FarmerOffersOrdersProps {
  offers: Offer[];
  orders: Order[];
  payments: Payment[];
  onRefresh: () => void;
}

export const FarmerOffersOrders: React.FC<FarmerOffersOrdersProps> = ({ offers, orders, payments, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'offers' | 'orders' | 'payments'>('offers');
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState(2560);

  const handleRespond = async (offerId: number, action: 'accept' | 'reject' | 'counter', price?: number) => {
    await api.respondToOffer(offerId, action, price);
    setCounterModalOffer(null);
    onRefresh();
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Tab Controls */}
      <div className="surface-card p-5 sm:p-6 rounded-3xl flex items-center justify-between">
        <div className="flex gap-3 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-5 py-3 rounded-2xl transition-all ${
              activeTab === 'offers' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Received Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-2xl transition-all ${
              activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Confirmed Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-3 rounded-2xl transition-all ${
              activeTab === 'payments' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Escrow Payments ({payments.length})
          </button>
        </div>
      </div>

      {/* OFFERS TAB */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {offers.map(off => (
            <div key={off.id} className="surface-card-hover rounded-3xl p-7 sm:p-8 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">{off.buyer_name || 'AgroCorp Foods'}</h3>
                    <Badge type="status" value={off.status} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Crop Lot #{off.lot_id} • Terms: {off.payment_terms}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">₹{off.offered_price.toLocaleString()} <span className="text-base font-semibold text-slate-500">/ q</span></p>
                  <p className="text-xs text-slate-400 font-medium">Offered Price</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl font-medium">
                <span>Quantity: <strong className="text-slate-900">{off.offered_quantity} Quintals</strong></span>
                <span>Gross Value: <strong className="text-slate-900">₹{(off.offered_price * off.offered_quantity).toLocaleString()}</strong></span>
                <span>Requested Pickup: <strong className="text-slate-900">{off.pickup_date}</strong></span>
              </div>

              {off.status === 'Pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleRespond(off.id, 'reject')}
                    className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    Reject Offer
                  </button>
                  <button
                    onClick={() => { setCounterModalOffer(off); setCounterPrice(off.offered_price + 30); }}
                    className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    Counter Offer
                  </button>
                  <button
                    onClick={() => handleRespond(off.id, 'accept')}
                    className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all"
                  >
                    Accept & Confirm Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map(ord => (
            <div key={ord.id} className="surface-card-hover rounded-3xl p-7 sm:p-8 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">Order #{ord.id}: {ord.crop_name} ({ord.quantity_quintals} q)</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Buyer: {ord.buyer_name} • Confirmed: {ord.created_at}</p>
                </div>
                <Badge type="status" value={ord.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-emerald-50/70 p-5 rounded-2xl text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 font-medium">Gross Contract Value</span>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">₹{ord.gross_value.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Transport Overhead</span>
                  <p className="text-lg font-bold text-rose-600 mt-1">-₹{ord.transport_cost.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Net Farmer Realization</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">₹{ord.net_realization.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {payments.map(pay => (
            <div key={pay.id} className="surface-card-hover rounded-3xl p-7 sm:p-8 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">Txn #{pay.transaction_id}</h3>
                    <Badge type="status" value={pay.status} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Method: {pay.payment_method} • Date: {pay.payment_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">₹{pay.amount_paid.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 font-medium">Total Settled Amount</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-3">Submit Counter Price Offer</h3>
            <p className="text-xs text-slate-500 mb-4">Original Buyer Offer: ₹{counterModalOffer.offered_price}/q</p>

            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">Your Counter Asking Price (₹/q)</label>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold text-base"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCounterModalOffer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(counterModalOffer.id, 'counter', counterPrice)}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
              >
                Send Counter Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
