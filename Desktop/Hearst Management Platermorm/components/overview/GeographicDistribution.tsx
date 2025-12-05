'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';
import styles from './GeographicDistribution.module.css';

interface GeographicData {
  region: string;
  aum: number;
  percentage: number;
}

interface GeographicDistributionProps {
  data: GeographicData[];
}

export default function GeographicDistribution({ data }: GeographicDistributionProps) {
  const maxPercentage = Math.max(...data.map(d => d.percentage));

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Geographic Distribution</h3>
        <p className={styles.subtitle}>AUM by Region</p>
      </div>
      <div className={styles.content}>
        {data.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.region}>{item.region}</span>
              <div className={styles.values}>
                <span className={styles.aum}>{formatCurrency(item.aum)}</span>
                <span className={styles.percentage}>{item.percentage}%</span>
              </div>
            </div>
            <div className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{
                  width: `${(item.percentage / maxPercentage) * 100}%`,
                  background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary))`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}



