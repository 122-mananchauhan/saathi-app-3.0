import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Filter, Layers, Info, ExternalLink, Users, TrendingUp, ShieldCheck, X } from 'lucide-react';
import { sampleFpos } from '../../data/mockData';
import { FpoData, Page } from '../../types';
import { FpoProfileModal } from '../fpo/FpoProfileModal';

export function IndiaGisMap({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeFpo, setActiveFpo] = useState<FpoData | null>(sampleFpos[0]);
  const [modalFpo, setModalFpo] = useState<FpoData | null>(null);

  const filteredFpos = useMemo(() => {
    return sampleFpos.filter(f => {
      const matchState = selectedState === 'All' || f.state === selectedState;
      const matchStatus = selectedStatus === 'All' || f.performanceStatus === selectedStatus;
      return matchState && matchStatus;
    });
  }, [selectedState, selectedStatus]);

  const states = useMemo(() => ['All', ...Array.from(new Set(sampleFpos.map(f => f.state)))], []);

  // Map latitude/longitude to SVG Canvas percentage positions for India map
  // India Bounding Box roughly: Lat 8N to 36N, Lng 68E to 97E
  const getMapCoords = (lat: number, lng: number) => {
    const minLat = 8, maxLat = 35;
    const minLng = 68, maxLng = 95;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;

    return { x: Math.min(92, Math.max(8, x)), y: Math.min(90, Math.max(10, y)) };
  };

  return (
    <>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Geospatial Intelligence</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">GIS FPO Spatial Map</h1>
          <p className="mt-1 text-slate-500">Interactive geographic distribution of WDC 2.0 Farmer Producer Organizations across India.</p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="glass mb-6 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={selectedState} 
                onChange={e => setSelectedState(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                {states.map(s => <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>)}
              </select>
            </div>

            <div>
              <select 
                value={selectedStatus} 
                onChange={e => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Performance Levels</option>
                <option value="High">High Performing</option>
                <option value="Moderate">Moderate</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-green-500 shadow-glow" /> High Performance (80+)</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-blue-500" /> Moderate (65-79)</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-amber-500" /> Needs Attention (&lt;65)</span>
          </div>
        </div>
      </section>

      {/* Main Layout: Interactive Map View + Selected FPO Side Card */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Visual Map Canvas Container */}
        <div className="glass relative min-h-[480px] overflow-hidden rounded-3xl p-6 lg:col-span-2 border border-green-100/80 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50">
          <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
            <Layers size={14} className="text-green-700" /> WDC 2.0 Cluster Layer (India)
          </div>

          {/* Stylized India Outline Map Background */}
          <div className="relative h-full w-full flex items-center justify-center py-6">
            <svg viewBox="0 0 600 650" className="h-full max-h-[450px] w-auto opacity-20 text-green-900 fill-current stroke-green-800 stroke-[1.5]">
              <path d="M 280,30 L 320,60 L 340,110 L 310,140 L 360,160 L 400,150 L 450,180 L 520,190 L 550,230 L 480,260 L 420,240 L 380,270 L 370,330 L 340,380 L 300,450 L 260,550 L 240,620 L 210,550 L 190,460 L 150,380 L 130,320 L 80,280 L 50,220 L 90,190 L 140,210 L 200,160 L 220,100 Z" />
            </svg>

            {/* Interactive FPO Map Pins */}
            {filteredFpos.map(f => {
              const { x, y } = getMapCoords(f.lat, f.lng);
              const isSelected = activeFpo?.id === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFpo(f)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300"
                >
                  <motion.div 
                    whileHover={{ scale: 1.25 }}
                    animate={{ scale: isSelected ? 1.3 : 1 }}
                    className={`relative flex items-center justify-center rounded-full p-2 text-white shadow-lg transition ${
                      f.healthScore >= 80 ? 'bg-green-600 ring-4 ring-green-200' :
                      f.healthScore >= 65 ? 'bg-blue-600 ring-4 ring-blue-200' :
                      'bg-amber-500 ring-4 ring-amber-200'
                    }`}
                  >
                    <MapPin size={18} />
                    
                    {/* Tooltip on Hover */}
                    <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl group-hover:block z-30">
                      {f.name} ({f.state})
                    </span>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected FPO Details Card */}
        {activeFpo ? (
          <div className="glass flex flex-col justify-between rounded-3xl p-6 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                  {activeFpo.id}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  activeFpo.healthScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Health: {activeFpo.healthScore}/100
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900">{activeFpo.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={14} className="text-green-600" /> {activeFpo.district}, {activeFpo.state}
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Members</span>
                  <b className="text-slate-800">{activeFpo.membersCount} farmers</b>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Revenue (Post-WDC)</span>
                  <b className="text-slate-900">₹{activeFpo.revenueAfterIntervention} Lakhs</b>
                </div>

                <div className="rounded-2xl bg-green-50 p-3.5 border border-green-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-green-800">Income Uplift</span>
                  <b className="text-green-700">+{activeFpo.incomeGrowthPct}% Growth</b>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Primary Crops</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeFpo.primaryCrops.map(c => (
                    <span key={c} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      🌾 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setModalFpo(activeFpo)}
              className="mt-6 w-full rounded-xl bg-green-700 py-3 text-center text-sm font-bold text-white shadow-glow hover:bg-green-800"
            >
              Open Full FPO Profile →
            </button>
          </div>
        ) : (
          <div className="glass flex items-center justify-center rounded-3xl p-6 text-center text-slate-400">
            Click any pin on the map to inspect FPO location details.
          </div>
        )}
      </section>

      {/* Modal View */}
      <FpoProfileModal fpo={modalFpo} onClose={() => setModalFpo(null)} />
    </>
  );
}
