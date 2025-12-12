export interface CoolingModule {
  id: string;
  type: string;
  coolingCapacitykW: number;
  flowRate: string;
  temperatureIn: number;
  temperatureOut: number;
  status: 'OK' | 'Warning' | 'Maintenance';
  efficiency: number;
}

export interface MiningContainer {
  id: string;
  name: string;
  type: string;
  capacityMW: number;
  machinesCount: number;
  coolingSystem: 'Hydro' | 'Immersion' | 'Air';
  section: string;
  status: 'In Service' | 'Maintenance' | 'Standby';
  coolingModule: CoolingModule;
  // Données de consommation et production
  powerConsumptionMW: number;
  hashrateTHs: number;
  dailyProductionBTC: number;
  efficiencyJTH: number;
  uptime: number; // Pourcentage d'uptime
  activeMachines: number;
}

export interface ASICMachine {
  brand: string;
  model: string;
  batch: string;
  hashrateTHs: number;
  powerConsumptionkW: number;
  efficiencyJTH: number;
  totalInstalled: number;
  activeCount: number;
  installationDate?: string;
}

export interface CoolingSystem {
  id: string;
  type: string;
  thermalCapacityMW: number;
  sectionsCovered: string[];
  containersCovered: string[];
  notes: string;
}

export interface Transformer {
  id: string;
  name: string;
  powerMVA: number;
  voltagePrimary: string;
  voltageSecondary: string;
  section: string;
  containersConnected: string[];
}

export interface MainSubstation {
  name: string;
  totalCapacityMW: number;
  inputVoltage: string;
  outputVoltage: string;
  feedersCount: number;
  sectionsConnected: string[];
}

export const mainSubstation: MainSubstation = {
  name: 'Main Substation 132/33 kV',
  totalCapacityMW: 120,
  inputVoltage: '132 kV',
  outputVoltage: '33 kV',
  feedersCount: 4,
  sectionsConnected: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
};

// Fonction de hash simple pour générer des valeurs déterministes basées sur une chaîne
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Fonction pour générer un nombre pseudo-aléatoire déterministe entre 0 et 1
function seededRandom(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export const miningContainers: MiningContainer[] = [];
for (let s = 1; s <= 4; s++) {
  for (let c = 1; c <= 8; c++) {
    // Génération d'un module de refroidissement unique pour chaque conteneur
    const coolingModuleId = `CM-${s}-${c}`;
    const containerId = `C${s}-${c}`;
    const seed = hashString(containerId);
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);
    const r4 = seededRandom(seed + 3);
    const r5 = seededRandom(seed + 4);
    const r6 = seededRandom(seed + 5);
    
    const coolingModule: CoolingModule = {
      id: coolingModuleId,
      type: 'Hydro Cooling Module',
      coolingCapacitykW: 3200 + Math.floor(r1 * 100), // Entre 3200 et 3300 kW
      flowRate: `${150 + Math.floor(r2 * 50)} L/min`, // Entre 150 et 200 L/min
      temperatureIn: 25 + Math.floor(r3 * 5), // Entre 25 et 30°C
      temperatureOut: 18 + Math.floor(r4 * 3), // Entre 18 et 21°C
      status: r5 > 0.15 ? 'OK' : (r6 > 0.5 ? 'Warning' : 'Maintenance'), // 85% OK, 7.5% Warning, 7.5% Maintenance
      efficiency: 85 + Math.floor(r1 * 10), // Entre 85% et 95%
    };

    // Calcul des données de production basées sur les machines ASIC
    const machineHashrate = 335; // TH/s par machine
    const machinePower = 5.36; // kW par machine
    const r7 = seededRandom(seed + 6);
    const r8 = seededRandom(seed + 7);
    const activeMachines = Math.floor(180 * (0.95 + r7 * 0.05)); // 95-100% des machines actives
    const totalHashrate = activeMachines * machineHashrate; // TH/s total
    const powerConsumption = activeMachines * machinePower; // kW
    const efficiency = 16; // J/TH
    // Production BTC/jour approximative (basée sur hashrate et difficulté estimée)
    const dailyProduction = (totalHashrate / 1000000) * 0.000125; // Approximation simplifiée

    miningContainers.push({
      id: containerId,
      name: `Container ${s}-${c}`,
      type: "40' Hydro Bitmain",
      capacityMW: 3.2,
      machinesCount: 180,
      coolingSystem: 'Hydro',
      section: `Section ${s}`,
      status: 'In Service',
      coolingModule: coolingModule,
      powerConsumptionMW: powerConsumption / 1000, // Conversion en MW
      hashrateTHs: totalHashrate,
      dailyProductionBTC: dailyProduction,
      efficiencyJTH: efficiency,
      uptime: 95 + r8 * 5, // 95-100% uptime
      activeMachines: activeMachines,
    });
  }
}

