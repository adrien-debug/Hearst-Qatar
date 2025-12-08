'use client';

import React from 'react';
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Top Performers</h3>
        <p className={styles.subtitle}>YTD Performance</p>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Product</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>AUM</th>
              <th className={styles.tableHeaderCell}>YTD</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={styles.tableBodyRow}>
                <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                  {item.name}
                </td>
                <td className={styles.tableCell}>
                  <Badge type={item.type} />
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {formatCurrency(item.aum)}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  +{item.ytd.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



