'use client';

import React, { useState } from 'react';
import { MiningProduct } from '@/types/product';
import ProductHeader from './ProductHeader';
import MiningIntegrationBlock from './MiningIntegrationBlock';
import Card from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';

interface ProductDetailMiningProps {
  product: MiningProduct;
}

const tabs = ['Overview', 'Composition', 'Performance', 'Risk Metrics', 'Regulatory Notes'];

export default function ProductDetailMining({ product }: ProductDetailMiningProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Mock composition data
  const composition = [
    { asset: 'BTC (Market)', allocation: 100 - product.miningExposurePercent, value: product.aum * (100 - product.miningExposurePercent) / 100 },
    { asset: 'BTC (Mining)', allocation: product.miningExposurePercent, value: product.aum * product.miningExposurePercent / 100 }
  ];

  return (
    <div>
      <ProductHeader product={product} />

      {/* Mining Integration Block */}
      {product.miningConfig && (
        <MiningIntegrationBlock 
          miningConfig={product.miningConfig}
          miningExposurePercent={product.miningExposurePercent}
        />
      )}

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
                This product combines market-based BTC exposure with mining-enhanced sourcing or collateral.
                Mining is used as a complementary source of BTC and/or to enhance collateral backing.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Mining Exposure</span>
                  <span className="text-sm font-semibold">{product.miningExposurePercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Mining Pools</span>
                  <span className="text-sm font-semibold">{product.miningConfig?.pools.length || 0} pools</span>
                </div>
              </div>
            </Card>

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

        {activeTab === 'Composition' && (
          <Card>
            <h3 className="text-xl font-bold mb-6">Asset Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>Source</TableCell>
                  <TableCell header>Allocation %</TableCell>
                  <TableCell header>Value</TableCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {composition.map((item) => (
                  <TableRow key={item.asset}>
                    <TableCell>{item.asset}</TableCell>
                    <TableCell>{item.allocation.toFixed(1)}%</TableCell>
                    <TableCell>${(item.value / 1000000).toFixed(2)}M</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            
            {/* Chart placeholder */}
            <div className="mt-8 h-64 bg-[var(--color-surface-alt)] rounded-lg flex items-center justify-center">
              <p className="text-[var(--color-text-muted)]">Chart placeholder - Asset allocation visualization</p>
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
                <div className="text-lg font-semibold">+5.8%</div>
              </div>
              <div>
                <div className="text-sm text-[var(--color-text-muted)] mb-1">3M</div>
                <div className="text-lg font-semibold">+13.5%</div>
              </div>
              <div>
                <div className="text-sm text-[var(--color-text-muted)] mb-1">6M</div>
                <div className="text-lg font-semibold">+20.1%</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'Risk Metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold mb-4">Volatility</h3>
              <div className="text-3xl font-bold mb-2">26.2%</div>
              <p className="text-sm text-[var(--color-text-muted)]">Annualized volatility (30-day)</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Max Drawdown</h3>
              <div className="text-3xl font-bold mb-2 text-[var(--color-danger)]">-19.5%</div>
              <p className="text-sm text-[var(--color-text-muted)]">Maximum drawdown (YTD)</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Sharpe Ratio</h3>
              <div className="text-3xl font-bold mb-2">1.38</div>
              <p className="text-sm text-[var(--color-text-muted)]">Risk-adjusted return</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-4">Mining Risk Factor</h3>
              <div className="text-3xl font-bold mb-2">Medium</div>
              <p className="text-sm text-[var(--color-text-muted)]">Exposure to mining-specific risks</p>
            </Card>
          </div>
        )}

        {activeTab === 'Regulatory Notes' && (
          <Card>
            <h3 className="text-xl font-bold mb-4">Jurisdictional Compatibility</h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              This product is available in the following jurisdictions:
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
            </div>
            <div className="mt-6 p-4 bg-[var(--color-surface-alt)] rounded-lg">
              <p className="text-sm text-[var(--color-text-muted)]">
                <strong>Note:</strong> Mining-enhanced products may have additional regulatory considerations.
                Please consult with your legal advisor before investing.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}



