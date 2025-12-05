'use client';

import React, { useState } from 'react';
import { Product, ProductType } from '@/types/product';
import { mockProducts } from '@/lib/mock-data';
import Badge from '@/components/ui/Badge';
import MiningIndicator from '@/components/ui/MiningIndicator';
import Link from 'next/link';
import styles from './ProductShelfHorizontal.module.css';

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export default function ProductShelf() {
  const [filterType, setFilterType] = useState<ProductType | 'all'>('all');

  const filteredProducts = filterType === 'all' 
    ? mockProducts 
    : mockProducts.filter(p => p.type === filterType);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Product Catalog</h1>
        <p className={styles.subtitle}>
          Browse all available products across Market, Mining-Enhanced, and Bouquet families.
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          onClick={() => setFilterType('all')}
          className={`${styles.filterButton} ${filterType === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          All Products
        </button>
        <button
          onClick={() => setFilterType('market')}
          className={`${styles.filterButton} ${filterType === 'market' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Market Only
        </button>
        <button
          onClick={() => setFilterType('mining')}
          className={`${styles.filterButton} ${filterType === 'mining' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Mining-Enhanced
        </button>
        <button
          onClick={() => setFilterType('bouquet')}
          className={`${styles.filterButton} ${filterType === 'bouquet' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Bouquets
        </button>
      </div>

      {/* Horizontal Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Product</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Description</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>AUM</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>YTD</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Mining %</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={styles.tableBodyRow}>
                <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                  {product.name}
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.badgeContainer}>
                    <Badge type={product.type} />
                  </div>
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellDescription}`}>
                  {product.description}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {formatCurrency(product.aum)}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric} ${product.ytdPerformance >= 0 ? styles.tableCellMetricPositive : styles.tableCellMetricNegative}`}>
                  {product.ytdPerformance >= 0 ? '+' : ''}{product.ytdPerformance.toFixed(1)}%
                </td>
                <td className={styles.tableCell}>
                  {product.miningExposurePercent > 0 ? (
                    <div>
                      <div style={{ textAlign: 'right', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600 }}>
                        {product.miningExposurePercent}%
                      </div>
                      <div className={styles.miningIndicatorContainer}>
                        <MiningIndicator percent={product.miningExposurePercent} />
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>—</span>
                  )}
                </td>
                <td className={styles.tableCell} style={{ textAlign: 'center' }}>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                    <button className={styles.actionButton}>
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>
          No products found for this filter.
        </div>
      )}
    </div>
  );
}



