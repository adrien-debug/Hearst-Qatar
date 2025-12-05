'use client';

import React, { useState } from 'react';
import { MarketProduct } from '@/types/product';
import ProductHeader from './ProductHeader';
import Card from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import styles from './ProductDetailMarket.module.css';

interface ProductDetailMarketProps {
  product: MarketProduct;
}

const tabs = ['Overview', 'Composition', 'Performance', 'Risk Metrics', 'Regulatory Notes'];

export default function ProductDetailMarket({ product }: ProductDetailMarketProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Mock composition data
  const composition = product.universe.map((asset, index) => ({
    asset,
    allocation: Math.floor(100 / product.universe.length) + (index === 0 ? 100 % product.universe.length : 0),
    value: product.aum * (Math.floor(100 / product.universe.length) + (index === 0 ? 100 % product.universe.length : 0)) / 100
  }));

  return (
    <div className={styles.container}>
      <ProductHeader product={product} />

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'Overview' && (
          <div className={styles.contentSection}>
            <Card>
              <h3 className={styles.sectionTitle}>Investment Objective</h3>
              <p className={styles.sectionText}>
                This product provides direct exposure to {product.universe.join(', ')} through market purchases.
                It is designed for institutional investors seeking pure market exposure without mining operations.
              </p>
              <div style={{ marginTop: '24px' }}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Universe</span>
                  <span className={styles.infoValue}>{product.universe.length} assets</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Risk Target</span>
                  <span className={styles.infoValue}>{product.riskTarget}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className={styles.sectionTitle}>Target Clients</h3>
              <div className={styles.badgeContainer}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Sovereign
                </span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Institutional
                </span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary)',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  Corporate
                </span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'Composition' && (
          <Card>
            <h3 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>Asset Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>Asset</TableCell>
                  <TableCell header>Allocation %</TableCell>
                  <TableCell header>Value</TableCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {composition.map((item) => (
                  <TableRow key={item.asset}>
                    <TableCell>{item.asset}</TableCell>
                    <TableCell>{item.allocation}%</TableCell>
                    <TableCell>${(item.value / 1000000).toFixed(2)}M</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            
            {/* Chart placeholder */}
            <div className={styles.chartPlaceholder}>
              <p className={styles.chartText}>Chart placeholder - Asset allocation visualization</p>
            </div>
          </Card>
        )}

        {activeTab === 'Performance' && (
          <Card>
            <h3 className={styles.sectionTitle} style={{ marginBottom: '24px' }}>Historical Returns</h3>
            {/* Chart placeholder */}
            <div className={`${styles.chartPlaceholder} ${styles.chartPlaceholderLarge}`} style={{ marginBottom: '24px' }}>
              <p className={styles.chartText}>Chart placeholder - Performance over time</p>
            </div>
            <div className={styles.performanceGrid}>
              <div>
                <div className={styles.performancePeriod}>1M</div>
                <div className={styles.performanceValue}>+5.2%</div>
              </div>
              <div>
                <div className={styles.performancePeriod}>3M</div>
                <div className={styles.performanceValue}>+12.8%</div>
              </div>
              <div>
                <div className={styles.performancePeriod}>6M</div>
                <div className={styles.performanceValue}>+18.5%</div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'Risk Metrics' && (
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Volatility</h3>
              <div className={styles.metricValue}>24.5%</div>
              <p className={styles.metricDescription}>Annualized volatility (30-day)</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Max Drawdown</h3>
              <div className={`${styles.metricValue} ${styles.metricValueDanger}`}>-18.2%</div>
              <p className={styles.metricDescription}>Maximum drawdown (YTD)</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Sharpe Ratio</h3>
              <div className={styles.metricValue}>1.42</div>
              <p className={styles.metricDescription}>Risk-adjusted return</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Beta</h3>
              <div className={styles.metricValue}>0.95</div>
              <p className={styles.metricDescription}>Relative to benchmark</p>
            </div>
          </div>
        )}

        {activeTab === 'Regulatory Notes' && (
          <Card>
            <h3 className={styles.sectionTitle}>Jurisdictional Compatibility</h3>
            <p className={styles.sectionText} style={{ marginBottom: '24px' }}>
              This product is available in the following jurisdictions:
            </p>
            <div className={styles.jurisdictionTags}>
              {product.jurisdictions.map((jurisdiction) => (
                <span
                  key={jurisdiction}
                  className={styles.jurisdictionTag}
                >
                  {jurisdiction}
                </span>
              ))}
            </div>
            <div className={styles.noteBox}>
              <p className={styles.noteText}>
                <strong>Note:</strong> Regulatory compliance and availability may vary by jurisdiction.
                Please consult with your legal advisor before investing.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}



