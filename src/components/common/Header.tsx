import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { 
  Sprout, Bell, User as UserIcon, LogOut, Upload, ShieldCheck, 
  ChevronDown, Sparkles, Menu, X
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  onOpenCSVModal?: () => void;
  onOpenGrievanceModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCSVModal, onOpenGrievanceModal }) => {
  const { user, role, switchRole, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const roleColors: Record<Role, { bg: string; text: string; label: string }> = {
    farmer: { bg: 'bg-emerald-500', text: 'text-emerald-700', label: 'Farmer Dashboard' },
    fpo: { bg: 'bg-indigo-500', text: 'text-indigo-700', label: 'FPO Collective Hub' },
    buyer: { bg: 'bg-blue-500', text: 'text-blue-700', label: 'Buyer Portal' },
    admin: { bg: 'bg-purple-500', text: 'text-purple-700', label: 'Govt / Admin Portal' }
  };

  const notifications = [
    { id: 1, title: 'New Buyer Match!', desc: 'AgroCorp offers ₹2,580/q for your Wheat Grade A lot.', time: '10m ago' },
    { id: 2, title: 'AI Price Alert', desc: 'Wheat prices expected to rise 3.3% over next 15 days.', time: '1h ago' },
    { id: 3, title: 'Order Picked Up', desc: 'Logistics vehicle dispatched for Khanna Mandi pickup.', time: '3h ago' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-white/90 shadow-[0_4px_18px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      {/* Top Demo Persona Switcher Bar */}
      <div className="bg-[#12362c] text-emerald-100 text-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Demo workspace</span>
            <span className="opacity-70">Explore each role</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-emerald-950/40 p-0.5">
            {(['farmer', 'fpo', 'buyer', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2.5 py-1 rounded-md transition-all font-semibold uppercase tracking-wider text-[10px] ${
                  role === r 
                    ? 'bg-amber-300 text-emerald-950 shadow-sm' 
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/80">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-serif">Kisan Market</h1>
              <Badge type="demo" value="Demo Data" />
            </div>
            <p className="hidden sm:block text-[11px] font-medium text-emerald-700">Better Prices. Better Buyers. Better Decisions.</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenCSVModal && (
            <button
              onClick={onOpenCSVModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Mandi Data
            </button>
          )}

          {onOpenGrievanceModal && (
            <button
              onClick={onOpenGrievanceModal}
              className="hidden lg:inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Grievance / Dispute
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">3 Unread</span>
                </div>
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/50 transition-colors border border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Current User & Role Profile */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[11px] font-semibold text-emerald-700 capitalize">{role} Account</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
              Guest View
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle quick actions"
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 shadow-lg">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-wrap gap-2 text-xs">
            {onOpenCSVModal && <button onClick={onOpenCSVModal} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-800"><Upload className="w-3.5 h-3.5" /> Import data</button>}
            {onOpenGrievanceModal && <button onClick={onOpenGrievanceModal} className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-700">Grievance / Dispute</button>}
            {user && <button onClick={logout} className="rounded-xl bg-rose-50 px-3 py-2 font-semibold text-rose-700">Sign out</button>}
          </div>
        </div>
      )}
    </header>
  );
};
