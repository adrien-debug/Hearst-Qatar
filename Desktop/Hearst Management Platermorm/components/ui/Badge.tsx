import React from 'react';
import { ProductType } from '@/types/product';

interface BadgeProps {
  type: ProductType;
  className?: string;
}

export default function Badge({ type, className = '' }: BadgeProps) {
  const badgeClass = `badge-${type}`;
  
  const labels = {
    market: 'Market Only',
    mining: 'Mining-Enhanced',
    bouquet: 'Bouquet'
  };

  return (
    <span className={`${badgeClass} ${className}`}>
      {labels[type]}
    </span>
  );
}



