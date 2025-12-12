import { useRef, useMemo } from 'react';
import { InstancedMesh, Matrix4 } from 'three';
import * as THREE from 'three';

interface OptimizedHD5ContainerProps {
  positions: Array<[number, number, number]>;
  onSelect?: (id: string) => void;
  selectedObjects?: Set<string>;
}

// Dimensions exactes du Bitmain ANTSPACE HD5
const HD5_LENGTH = 12.196;
const HD5_WIDTH = 2.438;
const HD5_HEIGHT = 2.896;

/**
 * Composant optimisé utilisant l'instancing pour rendre plusieurs containers HD5 identiques
 * Cela améliore significativement les performances pour 48 containers
 */
export default function OptimizedHD5Container({ 
  positions,
  onSelect,
  selectedObjects = new Set()
}: OptimizedHD5ContainerProps) {
  const instancedMeshRef = useRef<InstancedMesh>(null);
  
  // Créer la géométrie de base du container (une seule fois)
  const containerGeometry = useMemo(() => {
    // Géométrie simplifiée pour l'instancing (juste la boîte principale)
    // Les détails peuvent être ajoutés via textures normales
    return new THREE.BoxGeometry(HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH);
  }, []);

  // Matériau de base
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4b5563',
      metalness: 0.3,
      roughness: 0.6,
    });
  }, []);

  // Configurer les instances
  useMemo(() => {
    if (instancedMeshRef.current) {
      positions.forEach((position, index) => {
        const matrix = new THREE.Matrix4();
        matrix.setPosition(position[0], position[1], position[2]);
        instancedMeshRef.current!.setMatrixAt(index, matrix);
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions]);

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[containerGeometry, material, positions.length]}
      frustumCulled={true}
    />
  );
}

