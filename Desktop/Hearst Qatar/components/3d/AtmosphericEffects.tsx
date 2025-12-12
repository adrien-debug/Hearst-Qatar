import { useThree } from '@react-three/fiber';
import { Fog, FogExp2 } from 'three';
import { qualityManager } from '../../utils/qualityManager';
import { useEffect } from 'react';

/**
 * Composant pour les effets atmosphériques (fog)
 * Ajoute de la profondeur et du réalisme à la scène
 */
export default function AtmosphericEffects() {
  const { scene } = useThree();
  const qualitySettings = qualityManager.getSettings();

  useEffect(() => {
    // Ajouter du fog pour la profondeur atmosphérique (désertique)
    // FogExp2 pour un effet plus réaliste et progressif
    const fog = new FogExp2('#d4a574', 0.0008); // Couleur sable, densité faible
    
    // Ajuster selon la qualité
    if (qualitySettings.postProcessingEnabled) {
      scene.fog = fog;
    } else {
      scene.fog = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [scene, qualitySettings.postProcessingEnabled]);

  return null; // Composant invisible
}
