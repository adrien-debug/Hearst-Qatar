import React from 'react';
import { MiningConfig } from '@/types/product';
import Card from '@/components/ui/Card';
import MiningIndicator from '@/components/ui/MiningIndicator';
import styles from './MiningIntegrationBlock.module.css';

interface MiningIntegrationBlockProps {
  miningConfig: MiningConfig;
  miningExposurePercent: number;
}

export default function MiningIntegrationBlock({ 
  miningConfig, 
  miningExposurePercent 
}: MiningIntegrationBlockProps) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <Card>
        <h3 className={styles.title}>Mining Integration</h3>

      {/* Status */}
      <div className={styles.section}>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>Mining Status</span>
          <span className={`${styles.statusBadge} ${miningConfig.active ? styles.statusBadgeActive : styles.statusBadgeInactive}`}>
            {miningConfig.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {miningConfig.active && (
        <>
          {/* Mining Exposure */}
          <div className={styles.section}>
            <div className={styles.exposureRow}>
              <span className={styles.exposureLabel}>Strategy Exposure to Mining</span>
              <span className={styles.exposureValue}>{miningExposurePercent}%</span>
            </div>
            <MiningIndicator percent={miningExposurePercent} />
            <p className={styles.exposureNote}>
              Maximum allowed: {miningConfig.maxExposurePercent}%
            </p>
          </div>

          {/* Mining Pools */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Mining Pools</h4>
            <div className={styles.poolsList}>
              {miningConfig.pools.map((pool) => (
                <div key={pool.id} className={styles.poolItem}>
                  <div>
                    <div className={styles.poolName}>{pool.name}</div>
                    <div className={styles.poolCountry}>{pool.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role of Mining */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Role of Mining</h4>
            <div className={styles.roleContainer}>
              {miningConfig.role === 'sourcing' && (
                <span className={styles.roleBadge}>
                  BTC Sourcing
                </span>
              )}
              {miningConfig.role === 'collateral' && (
                <span className={styles.roleBadge}>
                  Collateral Enhancement
                </span>
              )}
            </div>
            <p className={styles.roleDescription}>
              {miningConfig.role === 'sourcing' 
                ? 'Mining is used as a source of BTC for the strategy, complementing market purchases.'
                : 'Mining outputs are used to enhance collateral backing for yield generation.'}
            </p>
          </div>

          {/* Stress Scenarios */}
          <div>
            <h4 className={styles.sectionTitle}>Stress Scenarios</h4>
            <div className={styles.stressScenariosList}>
              <div className={styles.stressScenario}>
                <div className={styles.stressScenarioTitle}>BTC Price Drop</div>
                <p className={styles.stressScenarioText}>
                  In the event of a significant BTC price decline, mining profitability may decrease.
                  The strategy maintains a maximum mining exposure of {miningConfig.maxExposurePercent}% to limit downside risk.
                </p>
              </div>
              <div className={styles.stressScenario}>
                <div className={styles.stressScenarioTitle}>Network Difficulty Increase</div>
                <p className={styles.stressScenarioText}>
                  Rising network difficulty reduces mining efficiency. The strategy diversifies across multiple pools
                  and maintains flexibility to adjust mining exposure dynamically.
                </p>
              </div>
              <div className={styles.stressScenario}>
                <div className={styles.stressScenarioTitle}>Energy Cost Increase</div>
                <p className={styles.stressScenarioText}>
                  Higher energy costs impact mining margins. The strategy works with pools that have
                  access to competitive energy rates and can scale operations efficiently.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      </Card>
    </div>
  );
}



