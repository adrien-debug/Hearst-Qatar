/**
 * Système de préchargement et cache global pour les textures partagées
 * Évite de charger la même texture plusieurs fois et cause des fuites de mémoire WebGL
 */

import * as THREE from 'three';

interface TextureCache {
  [key: string]: THREE.Texture | null;
}

interface LoadingPromises {
  [key: string]: Promise<THREE.Texture> | null;
}

class TexturePreloaderClass {
  private cache: TextureCache = {};
  private loadingPromises: LoadingPromises = {};
  private textureLoader: THREE.TextureLoader | null = null;

  constructor() {
    // Initialiser le loader seulement côté client
    if (typeof window !== 'undefined') {
      this.textureLoader = new THREE.TextureLoader();
    }
  }

  /**
   * Charge une texture (ou la retourne depuis le cache si déjà chargée)
   */
  async loadTexture(url: string, cacheKey?: string): Promise<THREE.Texture> {
    const key = cacheKey || url;

    // Si déjà en cache, retourner immédiatement
    if (this.cache[key]) {
      return this.cache[key]!;
    }

    // Si en cours de chargement, attendre la promesse existante
    if (this.loadingPromises[key]) {
      return this.loadingPromises[key]!;
    }

    // Charger la texture
    if (!this.textureLoader) {
      throw new Error('TextureLoader not initialized');
    }

    const loadingPromise = new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader!.load(
        url,
        (texture) => {
          // Configurer la texture
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.needsUpdate = true;

          // Mettre en cache
          this.cache[key] = texture;
          this.loadingPromises[key] = null;

          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Erreur de chargement de texture: ${url}`, error);
          this.loadingPromises[key] = null;
          reject(error);
        }
      );
    });

    this.loadingPromises[key] = loadingPromise;
    return loadingPromise;
  }

  /**
   * Précharge une liste de textures
   */
  async preloadTextures(urls: string[]): Promise<THREE.Texture[]> {
    const promises = urls.map(url => this.loadTexture(url));
    return Promise.all(promises);
  }

  /**
   * Récupère une texture depuis le cache (synchrone)
   * Retourne null si la texture n'est pas en cache
   */
  getTexture(url: string, cacheKey?: string): THREE.Texture | null {
    const key = cacheKey || url;
    return this.cache[key] || null;
  }

  /**
   * Nettoie une texture du cache
   */
  disposeTexture(url: string, cacheKey?: string) {
    const key = cacheKey || url;
    const texture = this.cache[key];

    if (texture) {
      texture.dispose();
      delete this.cache[key];
    }

    if (this.loadingPromises[key]) {
      delete this.loadingPromises[key];
    }
  }

  /**
   * Nettoie toutes les textures du cache
   */
  disposeAll() {
    Object.keys(this.cache).forEach(key => {
      const texture = this.cache[key];
      if (texture) {
        texture.dispose();
      }
    });

    this.cache = {};
    this.loadingPromises = {};
  }

  /**
   * Obtient le nombre de textures en cache
   */
  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }

  /**
   * Obtient les clés des textures en cache
   */
  getCacheKeys(): string[] {
    return Object.keys(this.cache);
  }
}

// Instance singleton globale
export const texturePreloader = new TexturePreloaderClass();

/**
 * Hook React pour utiliser une texture préchargée
 * Utilise le cache global pour éviter les chargements multiples
 */
export function usePreloadedTexture(url: string, cacheKey?: string): THREE.Texture | null {
  const key = cacheKey || url;
  
  // Essayer d'obtenir depuis le cache
  const cachedTexture = texturePreloader.getTexture(url, cacheKey);
  
  // Si pas en cache, charger (mais ne pas bloquer le rendu)
  if (!cachedTexture && typeof window !== 'undefined') {
    texturePreloader.loadTexture(url, cacheKey).catch(err => {
      console.error('Erreur de chargement de texture:', err);
    });
  }
  
  return cachedTexture;
}


