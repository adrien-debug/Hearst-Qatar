'use client';

import React, { useState } from 'react';
import { BouquetProduct } from '@/types/product';
import ProductHeader from './ProductHeader';
import AllocationTable from './AllocationTable';
import MiningIndicator from '@/components/ui/MiningIndicator';
import Card from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';

interface ProductDetailBouquetProps {
  product: BouquetProduct;
}

const tabs = ['Overview', 'Allocation', 'Performance', 'Risk Metrics', 'Regulatory Notes'];

export default function ProductDetailBouquet({ product }: ProductDetailBouquetProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Calculate global mining exposure
  const globalMiningExposure = product.allocations.reduce((sum, alloc) => {
    return sum + (alloc.allocationPercent * alloc.miningExposurePercent / 100);
  }, 0);

  return (
    <div>
      <ProductHeader product={product} />

      {/* Global Mining Exposure */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Overall Mining Exposure</h3>
          <span className="text-2xl font-bold">{globalMiningExposure.toFixed(1)}%</span>
        </div>
        <MiningIndicator percent={globalMiningExposure} />
        <p className="text-sm text-[var(--color-text-muted)] mt-3">
          Weighted average mining exposure across all underlying products.
        </p>
      </Card>

      {/* Tabs */}
      <div className="mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-text-main)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-4">Investment Objective</h3>
              <p className="text-[var(--color-text-muted)] mb-4">
                This bouquet product provides a diversified allocation across multiple underlying products,
                combining market-only and mining-enhanced strategies to achieve a balanced risk-return profile.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Number of Underlyings</span>
                  <span className="text-sm font-semibold">{product.allocations.length} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Global Mining Exposure</span>
                  <span className="text-sm font-semibold">{globalMiningExposure.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Rebalancing Frequency</span>
                  <span className="text-sm font-semibold">{product.rebalancingFrequency || 'N/A'}</span>
                </div>
              </div>
            </Card>

            {product.rebalancingRules && (
              <Card>
                <h3 className="text-xl font-bold mb-4">Rebalancing Rules</h3>
                <p className="text-[var(--color-text-muted)]">{product.rebalancingRules}</p>
              </Card>
            )}

            <Card>
              <h3 className="text-xl font-bold mb-4">Target Clients</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-full text-sm font-medium">
                  Sovereign
                </span>
                <span className="px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-full text-sm font-medium">
                  Institutional
                </span>
                <span className="px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-full text-sm font-medium">
                  Corporate
                </span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'Allocation' && (
          <Card>
            <h3 className="text-xl font-bold mb-6">Product Allocation</h3>
            <AllocationTable allocations={product.allocations} />
            
            {/* Pie chart placeholder */}
            <div className="mt-8 h-64 bg-[var(--color-surface-alt)] rounded-lg flex items-center justify-center">
              <p className="text-[var(--color-text-muted)]">Chart placeholder - Allocation pie/donut chart</p>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-[var(--color-surface-alt)] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Total Allocation</span>
                <span className="text-lg font-bold">
                  {product.allocations.reduce((sum, a) => sum + a.allocationPercent, 0)}%
                </span>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'Performance' && (
          <Card>
            <h3 className="text-xl font-bold mb-6">Historical Returns</h3>
            {/* Chart placeholder */}
            <div className="h-96 bg-[var(--color-surface-alt)] rounded-lg flex items-center justify-center mb-6">
              <p className="text-[var(--color-text-muted)]">Chart placeholder - Performance over time</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-[var(--color-text-muted)] mb-1">1M</div>
                <div className="text-lg font-semibold">+5.5%</div>
              </div>
              <div>
                <div className="text-sm text-[var(--color-text-muted)] mb-1">3M</div>
                <div className="text-lg font-semibold">+13.2%</div>
              </div>
              <div>
                <div className="text-sm text-[var(--color-text-muted)] mb-1">6M</div>
                <div className="text-lg font-semibold">+19.2%</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'Risk Metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold mb-4">Volatility</h3>
              <div className="text-3xl font-bold mb-2">25.1%</div>
              <p className="text-sm text-[var(--color-text-muted)]">Annualized volatility (30-day)</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Max Drawdown</h3>
              <div className="text-3xl font-bold mb-2 text-[var(--color-danger)]">-18.8%</div>
              <p className="text-sm text-[var(--color-text-muted)]">Maximum drawdown (YTD)</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Sharpe Ratio</h3>
              <div className="text-3xl font-bold mb-2">1.40</div>
              <p className="text-sm text-[var(--color-text-muted)]">Risk-adjusted return</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Diversification Score</h3>
              <div className="text-3xl font-bold mb-2">0.72</div>
              <p className="text-sm text-[var(--color-text-muted)]">Portfolio diversification metric</p>
            </Card>
          </div>
        )}

        {activeTab === 'Regulatory Notes' && (
          <Card>
            <h3 className="text-xl font-bold mb-4">Jurisdictional Compatibility</h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              This bouquet product is available in the following jurisdictions:
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-[var(--color-surface-alt)] rounded-lg text-sm font-medium">
                Global
              </span>
              <span className="px-4 py-2 bg-[var(--color-surface-alt)] rounded-lg text-sm font-medium">
                Qatar
              </span>
              <span className="px-4 py-2 bg-[var(--color-surface-alt)] rounded-lg text-sm font-medium">
                UAE
              </span>
              <span className="px-4 py-2 bg-[var(--color-surface-alt)] rounded-lg text-sm font-medium">
                Bahrain
              </span>
            </div>
            <div className="mt-6 p-4 bg-[var(--color-surface-alt)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)]">
                <strong>Note:</strong> Bouquet products combine multiple underlying products, each with their own
                regulatory considerations. Please consult with your legal advisor before investing.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}



