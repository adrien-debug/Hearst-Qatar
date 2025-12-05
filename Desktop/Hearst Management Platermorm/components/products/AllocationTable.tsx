import React from 'react';
import { BouquetAllocation } from '@/types/product';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import MiningIndicator from '@/components/ui/MiningIndicator';

interface AllocationTableProps {
  allocations: BouquetAllocation[];
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export default function AllocationTable({ allocations }: AllocationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell header>Underlying Product</TableCell>
          <TableCell header>Type</TableCell>
          <TableCell header>Allocation %</TableCell>
          <TableCell header>Mining %</TableCell>
          <TableCell header>Value</TableCell>
        </TableRow>
      </TableHeader>
      <tbody>
        {allocations.map((allocation, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="font-medium">{allocation.productName}</div>
            </TableCell>
            <TableCell>
              <Badge type={allocation.productType} />
            </TableCell>
            <TableCell>
              <div className="font-semibold">{allocation.allocationPercent}%</div>
            </TableCell>
            <TableCell>
              <div className="w-24">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--color-text-muted)]">{allocation.miningExposurePercent}%</span>
                </div>
                <MiningIndicator percent={allocation.miningExposurePercent} />
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm font-semibold">
                {/* This would need the total AUM to calculate, using placeholder */}
                {allocation.allocationPercent}%
              </div>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}



