'use client';

import React from 'react';
import { Execution } from '@/lib/mock-executions';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import styles from './ExecutionDetail.module.css';

const typeLabels = {
  buy: 'Buy',
  sell: 'Sell',
  rebalance: 'Rebalance',
  allocation: 'Allocation'
};

const statusColors = {
  pending: 'var(--color-warning)',
  executing: 'var(--color-accent)',
  completed: 'var(--color-success)',
  failed: 'var(--color-danger)',
  cancelled: 'var(--color-text-muted)'
};

interface ExecutionDetailProps {
  execution: Execution;
}

export default function ExecutionDetail({ execution }: ExecutionDetailProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <Link href="/execution" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Execution
            </Link>
            <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
            <span>{execution.orderId}</span>
          </div>
          <h1 className={styles.title}>{execution.orderId}</h1>
          <p className={styles.subtitle}>{execution.productName}</p>
        </div>
      </div>

      {/* Key Metrics - Horizontal */}
      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Status</div>
          <div className={styles.metricValueSmall} style={{ 
            color: statusColors[execution.status]
          }}>
            {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
          </div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Type</div>
          <div className={styles.metricValueSmall}>{typeLabels[execution.type]}</div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Value</div>
          <div className={styles.metricValue}>{formatCurrency(execution.value)}</div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Fees</div>
          <div className={styles.metricValue}>{formatCurrency(execution.fees)}</div>
        </Card>
        {execution.slippage !== undefined && (
          <Card className={styles.metricCard}>
            <div className={styles.metricLabel}>Slippage</div>
            <div className={styles.metricValueSmall} style={{ 
              color: execution.slippage >= 0 ? 'var(--color-danger)' : 'var(--color-success)'
            }}>
              {execution.slippage >= 0 ? '+' : ''}{execution.slippage.toFixed(2)}%
            </div>
          </Card>
        )}
      </div>

      {/* Details Grid */}
      <div className={styles.detailsGrid}>
        <Card>
          <h3 className={styles.sectionTitle}>Execution Details</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Order ID</span>
              <span className={styles.infoValue}>{execution.orderId}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Product</span>
              <span className={styles.infoValue}>
                <Link href={`/products/${execution.productId}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                  {execution.productName}
                </Link>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Asset</span>
              <span className={styles.infoValue}>{execution.asset}</span>
            </div>
            {execution.quantity > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Quantity</span>
                <span className={styles.infoValue}>{formatNumber(execution.quantity, { decimals: 1 })}</span>
              </div>
            )}
            {execution.price > 0 && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Price</span>
                <span className={styles.infoValue}>{formatCurrency(execution.price)}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Execution Venue</span>
              <span className={styles.infoValue}>{execution.executionVenue}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>Timing</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Order Timestamp</span>
              <span className={styles.infoValue}>{formatDate(execution.timestamp)}</span>
            </div>
            {execution.executedAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Executed At</span>
                <span className={styles.infoValue}>{formatDate(execution.executedAt)}</span>
              </div>
            )}
            {execution.executedAt && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Execution Time</span>
                <span className={styles.infoValue}>
                  {Math.round((new Date(execution.executedAt).getTime() - new Date(execution.timestamp).getTime()) / 1000)}s
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Mandate Information */}
      {execution.mandateId && execution.mandateName && (
        <Card>
          <h3 className={styles.sectionTitle}>Mandate Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Mandate</span>
              <span className={styles.infoValue}>
                <Link href={`/mandates/${execution.mandateId}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                  {execution.mandateName}
                </Link>
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



