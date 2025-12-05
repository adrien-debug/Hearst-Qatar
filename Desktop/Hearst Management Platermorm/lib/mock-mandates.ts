export interface Mandate {
  id: string;
  name: string;
  clientName: string;
  type: 'sovereign' | 'institutional' | 'corporate' | 'family-office';
  status: 'active' | 'pending' | 'closed';
  aum: number;
  inceptionDate: string;
  ytdPerformance: number;
  products: string[]; // Product IDs
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  jurisdiction: string;
  manager: string;
}

export interface Portfolio {
  id: string;
  name: string;
  mandateId: string;
  allocation: {
    productId: string;
    productName: string;
    allocationPercent: number;
    value: number;
  }[];
  totalValue: number;
  ytdPerformance: number;
  lastRebalanced: string;
}

export const mockMandates: Mandate[] = [
  {
    id: 'M1',
    name: 'Qatar Sovereign Wealth Fund - Core Allocation',
    clientName: 'Qatar Investment Authority',
    type: 'sovereign',
    status: 'active',
    aum: 500000000,
    inceptionDate: '2023-01-15',
    ytdPerformance: 19.8,
    products: ['A1', 'A3', 'B1', 'C1'],
    riskProfile: 'moderate',
    jurisdiction: 'Qatar',
    manager: 'Sarah Al-Mansoori'
  },
  {
    id: 'M2',
    name: 'UAE Institutional Core Strategy',
    clientName: 'Abu Dhabi Investment Council',
    type: 'institutional',
    status: 'active',
    aum: 320000000,
    inceptionDate: '2023-03-20',
    ytdPerformance: 21.2,
    products: ['A2', 'B2', 'C2'],
    riskProfile: 'moderate',
    jurisdiction: 'UAE',
    manager: 'Ahmed Bin Rashid'
  },
  {
    id: 'M3',
    name: 'Bahrain Corporate Treasury',
    clientName: 'Gulf Financial Services Group',
    type: 'corporate',
    status: 'active',
    aum: 85000000,
    inceptionDate: '2023-05-10',
    ytdPerformance: 17.5,
    products: ['A1', 'A4', 'B3'],
    riskProfile: 'conservative',
    jurisdiction: 'Bahrain',
    manager: 'Fatima Al-Khalifa'
  },
  {
    id: 'M4',
    name: 'High Net Worth Family Office',
    clientName: 'Al-Thani Family Office',
    type: 'family-office',
    status: 'active',
    aum: 180000000,
    inceptionDate: '2023-06-18',
    ytdPerformance: 23.1,
    products: ['A2', 'B4', 'C3'],
    riskProfile: 'aggressive',
    jurisdiction: 'Qatar',
    manager: 'Mohammed Al-Thani'
  },
  {
    id: 'M5',
    name: 'Saudi Institutional Diversified',
    clientName: 'Saudi Public Investment Fund',
    type: 'institutional',
    status: 'pending',
    aum: 750000000,
    inceptionDate: '2024-01-10',
    ytdPerformance: 0,
    products: ['A1', 'A2', 'A3', 'B1', 'B2', 'C4'],
    riskProfile: 'moderate',
    jurisdiction: 'Saudi Arabia',
    manager: 'Khalid Al-Saud'
  },
  {
    id: 'M6',
    name: 'Kuwait Sovereign Reserve',
    clientName: 'Kuwait Investment Authority',
    type: 'sovereign',
    status: 'active',
    aum: 420000000,
    inceptionDate: '2023-08-25',
    ytdPerformance: 18.9,
    products: ['A3', 'B1', 'C1', 'C4'],
    riskProfile: 'conservative',
    jurisdiction: 'Kuwait',
    manager: 'Noura Al-Sabah'
  }
];

export const mockPortfolios: Portfolio[] = [
  {
    id: 'P1',
    name: 'Qatar Core - Primary Portfolio',
    mandateId: 'M1',
    allocation: [
      { productId: 'A1', productName: 'BTC Core Market', allocationPercent: 40, value: 200000000 },
      { productId: 'A3', productName: 'ETF Mirrors', allocationPercent: 30, value: 150000000 },
      { productId: 'B1', productName: 'BTC Mining Reserve', allocationPercent: 20, value: 100000000 },
      { productId: 'C1', productName: 'Sovereign Core BTC', allocationPercent: 10, value: 50000000 }
    ],
    totalValue: 500000000,
    ytdPerformance: 19.8,
    lastRebalanced: '2024-01-15'
  },
  {
    id: 'P2',
    name: 'UAE Growth Strategy',
    mandateId: 'M2',
    allocation: [
      { productId: 'A2', productName: 'Multi-Asset Crypto Index', allocationPercent: 35, value: 112000000 },
      { productId: 'B2', productName: 'Mining-Backed Yield', allocationPercent: 40, value: 128000000 },
      { productId: 'C2', productName: 'Balanced Mining Allocation', allocationPercent: 25, value: 80000000 }
    ],
    totalValue: 320000000,
    ytdPerformance: 21.2,
    lastRebalanced: '2024-02-01'
  },
  {
    id: 'P3',
    name: 'Bahrain Conservative Treasury',
    mandateId: 'M3',
    allocation: [
      { productId: 'A1', productName: 'BTC Core Market', allocationPercent: 50, value: 42500000 },
      { productId: 'A4', productName: 'Market-Based Yield Products', allocationPercent: 30, value: 25500000 },
      { productId: 'B3', productName: 'Mining-Secured Collateral Pool', allocationPercent: 20, value: 17000000 }
    ],
    totalValue: 85000000,
    ytdPerformance: 17.5,
    lastRebalanced: '2024-01-20'
  }
];

export function getMandateById(id: string): Mandate | undefined {
  return mockMandates.find(m => m.id === id);
}

export function getPortfoliosByMandateId(mandateId: string): Portfolio[] {
  return mockPortfolios.filter(p => p.mandateId === mandateId);
}



