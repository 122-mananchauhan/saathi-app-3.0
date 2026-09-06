import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

interface BadgeProps {
  type: 'verification' | 'quality' | 'status' | 'demo';
  value: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  if (type === 'demo') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
        Demo Data
      </span>
    );
  }

  if (type === 'verification') {
    switch (value) {
      case 'TRUSTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            TRUSTED BUYER
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            VERIFIED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            NEW BUYER
          </span>
        );
    }
  }

  if (type === 'quality') {
    switch (value) {
      case 'EXCELLENT MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500 text-white shadow-sm">
            EXCELLENT MATCH (90%+)
          </span>
        );
      case 'GOOD MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-blue-500 text-white shadow-sm">
            GOOD MATCH (75–89%)
          </span>
        );
      case 'PARTIAL MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-white shadow-sm">
            PARTIAL MATCH (60–74%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-rose-500 text-white shadow-sm">
            MISMATCH (&lt;60%)
          </span>
        );
    }
  }

  // General Status
  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Sold: 'bg-blue-100 text-blue-800 border-blue-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    Confirmed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Picked Up': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Open: 'bg-sky-100 text-sky-800 border-sky-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[value] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      {value}
    </span>
  );
};
