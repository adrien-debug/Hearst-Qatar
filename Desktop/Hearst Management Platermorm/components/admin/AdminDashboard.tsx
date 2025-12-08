'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockAdminSections, mockSystemMetrics, mockAuditLogs, AdminSection, SystemMetric, AuditLog } from '@/lib/mock-admin';
import { formatDate } from '@/lib/format';
import { 
  getAdminIcon, 
  StatusHealthyIcon, 
  StatusWarningIcon, 
  StatusCriticalIcon,
  TrendUpIcon,
  TrendDownIcon,
  TrendStableIcon
} from './AdminIcons';
import styles from './AdminDashboard.module.css';

const categoryLabels = {
  products: 'Products',
  users: 'Users',
  system: 'System',
  security: 'Security',
  data: 'Data'
};

const statusColors = {
  active: 'var(--color-success)',
  maintenance: 'var(--color-warning)',
  beta: 'var(--color-accent)'
};

const trendIconMap = {
  up: TrendUpIcon,
  down: TrendDownIcon,
  stable: TrendStableIcon
};

const statusIconMap = {
  healthy: StatusHealthyIcon,
  warning: StatusWarningIcon,
  critical: StatusCriticalIcon
};

export default function AdminDashboard() {
  const [filterCategory, setFilterCategory] = useState<'all' | AdminSection['category']>('all');

  const filteredSections = mockAdminSections.filter(section => {
    const categoryMatch = filterCategory === 'all' || section.category === filterCategory;
    return categoryMatch;
  });

  const recentLogs = mockAuditLogs.slice(0, 5);

  return (
    <div className={styles.container}>
      {/* System Metrics */}
      <div className={styles.metricsSection}>
        <h2 className={styles.sectionTitle}>System Metrics</h2>
        <div className={styles.metricsGrid}>
          {mockSystemMetrics.map((metric) => (
            <div key={metric.id} className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>{metric.label}</span>
                {metric.status && statusIconMap[metric.status] && (
                  <span 
                    className={styles.metricStatus}
                    style={{ 
                      color: metric.status === 'healthy' 
                        ? 'var(--color-success)' 
                        : metric.status === 'warning'
                        ? 'var(--color-warning)'
                        : 'var(--color-danger)'
                    }}
                  >
                    {React.createElement(statusIconMap[metric.status], {
                      className: styles.metricStatusIcon
                    })}
                  </span>
                )}
              </div>
              <div className={styles.metricValue}>
                <span>
                  {typeof metric.value === 'number' && metric.value < 1 
                    ? metric.value.toFixed(2)
                    : typeof metric.value === 'number'
                    ? metric.value.toFixed(metric.id === 'api-latency' ? 0 : 0)
                    : metric.value
                  }
                </span>
                {metric.unit && <span className={styles.metricUnit}>{metric.unit}</span>}
                {metric.trend && trendIconMap[metric.trend] && (
                  <span 
                    className={styles.metricTrend}
                    style={{ 
                      color: metric.trend === 'up' 
                        ? 'var(--color-success)' 
                        : metric.trend === 'down'
                        ? 'var(--color-danger)'
                        : 'var(--color-text-muted)'
                    }}
                  >
                    {React.createElement(trendIconMap[metric.trend], {
                      className: styles.metricTrendIcon
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          onClick={() => setFilterCategory('all')}
          className={`${styles.filterButton} ${filterCategory === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          All
        </button>
        <button
          onClick={() => setFilterCategory('products')}
          className={`${styles.filterButton} ${filterCategory === 'products' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Products
        </button>
        <button
          onClick={() => setFilterCategory('users')}
          className={`${styles.filterButton} ${filterCategory === 'users' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Users
        </button>
        <button
          onClick={() => setFilterCategory('system')}
          className={`${styles.filterButton} ${filterCategory === 'system' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          System
        </button>
        <button
          onClick={() => setFilterCategory('security')}
          className={`${styles.filterButton} ${filterCategory === 'security' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Security
        </button>
        <button
          onClick={() => setFilterCategory('data')}
          className={`${styles.filterButton} ${filterCategory === 'data' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Data
        </button>
      </div>

      {/* Admin Sections Grid */}
      <div className={styles.sectionsGrid}>
        {filteredSections.map((section) => (
          <Link 
            key={section.id} 
            href={section.path}
            className={styles.sectionCard}
          >
            <div className={styles.sectionIcon}>
              {React.createElement(getAdminIcon(section.iconId), {
                className: styles.iconSvg
              })}
            </div>
            <div className={styles.sectionCardHeader}>
              <div className={styles.sectionCardTitleRow}>
                <h3 className={styles.sectionCardTitle}>{section.title}</h3>
                <span 
                  className={styles.sectionStatus}
                  style={{ 
                    backgroundColor: `${statusColors[section.status]}15`,
                    color: statusColors[section.status],
                    borderColor: `${statusColors[section.status]}40`
                  }}
                >
                  {section.status}
                </span>
              </div>
            </div>
            <p className={styles.sectionDescription}>{section.description}</p>
            <div className={styles.sectionCategory}>
              <span className={styles.categoryBadge} data-category={section.category}>
                {categoryLabels[section.category]}
              </span>
            </div>
            {section.stats && (
              <div className={styles.sectionStats}>
                {section.stats.map((stat, idx) => (
                  <div key={idx} className={styles.statItem}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <Link href="/admin/audit" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>
        <div className={styles.activityTable}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeaderCell}>Timestamp</th>
                <th className={styles.tableHeaderCell}>User</th>
                <th className={styles.tableHeaderCell}>Action</th>
                <th className={styles.tableHeaderCell}>Resource</th>
                <th className={styles.tableHeaderCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log) => (
                <tr key={log.id} className={styles.tableBodyRow}>
                  <td className={styles.tableCell}>
                    {formatDate(log.timestamp, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className={styles.tableCell}>{log.user}</td>
                  <td className={styles.tableCell}>{log.action}</td>
                  <td className={styles.tableCell}>{log.resource}</td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSections.length === 0 && (
        <div className={styles.emptyState}>
          No admin sections found for the selected filters.
        </div>
      )}
    </div>
  );
}


