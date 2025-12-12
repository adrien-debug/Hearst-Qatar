import Head from 'next/head';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import ChartCard from '../components/ChartCard';
import CircularProgress from '../components/CircularProgress';
import StatCard from '../components/StatCard';
import ComparisonBar from '../components/ComparisonBar';
import {
  mainKPIs,
  sectionsStatus,
  generatePowerData,
  generateHashrateData,
  generateMiningOutput,
  generateWalletData,
  generateWalletChartData,
  generateCountryReservesComparison,
  MiningOutput,
  WalletData,
  CountryBitcoinReserve,
} from '../data/dashboardMock';
import { colorTokens, formTokens, getCardClasses } from '../config/design-tokens';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'mining' | 'electricity'>('overview');
  const [mounted, setMounted] = useState(false);
  const [powerData, setPowerData] = useState<any[]>([]);
  const [hashrateData, setHashrateData] = useState<any[]>([]);
  const [miningOutput, setMiningOutput] = useState<MiningOutput[]>([]);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [walletChartData, setWalletChartData] = useState<any[]>([]);
  const [countryReservesData, setCountryReservesData] = useState<CountryBitcoinReserve[]>([]);
  const [kpis, setKpis] = useState(mainKPIs);

  useEffect(() => {
    setMounted(true);
    setPowerData(generatePowerData());
    setHashrateData(generateHashrateData());
    setMiningOutput(generateMiningOutput());
    const wallet = generateWalletData();
    setWalletData(wallet);
    setWalletChartData(generateWalletChartData());
    setCountryReservesData(generateCountryReservesComparison(wallet.currentBalance));
  }, []);

  const refreshData = () => {
    setPowerData(generatePowerData());
    setHashrateData(generateHashrateData());
    setMiningOutput(generateMiningOutput());
    const wallet = generateWalletData();
    setWalletData(wallet);
    setWalletChartData(generateWalletChartData());
    setCountryReservesData(generateCountryReservesComparison(wallet.currentBalance));
    setKpis({
      ...mainKPIs,
      totalPowerMW: mainKPIs.totalPowerMW + (Math.random() - 0.5) * 2,
      totalHashratePHs: mainKPIs.totalHashratePHs + (Math.random() - 0.5) * 20,
      dailyBTCProduction: mainKPIs.dailyBTCProduction + (Math.random() - 0.5) * 0.1,
      hashratePerMW: (mainKPIs.totalHashratePHs + (Math.random() - 0.5) * 20) / (mainKPIs.totalPowerMW + (Math.random() - 0.5) * 2),
      efficiencyRealVsTheoretical: mainKPIs.efficiencyRealVsTheoretical + (Math.random() - 0.5) * 0.5,
      consumptionMWhPerDay: (mainKPIs.totalPowerMW + (Math.random() - 0.5) * 2) * 24,
      consumptionMWhPerYear: (mainKPIs.totalPowerMW + (Math.random() - 0.5) * 2) * 8760 * (mainKPIs.globalUptime / 100),
    });
  };

  const powerChartData = powerData.length > 0 ? powerData.map((point) => ({
    time: point.time,
    'Section 1': Number(point['Section 1'].toFixed(1)),
    'Section 2': Number(point['Section 2'].toFixed(1)),
    'Section 3': Number(point['Section 3'].toFixed(1)),
    'Section 4': Number(point['Section 4'].toFixed(1)),
    Total: Number(point.total.toFixed(0)),
  })) : [];

  const btcProductionData = miningOutput.length > 0 ? miningOutput.slice(-30).map((output) => ({
    date: new Date(output.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }),
    btc: output.btcProduced,
  })) : [];

  if (!mounted) {
    return (
      <>
        <Head>
          <title>Dashboard - 100MW QATAR</title>
          <meta name="description" content="Real-time monitoring dashboard" />
        </Head>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-baseline mb-8">
            <h1 className="text-[1.75rem] font-bold text-[#0b1120] tracking-wide">Dashboard</h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-[#64748b]">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - 100MW QATAR</title>
        <meta name="description" content="Real-time monitoring dashboard" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 overflow-x-hidden">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#e2e8f0]">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[#0b1120] tracking-tight mb-2">
              QATAR - Strategic Bitcoin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Tableau de bord en temps réel - Opérations de minage souverain
            </p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-black bg-[#8AFD81] hover:bg-[#6FD96A] rounded-[8px] transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`relative px-4 sm:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded-[8px] whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#8AFD81] text-black shadow-md'
                : 'bg-white text-[#64748b] hover:text-[#0b1120] hover:border-[#8AFD81]/30 border border-[#e2e8f0] shadow-sm hover:shadow-md'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('mining')}
            className={`relative px-4 sm:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded-[8px] whitespace-nowrap ${
              activeTab === 'mining'
                ? 'bg-[#8AFD81] text-black shadow-md'
                : 'bg-white text-[#64748b] hover:text-[#0b1120] hover:border-[#8AFD81]/30 border border-[#e2e8f0] shadow-sm hover:shadow-md'
            }`}
          >
            Performance de minage
          </button>
          <button
            onClick={() => setActiveTab('electricity')}
            className={`relative px-4 sm:px-6 py-2 sm:py-3 font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 rounded-[8px] whitespace-nowrap ${
              activeTab === 'electricity'
                ? 'bg-[#8AFD81] text-black shadow-md'
                : 'bg-white text-[#64748b] hover:text-[#0b1120] hover:border-[#8AFD81]/30 border border-[#e2e8f0] shadow-sm hover:shadow-md'
            }`}
          >
            Souveraineté énergétique
          </button>
        </div>

        {/* OVERVIEW SECTION */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Hero KPIs - Style Overview */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-4 sm:p-6 md:p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm overflow-x-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Puissance totale</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.totalPowerMW.toFixed(1)}
                    </p>
                    <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">MW</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Capacité installée</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Hashrate total</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.totalHashratePHs.toLocaleString('en-US')}
                    </p>
                    <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">PH/s</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Contribution réseau</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Production quotidienne</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.dailyBTCProduction.toFixed(2)}
                    </p>
                    <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">BTC</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Moyenne journalière</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Disponibilité globale</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.globalUptime.toFixed(1)}
                    </p>
                    <span className="text-sm sm:text-base md:text-lg text-white/60 font-medium tracking-wide">%</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Excellence opérationnelle</p>
                </div>
              </div>
            </div>

            {/* Bitcoin Strategic Reserve - Style Overview */}
            {walletData && (
              <div className="bg-[#0a0b0d] rounded-[8px] p-4 sm:p-6 md:p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm overflow-x-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">Réserve stratégique Bitcoin</h2>
                    <p className="text-xs sm:text-sm text-white/60">Accumulation souveraine depuis le début</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="text-xs text-white/70 uppercase tracking-wider mb-3 font-medium">Solde actuel</div>
                    <div className="flex items-baseline gap-2 justify-start sm:justify-end">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#8AFD81] tracking-tight">
                        {walletData.currentBalance.toFixed(4)}
                      </span>
                      <span className="text-lg sm:text-xl font-medium text-white/60">BTC</span>
                    </div>
                    <div className="text-xs sm:text-sm text-white/50 mt-3">
                      ≈ ${(walletData.currentBalance * 42000).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-4 tracking-wide">Croissance de la réserve (30 jours)</h3>
                    <div className="h-48 sm:h-64 bg-black/30 rounded-[8px] border border-white/10 p-3 sm:p-5 overflow-x-auto">
                      {walletChartData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={walletChartData}>
                            <defs>
                              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8AFD81" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 10 }} />
                            <YAxis 
                              stroke="rgba(255,255,255,0.5)" 
                              tick={{ fontSize: 10 }}
                              tickFormatter={(value: number) => value.toFixed(0)}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#0a0b0d', 
                                border: '1px solid rgba(138, 253, 129, 0.2)', 
                                color: '#8AFD81', 
                                borderRadius: '8px',
                                fontSize: '11px'
                              }}
                              formatter={(value: number | string) => {
                                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                return `${numValue.toFixed(4)} BTC`;
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="balance" 
                              stroke="#8AFD81" 
                              strokeWidth={2}
                              fill="url(#colorBalance)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-4 tracking-wide">Classement des réserves mondiales</h3>
                    <div className="h-48 sm:h-64 bg-black/30 rounded-[8px] border border-white/10 p-3 sm:p-5 overflow-x-auto">
                      {countryReservesData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={countryReservesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                              type="number" 
                              stroke="rgba(255,255,255,0.5)" 
                              tick={{ fontSize: 11 }}
                              tickFormatter={(value: number) => {
                                if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                                return value.toFixed(0);
                              }}
                            />
                            <YAxis 
                              dataKey="country" 
                              type="category" 
                              stroke="rgba(255,255,255,0.5)" 
                              tick={{ fontSize: 11 }}
                              width={100}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#0a0b0d', 
                                border: '1px solid rgba(138, 253, 129, 0.2)', 
                                color: '#8AFD81', 
                                borderRadius: '8px',
                                fontSize: '11px'
                              }}
                              formatter={(value: number | string) => {
                                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                return `${numValue.toLocaleString('en-US', { maximumFractionDigits: 2 })} BTC`;
                              }}
                            />
                            <Bar dataKey="btc" radius={[0, 8, 8, 0]}>
                              {countryReservesData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.country === 'Qatar' ? '#8AFD81' : 'rgba(255,255,255,0.2)'} 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-xs text-white/60">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-[#8AFD81]"></div>
                        <span className="font-medium">Position du Qatar</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <span className="font-medium">Autres nations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MINING SECTION */}
        {activeTab === 'mining' && (
          <div className="space-y-8">
            {/* Hero Mining Metrics - Style Overview */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Hashrate total</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.totalHashratePHs.toLocaleString('en-US')}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">PH/s</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">{kpis.hashratePerMW.toFixed(2)} PH/s par MW</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Production BTC quotidienne</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.dailyBTCProduction.toFixed(2)}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">BTC</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">~{(kpis.dailyBTCProduction * 365).toFixed(0)} BTC/an</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Efficacité opérationnelle</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.efficiencyRealVsTheoretical.toFixed(1)}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Réel vs Théorique</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Part du réseau</h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.networkShare.toFixed(2)}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Contrôle global du hashrate</p>
                </div>
              </div>
            </div>

            {/* Efficiency & Performance Metrics - Style Overview */}
            <div className="bg-white rounded-[8px] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-[1.25rem] font-semibold text-[#0b1120] mb-6 tracking-tight">Métriques d'efficacité</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <CircularProgress
                      value={kpis.asicEfficiency}
                      max={30}
                      size={120}
                      label=""
                      unit=""
                      color="#8AFD81"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-1">Efficacité ASIC</h4>
                  <p className="text-2xl font-bold text-[#0b1120]">{kpis.asicEfficiency.toFixed(1)} <span className="text-sm font-medium text-[#64748b]">J/TH</span></p>
                  <p className="text-xs text-[#64748b] mt-2">Plus bas est meilleur</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <CircularProgress
                      value={kpis.energyEfficiencyBTCPerMW}
                      max={12}
                      size={120}
                      label=""
                      unit=""
                      color="#8AFD81"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-1">Efficacité énergétique</h4>
                  <p className="text-2xl font-bold text-[#0b1120]">{kpis.energyEfficiencyBTCPerMW.toFixed(1)} <span className="text-sm font-medium text-[#64748b]">BTC/MW/an</span></p>
                  <p className="text-xs text-[#64748b] mt-2">Top 3 mondial</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-[120px] h-[120px] rounded-full bg-[#8AFD81]/10 flex items-center justify-center">
                      <p className="text-3xl font-bold text-[#8AFD81]">${kpis.productionCost.toLocaleString('en-US')}</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-1">Coût de production</h4>
                  <p className="text-2xl font-bold text-[#0b1120]">${kpis.productionCost.toLocaleString('en-US')} <span className="text-sm font-medium text-[#64748b]">/BTC</span></p>
                  <p className="text-xs text-[#64748b] mt-2">23% d'avantage coût</p>
                </div>
              </div>
            </div>

            {/* Comparison & ROI - Style Overview */}
            <div className="space-y-6">
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-base font-semibold text-[#0b1120] mb-5 tracking-tight">Comparaison de l'efficacité hashrate</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Qatar', value: kpis.hashratePerMW, target: 10 },
                      { name: 'Industry Avg', value: 9.5, target: 10 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0', 
                          color: '#0b1120', 
                          borderRadius: '8px',
                          fontSize: '11px'
                        }} 
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        <Cell fill="#8AFD81" />
                        <Cell fill="#e2e8f0" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-8 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[1.25rem] font-semibold text-[#0b1120] mb-2 tracking-tight">ROI opérationnel</h4>
                    <p className="text-sm text-[#64748b]">Retour sur investissement</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-36 h-36">
                      <CircularProgress
                        value={kpis.operationalROI * 20}
                        max={100}
                        size={144}
                        label=""
                        unit=""
                        color="#8AFD81"
                        showValue={false}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-5xl font-bold text-[#8AFD81] mb-0.5">{kpis.operationalROI.toFixed(1)}x</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#64748b] mb-1">À $42,000/BTC</p>
                      <p className="text-sm text-[#64748b] mb-3">Coût: $10,000/BTC</p>
                      <div className="inline-block px-5 py-3 bg-[#8AFD81] rounded-[8px]">
                        <p className="text-sm text-black font-bold">320% marge nette</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Timeline - Style Overview */}
            <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-base font-semibold text-[#0b1120] mb-5 tracking-tight">Production BTC (30 derniers jours)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={btcProductionData}>
                    <defs>
                      <linearGradient id="colorBTC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8AFD81" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'BTC', angle: -90, position: 'insideLeft', fill: '#64748b', style: { fontSize: 11 } }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="btc" fill="url(#colorBTC)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ELECTRICITY SECTION */}
        {activeTab === 'electricity' && (
          <div className="space-y-8">
            {/* Energy Mix - Style Overview */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm">
              <h3 className="text-[1.25rem] font-semibold text-white mb-8 tracking-tight">Mix énergétique</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#8AFD81]/20 flex items-center justify-center">
                      <p className="text-3xl font-bold text-[#8AFD81]">{kpis.energyMixHydro.toFixed(0)}%</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-1">Hydroélectrique</h4>
                  <p className="text-xs text-white/50">Source d'énergie renouvelable</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#8AFD81]/20 flex items-center justify-center">
                      <p className="text-3xl font-bold text-[#8AFD81]">{kpis.energyMixSurplus.toFixed(0)}%</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-1">Surplus réseau</h4>
                  <p className="text-xs text-white/50">Utilisation énergie excédentaire</p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                      <p className="text-3xl font-bold text-white/60">{kpis.energyMixGrid.toFixed(0)}%</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-1">Réseau standard</h4>
                  <p className="text-xs text-white/50">Source conventionnelle</p>
                </div>
              </div>
            </div>

            {/* Energy Metrics - Style Overview */}
            <div className="bg-white rounded-[8px] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-[1.25rem] font-semibold text-[#0b1120] mb-6 tracking-tight">Métriques énergétiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider">Souveraineté énergétique</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[#e2e8f0] rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-[#8AFD81] h-4 rounded-full transition-all duration-700"
                        style={{ width: `${kpis.energySovereignty}%` }}
                      ></div>
                    </div>
                    <span className="text-3xl font-bold text-[#0b1120]">{kpis.energySovereignty.toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2">Hydro + Surplus (Sources souveraines)</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider">Disponibilité globale</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[#e2e8f0] rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-[#8AFD81] h-4 rounded-full transition-all duration-700"
                        style={{ width: `${kpis.globalUptime}%` }}
                      ></div>
                    </div>
                    <span className="text-3xl font-bold text-[#0b1120]">{kpis.globalUptime.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2">Disponibilité opérationnelle</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider">Énergie récupérée</h4>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {(kpis.recoveredEnergyMWh / 1000).toFixed(0)}
                    </p>
                    <span className="text-lg text-[#64748b] font-medium tracking-wide">GWh</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2">Valorisation annuelle</p>
                </div>
              </div>
            </div>

            {/* Power & Consumption - Style Overview */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-300 shadow-sm">
              <h3 className="text-[1.25rem] font-semibold text-white mb-8 tracking-tight">Puissance & Consommation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Puissance totale</h4>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.totalPowerMW.toFixed(1)}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">MW</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Capacité installée</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Consommation quotidienne</h4>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {kpis.consumptionMWhPerDay.toLocaleString('en-US')}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">MWh</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Moyenne 24h</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Consommation annuelle</h4>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                      {(kpis.consumptionMWhPerYear / 1000).toFixed(0)}
                    </p>
                    <span className="text-lg text-white/60 font-medium tracking-wide">GWh</span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">Total annuel</p>
                </div>
              </div>
            </div>

            {/* Cost Metrics - Style Overview */}
            <div className="bg-white rounded-[8px] p-8 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-[1.25rem] font-semibold text-[#0b1120] mb-6 tracking-tight">Métriques de coûts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#8AFD81]/10 flex items-center justify-center">
                      <p className="text-2xl font-bold text-[#8AFD81]">${kpis.averageEnergyCost.toFixed(0)}</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-1">Coût énergétique moyen</h4>
                  <p className="text-2xl font-bold text-[#0b1120]">${kpis.averageEnergyCost.toFixed(0)} <span className="text-sm font-medium text-[#64748b]">/MWh</span></p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#8AFD81]/10 flex items-center justify-center">
                      <p className="text-lg font-bold text-[#8AFD81]">${(kpis.marginalBTCCost/1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-1">Coût marginal BTC</h4>
                  <p className="text-2xl font-bold text-[#0b1120]">${kpis.marginalBTCCost.toLocaleString('en-US')} <span className="text-sm font-medium text-[#64748b]">/BTC</span></p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#8AFD81]/10 flex items-center justify-center">
                      <p className="text-2xl font-bold text-[#8AFD81]">{kpis.carbonIntensity.toFixed(2)}</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-[#64748b] uppercase tracking-wider mb-1">Intensité carbone</h4>
                  <p className="text-2xl font-bold text-[#0b1120]">{kpis.carbonIntensity.toFixed(2)} <span className="text-sm font-medium text-[#64748b]">tCO2/BTC</span></p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-base font-semibold text-[#0b1120] mb-5 tracking-tight">Comparaison des coûts de production (USD/BTC)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { country: 'Qatar', cost: kpis.marginalBTCCost },
                      { country: 'World Avg', cost: 13000 },
                      { country: 'USA', cost: 12000 },
                      { country: 'China', cost: 11000 },
                      { country: 'Kazakhstan', cost: 10000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="country" stroke="#6B7280" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#6B7280" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0', 
                          color: '#0b1120', 
                          borderRadius: '8px',
                          fontSize: '11px'
                        }} 
                      />
                      <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                        <Cell fill="#8AFD81" />
                        <Cell fill="#e2e8f0" />
                        <Cell fill="#e2e8f0" />
                        <Cell fill="#e2e8f0" />
                        <Cell fill="#e2e8f0" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-8 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[1.25rem] font-semibold text-[#0b1120] mb-2 tracking-tight">Avantage compétitif</h4>
                    <p className="text-sm text-[#64748b]">vs Moyenne mondiale</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-36 h-36">
                      <CircularProgress
                        value={kpis.competitiveAdvantage}
                        max={100}
                        size={144}
                        label=""
                        unit=""
                        color="#8AFD81"
                        showValue={false}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold text-[#8AFD81] mb-0.5">-{kpis.competitiveAdvantage.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#64748b] mb-2">Coût de production inférieur</p>
                      <div className="inline-block px-5 py-3 bg-[#8AFD81] rounded-[8px]">
                        <p className="text-sm text-black font-bold">${(13000 - kpis.marginalBTCCost).toLocaleString('en-US')} d'avantage par BTC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
