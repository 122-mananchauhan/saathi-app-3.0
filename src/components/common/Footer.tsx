import React from 'react';
import { Sprout, ShieldCheck, FileSpreadsheet, Globe, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span>Kisan Market</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Market Intelligence & Transaction Enablement Platform. Enabling transparent price discovery, AI buyer matching, net realization calculation, and direct farm-gate linkages.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Core Modules</h4>
          <ul className="space-y-2">
            <li>Net Realization Engine</li>
            <li>AI Price Forecasting & Sale Window</li>
            <li>AI Buyer Quality Matching</li>
            <li>FPO Produce Aggregation</li>
            <li>Direct Mandi & Buyer Linked Logistics</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Ecosystem Roles</h4>
          <ul className="space-y-2">
            <li>Farmer Dashboard</li>
            <li>FPO Member Management</li>
            <li>Verified Buyer Procurement</li>
            <li>Government Ecosystem Monitoring</li>
            <li>Escrow Payments & Dispute Handling</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Platform Integrity</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Government-Compatible Data Standards</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Agri API & CSV Import Compatible</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              All demo datasets use realistic Indian mandi & commodity specifications.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 pt-8 mt-8 border-t border-slate-800 flex flex-wrap justify-between items-center text-slate-500 text-[11px]">
        <p>© 2026 Kisan Market Platform. Tagline: "Better Prices. Better Buyers. Better Decisions."</p>
        <p>Built as a unified standalone AgriTech application.</p>
      </div>
    </footer>
  );
};
