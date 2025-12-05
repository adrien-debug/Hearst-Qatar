export interface Execution {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  type: 'buy' | 'sell' | 'rebalance' | 'allocation';
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';
  asset: string;
  quantity: number;
  price: number;
  value: number;
  timestamp: string;
  executedAt?: string;
  mandateId?: string;
  mandateName?: string;
  executionVenue: string;
  slippage?: number;
  fees: number;
}

export const mockExecutions: Execution[] = [
  {
    id: 'E1',
    orderId: 'ORD-2024-001',
    productId: 'A1',
    productName: 'BTC Core Market',
    type: 'buy',
    status: 'completed',
    asset: 'BTC',
    quantity: 125.5,
    price: 43250.00,
    value: 5430875.00,
    timestamp: '2024-01-15T10:30:00Z',
    executedAt: '2024-01-15T10:30:15Z',
    mandateId: 'M1',
    mandateName: 'Qatar Sovereign Wealth Fund',
    executionVenue: 'Coinbase Pro',
    slippage: 0.12,
    fees: 5430.88
  },
  {
    id: 'E2',
    orderId: 'ORD-2024-002',
    productId: 'B1',
    productName: 'BTC Mining Reserve',
    type: 'buy',
    status: 'executing',
    asset: 'BTC',
    quantity: 85.2,
    price: 43180.00,
    value: 3678936.00,
    timestamp: '2024-01-15T11:15:00Z',
    mandateId: 'M2',
    mandateName: 'UAE Institutional Core Strategy',
    executionVenue: 'Kraken',
    slippage: 0.08,
    fees: 3678.94
  },
  {
    id: 'E3',
    orderId: 'ORD-2024-003',
    productId: 'C1',
    productName: 'Sovereign Core BTC',
    type: 'rebalance',
    status: 'pending',
    asset: 'Multiple',
    quantity: 0,
    price: 0,
    value: 2500000.00,
    timestamp: '2024-01-15T12:00:00Z',
    mandateId: 'M1',
    mandateName: 'Qatar Sovereign Wealth Fund',
    executionVenue: 'Multiple',
    fees: 2500.00
  },
  {
    id: 'E4',
    orderId: 'ORD-2024-004',
    productId: 'A2',
    productName: 'Multi-Asset Crypto Index',
    type: 'buy',
    status: 'completed',
    asset: 'ETH',
    quantity: 2500.0,
    price: 2650.00,
    value: 6625000.00,
    timestamp: '2024-01-15T09:45:00Z',
    executedAt: '2024-01-15T09:45:22Z',
    mandateId: 'M2',
    mandateName: 'UAE Institutional Core Strategy',
    executionVenue: 'Binance',
    slippage: 0.15,
    fees: 6625.00
  },
  {
    id: 'E5',
    orderId: 'ORD-2024-005',
    productId: 'A3',
    productName: 'ETF Mirrors',
    type: 'sell',
    status: 'completed',
    asset: 'BTC',
    quantity: 50.0,
    price: 43300.00,
    value: 2165000.00,
    timestamp: '2024-01-14T16:20:00Z',
    executedAt: '2024-01-14T16:20:18Z',
    mandateId: 'M6',
    mandateName: 'Kuwait Sovereign Reserve',
    executionVenue: 'Gemini',
    slippage: -0.05,
    fees: 2165.00
  },
  {
    id: 'E6',
    orderId: 'ORD-2024-006',
    productId: 'B2',
    productName: 'Mining-Backed Yield',
    type: 'allocation',
    status: 'executing',
    asset: 'BTC',
    quantity: 120.0,
    price: 43200.00,
    value: 5184000.00,
    timestamp: '2024-01-15T13:30:00Z',
    mandateId: 'M4',
    mandateName: 'High Net Worth Family Office',
    executionVenue: 'FTX (via API)',
    slippage: 0.10,
    fees: 5184.00
  },
  {
    id: 'E7',
    orderId: 'ORD-2024-007',
    productId: 'A1',
    productName: 'BTC Core Market',
    type: 'buy',
    status: 'failed',
    asset: 'BTC',
    quantity: 100.0,
    price: 43250.00,
    value: 4325000.00,
    timestamp: '2024-01-14T14:00:00Z',
    mandateId: 'M3',
    mandateName: 'Bahrain Corporate Treasury',
    executionVenue: 'Coinbase Pro',
    fees: 0
  },
  {
    id: 'E8',
    orderId: 'ORD-2024-008',
    productId: 'C2',
    productName: 'Balanced Mining Allocation',
    type: 'rebalance',
    status: 'completed',
    asset: 'Multiple',
    quantity: 0,
    price: 0,
    value: 1800000.00,
    timestamp: '2024-01-14T10:00:00Z',
    executedAt: '2024-01-14T10:05:30Z',
    mandateId: 'M2',
    mandateName: 'UAE Institutional Core Strategy',
    executionVenue: 'Multiple',
    fees: 1800.00
  }
];

export function getExecutionById(id: string): Execution | undefined {
  return mockExecutions.find(e => e.id === id);
}

export function getExecutionsByStatus(status: Execution['status']): Execution[] {
  return mockExecutions.filter(e => e.status === status);
}

export function getExecutionsByType(type: Execution['type']): Execution[] {
  return mockExecutions.filter(e => e.type === type);
}



