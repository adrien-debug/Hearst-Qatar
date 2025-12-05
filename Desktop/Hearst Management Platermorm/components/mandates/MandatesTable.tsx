'use client';

import React, { useState } from 'react';
import { Mandate } from '@/lib/mock-mandates';
import { mockMandates } from '@/lib/mock-mandates';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/format';
import styles from './MandatesTable.module.css';

const typeLabels = {
  sovereign: 'Sovereign',
  institutional: 'Institutional',
  corporate: 'Corporate',
  'family-office': 'Family Office'
};

const statusColors = {
  active: 'var(--color-success)',
  pending: 'var(--color-warning)',
  closed: 'var(--color-text-muted)'
};

const riskProfileColors = {
  conservative: 'var(--color-accent)',
  moderate: 'var(--color-success)',
  aggressive: 'var(--color-warning)'
};

export default function MandatesTable() {
  const [filterStatus, setFilterStatus] = useState<'all' | Mandate['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Mandate['type']>('all');

  const filteredMandates = mockMandates.filter(mandate => {
    const statusMatch = filterStatus === 'all' || mandate.status === filterStatus;
    const typeMatch = filterType === 'all' || mandate.type === filterType;
    return statusMatch && typeMatch;
  });

  const totalAUM = filteredMandates.reduce((sum, m) => sum + m.aum, 0);
  const activeCount = filteredMandates.filter(m => m.status === 'active').length;
  const pendingCount = filteredMandates.filter(m => m.status === 'pending').length;
  const avgYTD = filteredMandates.length > 0 
    ? filteredMandates.reduce((sum, m) => sum + m.ytdPerformance, 0) / filteredMandates.length 
    : 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Portfolio</h1>
          <p className={styles.subtitle}>
            Manage client mandates, portfolios, and allocations across all products.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`${styles.filterButton} ${filterStatus === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`${styles.filterButton} ${filterStatus === 'active' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`${styles.filterButton} ${filterStatus === 'pending' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('closed')}
            className={`${styles.filterButton} ${filterStatus === 'closed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Closed
          </button>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type</span>
          <button
            onClick={() => setFilterType('all')}
            className={`${styles.filterButton} ${filterType === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('sovereign')}
            className={`${styles.filterButton} ${filterType === 'sovereign' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Sovereign
          </button>
          <button
            onClick={() => setFilterType('institutional')}
            className={`${styles.filterButton} ${filterType === 'institutional' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Institutional
          </button>
          <button
            onClick={() => setFilterType('corporate')}
            className={`${styles.filterButton} ${filterType === 'corporate' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Corporate
          </button>
          <button
            onClick={() => setFilterType('family-office')}
            className={`${styles.filterButton} ${filterType === 'family-office' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Family Office
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total AUM</div>
          <div className={styles.summaryValue}>{formatCurrency(totalAUM)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Average YTD</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
            +{avgYTD.toFixed(1)}%
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Active</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
            {activeCount}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Pending</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-warning)' }}>
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Mandates Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Mandate ID</th>
              <th className={styles.tableHeaderCell}>Name</th>
              <th className={styles.tableHeaderCell}>Client</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>AUM</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>YTD Performance</th>
              <th className={styles.tableHeaderCell}>Risk Profile</th>
              <th className={styles.tableHeaderCell}>Jurisdiction</th>
              <th className={styles.tableHeaderCell}>Manager</th>
              <th className={styles.tableHeaderCell}>Inception</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMandates.map((mandate) => (
              <tr key={mandate.id} className={styles.tableBodyRow}>
                <td className={`${styles.tableCell} ${styles.tableCellId}`}>
                  {mandate.id}
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.mandateName}>{mandate.name}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.clientName}>{mandate.clientName}</div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.typeBadge} data-type={mandate.type}>
                    {typeLabels[mandate.type]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ 
                      backgroundColor: `${statusColors[mandate.status]}15`,
                      color: statusColors[mandate.status],
                      borderColor: `${statusColors[mandate.status]}40`
                    }}
                  >
                    {mandate.status.charAt(0).toUpperCase() + mandate.status.slice(1)}
                  </span>
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {formatCurrency(mandate.aum)}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  <span style={{ color: mandate.ytdPerformance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {mandate.ytdPerformance > 0 ? '+' : ''}{mandate.ytdPerformance.toFixed(1)}%
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span 
                    className={styles.riskBadge}
                    style={{ 
                      backgroundColor: `${riskProfileColors[mandate.riskProfile]}15`,
                      color: riskProfileColors[mandate.riskProfile],
                      borderColor: `${riskProfileColors[mandate.riskProfile]}40`
                    }}
                  >
                    {mandate.riskProfile.charAt(0).toUpperCase() + mandate.riskProfile.slice(1)}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {mandate.jurisdiction}
                </td>
                <td className={styles.tableCell}>
                  {mandate.manager}
                </td>
                <td className={styles.tableCell}>
                  {formatDate(mandate.inceptionDate)}
                </td>
                <td className={styles.tableCell} style={{ textAlign: 'center' }}>
                  <Link href={`/mandates/${mandate.id}`} style={{ textDecoration: 'none' }}>
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

      {filteredMandates.length === 0 && (
        <div className={styles.emptyState}>
          No mandates found for the selected filters.
        </div>
      )}
    </div>
  );
}