export const asicMachines: ASICMachine[] = [
  {
    brand: 'Bitmain',
    model: 'Antminer S21 Hydro',
    batch: 'Section 1',
    hashrateTHs: 335,
    powerConsumptionkW: 5.36,
    efficiencyJTH: 16,
    totalInstalled: 1440,
    activeCount: 1420,
    installationDate: '2024-01-15',
  },
  {
    brand: 'Bitmain',
    model: 'Antminer S21 Hydro',
    batch: 'Section 2',
    hashrateTHs: 335,
    powerConsumptionkW: 5.36,
    efficiencyJTH: 16,
    totalInstalled: 1440,
    activeCount: 1415,
    installationDate: '2024-02-20',
  },
  {
    brand: 'Bitmain',
    model: 'Antminer S21 Hydro',
    batch: 'Section 3',
    hashrateTHs: 335,
    powerConsumptionkW: 5.36,
    efficiencyJTH: 16,
    totalInstalled: 1440,
    activeCount: 1430,
    installationDate: '2024-03-10',
  },
  {
    brand: 'Bitmain',
    model: 'Antminer S21 Hydro',
    batch: 'Section 4',
    hashrateTHs: 335,
    powerConsumptionkW: 5.36,
    efficiencyJTH: 16,
    totalInstalled: 1440,
    activeCount: 1415,
    installationDate: '2024-04-05',
  },
];

export const coolingSystems: CoolingSystem[] = [
  {
    id: 'CS1',
    type: 'Hydro Cooling System',
    thermalCapacityMW: 25,
    sectionsCovered: ['Section 1'],
    containersCovered: miningContainers.filter(c => c.section === 'Section 1').map(c => c.id),
    notes: 'Liquid cooling with heat exchangers',
  },
  {
    id: 'CS2',
    type: 'Hydro Cooling System',
    thermalCapacityMW: 25,
    sectionsCovered: ['Section 2'],
    containersCovered: miningContainers.filter(c => c.section === 'Section 2').map(c => c.id),
    notes: 'Liquid cooling with heat exchangers',
  },
  {
    id: 'CS3',
    type: 'Hydro Cooling System',
    thermalCapacityMW: 25,
    sectionsCovered: ['Section 3'],
    containersCovered: miningContainers.filter(c => c.section === 'Section 3').map(c => c.id),
    notes: 'Liquid cooling with heat exchangers',
  },
  {
    id: 'CS4',
    type: 'Hydro Cooling System',
    thermalCapacityMW: 25,
    sectionsCovered: ['Section 4'],
    containersCovered: miningContainers.filter(c => c.section === 'Section 4').map(c => c.id),
    notes: 'Liquid cooling with heat exchangers',
  },
];

// Fonction helper pour trouver un conteneur par ID
export function getContainerById(id: string): MiningContainer | undefined {
  return miningContainers.find(container => container.id === id);
}

export const transformers: Transformer[] = [
  {
    id: 'T1-1',
    name: 'Transformer 1-1',
    powerMVA: 4,
    voltagePrimary: '33 kV',
    voltageSecondary: '0.4 kV',
    section: 'Section 1',
    containersConnected: ['C1-1', 'C1-2'],
  },
  {
    id: 'T1-2',
    name: 'Transformer 1-2',
    powerMVA: 4,
    voltagePrimary: '33 kV',
    voltageSecondary: '0.4 kV',
    section: 'Section 1',
    containersConnected: ['C1-3', 'C1-4'],
  },
  {
    id: 'T1-3',
    name: 'Transformer 1-3',
    powerMVA: 4,
    voltagePrimary: '33 kV',
    voltageSecondary: '0.4 kV',
    section: 'Section 1',
    containersConnected: ['C1-5', 'C1-6'],
  },
  {
    id: 'T1-4',
    name: 'Transformer 1-4',
    powerMVA: 4,
    voltagePrimary: '33 kV',
    voltageSecondary: '0.4 kV',
    section: 'Section 1',
    containersConnected: ['C1-7', 'C1-8'],
  },
];

