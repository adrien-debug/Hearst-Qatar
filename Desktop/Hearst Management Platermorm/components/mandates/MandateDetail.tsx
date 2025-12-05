'use client';

import React from 'react';
import { Mandate } from '@/lib/mock-mandates';
import { getPortfoliosByMandateId } from '@/lib/mock-mandates';
import { mockProducts } from '@/lib/mock-data';
import Card from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import Link from 'next/link';
import styles from './MandateDetail.module.css';

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

const mandateTypes = {
  sovereign: 'Sovereign',
  institutional: 'Institutional',
  corporate: 'Corporate',
  'family-office': 'Family Office'
};

const riskProfiles = {
  conservative: 'Conservative',
  moderate: 'Moderate',
  aggressive: 'Aggressive'
};

interface MandateDetailProps {
  mandate: Mandate;
}

export default function MandateDetail({ mandate }: MandateDetailProps) {
  const portfolios = getPortfoliosByMandateId(mandate.id);
  const products = mandate.products.map(id => mockProducts.find(p => p.id === id)).filter(Boolean);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>
            <Link href="/mandates" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Portfolio
            </Link>
            <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
            <span>{mandate.name}</span>
          </div>
          <h1 className={styles.title}>{mandate.name}</h1>
          <p className={styles.subtitle}>{mandate.clientName}</p>
        </div>
      </div>

      {/* Key Metrics - Horizontal */}
      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>AUM</div>
          <div className={styles.metricValue}>{formatCurrency(mandate.aum)}</div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>YTD Performance</div>
          <div className={styles.metricValue} style={{ color: mandate.ytdPerformance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {mandate.ytdPerformance >= 0 ? '+' : ''}{mandate.ytdPerformance.toFixed(1)}%
          </div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Type</div>
          <div className={styles.metricValueSmall}>{mandateTypes[mandate.type]}</div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Risk Profile</div>
          <div className={styles.metricValueSmall}>{riskProfiles[mandate.riskProfile]}</div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricLabel}>Status</div>
          <div className={styles.metricValueSmall} style={{ 
            color: mandate.status === 'active' ? 'var(--color-success)' : mandate.status === 'pending' ? 'var(--color-warning)' : 'var(--color-text-muted)'
          }}>
            {mandate.status.charAt(0).toUpperCase() + mandate.status.slice(1)}
          </div>
        </Card>
      </div>

      {/* Details Grid */}
      <div className={styles.detailsGrid}>
        <Card>
          <h3 className={styles.sectionTitle}>Mandate Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Client Name</span>
              <span className={styles.infoValue}>{mandate.clientName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Jurisdiction</span>
              <span className={styles.infoValue}>{mandate.jurisdiction}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Portfolio Manager</span>
              <span className={styles.infoValue}>{mandate.manager}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Inception Date</span>
              <span className={styles.infoValue}>
                {new Date(mandate.inceptionDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className={styles.sectionTitle}>Portfolio Summary</h3>
          <div className={styles.portfolioSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Number of Portfolios</span>
              <span className={styles.summaryValue}>{portfolios.length}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Value</span>
              <span className={styles.summaryValue}>
                {formatCurrency(portfolios.reduce((sum, p) => sum + p.totalValue, 0))}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Average YTD</span>
              <span className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
                +{((portfolios.reduce((sum, p) => sum + p.ytdPerformance, 0) / portfolios.length) || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <h3 className={styles.sectionTitle}>Associated Products</h3>
        <div className={styles.tableWrapper}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Product Name</TableCell>
                <TableCell header>Type</TableCell>
                <TableCell header style={{ textAlign: 'right' }}>AUM</TableCell>
                <TableCell header style={{ textAlign: 'right' }}>YTD</TableCell>
                <TableCell header style={{ textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {products.map((product) => (
                <TableRow key={product!.id}>
                  <TableCell>{product!.name}</TableCell>
                  <TableCell>
                    <span className={styles.typeBadge} data-type={product!.type}>
                      {product!.type === 'market' ? 'Market Only' : product!.type === 'mining' ? 'Mining-Enhanced' : 'Bouquet'}
                    </span>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(product!.aum)}
                  </TableCell>
                  <TableCell style={{ 
                    textAlign: 'right', 
                    fontWeight: 600,
                    color: product!.ytdPerformance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                  }}>
                    {product!.ytdPerformance >= 0 ? '+' : ''}{product!.ytdPerformance.toFixed(1)}%
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Link href={`/products/${product!.id}`} style={{ textDecoration: 'none' }}>
                      <button className={styles.actionButton}>
                        View
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Portfolios Section */}
      {portfolios.length > 0 && (
        <Card>
          <h3 className={styles.sectionTitle}>Portfolios</h3>
          <div className={styles.portfoliosList}>
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className={styles.portfolioCard}>
                <div className={styles.portfolioHeader}>
                  <h4 className={styles.portfolioName}>{portfolio.name}</h4>
                  <div className={styles.portfolioMetrics}>
                    <div>
                      <span className={styles.portfolioMetricLabel}>Total Value</span>
                      <span className={styles.portfolioMetricValue}>{formatCurrency(portfolio.totalValue)}</span>
                    </div>
                    <div>
                      <span className={styles.portfolioMetricLabel}>YTD</span>
                      <span className={styles.portfolioMetricValue} style={{ color: 'var(--color-success)' }}>
                        +{portfolio.ytdPerformance.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.allocationTable}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell header>Product</TableCell>
                        <TableCell header style={{ textAlign: 'right' }}>Allocation %</TableCell>
                        <TableCell header style={{ textAlign: 'right' }}>Value</TableCell>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {portfolio.allocation.map((alloc, index) => (
                        <TableRow key={index}>
                          <TableCell>{alloc.productName}</TableCell>
                          <TableCell style={{ textAlign: 'right', fontWeight: 600 }}>
                            {alloc.allocationPercent}%
                          </TableCell>
                          <TableCell style={{ textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(alloc.value)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className={styles.portfolioFooter}>
                  <span className={styles.lastRebalanced}>
                    Last rebalanced: {new Date(portfolio.lastRebalanced).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}



