'use client';

import React, { useState } from 'react';
import { Report } from '@/lib/mock-reports';
import { mockReports } from '@/lib/mock-reports';
import { formatDate } from '@/lib/format';
import Modal from '@/components/ui/Modal';
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

const typeIcons = {
  performance: '📊',
  risk: '⚠️',
  compliance: '✅',
  operational: '⚙️',
  custom: '📄'
};

const frequencyIcons = {
  daily: '📅',
  weekly: '📆',
  monthly: '🗓️',
  quarterly: '📋',
  annual: '📑',
  'on-demand': '🔔'
};

export default function ReportsTable() {
  const [filterType, setFilterType] = useState<'all' | Report['type']>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReports = mockReports.filter(report => {
    const typeMatch = filterType === 'all' || report.type === filterType;
    return typeMatch;
  });

  const totalReports = mockReports.length;
  const completedCount = mockReports.filter(r => r.status === 'completed').length;
  const scheduledCount = mockReports.filter(r => r.status === 'scheduled').length;
  const generatingCount = mockReports.filter(r => r.status === 'generating').length;

  return (
    <>
      {/* Filters */}
      <div className={styles.filters}>
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

      {/* Reports Table - Simplified */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Report Name</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Frequency</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr 
                key={report.id} 
                className={styles.tableBodyRow}
                onClick={() => {
                  setSelectedReport(report);
                  setIsModalOpen(true);
                }}
              >
                <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                  <div className={styles.reportName}>{report.name}</div>
                  <div className={styles.reportEntity}>{report.productName || report.mandateName || 'Global'}</div>
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
                  <span className={styles.statusBadge}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
        }}
        title={selectedReport?.name}
      >
        {selectedReport && (
          <div>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Description</span>
              </div>
              <p style={{ color: '#ffffff', lineHeight: '1.6', margin: 0 }}>{selectedReport.description}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Type</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {typeLabels[selectedReport.type]}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Frequency</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {frequencyLabels[selectedReport.frequency]}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Status</span>
                <div style={{ color: statusColors[selectedReport.status], fontWeight: 600, marginTop: '4px' }}>
                  {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Format</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {selectedReport.format.toUpperCase()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Entity</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {selectedReport.productName || selectedReport.mandateName || 'Global'}
                </div>
              </div>
              {selectedReport.size && (
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Size</span>
                  <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                    {formatFileSize(selectedReport.size)}
                  </div>
                </div>
              )}
              {selectedReport.lastGenerated && (
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Last Generated</span>
                  <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                    {formatDate(selectedReport.lastGenerated, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
              {selectedReport.nextGeneration && (
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Next Generation</span>
                  <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                    {formatDate(selectedReport.nextGeneration, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
              {selectedReport.recipient && (
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Recipient</span>
                  <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                    {selectedReport.recipient}
                  </div>
                </div>
              )}
            </div>
            {selectedReport.status === 'completed' && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button style={{
                  padding: '12px 24px',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Download Report
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {filteredReports.length === 0 && (
        <div className={styles.emptyState}>
          No reports found for the selected filters.
        </div>
      )}
    </>
  );
}



