'use client';

import React, { useState } from 'react';
import { RiskMetric, ComplianceCheck, RiskAlert } from '@/lib/mock-risk';
import { mockRiskMetrics, mockComplianceChecks, mockRiskAlerts } from '@/lib/mock-risk';
import Link from 'next/link';
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
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Risk & Compliance</h1>
          <p className={styles.subtitle}>
            Monitor risk metrics, compliance status, and operational alerts across all products and mandates.
          </p>
        </div>
      </div>

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
              <div className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
                {compliantCount}/{mockComplianceChecks.length}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Open Alerts</div>
              <div className={styles.summaryValue} style={{ color: openAlertsCount > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
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
                      <span 
                        className={styles.severityBadge}
                        style={{
                          backgroundColor: `${riskLevelColors[alert.severity]}15`,
                          color: riskLevelColors[alert.severity],
                          borderColor: `${riskLevelColors[alert.severity]}40`
                        }}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span 
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: `${alertStatusColors[alert.status]}15`,
                          color: alertStatusColors[alert.status],
                          borderColor: `${alertStatusColors[alert.status]}40`
                        }}
                      >
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
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Risk Level</span>
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
          </div>

          {/* Risk Metrics Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeaderCell}>Product</th>
                  <th className={styles.tableHeaderCell}>Risk Level</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Volatility</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Max Drawdown</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Sharpe Ratio</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Beta</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>VaR 95%</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Stress Score</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiskMetrics.map((metric) => (
                  <tr key={metric.id} className={styles.tableBodyRow}>
                    <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                      {metric.productName}
                    </td>
                    <td className={styles.tableCell}>
                      <span 
                        className={styles.riskLevelBadge}
                        style={{
                          backgroundColor: `${riskLevelColors[metric.riskLevel]}15`,
                          color: riskLevelColors[metric.riskLevel],
                          borderColor: `${riskLevelColors[metric.riskLevel]}40`
                        }}
                      >
                        {metric.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                      {metric.volatility.toFixed(1)}%
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`} style={{ color: 'var(--color-danger)' }}>
                      {metric.maxDrawdown.toFixed(1)}%
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                      {metric.sharpeRatio.toFixed(2)}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                      {metric.beta.toFixed(2)}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellMetric}`} style={{ color: 'var(--color-danger)' }}>
                      {metric.var95.toFixed(1)}%
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.stressScoreContainer}>
                        <div className={styles.stressScoreBar}>
                          <div 
                            className={styles.stressScoreFill}
                            style={{ 
                              width: `${metric.stressTestScore}%`,
                              backgroundColor: metric.stressTestScore >= 70 ? 'var(--color-success)' : metric.stressTestScore >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                            }}
                          />
                        </div>
                        <span className={styles.stressScoreValue}>{metric.stressTestScore}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell} style={{ textAlign: 'center' }}>
                      <Link href={`/products/${metric.productId}`} style={{ textDecoration: 'none' }}>
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
        </>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <>
          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Status</span>
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
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
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
                      <span 
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: `${statusColors[check.status]}15`,
                          color: statusColors[check.status],
                          borderColor: `${statusColors[check.status]}40`
                        }}
                      >
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
                      <span 
                        className={styles.severityBadge}
                        style={{
                          backgroundColor: `${riskLevelColors[check.severity]}15`,
                          color: riskLevelColors[check.severity],
                          borderColor: `${riskLevelColors[check.severity]}40`
                        }}
                      >
                        {check.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(check.lastChecked).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(check.nextReview).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className={styles.tableCell} style={{ textAlign: 'center' }}>
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
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Severity</span>
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
          </div>

          {/* Alerts Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeaderCell}>Alert</th>
                  <th className={styles.tableHeaderCell}>Type</th>
                  <th className={styles.tableHeaderCell}>Severity</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Entity</th>
                  <th className={styles.tableHeaderCell}>Created</th>
                  <th className={styles.tableHeaderCell}>Resolved</th>
                  <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className={styles.tableBodyRow}>
                    <td className={`${styles.tableCell} ${styles.tableCellName}`}>
                      <div>
                        <div className={styles.alertTitle}>{alert.title}</div>
                        <div className={styles.alertDescription}>{alert.description}</div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.typeBadge} data-type={alert.type}>
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span 
                        className={styles.severityBadge}
                        style={{
                          backgroundColor: `${riskLevelColors[alert.severity]}15`,
                          color: riskLevelColors[alert.severity],
                          borderColor: `${riskLevelColors[alert.severity]}40`
                        }}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span 
                        className={styles.statusBadge}
                        style={{
                          backgroundColor: `${alertStatusColors[alert.status]}15`,
                          color: alertStatusColors[alert.status],
                          borderColor: `${alertStatusColors[alert.status]}40`
                        }}
                      >
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {alert.productName || alert.mandateName || 'Global'}
                    </td>
                    <td className={styles.tableCell}>
                      {new Date(alert.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className={styles.tableCell}>
                      {alert.resolvedAt 
                        ? new Date(alert.resolvedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '—'
                      }
                    </td>
                    <td className={styles.tableCell} style={{ textAlign: 'center' }}>
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
    </div>
  );
}



