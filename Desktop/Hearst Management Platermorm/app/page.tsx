import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { mockProducts } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/format';
import {
  mockPerformanceData,
  mockAllocationData,
  mockTrendData,
  mockTopPerformers
} from '@/lib/mock-overview';
import PerformanceChart from '@/components/overview/PerformanceChart';
import AllocationChart from '@/components/overview/AllocationChart';
import TopPerformers from '@/components/overview/TopPerformers';
import styles from './page.module.css';

export default function HomePage() {
  const totalAUM = mockProducts.reduce((sum, p) => sum + p.aum, 0);
  const avgYTD = mockProducts.reduce((sum, p) => sum + p.ytdPerformance, 0) / mockProducts.length;
  const marketProducts = mockProducts.filter(p => p.type === 'market').length;
  const miningProducts = mockProducts.filter(p => p.type === 'mining').length;
  const bouquetProducts = mockProducts.filter(p => p.type === 'bouquet').length;

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>
            Comprehensive view of platform performance, allocations, and key metrics
          </p>
        </div>

        {/* Key Metrics - Horizontal */}
        <div className={styles.metricsGrid}>
          <Card className={styles.metricCard}>
            <div className={styles.metricLabel}>Total AUM</div>
            <div className={styles.metricValue}>{formatCurrency(totalAUM)}</div>
            <div className={styles.metricChange}>+12.4% vs last quarter</div>
          </Card>
          <Card className={styles.metricCard}>
            <div className={styles.metricLabel}>Average YTD</div>
            <div className={`${styles.metricValue} ${styles.metricValueSuccess}`}>
              +{avgYTD.toFixed(1)}%
            </div>
            <div className={styles.metricChange}>+2.1% vs benchmark</div>
          </Card>
          <Card className={styles.metricCard}>
            <div className={styles.metricLabel}>Total Products</div>
            <div className={styles.metricValue}>{mockProducts.length}</div>
            <div className={styles.metricChange}>{marketProducts + miningProducts + bouquetProducts} active</div>
          </Card>
          <Card className={styles.metricCard}>
            <div className={styles.metricLabel}>Active Strategies</div>
            <div className={styles.metricValue}>{mockProducts.length}</div>
            <div className={styles.metricChange}>All performing</div>
          </Card>
        </div>

        {/* Charts Grid - Performance & Allocation */}
        <div className={styles.chartsGrid}>
          <PerformanceChart data={mockPerformanceData} />
          <AllocationChart data={mockAllocationData} />
        </div>

        {/* Top Performers */}
        <TopPerformers data={mockTopPerformers} />

        {/* Trend Metrics */}
        <Card className={styles.trendCard}>
          <h3 className={styles.trendTitle}>Performance Trends</h3>
          <div className={styles.trendGrid}>
            {mockTrendData.map((trend, index) => (
              <div key={index} className={styles.trendItem}>
                <div className={styles.trendPeriod}>{trend.period}</div>
                <div className={styles.trendValue}>+{trend.value.toFixed(1)}%</div>
                <div className={styles.trendChange}>
                  <span className={styles.trendChangePositive}>+{trend.change.toFixed(1)}%</span>
                  <span className={styles.trendChangeLabel}>vs prev</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}



