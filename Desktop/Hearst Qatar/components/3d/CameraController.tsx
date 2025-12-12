import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getObjectPosition } from '../../utils/3dHelpers';

interface CameraControllerProps {
  target?: {
    type: 'substation' | 'powerblock' | 'transformer' | 'container' | 'generator' | 'hub' | 'node' | 'module';
    powerBlock?: number;
    transformer?: number;
    generator?: number;
    column?: number;
    row?: number;
  } | null;
  duration?: number;
}

/**
 * Contrôleur de caméra pour animer les transitions entre vues
 */
export default function CameraController({ target, duration = 1000 }: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    if (!target) return;

    let startTime: number | null = null;
    let animationFrameId: number | null = null;
    let isCancelled = false;
    const startPosition = new THREE.Vector3().copy(camera.position);
    const startTarget = new THREE.Vector3(0, 0, 0);

    // Calculer la position cible selon le type d'objet
    let targetPosition: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    switch (target.type) {
      case 'substation':
      case 'hub':
        targetPosition = new THREE.Vector3(0, 100, 150);
        targetLookAt = new THREE.Vector3(0, 40, 0);
        break;
      case 'powerblock':
        if (target.powerBlock) {
          const pos = getObjectPosition(target.powerBlock);
          targetPosition = new THREE.Vector3(pos.x, pos.y + 50, pos.z + 80);
          targetLookAt = new THREE.Vector3(pos.x, pos.y, pos.z);
        } else {
          return;
        }
        break;
      case 'node':
        if (target.column) {
          // Position approximative pour les nœuds hexagonaux
          const nodeSpacing = 30;
          const nodeStartX = -(4 - 1) * nodeSpacing / 2;
          const nodeX = nodeStartX + (target.column - 1) * nodeSpacing;
          targetPosition = new THREE.Vector3(nodeX, 50, 60);
          targetLookAt = new THREE.Vector3(nodeX, 25, 0);
        } else {
          return;
        }
        break;
      case 'transformer':
        if (target.powerBlock && target.transformer) {
          const pos = getObjectPosition(target.powerBlock, target.transformer);
          targetPosition = new THREE.Vector3(pos.x, pos.y + 30, pos.z + 50);
          targetLookAt = new THREE.Vector3(pos.x, pos.y, pos.z);
        } else {
          return;
        }
        break;
      case 'module':
        if (target.column && target.row) {
          // Position approximative pour les modules terminaux
          const startX = -37.5;
          const startY = 5;
          const colSpacing = 25;
          const rowSpacing = 4;
          const moduleX = startX + (target.column - 1) * colSpacing;
          const moduleY = startY - (target.row - 1) * rowSpacing;
          targetPosition = new THREE.Vector3(moduleX, moduleY + 15, 30);
          targetLookAt = new THREE.Vector3(moduleX, moduleY, 0);
        } else {
          return;
        }
        break;
      case 'container':
        if (target.powerBlock && target.transformer) {
          const pos = getObjectPosition(target.powerBlock, target.transformer);
          targetPosition = new THREE.Vector3(pos.x, pos.y + 10, pos.z + 20);
          targetLookAt = new THREE.Vector3(pos.x, pos.y, pos.z);
        } else {
          return;
        }
        break;
      case 'generator':
        if (target.generator) {
          // Position approximative pour les générateurs
          targetPosition = new THREE.Vector3(0, 30, 40);
          targetLookAt = new THREE.Vector3(0, 0, 0);
        } else {
          return;
        }
        break;
      default:
        targetPosition = new THREE.Vector3(0, 100, 150);
        targetLookAt = new THREE.Vector3(0, 0, 0);
    }

    function animate(currentTime: number) {
      // Vérifier si l'animation a été annulée
      if (isCancelled) return;

      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Interpoler la position
      camera.position.lerpVectors(startPosition, targetPosition, eased);
      
      // Interpoler le point de vue
      const currentLookAt = new THREE.Vector3().lerpVectors(startTarget, targetLookAt, eased);
      camera.lookAt(currentLookAt);

      if (progress < 1 && !isCancelled) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    }

    animationFrameId = requestAnimationFrame(animate);

    // Fonction de nettoyage pour annuler l'animation
    return () => {
      isCancelled = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  }, [target, camera, duration]);

  return null;
}
