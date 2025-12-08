export interface PerformanceDataPoint {
  date: string;
  value: number;
  benchmark?: number;
}

export interface AllocationData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TrendData {
  period: string;
  value: number;
  change: number;
}

export const mockPerformanceData: PerformanceDataPoint[] = [
  { date: '2024-01', value: 100, benchmark: 100 },
  { date: '2024-02', value: 102.5, benchmark: 101.2 },
  { date: '2024-03', value: 105.8, benchmark: 103.1 },
  { date: '2024-04', value: 108.2, benchmark: 104.5 },
  { date: '2024-05', value: 112.4, benchmark: 106.2 },
  { date: '2024-06', value: 115.6, benchmark: 107.8 },
  { date: '2024-07', value: 118.9, benchmark: 109.3 },
  { date: '2024-08', value: 122.1, benchmark: 110.7 },
  { date: '2024-09', value: 125.3, benchmark: 112.1 },
  { date: '2024-10', value: 128.7, benchmark: 113.5 },
  { date: '2024-11', value: 131.2, benchmark: 114.8 },
  { date: '2024-12', value: 134.5, benchmark: 116.2 }
];

export const mockAllocationData: AllocationData[] = [
  { category: 'Market Only', value: 450000000, percentage: 45, color: 'linear-gradient(135deg, rgba(138, 253, 129, 0.7), rgba(111, 217, 106, 0.9))' },
  { category: 'Mining-Enhanced', value: 350000000, percentage: 35, color: 'linear-gradient(135deg, rgba(138, 253, 129, 0.9), rgba(138, 253, 129, 1))' },
  { category: 'Bouquets', value: 200000000, percentage: 20, color: 'linear-gradient(135deg, rgba(111, 217, 106, 0.8), rgba(138, 253, 129, 0.7))' }
];

export const mockTrendData: TrendData[] = [
  { period: '1M', value: 5.2, change: 0.3 },
  { period: '3M', value: 12.8, change: 1.2 },
  { period: '6M', value: 18.5, change: 2.1 },
  { period: '1Y', value: 34.5, change: 3.4 },
  { period: 'YTD', value: 28.7, change: 2.8 }
];

export const mockGeographicDistribution = [
  { region: 'Qatar', aum: 320000000, percentage: 32 },
  { region: 'UAE', aum: 280000000, percentage: 28 },
  { region: 'Bahrain', aum: 200000000, percentage: 20 },
  { region: 'Global', aum: 200000000, percentage: 20 }
];

export const mockTopPerformers = [
  { name: 'BTC Mining Reserve', type: 'mining' as const, ytd: 42.3, aum: 180000000 },
  { name: 'Sovereign Core BTC', type: 'bouquet' as const, ytd: 38.7, aum: 150000000 },
  { name: 'Multi-Asset Index', type: 'market' as const, ytd: 35.2, aum: 120000000 },
  { name: 'Mining-Backed Yield', type: 'mining' as const, ytd: 33.8, aum: 110000000 }
];


