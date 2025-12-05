import React from 'react';
import { Product } from '@/types/product';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import styles from './ProductHeader.module.css';

interface ProductHeaderProps {
  product: Product;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{product.name}</h1>
            <Badge type={product.type} />
          </div>
          <p className={styles.description}>{product.description}</p>
        </div>
      </div>

      {/* Key KPIs - Horizontal */}
      <div className={styles.kpisGrid}>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiLabel}>AUM</div>
          <div className={styles.kpiValue}>{formatCurrency(product.aum)}</div>
        </Card>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Inception Date</div>
          <div className={styles.kpiValue}>{new Date(product.inceptionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
        </Card>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiLabel}>YTD Performance</div>
          <div className={styles.kpiValue} style={{ color: product.ytdPerformance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {product.ytdPerformance >= 0 ? '+' : ''}{product.ytdPerformance.toFixed(1)}%
          </div>
        </Card>
        <Card className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Benchmark</div>
          <div className={styles.kpiValueSmall}>{product.benchmark || 'N/A'}</div>
        </Card>
      </div>
    </div>
  );
}



