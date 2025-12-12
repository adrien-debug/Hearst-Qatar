import { useRef, useMemo } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import HearstLogo from './HearstLogo';
import { createContainerMaterial } from '../../utils/materialHelpers';

interface HD5ContainerUltraSimplifiedProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Container HD5 ULTRA-SIMPLIFIÉ pour performances maximales
 * - Géométrie minimale (boxGeometry uniquement = 12 triangles)
 * - 1 logo uniquement (face avant)
 * - Matériau simple
 * - Pas de détails (nervures, tuyaux, échelles)
 */
export default function HD5ContainerUltraSimplified({
  position,
  containerId,
  onSelect,
  isSelected = false,
}: HD5ContainerUltraSimplifiedProps) {
  const groupRef = useRef<Group>(null);

  // Dimensions exactes en mètres
  const HD5_LENGTH = 12.196;
  const HD5_WIDTH = 3.5;
  const HD5_HEIGHT = 2.896;

  // Matériau simple mémorisé
  const containerMaterial = useMemo(() => {
    const mat = createContainerMaterial('#1a1a1a', 0.2);
    if (isSelected) {
      mat.emissive = new THREE.Color('#1e40af');
      mat.emissiveIntensity = 0.2;
    }
    return mat;
  }, [isSelected]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(containerId);
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      name={containerId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Container de base - 12 triangles seulement (boxGeometry) */}
      <mesh
        position={[0, HD5_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH]} />
        <primitive object={containerMaterial} attach="material" />
      </mesh>

      {/* Logo HEARST UNIQUEMENT sur la face arrière (visible depuis la nouvelle position caméra) */}
      <HearstLogo
        position={[0, HD5_HEIGHT / 2, -HD5_WIDTH / 2 - 0.05]}
        rotation={[0, Math.PI, 0]}
        width={HD5_LENGTH * 0.6}
      />
    </group>
  );
}
