import React, { useState } from 'react';
import { Role } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, TrendingUp, Users, ShieldCheck, ArrowRight, CheckCircle2, 
  BarChart3, Truck, Wallet, Scale, Lock, Sparkles, Building2, HelpCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [activeModal, setActiveModal] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('farmer');
  
  const [email, setEmail] = useState('farmer@kisanmarket.in');
  const [name, setName] = useState('Ramesh Singh');
  const [password, setPassword] = useState('password123');

  const handleRoleSelectAndOpenLogin = (role: Role) => {
    setSelectedRole(role);
    const emails: Record<Role, string> = {
      farmer: 'farmer@kisanmarket.in',
      fpo: 'fpo@kisanmarket.in',
      buyer: 'buyer@kisanmarket.in',
      admin: 'admin@kisanmarket.in'
    };
    setEmail(emails[role]);
    setActiveModal('login');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, selectedRole);
    setActiveModal(null);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans flex flex-col justify-between">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-[#0b2a22] via-emerald-950 to-slate-950 text-white overflow-hidden">
        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="hero-orb absolute -right-32 top-6 h-[34rem] w-[34rem] rounded-full" />
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-5 sm:py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold font-serif tracking-tight text-white">Kisan Market</span>
              <p className="text-[11px] text-emerald-300 font-medium">Better Prices. Better Buyers. Better Decisions.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('login')}
              className="px-4 py-2 text-xs font-bold text-emerald-300 border border-emerald-700 hover:bg-emerald-800/50 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveModal('register')}
              className="px-5 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              Register Account
            </button>
          </div>
        </nav>

        {/* Hero Section Content */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-12 sm:pt-16 pb-20 sm:pb-24 relative z-10 text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-emerald-300/20 text-emerald-100 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Agricultural Market Intelligence & Transaction Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-serif leading-[0.98] tracking-tight text-white mb-6">
              Empowering Farmers & FPOs to Achieve the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">Highest Net Price Realization</span>.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
              Transparent price discovery across mandis, processors, and digital institutional buyers. Powered by AI price predictions, sale window optimization, quality matching, and direct farm-gate transaction logistics.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => handleRoleSelectAndOpenLogin('farmer')}
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <span>Launch Farmer Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRoleSelectAndOpenLogin('buyer')}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <span>Browse Buyer Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Net Realization Showcase Card */}
          <div className="bg-slate-950/45 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">Live Net Realization Intelligence</span>
              </div>
              <Badge type="demo" value="Demo Data" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Karnal Processor Direct</p>
                  <p className="text-slate-400 text-[11px]">Distance: 115 km • Freight: ₹4,200</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-emerald-400">₹2,580 / quintal</p>
                  <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950 px-2 py-0.5 rounded">Highest Net Profit</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700 flex justify-between items-center opacity-80">
                <div>
                  <p className="font-semibold text-slate-200">Local Khanna Mandi</p>
                  <p className="text-slate-400 text-[11px]">Distance: 18 km • Freight: ₹800</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-300">₹2,450 / quintal</p>
                  <span className="text-[10px] text-slate-400">Standard Price</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Commodity: Wheat (120 Quintals)</span>
              <span className="text-emerald-400 font-semibold">+₹13,400 Extra Net Income</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Cards Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mb-3">Select Your Role to Access Portal</h2>
          <p className="text-slate-600 text-sm">
            Kisan Market provides role-specific dashboards with shared data integrity and complete security controls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Farmer Card */}
          <div 
            onClick={() => handleRoleSelectAndOpenLogin('farmer')}
            className="surface-card-hover rounded-3xl p-6 hover:border-emerald-500 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Farmer</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Add crops, create produce lots, view Net Realization, get AI price forecasts, sale window advice, and direct buyer matches.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Enter Farmer Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* FPO Card */}
          <div 
            onClick={() => handleRoleSelectAndOpenLogin('fpo')}
            className="surface-card-hover rounded-3xl p-6 hover:border-indigo-500 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. FPO</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Manage member farmers, aggregate yields into bulk lots, negotiate high-tonnage institutional contracts, and disburse payouts.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Enter FPO Hub <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Buyer Card */}
          <div 
            onClick={() => handleRoleSelectAndOpenLogin('buyer')}
            className="surface-card-hover rounded-3xl p-6 hover:border-blue-500 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Buyer</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Post procurement requirements, filter farmer lots by moisture & quality specs, send digital offers, and track logistics.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Enter Buyer Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Admin Card */}
          <div 
            onClick={() => handleRoleSelectAndOpenLogin('admin')}
            className="surface-card-hover rounded-3xl p-6 hover:border-purple-500 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Govt / Admin</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Monitor macro ecosystem health, regional supply-demand heatmaps, mandi price trends, and dispute resolution statistics.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Enter Admin Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 relative">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                {activeModal === 'login' ? 'Sign In to Kisan Market' : activeModal === 'register' ? 'Register Platform Account' : 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Select role and credentials to proceed</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {activeModal === 'register' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Role</label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl font-semibold text-[11px]">
                  {(['farmer', 'fpo', 'buyer', 'admin'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-1.5 rounded-lg capitalize transition-colors ${
                        selectedRole === r ? 'bg-white text-emerald-800 shadow' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {activeModal !== 'forgot' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all text-xs"
              >
                {activeModal === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : activeModal === 'register' ? 'Register Account' : 'Send Reset Link'}
              </button>

              <div className="flex justify-between items-center pt-2 text-[11px]">
                {activeModal === 'login' ? (
                  <>
                    <button type="button" onClick={() => setActiveModal('register')} className="text-emerald-700 font-semibold hover:underline">
                      Need an account? Register
                    </button>
                    <button type="button" onClick={() => setActiveModal('forgot')} className="text-slate-500 hover:underline">
                      Forgot Password?
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setActiveModal('login')} className="text-emerald-700 font-semibold hover:underline mx-auto">
                    Back to Login
                  </button>
                )}
              </div>
            </form>

            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
