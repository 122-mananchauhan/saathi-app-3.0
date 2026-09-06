import React, { useState, useEffect } from 'react';
import { FPOMember, CropLot } from '../../types';
import { api } from '../../services/api';
import { Users, Layers, Plus, CheckCircle2, TrendingUp, Sparkles, Building2, Wallet } from 'lucide-react';
import { Badge } from '../common/Badge';

export const FPODashboard: React.FC = () => {
  const [members, setMembers] = useState<FPOMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [bulkCrop, setBulkCrop] = useState('Wheat');
  const [bulkMinPrice, setBulkMinPrice] = useState(2520);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New member form
  const [farmerName, setFarmerName] = useState('Jaswant Singh');
  const [village, setVillage] = useState('Khanna');
  const [memberCrop, setMemberCrop] = useState('Wheat');
  const [qty, setQty] = useState(75);
  const [showAddMember, setShowAddMember] = useState(false);

  const loadMembers = async () => {
    const data = await api.getFPOMembers();
    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleToggleMember = (id: number) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter(i => i !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleAggregate = async () => {
    if (selectedMemberIds.length === 0) return;
    const res = await api.aggregateProduce(selectedMemberIds, bulkCrop, bulkMinPrice);
    setStatusMsg(`Successfully aggregated produce into Bulk Lot #${res.id} (${res.quantity_quintals} Quintals)`);
    setSelectedMemberIds([]);
    loadMembers();
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addFPOMember({
      farmer_name: farmerName,
      village,
      crop_name: memberCrop,
      quantity_quintals: Number(qty),
      harvest_date: new Date().toISOString().split('T')[0]
    });
    setShowAddMember(false);
    loadMembers();
  };

  const totalAggregatedTonnage = members
    .filter(m => m.is_aggregated)
    .reduce((sum, m) => sum + m.quantity_quintals, 0) / 10.0;

  const totalUnaggregatedTonnage = members
    .filter(m => !m.is_aggregated)
    .reduce((sum, m) => sum + m.quantity_quintals, 0) / 10.0;

  return (
    <div className="page-shell space-y-5 sm:space-y-6">
      {/* FPO Hero Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#28245c] via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-violet-300/10 blur-2xl" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200">Collective workspace</span>
            <Badge type="verification" value="TRUSTED" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif leading-none">Ludhiana Progressive Kisan FPO</h1>
          <p className="text-xs text-indigo-100/70 mt-3">FPO-PB-2024-8841 <span className="mx-1.5 text-indigo-300">•</span> Ludhiana, Punjab</p>
        </div>

        <button
          onClick={() => setShowAddMember(true)}
          className="relative px-5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 text-xs font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Farmer Member</span>
        </button>
      </div>

      {/* FPO High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card-hover p-5 border-t-4 border-t-indigo-500">
          <span className="text-xs font-semibold text-slate-500">Total FPO Farmer Members</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{members.length + 24} Farmers</p>
          <span className="text-[11px] text-indigo-700 font-semibold">Active Member Base</span>
        </div>

        <div className="surface-card-hover p-5 border-t-4 border-t-violet-500">
          <span className="text-xs font-semibold text-slate-500">Aggregated Tonnage</span>
          <p className="text-2xl font-extrabold text-indigo-700 mt-1">{totalAggregatedTonnage + 185} Tons</p>
          <span className="text-[11px] text-slate-400 font-medium">Bulk Lots Active</span>
        </div>

        <div className="surface-card-hover p-5 border-t-4 border-t-amber-400">
          <span className="text-xs font-semibold text-slate-500">Pending Aggregation Yield</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{totalUnaggregatedTonnage} Tons</p>
          <span className="text-[11px] text-amber-700 font-semibold">Available for Pooling</span>
        </div>

        <div className="surface-card-hover p-5 border-t-4 border-t-emerald-500">
          <span className="text-xs font-semibold text-slate-500">Bargaining Net Premium</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">+₹140 / quintal</p>
          <span className="text-[11px] text-emerald-700 font-semibold">vs Individual Mandi Rate</span>
        </div>
      </div>

      {/* Status Message Alert */}
      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-emerald-600">✕</button>
        </div>
      )}

      {/* Produce Aggregation Tool Section */}
      <div className="surface-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Collective Produce Aggregation Engine</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Select individual farmer yields to create high-volume Bulk Lots for institutional buyers</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handleAggregate}
              disabled={selectedMemberIds.length === 0}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-md ${
                selectedMemberIds.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              Aggregate Selected ({selectedMemberIds.length} Farmers)
            </button>
          </div>
        </div>

        {/* Member Table for Selection */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Select</th>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">Village</th>
                <th className="p-3">Crop</th>
                <th className="p-3">Available Yield</th>
                <th className="p-3">Harvest Date</th>
                <th className="p-3">Aggregation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(m => (
                <tr key={m.id} className={m.is_aggregated ? 'bg-slate-50 opacity-60' : 'hover:bg-indigo-50/40'}>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      disabled={m.is_aggregated}
                      checked={selectedMemberIds.includes(m.id)}
                      onChange={() => handleToggleMember(m.id)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </td>
                  <td className="p-3 font-bold text-slate-900">{m.farmer_name}</td>
                  <td className="p-3 text-slate-600">{m.village}</td>
                  <td className="p-3 font-semibold text-slate-800">{m.crop_name}</td>
                  <td className="p-3 font-extrabold text-indigo-700">{m.quantity_quintals} Quintals</td>
                  <td className="p-3 text-slate-500">{m.harvest_date}</td>
                  <td className="p-3">
                    {m.is_aggregated ? (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Aggregated</span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Ready for Pooling</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register New FPO Member Farmer</h3>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Name</label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village Location</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop Type</label>
                  <select
                    value={memberCrop}
                    onChange={(e) => setMemberCrop(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Paddy">Paddy</option>
                    <option value="Soybean">Soybean</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available Yield (q)</label>
                  <input
                    type="number"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
