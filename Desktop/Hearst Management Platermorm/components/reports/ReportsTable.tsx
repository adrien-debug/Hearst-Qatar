'use client';

import React, { useState } from 'react';
import { Report } from '@/lib/mock-reports';
import { mockReports } from '@/lib/mock-reports';
import Link from 'next/link';
import { formatDate } from '@/lib/format';
import styles from './ReportsTable.module.css';

function formatFileSize(kb: number): string {
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)} MB`;
  }
  return `${kb} KB`;
}

const typeLabels = {
  performance: 'Performance',
  risk: 'Risk',
  compliance: 'Compliance',
  operational: 'Operational',
  custom: 'Custom'
};

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  'on-demand': 'On-Demand'
};

const statusColors = {
  scheduled: 'var(--color-text-muted)',
  generating: 'var(--color-accent)',
  completed: 'var(--color-success)',
  failed: 'var(--color-danger)'
};

export default function ReportsTable() {
  const [filterType, setFilterType] = useState<'all' | Report['type']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Report['status']>('all');
  const [filterFrequency, setFilterFrequency] = useState<'all' | Report['frequency']>('all');

  const filteredReports = mockReports.filter(report => {
    const typeMatch = filterType === 'all' || report.type === filterType;
    const statusMatch = filterStatus === 'all' || report.status === filterStatus;
    const frequencyMatch = filterFrequency === 'all' || report.frequency === filterFrequency;
    return typeMatch && statusMatch && frequencyMatch;
  });

  const totalReports = mockReports.length;
  const completedCount = mockReports.filter(r => r.status === 'completed').length;
  const scheduledCount = mockReports.filter(r => r.status === 'scheduled').length;
  const generatingCount = mockReports.filter(r => r.status === 'generating').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.subtitle}>
            Generate, schedule, and manage reports across all products, mandates, and operational areas.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type</span>
          <button
            onClick={() => setFilterType('all')}
            className={`${styles.filterButton} ${filterType === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('performance')}
            className={`${styles.filterButton} ${filterType === 'performance' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Performance
          </button>
          <button
            onClick={() => setFilterType('risk')}
            className={`${styles.filterButton} ${filterType === 'risk' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Risk
          </button>
          <button
            onClick={() => setFilterType('compliance')}
            className={`${styles.filterButton} ${filterType === 'compliance' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Compliance
          </button>
          <button
            onClick={() => setFilterType('operational')}
            className={`${styles.filterButton} ${filterType === 'operational' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Operational
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={`${styles.filterButton} ${filterType === 'custom' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Custom
          </button>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`${styles.filterButton} ${filterStatus === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`${styles.filterButton} ${filterStatus === 'scheduled' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilterStatus('generating')}
            className={`${styles.filterButton} ${filterStatus === 'generating' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Generating
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`${styles.filterButton} ${filterStatus === 'completed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('failed')}
            className={`${styles.filterButton} ${filterStatus === 'failed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Failed
          </button>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Frequency</span>
          <button
            onClick={() => setFilterFrequency('all')}
            className={`${styles.filterButton} ${filterFrequency === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterFrequency('daily')}
            className={`${styles.filterButton} ${filterFrequency === 'daily' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Daily
          </button>
          <button
            onClick={() => setFilterFrequency('weekly')}
            className={`${styles.filterButton} ${filterFrequency === 'weekly' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilterFrequency('monthly')}
            className={`${styles.filterButton} ${filterFrequency === 'monthly' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilterFrequency('quarterly')}
            className={`${styles.filterButton} ${filterFrequency === 'quarterly' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Reports</div>
          <div className={styles.summaryValue}>{totalReports}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Completed</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
            {completedCount}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Scheduled</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-text-muted)' }}>
            {scheduledCount}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Generating</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-accent)' }}>
            {generatingCount}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Report Name</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Frequency</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Entity</th>
              <th className={styles.tableHeaderCell}>Format</th>
              <th className={styles.tableHeaderCell}>Size</th>
              <th className={styles.tableHeaderCell}>Last Generated</th>
              <th className={styles.tableHeaderCell}>Next Generation</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className={styles.tableBodyRow}>
                <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                  <div>
                    <div className={styles.reportName}>{report.name}</div>
                    <div className={styles.reportDescription}>{report.description}</div>
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.typeBadge} data-type={report.type}>
                    {typeLabels[report.type]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.frequencyBadge}>
                    {frequencyLabels[report.frequency]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ 
                      backgroundColor: `${statusColors[report.status]}15`,
                      color: statusColors[report.status],
                      borderColor: `${statusColors[report.status]}40`
                    }}
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {report.productName || report.mandateName || 'Global'}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.formatBadge} data-format={report.format}>
                    {report.format.toUpperCase()}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {report.size ? formatFileSize(report.size) : '—'}
                </td>
                <td className={styles.tableCell}>
                  {report.lastGenerated 
                    ? formatDate(report.lastGenerated, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'
                  }
                </td>
                <td className={styles.tableCell}>
                  {report.nextGeneration 
                    ? formatDate(report.nextGeneration, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—'
                  }
                </td>
                <td className={styles.tableCell} style={{ textAlign: 'center' }}>
                  <div className={styles.actionButtons}>
                    {report.status === 'completed' && (
                      <button className={styles.downloadButton}>
                        Download
                      </button>
                    )}
                    <button className={styles.actionButton}>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className={styles.emptyState}>
          No reports found for the selected filters.
        </div>
      )}
    </div>
  );
}



