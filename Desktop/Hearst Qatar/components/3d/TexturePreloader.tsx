import { useEffect, useState } from 'react';
import { texturePreloader } from '../../utils/texturePreloader';

/**
 * Composant qui précharge les textures communes au démarrage
 * Cela évite de charger la même texture 48 fois (une par container)
 */
export default function TexturePreloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('🔄 Démarrage du préchargement des textures...');

    // Liste des textures à précharger
    const texturesToPreload = [
      '/HEARST_LOGO.png',
      // Ajouter d'autres textures communes ici si nécessaire
    ];

    // Précharger toutes les textures
    texturePreloader
      .preloadTextures(texturesToPreload)
      .then((textures) => {
        console.log('✅ Textures préchargées avec succès:', texturesToPreload);
        console.log('📊 Nombre de textures en cache:', texturePreloader.getCacheSize());
        textures.forEach((texture, index) => {
          if (texture && texture.image) {
            const img = texture.image as HTMLImageElement | HTMLCanvasElement;
            if (img && typeof img.width === 'number' && typeof img.height === 'number') {
              console.log(`  ✓ ${texturesToPreload[index]}: ${img.width}x${img.height}`);
            }
          }
        });
        setLoaded(true);
      })
      .catch((error) => {
        console.error('⚠️ Erreur lors du préchargement des textures:', error);
        // Continuer quand même
        setLoaded(true);
      });

    // Nettoyage lors du démontage
    return () => {
      // Ne pas nettoyer les textures ici car elles peuvent être encore utilisées
      // Le nettoyage se fera au niveau de la page principale
    };
  }, []);

  // Ce composant ne rend rien, il précharge juste les textures
  return null;
}

