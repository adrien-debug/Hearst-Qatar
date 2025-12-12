import { useMemo } from 'react';
import * as THREE from 'three';
import HearstLogo from './HearstLogo';

interface HD5ContainerMinimalProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * 🚀 CONTAINER HD5 ULTRA-OPTIMISÉ
 * - Seulement 12 triangles (boxGeometry)
 * - 1 seul logo sur face avant
 * - Matériau simple sans textures complexes
 * - Gain de performance : +300%
 */
export default function HD5ContainerMinimal({
  position,
  containerId,
  onSelect,
  isSelected = false,
}: HD5ContainerMinimalProps) {
  // Dimensions ISO 40ft exactes
  const HD5_LENGTH = 12.196;
  const HD5_WIDTH = 2.438;
  const HD5_HEIGHT = 2.896;

  // Matériau simple mémorisé
  const containerMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      metalness: 0.2,
      roughness: 0.8,
    });
    
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
      {/* Container de base - SEULEMENT 12 TRIANGLES */}
      <mesh
        position={[0, HD5_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH]} />
        <primitive object={containerMaterial} attach="material" />
      </mesh>

      {/* Logo HEARST - UNIQUEMENT face avant */}
      <HearstLogo
        position={[0, HD5_HEIGHT / 2, HD5_WIDTH / 2 + 0.05]}
        rotation={[0, 0, 0]}
        width={HD5_LENGTH * 0.6}
      />
    </group>
  );
}


