import { Product, MarketProduct, MiningProduct, BouquetProduct } from '@/types/product';

export const mockProducts: Product[] = [
  // FAMILY A – MARKET ONLY
  {
    id: 'A1',
    code: 'BTC-CORE-MKT',
    name: 'BTC Core Market',
    type: 'market',
    description: 'Direct BTC exposure through market purchases, no mining involvement.',
    aum: 125000000,
    ytdPerformance: 18.5,
    miningExposurePercent: 0,
    inceptionDate: '2023-01-15',
    benchmark: 'BTC Price Index',
    universe: ['BTC'],
    riskTarget: 'Medium',
    jurisdictions: ['Global', 'Qatar', 'UAE', 'Bahrain']
  } as MarketProduct,
  
  {
    id: 'A2',
    code: 'MULTI-ASSET-IDX',
    name: 'Multi-Asset Crypto Index',
    type: 'market',
    description: 'Diversified crypto index tracking top 20 digital assets by market cap.',
    aum: 89000000,
    ytdPerformance: 22.3,
    miningExposurePercent: 0,
    inceptionDate: '2023-03-20',
    benchmark: 'HMP Crypto 20 Index',
    universe: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI', 'ATOM', 'ETC', 'LTC', 'BCH', 'ALGO', 'FIL', 'AAVE', 'MKR', 'COMP'],
    riskTarget: 'Medium-High',
    jurisdictions: ['Global', 'Qatar']
  } as MarketProduct,
  
  {
    id: 'A3',
    code: 'ETF-MIRRORS',
    name: 'ETF Mirrors',
    description: 'Mirrors of BTC/ETH/crypto ETFs for institutional exposure.',
    type: 'market',
    aum: 210000000,
    ytdPerformance: 19.8,
    miningExposurePercent: 0,
    inceptionDate: '2023-02-10',
    benchmark: 'BTC/ETH ETF Composite',
    universe: ['BTC', 'ETH'],
    riskTarget: 'Low-Medium',
    jurisdictions: ['Global', 'Qatar', 'UAE', 'Bahrain']
  } as MarketProduct,
  
  {
    id: 'A4',
    code: 'MARKET-YIELD',
    name: 'Market-Based Yield Products',
    description: 'Yield generation through staking, carry trades, and basis trading – no mining.',
    type: 'market',
    aum: 67000000,
    ytdPerformance: 12.4,
    miningExposurePercent: 0,
    inceptionDate: '2023-05-05',
    benchmark: 'Crypto Yield Index',
    universe: ['BTC', 'ETH', 'Stablecoins'],
    riskTarget: 'Low',
    jurisdictions: ['Global', 'Qatar', 'UAE']
  } as MarketProduct,
  
  // FAMILY B – MINING-ENHANCED
  {
    id: 'B1',
    code: 'BTC-MINING-RESERVE',
    name: 'BTC Mining Reserve',
    type: 'mining',
    description: 'BTC sourced from market + from mining pools. Mining is a complementary source.',
    aum: 180000000,
    ytdPerformance: 20.1,
    miningExposurePercent: 25,
    inceptionDate: '2023-04-12',
    benchmark: 'BTC Price Index',
    miningConfig: {
      active: true,
      role: 'sourcing',
      pools: [
        { id: 'pool1', name: 'Antpool', country: 'China' },
        { id: 'pool2', name: 'Foundry USA', country: 'USA' },
        { id: 'pool3', name: 'F2Pool', country: 'China' }
      ],
      maxExposurePercent: 30
    }
  } as MiningProduct,
  
  {
    id: 'B2',
    code: 'MINING-BACKED-YIELD',
    name: 'Mining-Backed Yield',
    type: 'mining',
    description: 'Yield products where collateral = BTC + future BTC flows from mining pools.',
    aum: 95000000,
    ytdPerformance: 15.7,
    miningExposurePercent: 40,
    inceptionDate: '2023-06-18',
    benchmark: 'Crypto Yield Index + Mining Premium',
    miningConfig: {
      active: true,
      role: 'collateral',
      pools: [
        { id: 'pool4', name: 'ViaBTC', country: 'China' },
        { id: 'pool5', name: 'Slush Pool', country: 'Czech Republic' }
      ],
      maxExposurePercent: 45
    }
  } as MiningProduct,
  
  {
    id: 'B3',
    code: 'MINING-SECURED-POOL',
    name: 'Mining-Secured Collateral Pool',
    type: 'mining',
    description: 'Collateral pool partly fed by mining outputs, used to secure other strategies.',
    aum: 145000000,
    ytdPerformance: 14.2,
    miningExposurePercent: 35,
    inceptionDate: '2023-07-25',
    benchmark: 'Collateral Yield Index',
    miningConfig: {
      active: true,
      role: 'collateral',
      pools: [
        { id: 'pool6', name: 'BTC.com', country: 'China' },
        { id: 'pool7', name: 'Binance Pool', country: 'Global' }
      ],
      maxExposurePercent: 40
    }
  } as MiningProduct,
  
  {
    id: 'B4',
    code: 'MINING-PARTICIPATION',
    name: 'Mining Participation Notes',
    type: 'mining',
    description: 'Notes giving exposure to a share of mining performance / flows through pools.',
    aum: 72000000,
    ytdPerformance: 16.9,
    miningExposurePercent: 100,
    inceptionDate: '2023-08-30',
    benchmark: 'Mining Performance Index',
    miningConfig: {
      active: true,
      role: 'sourcing',
      pools: [
        { id: 'pool8', name: 'Luxor', country: 'USA' },
        { id: 'pool9', name: 'MARA Pool', country: 'USA' },
        { id: 'pool10', name: 'Core Scientific', country: 'USA' }
      ],
      maxExposurePercent: 100
    }
  } as MiningProduct,
  
  // FAMILY C – BOUQUETS
  {
    id: 'C1',
    code: 'SOVEREIGN-CORE-BTC',
    name: 'Sovereign Core BTC',
    type: 'bouquet',
    description: 'Conservative allocation focused on BTC core exposure with minimal mining.',
    aum: 320000000,
    ytdPerformance: 19.2,
    miningExposurePercent: 3.75, // 15% of 25% = 3.75%
    inceptionDate: '2023-09-10',
    benchmark: 'BTC Price Index',
    allocations: [
      { productId: 'A1', productName: 'BTC Core Market', productType: 'market', allocationPercent: 60, miningExposurePercent: 0 },
      { productId: 'A3', productName: 'ETF Mirrors', productType: 'market', allocationPercent: 25, miningExposurePercent: 0 },
      { productId: 'B1', productName: 'BTC Mining Reserve', productType: 'mining', allocationPercent: 15, miningExposurePercent: 25 }
    ],
    rebalancingFrequency: 'Quarterly',
    rebalancingRules: 'Rebalance when allocation drifts >5% from target. Maintain 60/25/15 split.'
  } as BouquetProduct,
  
  {
    id: 'C2',
    code: 'BALANCED-MINING',
    name: 'Balanced Mining Allocation',
    type: 'bouquet',
    description: 'Balanced exposure to market and mining-enhanced products.',
    aum: 245000000,
    ytdPerformance: 18.7,
    miningExposurePercent: 16.25, // (25% * 25%) + (20% * 40%) = 6.25% + 8% = 14.25% (approximé)
    inceptionDate: '2023-10-05',
    benchmark: 'HMP Balanced Index',
    allocations: [
      { productId: 'A1', productName: 'BTC Core Market', productType: 'market', allocationPercent: 35, miningExposurePercent: 0 },
      { productId: 'A2', productName: 'Multi-Asset Crypto Index', productType: 'market', allocationPercent: 20, miningExposurePercent: 0 },
      { productId: 'B1', productName: 'BTC Mining Reserve', productType: 'mining', allocationPercent: 25, miningExposurePercent: 25 },
      { productId: 'B2', productName: 'Mining-Backed Yield', productType: 'mining', allocationPercent: 20, miningExposurePercent: 40 }
    ],
    rebalancingFrequency: 'Monthly',
    rebalancingRules: 'Monthly rebalancing to maintain target allocations. Mining exposure capped at 20%.'
  } as BouquetProduct,
  
  {
    id: 'C3',
    code: 'AGGRESSIVE-MINING',
    name: 'Aggressive Mining & Growth',
    type: 'bouquet',
    description: 'High-growth allocation with significant mining exposure.',
    aum: 185000000,
    ytdPerformance: 21.5,
    miningExposurePercent: 48, // (30% * 40%) + (30% * 100%) = 12% + 30% = 42% (approximé)
    inceptionDate: '2023-11-15',
    benchmark: 'HMP Growth Index',
    allocations: [
      { productId: 'A2', productName: 'Multi-Asset Crypto Index', productType: 'market', allocationPercent: 25, miningExposurePercent: 0 },
      { productId: 'A4', productName: 'Market-Based Yield Products', productType: 'market', allocationPercent: 15, miningExposurePercent: 0 },
      { productId: 'B2', productName: 'Mining-Backed Yield', productType: 'mining', allocationPercent: 30, miningExposurePercent: 40 },
      { productId: 'B4', productName: 'Mining Participation Notes', productType: 'mining', allocationPercent: 30, miningExposurePercent: 100 }
    ],
    rebalancingFrequency: 'Bi-weekly',
    rebalancingRules: 'Active rebalancing to capture mining performance. Mining exposure target: 45-50%.'
  } as BouquetProduct,
  
  {
    id: 'C4',
    code: 'ETF-SOVEREIGN',
    name: 'ETF-Mirror Sovereign Basket',
    type: 'bouquet',
    description: 'Sovereign-grade allocation focused on ETF mirrors with mining enhancement.',
    aum: 410000000,
    ytdPerformance: 18.9,
    miningExposurePercent: 9.25, // (15% * 25%) + (15% * 40%) = 3.75% + 6% = 9.75% (approximé)
    inceptionDate: '2023-12-01',
    benchmark: 'ETF Composite + Mining Premium',
    allocations: [
      { productId: 'A3', productName: 'ETF Mirrors', productType: 'market', allocationPercent: 50, miningExposurePercent: 0 },
      { productId: 'A1', productName: 'BTC Core Market', productType: 'market', allocationPercent: 20, miningExposurePercent: 0 },
      { productId: 'B1', productName: 'BTC Mining Reserve', productType: 'mining', allocationPercent: 15, miningExposurePercent: 25 },
      { productId: 'B2', productName: 'Mining-Backed Yield', productType: 'mining', allocationPercent: 15, miningExposurePercent: 40 }
    ],
    rebalancingFrequency: 'Quarterly',
    rebalancingRules: 'Quarterly rebalancing. Maintain ETF mirror dominance (50%) with mining enhancement (30%).'
  } as BouquetProduct
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id);
}

export function getProductsByType(type: 'market' | 'mining' | 'bouquet'): Product[] {
  return mockProducts.filter(p => p.type === type);
}



