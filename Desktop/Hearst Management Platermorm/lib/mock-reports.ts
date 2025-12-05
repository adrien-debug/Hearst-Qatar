export interface Report {
  id: string;
  name: string;
  type: 'performance' | 'risk' | 'compliance' | 'operational' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on-demand';
  status: 'scheduled' | 'generating' | 'completed' | 'failed';
  lastGenerated?: string;
  nextGeneration?: string;
  productId?: string;
  productName?: string;
  mandateId?: string;
  mandateName?: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  size?: number; // in KB
  recipient?: string;
  description: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: Report['type'];
  description: string;
  defaultFrequency: Report['frequency'];
  availableFormats: Report['format'][];
}

export const mockReports: Report[] = [
  {
    id: 'R1',
    name: 'Monthly Performance Report - All Products',
    type: 'performance',
    frequency: 'monthly',
    status: 'completed',
    lastGenerated: '2024-01-01T00:00:00Z',
    nextGeneration: '2024-02-01T00:00:00Z',
    format: 'pdf',
    size: 2450,
    recipient: 'management@hearth.com',
    description: 'Comprehensive monthly performance report covering all products with YTD metrics, returns, and benchmarks.'
  },
  {
    id: 'R2',
    name: 'Weekly Risk Metrics Dashboard',
    type: 'risk',
    frequency: 'weekly',
    status: 'completed',
    lastGenerated: '2024-01-15T09:00:00Z',
    nextGeneration: '2024-01-22T09:00:00Z',
    format: 'excel',
    size: 890,
    recipient: 'risk@hearth.com',
    description: 'Weekly risk metrics including volatility, VaR, stress test scores, and drawdown analysis.'
  },
  {
    id: 'R3',
    name: 'Qatar Sovereign Fund - Quarterly Report',
    type: 'custom',
    frequency: 'quarterly',
    status: 'scheduled',
    lastGenerated: '2023-12-31T00:00:00Z',
    nextGeneration: '2024-03-31T00:00:00Z',
    format: 'pdf',
    size: 3200,
    mandateId: 'M1',
    mandateName: 'Qatar Sovereign Wealth Fund',
    recipient: 'client@qia.qa',
    description: 'Quarterly client report for Qatar Sovereign Wealth Fund with detailed portfolio performance and allocations.'
  },
  {
    id: 'R4',
    name: 'Daily Execution Summary',
    type: 'operational',
    frequency: 'daily',
    status: 'generating',
    lastGenerated: '2024-01-14T18:00:00Z',
    nextGeneration: '2024-01-15T18:00:00Z',
    format: 'csv',
    size: 125,
    recipient: 'operations@hearth.com',
    description: 'Daily summary of all trade executions, venues, and execution metrics.'
  },
  {
    id: 'R5',
    name: 'Compliance Status Report - UAE',
    type: 'compliance',
    frequency: 'monthly',
    status: 'completed',
    lastGenerated: '2024-01-10T10:00:00Z',
    nextGeneration: '2024-02-10T10:00:00Z',
    format: 'pdf',
    size: 1560,
    recipient: 'compliance@hearth.com',
    description: 'Monthly compliance status report for all UAE-regulated products and mandates.'
  },
  {
    id: 'R6',
    name: 'BTC Mining Reserve - Performance Analysis',
    type: 'performance',
    frequency: 'on-demand',
    status: 'completed',
    lastGenerated: '2024-01-12T14:30:00Z',
    format: 'excel',
    size: 2100,
    productId: 'B1',
    productName: 'BTC Mining Reserve',
    recipient: 'analytics@hearth.com',
    description: 'Detailed performance analysis of BTC Mining Reserve product including mining pool contributions.'
  },
  {
    id: 'R7',
    name: 'Annual Regulatory Filing - Bahrain',
    type: 'compliance',
    frequency: 'annual',
    status: 'scheduled',
    lastGenerated: '2023-12-31T00:00:00Z',
    nextGeneration: '2024-12-31T00:00:00Z',
    format: 'pdf',
    size: 4500,
    recipient: 'regulatory@cbb.gov.bh',
    description: 'Annual regulatory filing required by Bahrain Central Bank for all Bahrain-regulated products.'
  },
  {
    id: 'R8',
    name: 'Real-time Risk Alerts Export',
    type: 'risk',
    frequency: 'on-demand',
    status: 'completed',
    lastGenerated: '2024-01-15T11:00:00Z',
    format: 'json',
    size: 45,
    recipient: 'risk@hearth.com',
    description: 'Real-time export of all active risk alerts in JSON format for system integration.'
  }
];

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'T1',
    name: 'Standard Performance Report',
    type: 'performance',
    description: 'Standard monthly performance report template with KPIs, returns, and benchmarks.',
    defaultFrequency: 'monthly',
    availableFormats: ['pdf', 'excel']
  },
  {
    id: 'T2',
    name: 'Risk Metrics Dashboard',
    type: 'risk',
    description: 'Comprehensive risk metrics dashboard with volatility, VaR, and stress test results.',
    defaultFrequency: 'weekly',
    availableFormats: ['excel', 'pdf', 'csv']
  },
  {
    id: 'T3',
    name: 'Client Portfolio Report',
    type: 'custom',
    description: 'Customizable client-facing portfolio report with allocations and performance.',
    defaultFrequency: 'quarterly',
    availableFormats: ['pdf', 'excel']
  },
  {
    id: 'T4',
    name: 'Compliance Checklist',
    type: 'compliance',
    description: 'Regulatory compliance checklist and status report.',
    defaultFrequency: 'monthly',
    availableFormats: ['pdf', 'excel']
  },
  {
    id: 'T5',
    name: 'Execution Summary',
    type: 'operational',
    description: 'Daily execution summary with trade details and venue analysis.',
    defaultFrequency: 'daily',
    availableFormats: ['csv', 'excel', 'json']
  }
];

export function getReportById(id: string): Report | undefined {
  return mockReports.find(r => r.id === id);
}

export function getReportsByType(type: Report['type']): Report[] {
  return mockReports.filter(r => r.type === type);
}

export function getReportsByStatus(status: Report['status']): Report[] {
  return mockReports.filter(r => r.status === status);
}



