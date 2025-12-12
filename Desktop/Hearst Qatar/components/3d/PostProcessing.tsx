import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { qualityManager } from '../../utils/qualityManager';
import * as THREE from 'three';

/**
 * Composant de post-processing simplifié
 * Utilise les capacités natives de Three.js pour les effets
 * Note: Pour SSAO/Bloom avancés, installer @react-three/postprocessing plus tard
 */
export default function PostProcessing() {
  const { gl, scene } = useThree();
  const [enabled, setEnabled] = useState(false);
  const qualitySettings = qualityManager.getSettings();

  // Activer le post-processing après 2 secondes pour ne pas bloquer le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnabled(qualitySettings.postProcessingEnabled);
    }, 2000);

    return () => clearTimeout(timer);
  }, [qualitySettings.postProcessingEnabled]);

  // Ajuster le tone mapping selon la qualité
  useEffect(() => {
    if (enabled && qualitySettings.postProcessingEnabled) {
      // Tone mapping amélioré pour meilleur rendu
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.2;
    } else {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
    }
  }, [enabled, qualitySettings.postProcessingEnabled, gl]);

  // Pour l'instant, retourner null - les effets avancés nécessitent @react-three/postprocessing
  // qui sera installé plus tard avec --legacy-peer-deps si nécessaire
  return null;
}
