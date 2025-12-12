import { useThree } from '@react-three/fiber';
import { useMemo, useEffect } from 'react';
import { Environment } from '@react-three/drei';
import { qualityManager } from '../../utils/qualityManager';

/**
 * Composant pour environnement HDRI personnalisé désertique
 * Utilise le preset sunset par défaut, peut être amélioré avec un HDRI personnalisé
 */
export default function EnvironmentHDRI() {
  const { scene } = useThree();
  const qualitySettings = qualityManager.getSettings();

  // Utiliser le preset sunset pour l'ambiance désertique
  // Peut être remplacé par un HDRI personnalisé plus tard
  return (
    <Environment
      preset="sunset"
      environmentIntensity={qualitySettings.postProcessingEnabled ? 1.2 : 1.0}
      background={false} // Ne pas utiliser comme arrière-plan pour performance
    />
  );
}
