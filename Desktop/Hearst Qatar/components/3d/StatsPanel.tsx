import { useFrame } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { useEffect, useState } from 'react';

interface StatsPanelProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Panneau de statistiques de performance WebGL
 * Affiche FPS, temps de rendu, etc.
 */
export default function StatsPanel({ 
  show = false,
  position = 'top-left' 
}: StatsPanelProps) {
  if (!show) return null;

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-20 bg-black/70 text-white text-xs p-2 rounded font-mono`}>
      <Stats />
    </div>
  );
}
