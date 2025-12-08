'use client';

import React from 'react';
import { PerformanceDataPoint } from '@/lib/mock-overview';
import styles from './PerformanceTable.module.css';

interface PerformanceTableProps {
  data: PerformanceDataPoint[];
}

const formatMonth = (isoMonth: string) => {
  const [year, month] = isoMonth.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const formatPct = (value: number) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export default function PerformanceTable({ data }: PerformanceTableProps) {
  const tableData = data.map((point, index) => {
    const portfolioReturn = index === 0 ? 0 : ((point.value - 100) / 100) * 100;
    const benchmarkReturn = index === 0 ? 0 : (((point.benchmark ?? 100) - 100) / 100) * 100;
    const diff = portfolioReturn - benchmarkReturn;
    return {
      period: formatMonth(point.date),
      portfolio: portfolioReturn,
      benchmark: benchmarkReturn,
      diff
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Période</th>
              <th className={styles.tableHeader}>Portfolio</th>
              <th className={styles.tableHeader}>Benchmark</th>
              <th className={styles.tableHeader}>Diff.</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {tableData.map((row, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{row.period}</td>
                <td className={`${styles.tableCell} ${styles.tableCellValue}`}>
                  {formatPct(row.portfolio)}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellValue}`}>
                  {formatPct(row.benchmark)}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellDifference} ${row.diff >= 0 ? styles.positive : styles.negative}`}>
                  {formatPct(row.diff)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
