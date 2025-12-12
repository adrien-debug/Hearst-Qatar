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
} from 'recharts';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import CircularProgress from '../components/CircularProgress';
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
    // Initialiser les données uniquement côté client pour éviter les différences d'hydratation
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

  const powerDistribution = sectionsStatus.map((section) => ({
    name: section.name,
    value: section.powerMW,
  }));

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
            <h1 className="text-[1.75rem] font-bold text-[#0b1120] tracking-wide">
              Dashboard
            </h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0b1120] tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-sm text-[#64748b] tracking-wide">
              Real-time monitoring and analytics
            </p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#8AFD81] hover:text-[#6FD96A] bg-transparent border border-[#8AFD81]/20 hover:border-[#8AFD81]/40 rounded-[8px] transition-all duration-200 cursor-pointer tracking-wide hover:shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 border-b border-[#e2e8f0]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`relative px-6 py-3.5 font-medium text-sm tracking-wide transition-all duration-200 border-b-2 ${
              activeTab === 'overview'
                ? 'text-[#8AFD81] border-[#8AFD81]'
                : 'text-[#64748b] border-transparent hover:text-[#0b1120] hover:border-[#e2e8f0]'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8AFD81]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('mining')}
            className={`relative px-6 py-3.5 font-medium text-sm tracking-wide transition-all duration-200 border-b-2 ${
              activeTab === 'mining'
                ? 'text-[#8AFD81] border-[#8AFD81]'
                : 'text-[#64748b] border-transparent hover:text-[#0b1120] hover:border-[#e2e8f0]'
            }`}
          >
            Bitcoin Mining
            {activeTab === 'mining' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8AFD81]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('electricity')}
            className={`relative px-6 py-3.5 font-medium text-sm tracking-wide transition-all duration-200 border-b-2 ${
              activeTab === 'electricity'
                ? 'text-[#8AFD81] border-[#8AFD81]'
                : 'text-[#64748b] border-transparent hover:text-[#0b1120] hover:border-[#e2e8f0]'
            }`}
          >
            Electricity
            {activeTab === 'electricity' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8AFD81]"></span>
            )}
          </button>
        </div>

        {/* KPI Box - Overview */}
        {activeTab === 'overview' && (
          <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 w-full mb-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Power</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.totalPowerMW.toFixed(1)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">MW</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Hashrate</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.totalHashratePHs.toLocaleString('en-US')}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">PH/s</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Daily BTC Production</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.dailyBTCProduction.toFixed(2)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">BTC</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Global Uptime</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.globalUptime.toFixed(1)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual KPIs - Bitcoin Mining */}
        {activeTab === 'mining' && (
          <div className="space-y-8 mb-8">
            {/* Main Mining Metrics - Circular Progress */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Mining Performance Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                <CircularProgress
                  value={kpis.efficiencyRealVsTheoretical}
                  max={100}
                  size={140}
                  label="Efficiency Real vs Theoretical"
                  unit="%"
                  color="#8AFD81"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-[#8AFD81] mb-1">
                      {kpis.totalHashratePHs.toLocaleString('en-US')}
                    </p>
                    <p className="text-sm text-white/60">PH/s</p>
                    <p className="text-xs text-white/50 mt-2">Total Hashrate</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-[#8AFD81] mb-1">
                      {kpis.dailyBTCProduction.toFixed(2)}
                    </p>
                    <p className="text-sm text-white/60">BTC/day</p>
                    <p className="text-xs text-white/50 mt-2">Daily Production</p>
                  </div>
                </div>
                <CircularProgress
                  value={kpis.networkShare}
                  max={1}
                  size={140}
                  label="Network Share"
                  unit="%"
                  color="#8AFD81"
                />
              </div>
            </div>

            {/* Mining Efficiency & Cost Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">ASIC Efficiency</h4>
                <div className="flex items-center justify-center mb-4">
                  <CircularProgress
                    value={kpis.asicEfficiency}
                    max={30}
                    size={120}
                    label=""
                    unit="J/TH"
                    color="#8AFD81"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/50">Lower is better</p>
                </div>
              </div>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Energy Efficiency</h4>
                <div className="flex items-center justify-center mb-4">
                  <CircularProgress
                    value={kpis.energyEfficiencyBTCPerMW}
                    max={12}
                    size={120}
                    label=""
                    unit="BTC/MW/an"
                    color="#6FD96A"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/50">Top 3 worldwide</p>
                </div>
              </div>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Production Cost</h4>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-[#8AFD81] mb-2">
                    ${kpis.productionCost.toLocaleString('en-US')}
                  </p>
                  <p className="text-sm text-white/60 mb-4">per BTC</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-[#8AFD81] h-2 rounded-full"
                      style={{ width: `${((20000 - kpis.productionCost) / 20000) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2">vs $13,000 avg</p>
                </div>
              </div>
            </div>

            {/* Hashrate & ROI Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartCard title="Hashrate per MW Efficiency">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ name: 'Qatar', value: kpis.hashratePerMW }, { name: 'Industry Avg', value: 9.5 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      <Cell fill="#8AFD81" />
                      <Cell fill="#94a3b8" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm flex flex-col items-center justify-center">
                <h4 className="text-lg font-semibold text-white mb-6">Operational ROI</h4>
                <div className="relative w-48 h-48">
                  <CircularProgress
                    value={kpis.operationalROI * 20}
                    max={100}
                    size={192}
                    label=""
                    unit=""
                    color="#8AFD81"
                    showValue={false}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold text-[#8AFD81]">{kpis.operationalROI.toFixed(1)}x</p>
                    <p className="text-sm text-white/60 mt-2">Return on Investment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Box - Electricity */}
        {activeTab === 'electricity' && (
          <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 w-full mb-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Total Power</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.totalPowerMW.toFixed(1)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">MW</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Consumption (Daily)</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.consumptionMWhPerDay.toLocaleString('en-US')}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">MWh</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Consumption (Annual)</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {(kpis.consumptionMWhPerYear / 1000).toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">GWh</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Global Uptime</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.globalUptime.toFixed(1)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Energy Mix - Hydro</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.energyMixHydro.toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Energy Mix - Surplus</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.energyMixSurplus.toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Energy Sovereignty</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.energySovereignty.toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Average Energy Cost</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    ${kpis.averageEnergyCost.toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">/MWh</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Marginal BTC Cost</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    ${kpis.marginalBTCCost.toLocaleString('en-US')}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">/BTC</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Carbon Intensity</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {kpis.carbonIntensity.toFixed(2)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">tCO2/BTC</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Competitive Advantage</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    -{kpis.competitiveAdvantage.toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">%</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Recovered Energy</h3>
                  <svg className="w-5 h-5 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
                    {(kpis.recoveredEnergyMWh / 1000).toFixed(0)}
                  </p>
                  <span className="text-lg text-white/60 font-medium tracking-wide">GWh/an</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bitcoin Strategic Reserve - Overview */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-[8px] p-8 border border-[#e2e8f0] shadow-sm mb-8 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0b1120] tracking-tight mb-2">Bitcoin Strategic Reserve</h2>
                <p className="text-sm text-[#64748b] tracking-wide">Real-time wallet balance and growth tracking</p>
              </div>
              <div className="text-left sm:text-right bg-[#f8f9fa] rounded-[8px] px-6 py-4 border border-[#e2e8f0]">
                <div className="text-xs text-[#64748b] uppercase tracking-wider mb-2 font-medium">Current Balance</div>
                <div className="text-3xl font-bold text-[#8AFD81] tracking-tight">
                  {walletData ? (
                    <>
                      <span>{walletData.currentBalance.toFixed(4)}</span> <span className="text-lg text-[#64748b] font-medium">BTC</span>
                    </>
                  ) : (
                    <span className="text-lg text-[#64748b]">Loading...</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-semibold text-[#0b1120] mb-6 tracking-wide">Wallet Growth (Last 30 Days)</h3>
                <div className="h-80">
                  {walletChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={walletChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis 
                        stroke="#64748b" 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'BTC', angle: -90, position: 'insideLeft', fill: '#64748b', style: { fontSize: 12 } }}
                        tickFormatter={(value: number) => value.toFixed(2)}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0b1120', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                        formatter={(value: number | string) => {
                          const numValue = typeof value === 'string' ? parseFloat(value) : value;
                          return `${numValue.toFixed(4)} BTC`;
                        }}
                      />
                      <Line type="monotone" dataKey="balance" stroke="#8AFD81" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#64748b]">Loading chart data...</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#0b1120] mb-6 tracking-wide">Global Bitcoin Reserves Comparison</h3>
                <div className="h-80">
                  {countryReservesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={countryReservesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number" 
                          stroke="#64748b" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value: number) => {
                            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                            return value.toFixed(0);
                          }}
                        />
                        <YAxis 
                          dataKey="country" 
                          type="category" 
                          stroke="#64748b" 
                          tick={{ fontSize: 12 }}
                          width={90}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0b1120', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                          formatter={(value: number | string) => {
                            const numValue = typeof value === 'string' ? parseFloat(value) : value;
                            return `${numValue.toLocaleString('en-US', { maximumFractionDigits: 2 })} BTC`;
                          }}
                        />
                        <Bar 
                          dataKey="btc" 
                          radius={[0, 6, 6, 0]}
                        >
                          {countryReservesData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.country === 'Qatar' ? '#8AFD81' : '#94a3b8'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#64748b]">Loading comparison data...</div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-[#64748b]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#8AFD81]"></div>
                    <span>Qatar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[#94a3b8]"></div>
                    <span>Other Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts - Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard title="Total Hashrate (24h)">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hashrateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'PH/s', angle: -90, position: 'insideLeft', fill: '#64748b', style: { fontSize: 12 } }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0b1120', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Total" stroke="#8AFD81" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Electrical Power per Section (24h)">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={powerChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#64748b', style: { fontSize: 12 } }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0b1120', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Section 1" stroke="#8AFD81" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Section 2" stroke="#6FD96A" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Section 3" stroke="#6DD16D" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Section 4" stroke="#6CC744" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}


        {/* Visual KPIs - Electricity */}
        {activeTab === 'electricity' && (
          <div className="space-y-8 mb-8">
            {/* Energy Mix Donut Chart */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Energy Mix & Sovereignty</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Hydro', value: kpis.energyMixHydro },
                          { name: 'Surplus', value: kpis.energyMixSurplus },
                          { name: 'Grid', value: kpis.energyMixGrid },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#8AFD81" />
                        <Cell fill="#6FD96A" />
                        <Cell fill="#94a3b8" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#8AFD81]" />
                        <span className="text-white/70">Hydro</span>
                      </div>
                      <span className="text-white font-semibold">{kpis.energyMixHydro.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#6FD96A]" />
                        <span className="text-white/70">Surplus</span>
                      </div>
                      <span className="text-white font-semibold">{kpis.energyMixSurplus.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                        <span className="text-white/70">Grid</span>
                      </div>
                      <span className="text-white font-semibold">{kpis.energyMixGrid.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Energy Sovereignty</span>
                      <span className="text-2xl font-bold text-[#8AFD81]">{kpis.energySovereignty.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-[#8AFD81] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${kpis.energySovereignty}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Global Uptime</span>
                      <span className="text-2xl font-bold text-[#8AFD81]">{kpis.globalUptime.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-[#6FD96A] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${kpis.globalUptime}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Recovered Energy</span>
                      <span className="text-2xl font-bold text-[#8AFD81]">{(kpis.recoveredEnergyMWh / 1000).toFixed(0)} GWh</span>
                    </div>
                    <p className="text-xs text-white/50">Energy otherwise lost (curtailment)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Power & Consumption Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Total Power</h4>
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-bold text-[#8AFD81] mb-2">{kpis.totalPowerMW.toFixed(1)}</p>
                  <p className="text-sm text-white/60">MW</p>
                </div>
              </div>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Daily Consumption</h4>
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-bold text-[#8AFD81] mb-2">{kpis.consumptionMWhPerDay.toLocaleString('en-US')}</p>
                  <p className="text-sm text-white/60">MWh</p>
                </div>
              </div>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Annual Consumption</h4>
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-bold text-[#8AFD81] mb-2">{(kpis.consumptionMWhPerYear / 1000).toFixed(0)}</p>
                  <p className="text-sm text-white/60">GWh</p>
                </div>
              </div>
            </div>

            {/* Cost & Carbon Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Average Energy Cost</h4>
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-bold text-[#8AFD81] mb-2">${kpis.averageEnergyCost.toFixed(0)}</p>
                  <p className="text-sm text-white/60 mb-4">per MWh</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-[#8AFD81] h-2 rounded-full"
                      style={{ width: `${((120 - kpis.averageEnergyCost) / 120) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2">vs $130 avg worldwide</p>
                </div>
              </div>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Marginal BTC Cost</h4>
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-bold text-[#8AFD81] mb-2">${kpis.marginalBTCCost.toLocaleString('en-US')}</p>
                  <p className="text-sm text-white/60 mb-4">per BTC</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-[#6FD96A] h-2 rounded-full"
                      style={{ width: `${((13000 - kpis.marginalBTCCost) / 13000) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2">40% below world avg</p>
                </div>
              </div>

              <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
                <h4 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Carbon Intensity</h4>
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-bold text-[#8AFD81] mb-2">{kpis.carbonIntensity.toFixed(2)}</p>
                  <p className="text-sm text-white/60 mb-4">tCO2/BTC</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-[#6DD16D] h-2 rounded-full"
                      style={{ width: `${((0.38 - kpis.carbonIntensity) / 0.38) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2">60% below world avg</p>
                </div>
              </div>
            </div>

            {/* Competitive Advantage Visual */}
            <div className="bg-[#0a0b0d] rounded-[8px] p-8 border border-white/5 hover:border-[#8AFD81]/20 transition-all duration-200 shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Competitive Advantage</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Cost Comparison (USD/BTC)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Qatar', cost: kpis.marginalBTCCost },
                      { name: 'World Avg', cost: 13000 },
                      { name: 'USA', cost: 12000 },
                      { name: 'China', cost: 11000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                      <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                        <Cell fill="#8AFD81" />
                        <Cell fill="#94a3b8" />
                        <Cell fill="#94a3b8" />
                        <Cell fill="#94a3b8" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <div className="flex flex-col items-center justify-center bg-white/5 rounded-[8px] p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Advantage</h4>
                  <div className="relative w-48 h-48 mb-4">
                    <CircularProgress
                      value={kpis.competitiveAdvantage}
                      max={100}
                      size={192}
                      label=""
                      unit=""
                      color="#8AFD81"
                      showValue={false}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-5xl font-bold text-[#8AFD81]">-{kpis.competitiveAdvantage.toFixed(0)}%</p>
                      <p className="text-sm text-white/60 mt-2">vs World Average</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 text-center">Lower production cost</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

