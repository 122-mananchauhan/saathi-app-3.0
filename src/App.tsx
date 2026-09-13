import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sprout,
  LayoutDashboard,
  Building2,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  Map,
  FileText,
  UploadCloud,
  ArrowRight,
  Menu,
  X,
  Check,
  BarChart3,
  Leaf,
  Users
} from 'lucide-react';

import { Page } from './types';
import { DashboardView } from './components/dashboard/DashboardView';
import { FpoDirectory } from './components/fpo/FpoDirectory';
import { IncomeImpactView } from './components/impact/IncomeImpactView';
import { HealthRiskMonitor } from './components/healthRisk/HealthRiskMonitor';
import { RecommendationView } from './components/recommendations/RecommendationView';
import { IndiaGisMap } from './components/gis/IndiaGisMap';
import { ReportsView } from './components/reports/ReportsView';
import { DataManagementView } from './components/dataMgmt/DataManagementView';

function App() {
  const [page, setPage] = useState<Page>('landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFpoId, setSelectedFpoId] = useState<string | undefined>(undefined);

  const navigate = (target: Page) => {
    setPage(target);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFpo = (fpoId: string) => {
    setSelectedFpoId(fpoId);
    navigate('fpos');
  };

  if (page === 'landing') {
    return <Landing onDemo={() => navigate('dashboard')} onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#f7fbf8]">
      <AppNav page={page} onNavigate={navigate} open={menuOpen} setOpen={setMenuOpen} />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {page === 'dashboard' && <DashboardView onNavigate={navigate} onSelectFpo={handleSelectFpo} />}
        {page === 'fpos' && <FpoDirectory onNavigate={navigate} initialSelectedFpoId={selectedFpoId} />}
        {page === 'impact' && <IncomeImpactView />}
        {page === 'health-risk' && <HealthRiskMonitor />}
        {page === 'recommendations' && <RecommendationView />}
        {page === 'gis' && <IndiaGisMap onNavigate={navigate} />}
        {page === 'reports' && <ReportsView />}
        {page === 'data-mgmt' && <DataManagementView />}
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-green-700 to-emerald-500 text-white shadow-glow">
        <Sprout size={22} />
      </div>
      <div>
        <p className="font-semibold leading-none text-slate-900">Kisan Saathi</p>
        <p className="mt-1 text-xs font-medium text-green-700">FPO INCOME INTELLIGENCE</p>
      </div>
    </div>
  );
}

function AppNav({
  page,
  onNavigate,
  open,
  setOpen
}: {
  page: Page;
  onNavigate: (p: Page) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const links: [Page, string, any][] = [
    ['dashboard', 'Dashboard', LayoutDashboard],
    ['fpos', 'FPOs', Building2],
    ['impact', 'Income & AI Impact', TrendingUp],
    ['health-risk', 'Health & Risk', ShieldCheck],
    ['recommendations', 'AI Recs', Lightbulb],
    ['gis', 'GIS Map', Map],
    ['reports', 'Reports', FileText],
    ['data-mgmt', 'Data Mgmt', UploadCloud],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-green-100/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => onNavigate('landing')}>
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 xl:flex">
          {links.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold transition ${page === key
                  ? 'bg-green-700 text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>

        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-700 xl:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-green-100 bg-white p-4 xl:hidden grid gap-2">
          {links.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${page === key ? 'bg-green-700 text-white' : 'text-slate-600 hover:bg-green-50'
                }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function Landing({ onDemo, onNavigate }: { onDemo: () => void; onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7fbf8]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <button onClick={onDemo} className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-green-800">
            Launch Platform Demo <ArrowRight className="ml-1 inline" size={15} />
          </button>
        </div>
      </header>

      <main>
        <section className="soft-grid relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="relative z-10">
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 max-w-3xl font-['Playfair_Display'] text-4xl font-bold leading-[1.12] text-slate-900 sm:text-5xl lg:text-6xl">
              Measuring & Predicting FPO Income Growth Under <span className="text-green-700">WDC 2.0</span> Interventions.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Kisan Saathi turns field & intervention datasets into transparent causal impact insights, ML income predictions, interactive what-if simulations, and early risk alerts for government decision-makers.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-3">
              <button onClick={onDemo} className="rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-3.5 font-bold text-white shadow-glow transition hover:-translate-y-0.5">
                Launch Platform Demo <ArrowRight className="ml-2 inline" size={17} />
              </button>
            </motion.div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><Check size={16} className="text-green-600" /> Explainable Causal Attribution</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-green-600" /> Interactive What-If Simulator</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-green-600" /> 6-Pillar Health Score</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, type: 'spring' }} className="relative self-center">
            <div className="absolute -inset-7 rounded-full bg-green-200/40 blur-3xl" />
            <div className="glass relative rounded-[28px] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">FPO Income Snapshot</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">Anand Green Farmer Producer Co.</h2>
                </div>
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <TrendingUp />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Income Uplift</p>
                  <p className="mt-1 text-2xl font-bold text-green-700">+50.2%</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">AI Confidence</p>
                  <p className="mt-1 text-2xl font-bold text-blue-700">92%</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-green-800 to-emerald-600 p-5 text-white">
                <p className="text-sm text-green-100">Primary Causal Driver</p>
                <div className="mt-2 flex items-center justify-between">
                  <b className="text-xl">Solar Drip Irrigation</b>
                  <b className="text-2xl">42%</b>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[42%] rounded-full bg-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <ExplainCard icon={<Users />} title="What is an FPO?" text="A Farmer Producer Organisation helps smallholders pool harvests, buy inputs collectively, and negotiate higher prices with buyers." />
            <ExplainCard icon={<Leaf />} title="What is WDC 2.0?" text="Watershed Development Component 2.0 provides funding for water conservation, micro-irrigation, and agricultural resilience." />
            <ExplainCard icon={<BarChart3 />} title="Why Kisan Saathi?" text="It enables government agencies to attribute income changes accurately, model scenarios, and target interventions effectively." />
          </div>
        </section>
      </main>
    </div>
  );
}

function ExplainCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="glass rounded-2xl p-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-green-700 to-emerald-500 text-white">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 leading-6 text-slate-600">{text}</p>
    </motion.article>
  );
}

export default App;
