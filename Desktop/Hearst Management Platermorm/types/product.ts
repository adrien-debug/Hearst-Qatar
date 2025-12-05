export type ProductType = 'market' | 'mining' | 'bouquet';

export type MiningRole = 'sourcing' | 'collateral';

export interface MiningPool {
  id: string;
  name: string;
  country: string;
}

export interface MiningConfig {
  active: boolean;
  role: MiningRole | null;
  pools: MiningPool[];
  maxExposurePercent: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  description: string;
  aum: number;
  ytdPerformance: number;
  miningExposurePercent: number;
  inceptionDate: string;
  benchmark?: string;
  miningConfig?: MiningConfig;
}

export interface BouquetAllocation {
  productId: string;
  productName: string;
  productType: ProductType;
  allocationPercent: number;
  miningExposurePercent: number;
}

export interface BouquetProduct extends Product {
  type: 'bouquet';
  allocations: BouquetAllocation[];
  rebalancingFrequency?: string;
  rebalancingRules?: string;
}

export interface MarketProduct extends Product {
  type: 'market';
  universe: string[];
  riskTarget?: string;
  jurisdictions: string[];
}

export interface MiningProduct extends Product {
  type: 'mining';
  miningConfig: MiningConfig;
}



