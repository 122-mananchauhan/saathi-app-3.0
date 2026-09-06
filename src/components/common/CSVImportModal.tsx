import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [csvText, setCsvText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const sampleCSV = `Commodity,Mandi_Name,District,State,Modal_Price,Min_Price,Max_Price,Arrivals_Tons,Demand_Level,Distance_KM
Wheat,Bathinda Central Mandi,Bathinda,Punjab,2490,2430,2520,380,High,48
Paddy (Rice),Amritsar Agro Hub,Amritsar,Punjab,3960,3880,4050,720,Very High,82
Soybean,Latur Mandi,Latur,Maharashtra,4810,4650,4950,1100,Very High,650
Cotton,Sri Ganganagar Market,Sri Ganganagar,Rajasthan,6920,6700,7150,290,High,180`;

  const handleLoadSample = () => {
    setCsvText(sampleCSV);
  };

  const handleProcessCSV = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setStatusMsg({ type: 'error', text: 'Please paste or upload at least 1 header line and 1 data row.' });
        return;
      }

      const newItems = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length >= 5) {
          newItems.push({
            commodity: cols[0] || 'Wheat',
            mandi_name: cols[1] || 'Imported Mandi',
            district: cols[2] || 'Ludhiana',
            state: cols[3] || 'Punjab',
            modal_price: parseFloat(cols[4]) || 2450,
            min_price: parseFloat(cols[5]) || 2400,
            max_price: parseFloat(cols[6]) || 2500,
            arrivals_tons: parseFloat(cols[7]) || 350,
            demand_level: (cols[8] as any) || 'High',
            distance_km: parseFloat(cols[9]) || 30
          });
        }
      }

      api.importMarketData(newItems);
      setStatusMsg({ type: 'success', text: `Successfully imported ${newItems.length} Mandi Price records!` });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Error parsing CSV format. Ensure comma-separated format.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span>Import Agmarknet / Mandi Market Data (CSV)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Import live or historical Agmarknet mandi data, processor purchase prices, or regional demand figures.
          </p>

          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Paste CSV Content:</span>
            <button 
              onClick={handleLoadSample}
              className="text-emerald-700 hover:text-emerald-800 font-semibold underline text-xs"
            >
              Load Sample Mandi Dataset
            </button>
          </div>

          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Commodity,Mandi_Name,District,State,Modal_Price,Min_Price,Max_Price,Arrivals_Tons,Demand_Level,Distance_KM..."
            className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
          />

          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {statusMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessCSV}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
            >
              Process & Update Market Intelligence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
