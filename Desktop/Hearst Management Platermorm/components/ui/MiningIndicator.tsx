import React from 'react';

interface MiningIndicatorProps {
  percent: number;
  className?: string;
}

export default function MiningIndicator({ percent, className = '' }: MiningIndicatorProps) {
  return (
    <div 
      className={`mining-indicator ${className}`}
      style={{ 
        '--mining-percent': `${percent}%` 
      } as React.CSSProperties & { '--mining-percent': string }}
    />
  );
}



