'use client';

import React, { useState } from 'react';
import { ProductType, MarketProduct, MiningProduct, BouquetProduct, MiningConfig, BouquetAllocation } from '@/types/product';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MiningConfigSection from './MiningConfigSection';
import BouquetBuilder from './BouquetBuilder';
import styles from './ProductFactoryForm.module.css';

const defaultMiningConfig: MiningConfig = {
  active: false,
  role: null,
  pools: [],
  maxExposurePercent: 30
};

export default function ProductFactoryForm() {
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productType, setProductType] = useState<ProductType | ''>('');
  const [description, setDescription] = useState('');

  // Market-only fields
  const [universe, setUniverse] = useState<string[]>([]);
  const [riskTarget, setRiskTarget] = useState('');
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);

  // Mining fields
  const [miningConfig, setMiningConfig] = useState<MiningConfig>(defaultMiningConfig);

  // Bouquet fields
  const [allocations, setAllocations] = useState<BouquetAllocation[]>([]);
  const [rebalancingFrequency, setRebalancingFrequency] = useState('');
  const [rebalancingRules, setRebalancingRules] = useState('');

  const availableAssets = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI', 'ATOM', 'ETC', 'LTC', 'BCH', 'ALGO', 'FIL', 'AAVE', 'MKR', 'COMP', 'Stablecoins'];
  const availableJurisdictions = ['Global', 'Qatar', 'Bahrain', 'UAE', 'USA', 'Europe'];

  const handleAssetToggle = (asset: string) => {
    setUniverse(prev => 
      prev.includes(asset) 
        ? prev.filter(a => a !== asset)
        : [...prev, asset]
    );
  };

  const handleJurisdictionToggle = (jurisdiction: string) => {
    setJurisdictions(prev => 
      prev.includes(jurisdiction) 
        ? prev.filter(j => j !== jurisdiction)
        : [...prev, jurisdiction]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to an API
    console.log('Product data:', {
      productName,
      productCode,
      productType,
      description,
      universe,
      riskTarget,
      jurisdictions,
      miningConfig,
      allocations,
      rebalancingFrequency,
      rebalancingRules
    });
    alert('Product saved! (This is a demo - no actual save occurred)');
  };

  const handleReset = () => {
    setProductName('');
    setProductCode('');
    setProductType('');
    setDescription('');
    setUniverse([]);
    setRiskTarget('');
    setJurisdictions([]);
    setMiningConfig(defaultMiningConfig);
    setAllocations([]);
    setRebalancingFrequency('');
    setRebalancingRules('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Basic Information */}
      <Card>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <div className={styles.formGroup}>
          <div>
            <label className={styles.label}>Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className={styles.input}
              placeholder="e.g., BTC Core Market"
            />
          </div>
          <div>
            <label className={styles.label}>Product Code / ID *</label>
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              required
              className={styles.input}
              placeholder="e.g., BTC-CORE-MKT"
            />
          </div>
          <div>
            <label className={styles.label}>Product Type *</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as ProductType)}
              required
              className={styles.select}
            >
              <option value="">Select product type...</option>
              <option value="market">Market Only</option>
              <option value="mining">Mining-Enhanced</option>
              <option value="bouquet">Bouquet</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={styles.textarea}
              placeholder="Product description..."
            />
          </div>
        </div>
      </Card>

      {/* Market-Only Configuration */}
      {productType === 'market' && (
        <Card>
          <h2 className={styles.sectionTitle}>Market-Only Configuration</h2>
          <div className={styles.formGroup}>
            <div>
              <label className={styles.label}>Select Universe</label>
              <div className={styles.assetGrid}>
                {availableAssets.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => handleAssetToggle(asset)}
                    className={`${styles.assetButton} ${universe.includes(asset) ? styles.assetButtonSelected : ''}`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={styles.label}>Risk / Volatility Target</label>
              <select
                value={riskTarget}
                onChange={(e) => setRiskTarget(e.target.value)}
                className={styles.select}
              >
                <option value="">Select risk target...</option>
                <option value="Low">Low</option>
                <option value="Low-Medium">Low-Medium</option>
                <option value="Medium">Medium</option>
                <option value="Medium-High">Medium-High</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Jurisdiction Tags</label>
              <div className={styles.jurisdictionContainer}>
                {availableJurisdictions.map((jurisdiction) => (
                  <button
                    key={jurisdiction}
                    type="button"
                    onClick={() => handleJurisdictionToggle(jurisdiction)}
                    className={`${styles.jurisdictionButton} ${jurisdictions.includes(jurisdiction) ? styles.jurisdictionButtonSelected : ''}`}
                  >
                    {jurisdiction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Mining-Enhanced Configuration */}
      {productType === 'mining' && (
        <MiningConfigSection
          miningConfig={miningConfig}
          onMiningConfigChange={setMiningConfig}
        />
      )}

      {/* Bouquet Configuration */}
      {productType === 'bouquet' && (
        <div className={styles.form} style={{ gap: '24px' }}>
          <BouquetBuilder
            allocations={allocations}
            onAllocationsChange={setAllocations}
          />
          <Card>
            <h2 className={styles.sectionTitle}>Rebalancing Configuration</h2>
            <div className={styles.formGroup}>
              <div>
                <label className={styles.label}>Rebalancing Frequency</label>
                <select
                  value={rebalancingFrequency}
                  onChange={(e) => setRebalancingFrequency(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select frequency...</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Rebalancing Rules</label>
                <textarea
                  value={rebalancingRules}
                  onChange={(e) => setRebalancingRules(e.target.value)}
                  rows={4}
                  className={styles.textarea}
                  placeholder="Describe rebalancing rules and triggers..."
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Product
        </Button>
      </div>
    </form>
  );
}



