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
    <div className="page-shell space-y-8 sm:space-y-10 lg:space-y-12">
      {/* FPO Hero Header */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-[#28245c] via-indigo-900 to-purple-950 text-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl border border-indigo-900/80 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="absolute -right-10 -top-20 h-80 w-80 rounded-full bg-violet-300/10 blur-3xl pointer-events-none" />
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Collective workspace</span>
            <Badge type="verification" value="TRUSTED" />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-tight">Ludhiana Progressive Kisan FPO</h1>
          <p className="text-sm sm:text-base text-indigo-100/80 font-medium">FPO-PB-2024-8841 <span className="mx-2 text-indigo-300">•</span> Ludhiana, Punjab</p>
        </div>

        <button
          onClick={() => setShowAddMember(true)}
          className="relative px-6 py-3.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-950 text-sm font-bold shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Farmer Member</span>
        </button>
      </div>

      {/* FPO High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-indigo-500">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Total FPO Farmer Members</span>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight my-2">{members.length + 24} <span className="text-base font-semibold text-slate-500">Farmers</span></p>
          <span className="text-xs sm:text-sm text-indigo-700 font-semibold">Active Member Base</span>
        </div>

        <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-violet-500">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Aggregated Tonnage</span>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-indigo-700 tracking-tight my-2">{totalAggregatedTonnage + 185} <span className="text-base font-semibold text-indigo-500">Tons</span></p>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">Bulk Lots Active</span>
        </div>

        <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-amber-400">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Pending Aggregation Yield</span>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-600 tracking-tight my-2">{totalUnaggregatedTonnage} <span className="text-base font-semibold text-amber-500">Tons</span></p>
          <span className="text-xs sm:text-sm text-amber-700 font-semibold">Available for Pooling</span>
        </div>

        <div className="surface-card-hover p-6 sm:p-7 min-h-[160px] flex flex-col justify-between border-t-4 border-t-emerald-500">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Bargaining Net Premium</span>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-700 tracking-tight my-2">+₹140 <span className="text-base font-semibold text-emerald-600">/ q</span></p>
          <span className="text-xs sm:text-sm text-emerald-700 font-semibold">vs Individual Mandi Rate</span>
        </div>
      </div>

      {/* Status Message Alert */}
      {statusMsg && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800 flex items-center justify-between shadow-sm">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-emerald-600 hover:text-emerald-900 font-extrabold text-base">✕</button>
        </div>
      )}

      {/* Produce Aggregation Tool Section */}
      <div className="surface-card rounded-3xl p-7 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-3">
              <Layers className="w-6 h-6 text-indigo-600" />
              <span>Collective Produce Aggregation Engine</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Select text-slate-500 individual farmer yields to create high-volume Bulk Lots for institutional buyers</p>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <button
              onClick={handleAggregate}
              disabled={selectedMemberIds.length === 0}
              className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
                selectedMemberIds.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Aggregate Selected ({selectedMemberIds.length} Farmers)
            </button>
          </div>
        </div>

        {/* Member Table for Selection */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="p-4">Select</th>
                <th className="p-4">Farmer Name</th>
                <th className="p-4">Village</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Available Yield</th>
                <th className="p-4">Harvest Date</th>
                <th className="p-4">Aggregation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(m => (
                <tr key={m.id} className={m.is_aggregated ? 'bg-slate-50 opacity-60' : 'hover:bg-indigo-50/40 transition-colors'}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      disabled={m.is_aggregated}
                      checked={selectedMemberIds.includes(m.id)}
                      onChange={() => handleToggleMember(m.id)}
                      className="w-4.5 h-4.5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-4 font-bold text-slate-900">{m.farmer_name}</td>
                  <td className="p-4 text-slate-600">{m.village}</td>
                  <td className="p-4 font-semibold text-slate-800">{m.crop_name}</td>
                  <td className="p-4 font-extrabold text-indigo-700">{m.quantity_quintals} Quintals</td>
                  <td className="p-4 text-slate-500">{m.harvest_date}</td>
                  <td className="p-4">
                    {m.is_aggregated ? (
                      <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-lg">Aggregated</span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">Ready for Pooling</span>
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
