import { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, Matrix4, Object3D } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createContainerMaterial, createAdvancedMetalMaterial } from '../../utils/materialHelpers';
import { qualityManager } from '../../utils/qualityManager';

interface ContainerInstance {
  id: string;
  position: [number, number, number];
  isSelected?: boolean;
}

interface HD5ContainerInstancedProps {
  instances: ContainerInstance[];
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

// Dimensions exactes en mètres - CONTAINERS ÉLARGIS
const HD5_LENGTH = 12.196; // m
const HD5_WIDTH = 3.5;      // m (augmenté de 2.438m à 3.5m pour plus de largeur)
const HD5_HEIGHT = 2.896;   // m

/**
 * Version instanciée des containers HD5 pour réduire les draw calls
 * 48 containers → 1 draw call au lieu de 48
 */
export default function HD5ContainerInstanced({
  instances,
  onSelect,
  selectedObject,
}: HD5ContainerInstancedProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useMemo(() => new Object3D(), []);
  const { raycaster, camera, gl } = useThree();

  // Matériaux mémorisés
  const containerMaterial = useMemo(() => createContainerMaterial('#1a1a1a', 0.2), []);

  // Mettre à jour les matrices de transformation pour chaque instance
  useEffect(() => {
    if (!meshRef.current) return;

    instances.forEach((instance, i) => {
      const isSelected = selectedObject === instance.id;
      
      tempObject.position.set(...instance.position);
      tempObject.position.y += HD5_HEIGHT / 2; // Centrer verticalement
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      // Gérer la sélection visuelle (peut être fait avec des couleurs d'instance)
      // Pour l'instant, on garde le matériau de base
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [instances, selectedObject, tempObject]);

  // Gérer les clics avec raycasting sur les instances
  useEffect(() => {
    if (!onSelect) return;

    const handleClick = (event: MouseEvent) => {
      if (!meshRef.current) return;

      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      
      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        const instanceId = intersects[0].instanceId;
        if (instances[instanceId]) {
          onSelect(instances[instanceId].id);
        }
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [instances, onSelect, raycaster, camera, gl]);

  // Créer la géométrie de base du container (simplifiée pour l'instancing)
  const geometry = useMemo(() => {
    return new THREE.BoxGeometry(HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH);
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, containerMaterial, instances.length]}
      castShadow
      receiveShadow
    />
  );
}
