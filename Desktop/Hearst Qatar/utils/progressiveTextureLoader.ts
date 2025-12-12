import * as THREE from 'three';
import { textureCache } from './textureCache';

/**
 * Système de chargement progressif des textures
 * Charge d'abord les textures basse résolution, puis améliore progressivement
 */

export interface TextureLoadOptions {
  priority?: 'high' | 'medium' | 'low';
  lowResSize?: number;
  highResSize?: number;
  onProgress?: (progress: number) => void;
}

class ProgressiveTextureLoader {
  private loadingQueue: Map<string, Promise<THREE.Texture>> = new Map();
  private loadedTextures: Map<string, THREE.Texture> = new Map();
  private placeholderCache: Map<string, THREE.Texture> = new Map();

  /**
   * Crée une texture placeholder (couleur unie) pour affichage immédiat
   */
  createPlaceholder(color: string = '#808080', size: number = 64): THREE.Texture {
    const key = `placeholder_${color}_${size}`;
    
    if (this.placeholderCache.has(key)) {
      return this.placeholderCache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    this.placeholderCache.set(key, texture);
    return texture;
  }

  /**
   * Charge une texture de manière progressive
   */
  async loadProgressive(
    createLowRes: () => THREE.Texture,
    createHighRes: () => THREE.Texture,
    key: string,
    options: TextureLoadOptions = {}
  ): Promise<THREE.Texture> {
    const {
      priority = 'medium',
      lowResSize = 256,
      highResSize = 1024,
      onProgress,
    } = options;

    // Si déjà chargée, retourner immédiatement
    if (this.loadedTextures.has(key)) {
      return this.loadedTextures.get(key)!;
    }

    // Si en cours de chargement, retourner la promesse existante
    if (this.loadingQueue.has(key)) {
      return this.loadingQueue.get(key)!;
    }

    // Créer la promesse de chargement
    const loadPromise = this.loadTextureProgressive(
      createLowRes,
      createHighRes,
      key,
      lowResSize,
      highResSize,
      onProgress
    );

    this.loadingQueue.set(key, loadPromise);

    try {
      const texture = await loadPromise;
      this.loadedTextures.set(key, texture);
      return texture;
    } finally {
      this.loadingQueue.delete(key);
    }
  }

  /**
   * Charge la texture de manière progressive (basse résolution d'abord)
   */
  private async loadTextureProgressive(
    createLowRes: () => THREE.Texture,
    createHighRes: () => THREE.Texture,
    key: string,
    lowResSize: number,
    highResSize: number,
    onProgress?: (progress: number) => void
  ): Promise<THREE.Texture> {
    // Étape 1: Charger texture basse résolution immédiatement
    onProgress?.(0.3);
    
    const lowResTexture = await this.createTextureAsync(createLowRes, 0);
    lowResTexture.name = `${key}_low`;
    
    // Retourner d'abord la texture basse résolution
    // (l'utilisateur peut l'utiliser immédiatement)
    
    // Étape 2: Améliorer vers haute résolution en arrière-plan
    onProgress?.(0.5);
    
    // Attendre un peu pour ne pas bloquer le thread principal
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Si on a besoin de haute résolution, créer la texture haute résolution
    if (highResSize > lowResSize) {
      onProgress?.(0.7);
      
      const highResTexture = await this.createTextureAsync(createHighRes, 50);
      highResTexture.name = `${key}_high`;
      
      // Disposer de l'ancienne texture basse résolution
      lowResTexture.dispose();
      
      onProgress?.(1.0);
      return highResTexture;
    }
    
    onProgress?.(1.0);
    return lowResTexture;
  }

  /**
   * Crée une texture de manière asynchrone
   */
  private async createTextureAsync(
    createFn: () => THREE.Texture,
    delay: number = 0
  ): Promise<THREE.Texture> {
    return new Promise((resolve) => {
      const create = () => {
        try {
          const texture = createFn();
          resolve(texture);
        } catch (e) {
          console.error('Erreur création texture:', e);
          // Retourner une texture placeholder en cas d'erreur
          resolve(this.createPlaceholder('#ff0000', 64));
        }
      };

      if (delay > 0) {
        setTimeout(create, delay);
      } else if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(create, { timeout: 1000 });
      } else {
        setTimeout(create, 0);
      }
    });
  }

  /**
   * Préchage une texture (haute priorité)
   */
  preload(
    createLowRes: () => THREE.Texture,
    createHighRes: () => THREE.Texture,
    key: string
  ): Promise<THREE.Texture> {
    return this.loadProgressive(createLowRes, createHighRes, key, {
      priority: 'high',
    });
  }

  /**
   * Nettoie les textures chargées
   */
  clear() {
    this.loadedTextures.forEach(texture => texture.dispose());
    this.loadedTextures.clear();
    this.loadingQueue.clear();
  }

  /**
   * Obtient le nombre de textures en cours de chargement
   */
  getLoadingCount(): number {
    return this.loadingQueue.size;
  }

  /**
   * Obtient le nombre de textures chargées
   */
  getLoadedCount(): number {
    return this.loadedTextures.size;
  }
}

// Instance singleton
export const progressiveTextureLoader = new ProgressiveTextureLoader();
