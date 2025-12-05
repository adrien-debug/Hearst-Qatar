'use client';

import React from 'react';
import { MiningConfig } from '@/types/product';
import Card from '@/components/ui/Card';

interface MiningConfigSectionProps {
  miningConfig: MiningConfig;
  onMiningConfigChange: (config: MiningConfig) => void;
}

const miningPools = [
  { id: 'pool1', name: 'Antpool', country: 'China' },
  { id: 'pool2', name: 'Foundry USA', country: 'USA' },
  { id: 'pool3', name: 'F2Pool', country: 'China' },
  { id: 'pool4', name: 'ViaBTC', country: 'China' },
  { id: 'pool5', name: 'Slush Pool', country: 'Czech Republic' },
  { id: 'pool6', name: 'BTC.com', country: 'China' },
  { id: 'pool7', name: 'Binance Pool', country: 'Global' },
  { id: 'pool8', name: 'Luxor', country: 'USA' },
  { id: 'pool9', name: 'MARA Pool', country: 'USA' },
  { id: 'pool10', name: 'Core Scientific', country: 'USA' }
];

export default function MiningConfigSection({ miningConfig, onMiningConfigChange }: MiningConfigSectionProps) {
  const handleToggleActive = () => {
    onMiningConfigChange({
      ...miningConfig,
      active: !miningConfig.active
    });
  };

  const handleRoleChange = (role: 'sourcing' | 'collateral') => {
    onMiningConfigChange({
      ...miningConfig,
      role
    });
  };

  const handlePoolToggle = (poolId: string) => {
    const isSelected = miningConfig.pools.some(p => p.id === poolId);
    const pool = miningPools.find(p => p.id === poolId);
    if (!pool) return;

    onMiningConfigChange({
      ...miningConfig,
      pools: isSelected
        ? miningConfig.pools.filter(p => p.id !== poolId)
        : [...miningConfig.pools, pool]
    });
  };

  const handleMaxExposureChange = (value: string) => {
    const percent = parseFloat(value);
    if (!isNaN(percent) && percent >= 0 && percent <= 100) {
      onMiningConfigChange({
        ...miningConfig,
        maxExposurePercent: percent
      });
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-6">Mining Configuration</h3>

      {/* Active toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Mining Integration</label>
          <button
            onClick={handleToggleActive}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              miningConfig.active ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-subtle)]'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                miningConfig.active ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {miningConfig.active && (
        <>
          {/* Role selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Role of Mining</label>
            <div className="flex gap-4">
              <button
                onClick={() => handleRoleChange('sourcing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  miningConfig.role === 'sourcing'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)]'
                }`}
              >
                BTC Sourcing
              </button>
              <button
                onClick={() => handleRoleChange('collateral')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  miningConfig.role === 'collateral'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)]'
                }`}
              >
                Collateral
              </button>
            </div>
          </div>

          {/* Mining pools */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select Mining Pools</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {miningPools.map((pool) => {
                const isSelected = miningConfig.pools.some(p => p.id === pool.id);
                return (
                  <button
                    key={pool.id}
                    onClick={() => handlePoolToggle(pool.id)}
                    className={`p-3 rounded-lg text-left border transition-colors ${
                      isSelected
                        ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'bg-white border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-alt)]'
                    }`}
                  >
                    <div className="font-medium text-sm">{pool.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{pool.country}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max exposure */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Mining Exposure %
            </label>
            <input
              type="number"
              value={miningConfig.maxExposurePercent}
              onChange={(e) => handleMaxExposureChange(e.target.value)}
              min="0"
              max="100"
              step="1"
              className="w-full px-4 py-2 border border-[var(--color-border-subtle)] rounded-lg"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Cap the maximum percentage of the strategy exposed to mining.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}



