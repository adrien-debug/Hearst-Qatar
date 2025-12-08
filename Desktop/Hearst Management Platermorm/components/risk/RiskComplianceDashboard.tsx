'use client';

import React, { useState } from 'react';
import { RiskMetric, ComplianceCheck, RiskAlert } from '@/lib/mock-risk';
import { mockRiskMetrics, mockComplianceChecks, mockRiskAlerts } from '@/lib/mock-risk';
import Modal from '@/components/ui/Modal';
import RiskDetail from './RiskDetail';
import ComplianceDetail from './ComplianceDetail';
import styles from './RiskComplianceDashboard.module.css';

const riskLevelColors = {
  low: 'var(--color-success)',
  medium: 'var(--color-warning)',
  high: 'var(--color-danger)',
  critical: '#991b1b'
};

const statusColors = {
  compliant: 'var(--color-success)',
  warning: 'var(--color-warning)',
  'non-compliant': 'var(--color-danger)',
  pending: 'var(--color-text-muted)'
};

const alertStatusColors = {
  open: 'var(--color-danger)',
  acknowledged: 'var(--color-warning)',
  resolved: 'var(--color-success)',
  dismissed: 'var(--color-text-muted)'
};


export default function RiskComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'compliance' | 'alerts'>('overview');
  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | RiskMetric['riskLevel']>('all');
  const [filterComplianceStatus, setFilterComplianceStatus] = useState<'all' | ComplianceCheck['status']>('all');
  const [filterAlertSeverity, setFilterAlertSeverity] = useState<'all' | RiskAlert['severity']>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskMetric | null>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceCheck | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'risk' | 'compliance' | 'alert' | null>(null);

  const filteredRiskMetrics = filterRiskLevel === 'all' 
    ? mockRiskMetrics 
    : mockRiskMetrics.filter(m => m.riskLevel === filterRiskLevel);

  const filteredComplianceChecks = filterComplianceStatus === 'all'
    ? mockComplianceChecks
    : mockComplianceChecks.filter(c => c.status === filterComplianceStatus);

  const filteredAlerts = filterAlertSeverity === 'all'
    ? mockRiskAlerts
    : mockRiskAlerts.filter(a => a.severity === filterAlertSeverity);

  const avgVolatility = mockRiskMetrics.reduce((sum, m) => sum + m.volatility, 0) / mockRiskMetrics.length;
  const avgSharpe = mockRiskMetrics.reduce((sum, m) => sum + m.sharpeRatio, 0) / mockRiskMetrics.length;
  const compliantCount = mockComplianceChecks.filter(c => c.status === 'compliant').length;
  const openAlertsCount = mockRiskAlerts.filter(a => a.status === 'open' || a.status === 'acknowledged').length;

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.tabButtonActive : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`${styles.tabButton} ${activeTab === 'risk' ? styles.tabButtonActive : ''}`}
          >
            Risk Metrics
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`${styles.tabButton} ${activeTab === 'compliance' ? styles.tabButtonActive : ''}`}
          >
            Compliance
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`${styles.tabButton} ${activeTab === 'alerts' ? styles.tabButtonActive : ''}`}
          >
            Alerts
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Avg Volatility</div>
              <div className={styles.summaryValue}>{avgVolatility.toFixed(1)}%</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Avg Sharpe Ratio</div>
              <div className={styles.summaryValue}>{avgSharpe.toFixed(2)}</div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Compliant Checks</div>
              <div className={styles.summaryValue}>
                {compliantCount}/{mockComplianceChecks.length}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Open Alerts</div>
              <div className={styles.summaryValue}>
                {openAlertsCount}
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Alerts</h2>
            <div className={styles.alertsList}>
              {mockRiskAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className={styles.alertCard}>
                  <div className={styles.alertHeader}>
                    <div>
                      <h3 className={styles.alertTitle}>{alert.title}</h3>
                      <p className={styles.alertDescription}>{alert.description}</p>
                    </div>
                    <div className={styles.alertBadges}>
                      <span className={styles.severityBadge}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={styles.statusBadge}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Risk Metrics Tab */}
      {activeTab === 'risk' && (
        <>
          {/* Filters */}
          <div className={styles.filters}>
            <button
              onClick={() => setFilterRiskLevel('all')}
              className={`${styles.filterButton} ${filterRiskLevel === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRiskLevel('low')}
              className={`${styles.filterButton} ${filterRiskLevel === 'low' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Low
            </button>
            <button
              onClick={() => setFilterRiskLevel('medium')}
              className={`${styles.filterButton} ${filterRiskLevel === 'medium' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilterRiskLevel('high')}
              className={`${styles.filterButton} ${filterRiskLevel === 'high' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              High
            </button>
            <button
              onClick={() => setFilterRiskLevel('critical')}
              className={`${styles.filterButton} ${filterRiskLevel === 'critical' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Critical
            </button>
          </div>

          {/* Risk Metrics Table - Simplified */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeaderCell}>Product</th>
                  <th className={styles.tableHeaderCell}>Risk Level</th>
                  <th className={styles.tableHeaderCell}>Volatility</th>
                  <th className={styles.tableHeaderCell}>Stress Score</th>
                  <th className={styles.tableHeaderCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiskMetrics.map((metric) => (
                  <tr 
                    key={metric.id} 
                    className={styles.tableBodyRow}
                    onClick={() => {
                      setSelectedRisk(metric);
                      setModalType('risk');
                      setIsModalOpen(true);
                    }}
                  >
                    <td className={styles.tableCell}>
                      <div className={styles.productName}>{metric.productName}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.riskLevelBadge}>
                        {metric.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                      {metric.volatility.toFixed(1)}%
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                      {metric.stressTestScore}
                    </td>
                    <td className={styles.tableCell}>
                      <button 
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRisk(metric);
                          setModalType('risk');
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
        </>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <>
          {/* Filters */}
          <div className={styles.filters}>
            <button
              onClick={() => setFilterComplianceStatus('all')}
              className={`${styles.filterButton} ${filterComplianceStatus === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterComplianceStatus('compliant')}
              className={`${styles.filterButton} ${filterComplianceStatus === 'compliant' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Compliant
            </button>
            <button
              onClick={() => setFilterComplianceStatus('warning')}
              className={`${styles.filterButton} ${filterComplianceStatus === 'warning' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Warning
            </button>
            <button
              onClick={() => setFilterComplianceStatus('non-compliant')}
              className={`${styles.filterButton} ${filterComplianceStatus === 'non-compliant' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Non-Compliant
            </button>
            <button
              onClick={() => setFilterComplianceStatus('pending')}
              className={`${styles.filterButton} ${filterComplianceStatus === 'pending' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Pending
            </button>
          </div>

          {/* Compliance Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeaderCell}>Check Name</th>
                  <th className={styles.tableHeaderCell}>Type</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Jurisdiction</th>
                  <th className={styles.tableHeaderCell}>Entity</th>
                  <th className={styles.tableHeaderCell}>Severity</th>
                  <th className={styles.tableHeaderCell}>Last Checked</th>
                  <th className={styles.tableHeaderCell}>Next Review</th>
                  <th className={styles.tableHeaderCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplianceChecks.map((check) => (
                  <tr key={check.id} className={styles.tableBodyRow}>
                    <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                      {check.name}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.typeBadge} data-type={check.type}>
                        {check.type.charAt(0).toUpperCase() + check.type.slice(1)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.statusBadge}>
                        {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {check.jurisdiction}
                    </td>
                    <td className={styles.tableCell}>
                      {check.productName || check.mandateName || 'Global'}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.severityBadge}>
                        {check.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(check.lastChecked).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(check.nextReview).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className={styles.tableCell}>
                      <button className={styles.actionButton}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <>
          {/* Filters */}
          <div className={styles.filters}>
            <button
              onClick={() => setFilterAlertSeverity('all')}
              className={`${styles.filterButton} ${filterAlertSeverity === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterAlertSeverity('low')}
              className={`${styles.filterButton} ${filterAlertSeverity === 'low' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Low
            </button>
            <button
              onClick={() => setFilterAlertSeverity('medium')}
              className={`${styles.filterButton} ${filterAlertSeverity === 'medium' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilterAlertSeverity('high')}
              className={`${styles.filterButton} ${filterAlertSeverity === 'high' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              High
            </button>
            <button
              onClick={() => setFilterAlertSeverity('critical')}
              className={`${styles.filterButton} ${filterAlertSeverity === 'critical' ? styles.filterButtonActive : styles.filterButtonInactive}`}
            >
              Critical
            </button>
          </div>

          {/* Alerts Table - Simplified */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeaderCell}>Alert</th>
                  <th className={styles.tableHeaderCell}>Type</th>
                  <th className={styles.tableHeaderCell}>Severity</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id} 
                    className={styles.tableBodyRow}
                    onClick={() => {
                      setSelectedAlert(alert);
                      setModalType('alert');
                      setIsModalOpen(true);
                    }}
                  >
                    <td className={styles.tableCell}>
                      <div className={styles.alertTitle}>{alert.title}</div>
                      <div className={styles.alertEntity}>{alert.productName || alert.mandateName || 'Global'}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.typeBadge} data-type={alert.type}>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.severityBadge}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.statusBadge}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <button 
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(alert);
                          setModalType('alert');
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
        </>
      )}

      {/* Modals */}
      <Modal 
        isOpen={isModalOpen && modalType === 'risk' && selectedRisk !== null} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRisk(null);
          setModalType(null);
        }}
        title={selectedRisk?.productName}
      >
        {selectedRisk && <RiskDetail metric={selectedRisk} />}
      </Modal>

      <Modal 
        isOpen={isModalOpen && modalType === 'compliance' && selectedCompliance !== null} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompliance(null);
          setModalType(null);
        }}
        title={selectedCompliance?.name}
      >
        {selectedCompliance && <ComplianceDetail check={selectedCompliance} />}
      </Modal>

      <Modal 
        isOpen={isModalOpen && modalType === 'alert' && selectedAlert !== null} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
          setModalType(null);
        }}
        title={selectedAlert?.title}
      >
        {selectedAlert && (
          <div>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Description</span>
              </div>
              <p style={{ color: '#ffffff', lineHeight: '1.6', margin: 0 }}>{selectedAlert.description}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Type</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {selectedAlert.type.charAt(0).toUpperCase() + selectedAlert.type.slice(1)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Severity</span>
                <div style={{ color: riskLevelColors[selectedAlert.severity], fontWeight: 600, marginTop: '4px' }}>
                  {selectedAlert.severity.toUpperCase()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Status</span>
                <div style={{ color: alertStatusColors[selectedAlert.status], fontWeight: 600, marginTop: '4px' }}>
                  {selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Entity</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {selectedAlert.productName || selectedAlert.mandateName || 'Global'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Created</span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                  {new Date(selectedAlert.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              {selectedAlert.resolvedAt && (
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Resolved</span>
                  <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                    {new Date(selectedAlert.resolvedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}



