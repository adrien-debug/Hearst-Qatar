'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';
import styles from './TopPerformers.module.css';

interface TopPerformer {
  name: string;
  type: 'market' | 'mining' | 'bouquet';
  ytd: number;
  aum: number;
}

interface TopPerformersProps {
  data: TopPerformer[];
}

export default function TopPerformers({ data }: TopPerformersProps) {
  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top Performers</h3>
        <p className={styles.subtitle}>YTD Performance</p>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Product</div>
          <div className={styles.headerCell}>Type</div>
          <div className={`${styles.headerCell} ${styles.headerCellRight}`}>AUM</div>
          <div className={`${styles.headerCell} ${styles.headerCellRight}`}>YTD</div>
        </div>
        {data.map((item, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.cell}>
              <span className={styles.productName}>{item.name}</span>
            </div>
            <div className={styles.cell}>
              <Badge type={item.type} />
            </div>
            <div className={`${styles.cell} ${styles.cellRight}`}>
              <span className={styles.aum}>{formatCurrency(item.aum)}</span>
            </div>
            <div className={`${styles.cell} ${styles.cellRight}`}>
              <span className={styles.ytd}>+{item.ytd.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}



