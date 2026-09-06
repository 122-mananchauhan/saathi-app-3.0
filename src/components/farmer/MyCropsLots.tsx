import React, { useState } from 'react';
import { CropLot } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Sprout, Warehouse, CheckCircle, Tag, MapPin } from 'lucide-react';
import { Badge } from '../common/Badge';

interface MyCropsLotsProps {
  lots: CropLot[];
  onRefresh: () => void;
}

export const MyCropsLots: React.FC<MyCropsLotsProps> = ({ lots, onRefresh }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const [cropName, setCropName] = useState('Wheat');
  const [quantity, setQuantity] = useState(120);
  const [grade, setGrade] = useState('Grade A');
  const [moisture, setMoisture] = useState(11.5);
  const [variety, setVariety] = useState('HD-2967 Sharbati');
  const [minPrice, setMinPrice] = useState(2450);
  const [location, setLocation] = useState('Samrala Village, Ludhiana');
  const [district, setDistrict] = useState('Ludhiana');
  const [state, setState] = useState('Punjab');
  const [storageAvailable, setStorageAvailable] = useState(true);

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createCropLot({
      crop_name: cropName,
      quantity_quintals: Number(quantity),
      grade,
      moisture_pct: Number(moisture),
      grain_size: 'Large Sharbati',
      variety,
      minimum_price: Number(minPrice),
      location,
      district,
      state,
      storage_available: storageAvailable,
      storage_cost_per_quintal_month: 45,
      is_bulk: false,
      aggregated_farmer_count: 1
    }, user?.id || 1);

    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 surface-card p-7 sm:p-8 rounded-3xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">My Crop Lots & Produce Inventory</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Publish produce lots with moisture & grade specifications for buyers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Lot</span>
        </button>
      </div>

      {/* Lot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {lots.map(lot => (
          <div key={lot.id} className="surface-card-hover rounded-3xl p-7 flex flex-col justify-between space-y-5 min-h-[320px]">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">{lot.crop_name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{lot.variety} • {lot.grade}</p>
                </div>
                <Badge type="status" value={lot.status} />
              </div>

              <div className="space-y-3 text-xs sm:text-sm py-4 border-y border-slate-100 my-4">
                <div className="flex justify-between text-slate-600">
                  <span>Quantity:</span>
                  <span className="font-bold text-slate-900">{lot.quantity_quintals} Quintals ({lot.quantity_quintals / 10} Tons)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Moisture Content:</span>
                  <span className="font-bold text-emerald-700">{lot.moisture_pct}%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Min Price Asking:</span>
                  <span className="font-black text-slate-900 text-base">₹{lot.minimum_price} / q</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Warehouse Storage:</span>
                  <span className={lot.storage_available ? 'text-emerald-700 font-bold' : 'text-slate-400 font-medium'}>
                    {lot.storage_available ? 'Available (Accredited)' : 'Immediate Sale'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{lot.location}, {lot.district}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Published: {lot.created_at}</span>
              {lot.is_bulk && <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">FPO Bulk Lot ({lot.aggregated_farmer_count} Farmers)</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Lot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-lg font-bold font-serif text-slate-900">Publish Produce Lot for Buyers</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateLot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop Type</label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Paddy (Rice)">Paddy (Rice)</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Maize">Maize</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Potato">Potato</option>
                    <option value="Onion">Onion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Price (₹/q)</label>
                  <input
                    type="number"
                    required
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Variety</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Sharbati HD-2967"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Village</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="storage"
                  checked={storageAvailable}
                  onChange={(e) => setStorageAvailable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="storage" className="font-semibold text-slate-700 text-xs">
                  Accredited warehouse storage available for holding
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Publish Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
