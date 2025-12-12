export interface MainKPIs {
  totalPowerMW: number;
  powerPerSectionMW: number;
  totalHashratePHs: number;
  dailyBTCProduction: number;
  globalUptime: number;
  energyEfficiency: number;
  // Mining KPIs
  hashratePerMW: number; // PH/s/MW
  efficiencyRealVsTheoretical: number; // %
  asicEfficiency: number; // J/TH
  energyEfficiencyBTCPerMW: number; // BTC/MW/an
  networkShare: number; // % du réseau
  productionCost: number; // USD/BTC
  operationalROI: number; // ratio
  // Electricity KPIs
  consumptionMWhPerDay: number;
  consumptionMWhPerYear: number;
  energyMixHydro: number; // %
  energyMixSurplus: number; // %
  energyMixGrid: number; // %
  averageEnergyCost: number; // USD/MWh
  marginalBTCCost: number; // USD/BTC
  carbonIntensity: number; // tCO2/BTC
  utilizationRate: number; // %
  recoveredEnergyMWh: number; // MWh/an (curtailment)
  competitiveAdvantage: number; // % vs moyenne mondiale
  energySovereignty: number; // %
}

export interface SectionStatus {
  id: string;
  name: string;
  powerMW: number;
  hashratePHs: number;
  temperatureC: number;
  uptime: number;
  status: 'OK' | 'Warning' | 'Off';
}

export interface MiningOutput {
  date: string;
  btcProduced: number;
  revenueUSD: number;
  btcPrice: number;
}

export interface WalletTransaction {
  date: string;
  btcReceived: number;
  txHash: string;
  confirmations: number;
}

export interface WalletData {
  currentBalance: number;
  totalReceived: number;
  transactions: WalletTransaction[];
}

export const mainKPIs: MainKPIs = {
  totalPowerMW: 98.5,
  powerPerSectionMW: 24.6,
  totalHashratePHs: 1020,
  dailyBTCProduction: 2.45,
  globalUptime: 99.2,
  energyEfficiency: 0.38,
  // Mining KPIs
  hashratePerMW: 10.35, // 1020 PH/s / 98.5 MW
  efficiencyRealVsTheoretical: 98.5, // %
  asicEfficiency: 21.0, // J/TH
  energyEfficiencyBTCPerMW: 9.0, // BTC/MW/an (2.45 BTC/jour * 365 / 100 MW)
  networkShare: 0.15, // % du réseau (~600 EH/s réseau, 1.02 PH/s Qatar)
  productionCost: 10000, // USD/BTC
  operationalROI: 4.2, // ratio (à $42k/BTC, coût $10k/BTC)
  // Electricity KPIs
  consumptionMWhPerDay: 2400, // 100 MW * 24h
  consumptionMWhPerYear: 876000, // 100 MW * 8760h * 99.2% uptime
  energyMixHydro: 80, // %
  energyMixSurplus: 15, // %
  energyMixGrid: 5, // %
  averageEnergyCost: 80, // USD/MWh ($0.08/kWh)
  marginalBTCCost: 8000, // USD/BTC (coût énergétique uniquement)
  carbonIntensity: 0.15, // tCO2/BTC
  utilizationRate: 99.2, // % (identique à uptime)
  recoveredEnergyMWh: 131400, // MWh/an (15% de 876,000)
  competitiveAdvantage: 40, // % (coût 40% inférieur à moyenne mondiale)
  energySovereignty: 95, // % (80% hydro + 15% surplus)
};

export const sectionsStatus: SectionStatus[] = [
  { id: 'S1', name: 'Section 1', powerMW: 24.8, hashratePHs: 255, temperatureC: 42, uptime: 99.5, status: 'OK' },
  { id: 'S2', name: 'Section 2', powerMW: 24.5, hashratePHs: 252, temperatureC: 41, uptime: 99.1, status: 'OK' },
  { id: 'S3', name: 'Section 3', powerMW: 24.7, hashratePHs: 256, temperatureC: 43, uptime: 98.8, status: 'Warning' },
  { id: 'S4', name: 'Section 4', powerMW: 24.5, hashratePHs: 257, temperatureC: 40, uptime: 99.4, status: 'OK' },
];

export function generatePowerData() {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const date = new Date();
    date.setHours(date.getHours() - i);
    data.push({
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      'Section 1': 24.5 + Math.random() * 1.5,
      'Section 2': 24.3 + Math.random() * 1.5,
      'Section 3': 24.6 + Math.random() * 1.5,
      'Section 4': 24.4 + Math.random() * 1.5,
      total: 98 + Math.random() * 6,
    });
  }
  return data;
}

export function generateHashrateData() {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const date = new Date();
    date.setHours(date.getHours() - i);
    data.push({
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      Total: 1015 + Math.random() * 20,
    });
  }
  return data;
}

export function generateMiningOutput(): MiningOutput[] {
  const output = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const btcProduced = 2.2 + Math.random() * 0.6;
    const btcPrice = 42000 + Math.random() * 5000;
    output.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      btcProduced,
      revenueUSD: btcProduced * btcPrice,
      btcPrice,
    });
  }
  return output;
}

export function generateWalletData(): WalletData {
  const transactions: WalletTransaction[] = [];
  let cumulativeBalance = 1250; // Starting balance
  
  // Generate last 30 days of transactions
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const btcReceived = 2.8 + Math.random() * 0.4; // Around 3 BTC per day
    cumulativeBalance += btcReceived;
    
    transactions.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      btcReceived: Number(btcReceived.toFixed(4)),
      txHash: `0x${Math.random().toString(16).substr(2, 16)}...${Math.random().toString(16).substr(2, 8)}`,
      confirmations: Math.floor(Math.random() * 3) + 3, // 3-5 confirmations
    });
  }
  
  return {
    currentBalance: Number(cumulativeBalance.toFixed(4)),
    totalReceived: Number((cumulativeBalance - 1250).toFixed(4)),
    transactions: transactions.reverse(),
  };
}

export function generateWalletChartData() {
  const data = [];
  let cumulativeBalance = 1250;
  
  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dailyBTC = 2.8 + Math.random() * 0.4;
    cumulativeBalance += dailyBTC;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Number(cumulativeBalance.toFixed(2)),
      dailyReceived: Number(dailyBTC.toFixed(4)),
    });
  }
  
  return data;
}

export interface CountryBitcoinReserve {
  country: string;
  btc: number;
}

export function generateCountryReservesComparison(qatarBalance: number): CountryBitcoinReserve[] {
  // Données basées sur les réserves Bitcoin connues des pays (approximatives)
  // Le Qatar sera ajouté avec sa balance actuelle
  const countries: CountryBitcoinReserve[] = [
    { country: 'USA', btc: 207000 }, // États-Unis
    { country: 'China', btc: 194000 }, // Chine
    { country: 'El Salvador', btc: 5689 }, // El Salvador
    { country: 'Ukraine', btc: 46351 }, // Ukraine
    { country: 'Qatar', btc: qatarBalance }, // Qatar - balance actuelle
    { country: 'Germany', btc: 50400 }, // Allemagne
    { country: 'Canada', btc: 3364 }, // Canada
    { country: 'UK', btc: 6151 }, // Royaume-Uni
  ];
  
  // Trier par ordre décroissant de BTC
  return countries.sort((a, b) => b.btc - a.btc);
}

