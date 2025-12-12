import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import { performanceMonitor } from '../../utils/performanceMonitor';
import { qualityManager } from '../../utils/qualityManager';

/**
 * Composant 3D pour le monitoring de performance
 * Met à jour les métriques chaque frame et adapte la qualité
 */
export default function PerformanceMonitor3D() {
  useFrame(() => {
    // Mettre à jour les métriques chaque frame
    performanceMonitor.update();
    
    // Adapter la qualité selon les performances
    const quality = performanceMonitor.getQuality();
    qualityManager.setQuality(quality);
  });

  useEffect(() => {
    // Log des recommandations au démarrage
    const recommendations = performanceMonitor.getOptimizationRecommendations();
    if (recommendations.length > 0) {
      console.log('💡 Recommandations d\'optimisation:', recommendations);
    }
  }, []);

  return null; // Composant invisible
}
