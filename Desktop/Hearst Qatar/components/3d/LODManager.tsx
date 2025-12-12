import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';
import { qualityManager } from '../../utils/qualityManager';

interface LODLevel {
  distance: number;
  visible: boolean;
}

/**
 * Gestionnaire LOD (Level of Detail) pour optimiser les performances
 * Réduit la complexité des objets distants automatiquement
 */
export default function LODManager() {
  const { camera, scene } = useThree();
  const qualitySettings = qualityManager.getSettings();

  useFrame(() => {
    if (!qualitySettings.lodEnabled) return;

    const cameraPosition = new Vector3();
    camera.getWorldPosition(cameraPosition);

    // Parcourir tous les objets de la scène et ajuster leur visibilité selon la distance
    scene.traverse((obj: Object3D) => {
      if (obj.userData.lodEnabled !== false) {
        const objPosition = new Vector3();
        obj.getWorldPosition(objPosition);
        const distance = cameraPosition.distanceTo(objPosition);

        // Désactiver les détails non essentiels à distance
        // Désactiver les petits éléments (LED, détails) au-delà de 200m
        if (distance > 200 && obj.userData.isDetail) {
          obj.visible = false;
        } else if (distance > 100 && obj.userData.isDetail) {
          // Réduire l'intensité des détails à moyenne distance
          if (obj instanceof Object3D) {
            obj.visible = true;
          }
        } else {
          obj.visible = true;
        }
      }
    });
  });

  return null; // Composant invisible
}
