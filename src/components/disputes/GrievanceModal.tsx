import React, { useState, useEffect } from 'react';
import { Dispute } from '../../types';
import { api } from '../../services/api';
import { X, AlertCircle, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({ isOpen, onClose }) => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showRaiseForm, setShowRaiseForm] = useState(false);

  const [orderId, setOrderId] = useState(1);
  const [category, setCategory] = useState<'Quality' | 'Quantity' | 'Payment' | 'Delivery' | 'Logistics'>('Quality');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadDisputes = async () => {
    const data = await api.getDisputes();
    setDisputes(data);
  };

  useEffect(() => {
    if (isOpen) loadDisputes();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createDispute({
      order_id: Number(orderId),
      raised_by_name: 'Platform User',
      category,
      title,
      description
    });

    setShowRaiseForm(false);
    loadDisputes();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Dispute & Grievance Resolution Portal</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Platform Active Disputes ({disputes.length})</span>
            <button
              onClick={() => setShowRaiseForm(!showRaiseForm)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow"
            >
              {showRaiseForm ? 'View Active List' : 'Raise New Dispute'}
            </button>
          </div>

          {showRaiseForm ? (
            <form onSubmit={handleSubmitDispute} className="space-y-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">File Grievance / Quality Dispute</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Order ID</label>
                  <input
                    type="number"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dispute Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-semibold"
                  >
                    <option value="Quality">Quality Variance</option>
                    <option value="Quantity">Quantity Discrepancy</option>
                    <option value="Payment">Escrow / Payment Delay</option>
                    <option value="Delivery">Pickup / Logistics Delay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dispute Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. Moisture content dispute upon delivery"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description & Evidence Notes</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  placeholder="Explain issue clearly..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRaiseForm(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {disputes.map(d => (
                <div key={d.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{d.title}</h4>
                      <p className="text-[11px] text-slate-500">Order #{d.order_id} • Category: {d.category} • Raised By: {d.raised_by_name}</p>
                    </div>
                    <Badge type="status" value={d.status} />
                  </div>
                  <p className="text-slate-700 leading-relaxed">{d.description}</p>
                  {d.resolution_notes && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      <strong>Resolution Notes:</strong> {d.resolution_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
