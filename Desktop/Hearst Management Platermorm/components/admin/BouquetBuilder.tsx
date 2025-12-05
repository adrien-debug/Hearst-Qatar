'use client';

import React, { useState } from 'react';
import { BouquetAllocation, ProductType } from '@/types/product';
import { mockProducts } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';

interface BouquetBuilderProps {
  allocations: BouquetAllocation[];
  onAllocationsChange: (allocations: BouquetAllocation[]) => void;
}

export default function BouquetBuilder({ allocations, onAllocationsChange }: BouquetBuilderProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [allocationPercent, setAllocationPercent] = useState('');

  const totalAllocation = allocations.reduce((sum, a) => sum + a.allocationPercent, 0);
  const isValid = totalAllocation === 100;

  const handleAdd = () => {
    if (!selectedProductId || !allocationPercent) return;

    const product = mockProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const percent = parseFloat(allocationPercent);
    if (isNaN(percent) || percent <= 0 || totalAllocation + percent > 100) return;

    const newAllocation: BouquetAllocation = {
      productId: product.id,
      productName: product.name,
      productType: product.type,
      allocationPercent: percent,
      miningExposurePercent: product.miningExposurePercent
    };

    onAllocationsChange([...allocations, newAllocation]);
    setSelectedProductId('');
    setAllocationPercent('');
  };

  const handleRemove = (index: number) => {
    onAllocationsChange(allocations.filter((_, i) => i !== index));
  };

  const handleUpdatePercent = (index: number, newPercent: number) => {
    if (isNaN(newPercent) || newPercent <= 0) return;
    
    const updated = [...allocations];
    updated[index].allocationPercent = newPercent;
    onAllocationsChange(updated);
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-6">Bouquet Allocation Builder</h3>

      {/* Add allocation */}
      <div className="mb-6 p-4 bg-[var(--color-surface-alt)] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-border-subtle)] rounded-lg bg-white"
            >
              <option value="">Choose a product...</option>
              {mockProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Allocation %</label>
            <input
              type="number"
              value={allocationPercent}
              onChange={(e) => setAllocationPercent(e.target.value)}
              placeholder="0.0"
              min="0"
              max={100 - totalAllocation}
              step="0.1"
              className="w-full px-4 py-2 border border-[var(--color-border-subtle)] rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd} variant="primary" className="w-full">
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Allocations table */}
      {allocations.length > 0 && (
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Product</TableCell>
                <TableCell header>Type</TableCell>
                <TableCell header>Allocation %</TableCell>
                <TableCell header>Mining %</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {allocations.map((allocation, index) => (
                <TableRow key={index}>
                  <TableCell>{allocation.productName}</TableCell>
                  <TableCell>
                    <Badge type={allocation.productType} />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={allocation.allocationPercent}
                      onChange={(e) => handleUpdatePercent(index, parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 border border-[var(--color-border-subtle)] rounded"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </TableCell>
                  <TableCell>{allocation.miningExposurePercent}%</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-[var(--color-danger)] hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Validation */}
      <div className={`p-4 rounded-lg ${isValid ? 'bg-[var(--color-primary-soft)]' : 'bg-[var(--color-warning)]/10'}`}>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Allocation</span>
          <span className={`text-lg font-bold ${isValid ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
            {totalAllocation.toFixed(1)}%
          </span>
        </div>
        {!isValid && (
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            Total allocation must equal 100%. Current: {totalAllocation.toFixed(1)}%
          </p>
        )}
      </div>

      {/* Global mining exposure calculation */}
      {allocations.length > 0 && (
        <div className="mt-4 p-4 bg-[var(--color-surface-alt)] rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Global Mining Exposure</span>
            <span className="text-lg font-bold">
              {allocations.reduce((sum, a) => sum + (a.allocationPercent * a.miningExposurePercent / 100), 0).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}



