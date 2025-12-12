import * as THREE from 'three';

/**
 * Système de cache pour les textures - Évite la régénération
 * et permet un chargement progressif
 */

interface TextureCacheEntry {
  texture: THREE.Texture;
  size: number;
  timestamp: number;
}

class TextureCache {
  private cache: Map<string, TextureCacheEntry> = new Map();
  private maxCacheSize = 50; // Nombre maximum de textures en cache
  private maxAge = 5 * 60 * 1000; // 5 minutes

  /**
   * Génère une clé unique pour une texture
   */
  private getKey(type: string, size: number, params?: any): string {
    return `${type}_${size}_${JSON.stringify(params || {})}`;
  }

  /**
   * Nettoie les textures anciennes
   */
  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Supprimer les entrées trop anciennes
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > this.maxAge) {
        entry.texture.dispose();
        this.cache.delete(key);
      }
    });

    // Si le cache est encore trop grand, supprimer les plus anciennes
    if (this.cache.size > this.maxCacheSize) {
      const sorted = entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, this.cache.size - this.maxCacheSize);
      
      sorted.forEach(([key, entry]) => {
        entry.texture.dispose();
        this.cache.delete(key);
      });
    }
  }

  /**
   * Récupère une texture du cache ou la crée
   */
  getOrCreate<T extends THREE.Texture>(
    type: string,
    size: number,
    createFn: () => T,
    params?: any
  ): T {
    this.cleanup();
    
    const key = this.getKey(type, size, params);
    const cached = this.cache.get(key);
    
    if (cached && cached.size === size) {
      return cached.texture as T;
    }

    // Créer la nouvelle texture
    const texture = createFn();
    this.cache.set(key, {
      texture,
      size,
      timestamp: Date.now(),
    });

    return texture;
  }

  /**
   * Vide le cache
   */
  clear(): void {
    this.cache.forEach((entry) => {
      entry.texture.dispose();
    });
    this.cache.clear();
  }

  /**
   * Obtient la taille du cache
   */
  getSize(): number {
    return this.cache.size;
  }
}

// Instance singleton
export const textureCache = new TextureCache();

/**
 * Cache pour la taille optimale de texture - évite la création répétée de contextes WebGL
 */
let cachedOptimalTextureSize: number | null = null;
let cachedWebGLContext: WebGLRenderingContext | null = null;
let cachedCanvas: HTMLCanvasElement | null = null;

/**
 * Détecte la résolution optimale selon les performances
 * IMPORTANT: Crée un seul contexte WebGL et met en cache le résultat
 */
export function getOptimalTextureSize(): number {
  if (typeof window === 'undefined') return 512;
  
  // Retourner la valeur en cache si elle existe déjà
  if (cachedOptimalTextureSize !== null) {
    return cachedOptimalTextureSize;
  }
  
  try {
    // Créer un contexte WebGL UNIQUEMENT si nécessaire
    if (!cachedCanvas) {
      cachedCanvas = document.createElement('canvas');
      cachedCanvas.width = 1;
      cachedCanvas.height = 1;
      cachedWebGLContext = cachedCanvas.getContext('webgl') || cachedCanvas.getContext('webgl2');
    }
    
    const gl = cachedWebGLContext;
    
    if (!gl) {
      cachedOptimalTextureSize = 512;
      return 512;
    }
    
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Ajuster selon les capacités
    if (isMobile) {
      cachedOptimalTextureSize = Math.min(512, maxTextureSize); // Réduit pour mobile
    } else {
      // Pour desktop, utiliser 512px par défaut pour éviter les blocages
      cachedOptimalTextureSize = Math.min(512, maxTextureSize);
    }
    
    console.log('✅ Taille optimale de texture détectée et mise en cache:', cachedOptimalTextureSize);
    return cachedOptimalTextureSize;
  } catch (e) {
    console.warn('Error detecting optimal texture size:', e);
    cachedOptimalTextureSize = 512;
    return 512; // Valeur sécurisée par défaut
  }
}

/**
 * Nettoie le contexte WebGL utilisé pour la détection
 * À appeler lors du démontage de l'application
 */
export function cleanupOptimalTextureSizeCache(): void {
  if (cachedWebGLContext) {
    const loseContextExt = cachedWebGLContext.getExtension('WEBGL_lose_context');
    if (loseContextExt) {
      loseContextExt.loseContext();
    }
    cachedWebGLContext = null;
  }
  if (cachedCanvas) {
    cachedCanvas.width = 0;
    cachedCanvas.height = 0;
    cachedCanvas = null;
  }
  cachedOptimalTextureSize = null;
  console.log('✅ Cache de taille de texture nettoyé');
}

/**
 * Génère une texture de manière asynchrone pour ne pas bloquer
 */
export async function createTextureAsync<T extends THREE.Texture>(
  createFn: () => T,
  delay: number = 0
): Promise<T> {
  return new Promise((resolve) => {
    if (delay > 0) {
      setTimeout(() => {
        resolve(createFn());
      }, delay);
    } else {
      // Utiliser requestIdleCallback si disponible, sinon setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          resolve(createFn());
        });
      } else {
        setTimeout(() => {
          resolve(createFn());
        }, 0);
      }
    }
  });
}
