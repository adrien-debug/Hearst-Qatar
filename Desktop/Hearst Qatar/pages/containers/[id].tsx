import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getContainerById, asicMachines } from '../../data/hardwareMock';

// Fonction pour générer des données de hashrate en temps réel (24 dernières heures)
function generateHashrateData(baseHashrate: number) {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    time.setMinutes(0);
    time.setSeconds(0);
    
    // Variation de ±5% autour du hashrate de base
    const variation = 1 + (Math.random() - 0.5) * 0.1;
    const hashrate = baseHashrate * variation;
    
    data.push({
      time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      hashrate: Number(hashrate.toFixed(2)),
      fullTime: time,
    });
  }
  
  return data;
}

// Fonction pour générer des données de production en temps réel (24 dernières heures)
function generateProductionData(baseProduction: number) {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    time.setMinutes(0);
    time.setSeconds(0);
    
    // Variation de ±8% autour de la production de base
    const variation = 1 + (Math.random() - 0.5) * 0.16;
    const production = baseProduction * variation;
    
    data.push({
      time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      production: Number(production.toFixed(6)),
      fullTime: time,
    });
  }
  
  return data;
}

export default function ContainerDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [hashrateData, setHashrateData] = useState<Array<{time: string; hashrate: number}>>([]);
  const [productionData, setProductionData] = useState<Array<{time: string; production: number}>>([]);

  if (!id || typeof id !== 'string') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-[#64748b]">Chargement...</p>
        </div>
      </div>
    );
  }

  const container = getContainerById(id);

  // Initialiser et mettre à jour les données en temps réel
  useEffect(() => {
    if (container) {
      // Initialisation
      setHashrateData(generateHashrateData(container.hashrateTHs));
      setProductionData(generateProductionData(container.dailyProductionBTC / 24));
      
      // Mise à jour toutes les minutes pour simuler le temps réel
      const interval = setInterval(() => {
        setHashrateData(prev => {
          if (prev.length === 0) return prev;
          const newData = [...prev];
          // Ajouter un nouveau point et supprimer le plus ancien
          const now = new Date();
          const variation = 1 + (Math.random() - 0.5) * 0.1;
          const newHashrate = container.hashrateTHs * variation;
          
          newData.shift();
          newData.push({
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            hashrate: Number(newHashrate.toFixed(2)),
          });
          return newData;
        });
        
        setProductionData(prev => {
          if (prev.length === 0) return prev;
          const newData = [...prev];
          const now = new Date();
          const variation = 1 + (Math.random() - 0.5) * 0.16;
          const newProduction = (container.dailyProductionBTC / 24) * variation;
          
          newData.shift();
          newData.push({
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            production: Number(newProduction.toFixed(6)),
          });
          return newData;
        });
      }, 60000); // Mise à jour toutes les minutes
      
      return () => clearInterval(interval);
    }
  }, [container, id]);

  if (!container) {
    return (
      <>
        <Head>
          <title>Conteneur introuvable - 100MW QATAR</title>
        </Head>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-[#0b1120] mb-4">Conteneur introuvable</h1>
            <Link href="/hardware" className="text-[#8AFD81] hover:underline">
              Retour à la liste des conteneurs
            </Link>
          </div>
        </div>
      </>
    );
  }

  const tempDiff = container.coolingModule.temperatureIn - container.coolingModule.temperatureOut;
  const machineData = asicMachines[0];
  const uptimeColor = container.uptime >= 98 ? 'text-[#8AFD81]' : container.uptime >= 95 ? 'text-yellow-500' : 'text-red-500';

  return (
    <>
      <Head>
        <title>{container.name} - 100MW QATAR</title>
        <meta name="description" content={`Détails du conteneur ${container.name}`} />
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Bouton retour */}
        <Link 
          href="/hardware"
          className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#8AFD81] transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux conteneurs
        </Link>

        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0b1120] tracking-tight mb-1">
                {container.name}
              </h1>
              <p className="text-sm text-[#64748b]">{container.type}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-white to-[#f8f9fa] border border-[#e2e8f0]">
              <div className={`w-2.5 h-2.5 rounded-full ${container.status === 'In Service' ? 'bg-[#8AFD81] shadow-[0_0_8px_rgba(138,253,129,0.4)]' : 'bg-yellow-500'}`}></div>
              <span className="text-xs font-bold text-[#0b1120]">{container.status}</span>
            </div>
          </div>
          <div className="h-0.5 w-24 bg-gradient-to-r from-[#8AFD81] to-[#6FD96A] rounded-full"></div>
        </div>

        {/* Bandeau de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#0a0b0d] via-[#0f1114] to-[#0a0b0d] rounded-xl p-4 border border-white/10 shadow-lg">
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Puissance</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                {container.powerConsumptionMW.toFixed(2)}
              </span>
              <span className="text-sm text-white/50 font-semibold">MW</span>
            </div>
            <div className="mt-2 text-[10px] text-white/40">
              Capacité: {container.capacityMW} MW
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a0b0d] via-[#0f1114] to-[#0a0b0d] rounded-xl p-4 border border-white/10 shadow-lg">
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Hashrate</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                {(container.hashrateTHs / 1000).toFixed(2)}
              </span>
              <span className="text-sm text-white/50 font-semibold">PH/s</span>
            </div>
            <div className="mt-2 text-[10px] text-white/40">
              {container.hashrateTHs.toLocaleString('en-US')} TH/s
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a0b0d] via-[#0f1114] to-[#0a0b0d] rounded-xl p-4 border border-white/10 shadow-lg">
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Production</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#8AFD81] to-[#6FD96A]">
                {container.dailyProductionBTC.toFixed(4)}
              </span>
              <span className="text-sm text-white/50 font-semibold">BTC/j</span>
            </div>
            <div className="mt-2 text-[10px] text-white/40">
              ≈ {((container.dailyProductionBTC * 365) / 1000).toFixed(2)} BTC/an
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a0b0d] via-[#0f1114] to-[#0a0b0d] rounded-xl p-4 border border-white/10 shadow-lg">
            <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Uptime</div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold ${uptimeColor}`}>
                {container.uptime.toFixed(2)}
              </span>
              <span className="text-sm text-white/50 font-semibold">%</span>
            </div>
            <div className="mt-2 text-[10px] text-white/40">
              Machines actives: {container.activeMachines}/{container.machinesCount}
            </div>
          </div>
        </div>

        {/* Graphiques en temps réel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique Hashrate */}
          <section className="bg-white rounded-xl border border-[#e2e8f0]/80 shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0b1120] tracking-tight">Hashrate Live</h2>
                  <p className="text-[10px] text-[#64748b] mt-0.5">24 dernières heures</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse"></div>
                <span className="text-[10px] text-[#64748b] font-medium">Live</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hashrateData}>
                  <defs>
                    <linearGradient id="hashrateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8AFD81" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#64748b' }}
                    label={{ value: 'TH/s', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: '11px' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0b0d', 
                      border: '1px solid #8AFD81/20',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#8AFD81' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hashrate" 
                    stroke="#8AFD81" 
                    strokeWidth={2}
                    fill="url(#hashrateGradient)"
                    dot={{ fill: '#8AFD81', r: 3 }}
                    activeDot={{ r: 5, fill: '#8AFD81' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Graphique Production */}
          <section className="bg-white rounded-xl border border-[#e2e8f0]/80 shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0b1120] tracking-tight">Production Live</h2>
                  <p className="text-[10px] text-[#64748b] mt-0.5">Production horaire (24h)</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8AFD81] animate-pulse"></div>
                <span className="text-[10px] text-[#64748b] font-medium">Live</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData}>
                  <defs>
                    <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8AFD81" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#64748b' }}
                    label={{ value: 'BTC/h', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: '11px' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0b0d', 
                      border: '1px solid #8AFD81/20',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#8AFD81' }}
                    formatter={(value: number) => `${value.toFixed(6)} BTC`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="production" 
                    stroke="#8AFD81" 
                    strokeWidth={2}
                    fill="url(#productionGradient)"
                    dot={{ fill: '#8AFD81', r: 3 }}
                    activeDot={{ r: 5, fill: '#8AFD81' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Sections détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Section Puissance & Consommation */}
          <section className="bg-white rounded-xl border border-[#e2e8f0]/80 shadow-md p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-[#0b1120] tracking-tight">Puissance & Consommation</h2>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-2 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium text-sm">Capacité installée</span>
                <span className="text-[#0b1120] font-bold text-base">{container.capacityMW} MW</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Consommation actuelle</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.powerConsumptionMW.toFixed(2)} MW</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Taux d'utilisation</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {((container.powerConsumptionMW / container.capacityMW) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Efficacité énergétique</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.efficiencyJTH} J/TH</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#64748b] font-medium">Puissance par machine</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {(container.powerConsumptionMW * 1000 / container.activeMachines).toFixed(2)} kW
                </span>
              </div>
            </div>
          </section>

          {/* Section Production & Hashrate */}
          <section className="bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                <svg className="w-6 h-6 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0b1120] tracking-tight">Production & Hashrate</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Hashrate total</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {container.hashrateTHs.toLocaleString('en-US')} TH/s
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Hashrate unitaire</span>
                <span className="text-[#0b1120] font-bold text-lg">{machineData.hashrateTHs} TH/s</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Production quotidienne</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.dailyProductionBTC.toFixed(4)} BTC</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Production mensuelle</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {(container.dailyProductionBTC * 30).toFixed(3)} BTC
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#64748b] font-medium">Hashrate par machine</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {(container.hashrateTHs / container.activeMachines).toFixed(0)} TH/s
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Section Machines ASIC */}
          <section className="bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                <svg className="w-6 h-6 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0b1120] tracking-tight">Machines ASIC</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Marque</span>
                <span className="text-[#0b1120] font-bold text-lg">{machineData.brand}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Modèle</span>
                <span className="text-[#0b1120] font-bold text-lg">{machineData.model}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Total installé</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.machinesCount}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Machines actives</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.activeMachines}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#64748b] font-medium">Taux d'activité</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {((container.activeMachines / container.machinesCount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </section>

          {/* Section Refroidissement */}
          <section className="bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
                <svg className="w-6 h-6 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#0b1120] tracking-tight">Module de Refroidissement</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Module ID</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.coolingModule.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Type</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.coolingModule.type}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Capacité de refroidissement</span>
                <span className="text-[#0b1120] font-bold text-lg">
                  {(container.coolingModule.coolingCapacitykW / 1000).toFixed(2)} MW
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Débit</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.coolingModule.flowRate}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Temp. entrée</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.coolingModule.temperatureIn}°C</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Temp. sortie</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.coolingModule.temperatureOut}°C</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#f1f5f9]">
                <span className="text-[#64748b] font-medium">Δ Température</span>
                <span className="text-[#0b1120] font-bold text-lg">{tempDiff}°C</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#64748b] font-medium">Efficacité</span>
                <span className="text-[#0b1120] font-bold text-lg">{container.coolingModule.efficiency}%</span>
              </div>
            </div>
          </section>
        </div>

        {/* Section Informations générales */}
        <section className="bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a0b0d] to-[#1a1d24] flex items-center justify-center border border-[#8AFD81]/20">
              <svg className="w-6 h-6 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0b1120] tracking-tight">Informations Générales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-2">Section</div>
              <div className="text-lg font-bold text-[#0b1120]">{container.section}</div>
            </div>
            <div>
              <div className="text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-2">Système de refroidissement</div>
              <div className="text-lg font-bold text-[#0b1120]">{container.coolingSystem}</div>
            </div>
            <div>
              <div className="text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-2">Statut module refroidissement</div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  container.coolingModule.status === 'OK' ? 'bg-[#8AFD81]' :
                  container.coolingModule.status === 'Warning' ? 'bg-yellow-500' : 'bg-orange-500'
                }`}></div>
                <span className="text-lg font-bold text-[#0b1120]">{container.coolingModule.status}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}



