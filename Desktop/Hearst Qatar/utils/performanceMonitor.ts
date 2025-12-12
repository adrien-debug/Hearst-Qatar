import * as THREE from 'three';

/**
 * Système de monitoring de performance pour adaptation automatique de la qualité
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  textures: number;
  memoryUsage?: number;
}

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

class PerformanceMonitor {
  private fps: number = 60;
  private frameTime: number = 16.67; // ms
  private frameCount: number = 0;
  private lastTime: number = 0;
  private samples: number[] = [];
  private maxSamples: number = 60; // 1 seconde à 60 FPS
  private currentQuality: QualityLevel = 'high';
  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private renderer: THREE.WebGLRenderer | null = null;

  /**
   * Initialise le monitoring avec un renderer Three.js
   */
  init(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.lastTime = performance.now();
  }

  /**
   * Met à jour les métriques (à appeler chaque frame)
   */
  update() {
    const now = performance.now();
    const deltaTime = now - this.lastTime;
    
    if (deltaTime > 0) {
      this.frameTime = deltaTime;
      this.fps = 1000 / deltaTime;
      
      // Ajouter à l'échantillon
      this.samples.push(this.fps);
      if (this.samples.length > this.maxSamples) {
        this.samples.shift();
      }
    }
    
    this.lastTime = now;
    this.frameCount++;

    // Calculer FPS moyen sur les dernières secondes
    const avgFps = this.samples.length > 0
      ? this.samples.reduce((a, b) => a + b, 0) / this.samples.length
      : this.fps;

    // Adapter la qualité selon les performances
    this.adaptQuality(avgFps);

    // Notifier les callbacks
    this.notifyCallbacks();
  }

  /**
   * Adapte automatiquement la qualité selon les performances
   */
  private adaptQuality(avgFps: number) {
    let newQuality: QualityLevel = this.currentQuality;

    if (avgFps < 25) {
      // Performance très faible - qualité minimale
      newQuality = 'low';
    } else if (avgFps < 40) {
      // Performance faible - qualité moyenne
      newQuality = 'medium';
    } else if (avgFps < 55) {
      // Performance correcte - qualité haute
      newQuality = 'high';
    } else {
      // Performance excellente - qualité ultra
      newQuality = 'ultra';
    }

    if (newQuality !== this.currentQuality) {
      this.currentQuality = newQuality;
      console.log(`🎯 Qualité adaptée: ${newQuality} (FPS: ${avgFps.toFixed(1)})`);
    }
  }

  /**
   * Notifie tous les callbacks enregistrés
   */
  private notifyCallbacks() {
    const metrics = this.getMetrics();
    this.callbacks.forEach(callback => {
      try {
        callback(metrics);
      } catch (e) {
        console.warn('Erreur dans callback de performance:', e);
      }
    });
  }

  /**
   * Obtient les métriques actuelles
   */
  getMetrics(): PerformanceMetrics {
    const info = this.renderer?.info || null;
    
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      drawCalls: info?.render?.calls || 0,
      triangles: info?.render?.triangles || 0,
      textures: info?.memory?.textures || 0,
      memoryUsage: info?.memory?.geometries || 0,
    };
  }

  /**
   * Obtient le niveau de qualité actuel
   */
  getQuality(): QualityLevel {
    return this.currentQuality;
  }

  /**
   * Enregistre un callback pour recevoir les métriques
   */
  onUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Réinitialise les métriques
   */
  reset() {
    this.fps = 60;
    this.frameTime = 16.67;
    this.frameCount = 0;
    this.samples = [];
    this.lastTime = performance.now();
  }

  /**
   * Obtient les recommandations d'optimisation selon les performances
   */
  getOptimizationRecommendations(): string[] {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];

    if (this.fps < 30) {
      recommendations.push('Réduire la résolution des shadow maps');
      recommendations.push('Désactiver le post-processing');
      recommendations.push('Réduire la qualité des textures');
      recommendations.push('Activer le LOD pour objets distants');
    }

    if (metrics.drawCalls > 500) {
      recommendations.push('Utiliser l\'instancing pour objets répétitifs');
    }

    if (metrics.triangles > 500000) {
      recommendations.push('Réduire la complexité géométrique');
      recommendations.push('Activer le LOD');
    }

    if (metrics.textures > 50) {
      recommendations.push('Réduire le nombre de textures actives');
      recommendations.push('Utiliser des textures atlas');
    }

    return recommendations;
  }
}

// Instance singleton
export const performanceMonitor = new PerformanceMonitor();
