import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MiningIndicator from '@/components/ui/MiningIndicator';
import Button from '@/components/ui/Button';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <div className={styles.cardContainer}>
        <div className={styles.content}>
          {/* Header with badge */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h3 className={styles.title}>{product.name}</h3>
              <Badge type={product.type} />
            </div>
          </div>

          {/* Description */}
          <p className={styles.description}>
            {product.description}
          </p>

          {/* Metrics */}
          <div className={styles.metrics}>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>AUM</span>
              <span className={styles.metricValue}>{formatCurrency(product.aum)}</span>
            </div>
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>YTD Performance</span>
              <span className={`${styles.metricValue} ${product.ytdPerformance >= 0 ? styles.metricValuePositive : styles.metricValueNegative}`}>
                {product.ytdPerformance >= 0 ? '+' : ''}{product.ytdPerformance.toFixed(1)}%
              </span>
            </div>
            {product.miningExposurePercent > 0 && (
              <div className={styles.miningSection}>
                <div className={styles.miningRow}>
                  <span className={styles.metricLabel}>Mining Exposure</span>
                  <span className={styles.metricValue}>{product.miningExposurePercent}%</span>
                </div>
                <MiningIndicator percent={product.miningExposurePercent} />
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ width: '100%' }}>
            View Product
          </Button>
        </Link>
      </div>
    </Card>
  );
}



