export interface RiskMetric {
  id: string;
  productId: string;
  productName: string;
  type: 'market' | 'mining' | 'bouquet';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  beta: number;
  var95: number; // Value at Risk 95%
  stressTestScore: number; // 0-100
  lastUpdated: string;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  type: 'regulatory' | 'operational' | 'legal' | 'audit';
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending';
  jurisdiction: string;
  productId?: string;
  productName?: string;
  mandateId?: string;
  mandateName?: string;
  description: string;
  lastChecked: string;
  nextReview: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskAlert {
  id: string;
  title: string;
  type: 'risk' | 'compliance' | 'operational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved' | 'dismissed';
  productId?: string;
  productName?: string;
  mandateId?: string;
  mandateName?: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
}

export const mockRiskMetrics: RiskMetric[] = [
  {
    id: 'RM1',
    productId: 'A1',
    productName: 'BTC Core Market',
    type: 'market',
    riskLevel: 'medium',
    volatility: 24.5,
    maxDrawdown: -18.2,
    sharpeRatio: 1.42,
    beta: 0.95,
    var95: -12.5,
    stressTestScore: 72,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'RM2',
    productId: 'B1',
    productName: 'BTC Mining Reserve',
    type: 'mining',
    riskLevel: 'medium',
    volatility: 26.2,
    maxDrawdown: -19.5,
    sharpeRatio: 1.38,
    beta: 1.05,
    var95: -14.2,
    stressTestScore: 68,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'RM3',
    productId: 'C1',
    productName: 'Sovereign Core BTC',
    type: 'bouquet',
    riskLevel: 'low',
    volatility: 22.8,
    maxDrawdown: -16.5,
    sharpeRatio: 1.45,
    beta: 0.88,
    var95: -11.2,
    stressTestScore: 78,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'RM4',
    productId: 'B4',
    productName: 'Mining Participation Notes',
    type: 'mining',
    riskLevel: 'high',
    volatility: 32.5,
    maxDrawdown: -25.8,
    sharpeRatio: 1.25,
    beta: 1.35,
    var95: -18.5,
    stressTestScore: 58,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    id: 'RM5',
    productId: 'A2',
    productName: 'Multi-Asset Crypto Index',
    type: 'market',
    riskLevel: 'medium',
    volatility: 28.3,
    maxDrawdown: -21.2,
    sharpeRatio: 1.35,
    beta: 1.12,
    var95: -15.8,
    stressTestScore: 65,
    lastUpdated: '2024-01-15T10:00:00Z'
  }
];

export const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: 'CC1',
    name: 'Qatar Financial Centre Regulatory Compliance',
    type: 'regulatory',
    status: 'compliant',
    jurisdiction: 'Qatar',
    productId: 'A1',
    productName: 'BTC Core Market',
    description: 'Product complies with QFC regulatory requirements for digital asset management.',
    lastChecked: '2024-01-10T09:00:00Z',
    nextReview: '2024-04-10T09:00:00Z',
    severity: 'low'
  },
  {
    id: 'CC2',
    name: 'UAE Securities and Commodities Authority',
    type: 'regulatory',
    status: 'compliant',
    jurisdiction: 'UAE',
    productId: 'A3',
    productName: 'ETF Mirrors',
    description: 'Compliant with SCA regulations for ETF mirror products.',
    lastChecked: '2024-01-08T10:00:00Z',
    nextReview: '2024-04-08T10:00:00Z',
    severity: 'low'
  },
  {
    id: 'CC3',
    name: 'Mining Pool Operational Risk Assessment',
    type: 'operational',
    status: 'warning',
    jurisdiction: 'Global',
    productId: 'B1',
    productName: 'BTC Mining Reserve',
    description: 'One mining pool showing increased latency. Monitoring required.',
    lastChecked: '2024-01-15T08:00:00Z',
    nextReview: '2024-01-22T08:00:00Z',
    severity: 'medium'
  },
  {
    id: 'CC4',
    name: 'KYC/AML Compliance - Mandate M1',
    type: 'legal',
    status: 'compliant',
    jurisdiction: 'Qatar',
    mandateId: 'M1',
    mandateName: 'Qatar Sovereign Wealth Fund',
    description: 'All KYC/AML checks completed and up to date.',
    lastChecked: '2024-01-12T14:00:00Z',
    nextReview: '2024-07-12T14:00:00Z',
    severity: 'low'
  },
  {
    id: 'CC5',
    name: 'Annual Audit - Portfolio Holdings',
    type: 'audit',
    status: 'pending',
    jurisdiction: 'Global',
    description: 'Annual audit of all portfolio holdings scheduled for Q1 2024.',
    lastChecked: '2023-12-31T00:00:00Z',
    nextReview: '2024-03-31T00:00:00Z',
    severity: 'medium'
  },
  {
    id: 'CC6',
    name: 'Bahrain Central Bank Reporting',
    type: 'regulatory',
    status: 'non-compliant',
    jurisdiction: 'Bahrain',
    productId: 'A4',
    productName: 'Market-Based Yield Products',
    description: 'Monthly reporting submission delayed. Action required.',
    lastChecked: '2024-01-14T16:00:00Z',
    nextReview: '2024-01-16T16:00:00Z',
    severity: 'high'
  }
];

export const mockRiskAlerts: RiskAlert[] = [
  {
    id: 'RA1',
    title: 'High Volatility Detected - Mining Participation Notes',
    type: 'risk',
    severity: 'high',
    status: 'open',
    productId: 'B4',
    productName: 'Mining Participation Notes',
    description: 'Volatility has exceeded 30% threshold. Review risk parameters.',
    createdAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'RA2',
    title: 'Mining Pool Connectivity Issue',
    type: 'operational',
    severity: 'medium',
    status: 'acknowledged',
    productId: 'B1',
    productName: 'BTC Mining Reserve',
    description: 'Antpool showing intermittent connectivity. Monitoring in progress.',
    createdAt: '2024-01-15T08:15:00Z'
  },
  {
    id: 'RA3',
    title: 'Regulatory Reporting Overdue - Bahrain',
    type: 'compliance',
    severity: 'high',
    status: 'open',
    productId: 'A4',
    productName: 'Market-Based Yield Products',
    description: 'Monthly regulatory reporting to Bahrain Central Bank is overdue.',
    createdAt: '2024-01-14T18:00:00Z'
  },
  {
    id: 'RA4',
    title: 'Stress Test Score Below Threshold',
    type: 'risk',
    severity: 'medium',
    status: 'resolved',
    productId: 'B4',
    productName: 'Mining Participation Notes',
    description: 'Stress test score improved to acceptable level after rebalancing.',
    createdAt: '2024-01-10T10:00:00Z',
    resolvedAt: '2024-01-12T14:00:00Z'
  },
  {
    id: 'RA5',
    title: 'Drawdown Warning - Multi-Asset Index',
    type: 'risk',
    severity: 'medium',
    status: 'acknowledged',
    productId: 'A2',
    productName: 'Multi-Asset Crypto Index',
    description: 'Current drawdown approaching 20% threshold. Monitor closely.',
    createdAt: '2024-01-13T11:00:00Z'
  }
];

export function getRiskMetricById(id: string): RiskMetric | undefined {
  return mockRiskMetrics.find(m => m.id === id);
}

export function getComplianceCheckById(id: string): ComplianceCheck | undefined {
  return mockComplianceChecks.find(c => c.id === id);
}

export function getRiskAlertById(id: string): RiskAlert | undefined {
  return mockRiskAlerts.find(a => a.id === id);
}



