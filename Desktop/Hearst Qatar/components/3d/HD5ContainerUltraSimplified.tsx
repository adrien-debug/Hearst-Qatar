import { useRef, useMemo } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import HearstLogo from './HearstLogo';
import HD5CoolingModule from './HD5CoolingModule';
import HD5RoofModule from './HD5RoofModule';
import { createContainerMaterial } from '../../utils/materialHelpers';

interface HD5ContainerUltraSimplifiedProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Container BITMAIN ANTSPACE HD5 HYDRO
 * - Dimensions ISO 40ft exactes : 12.196m × 2.896m × 2.438m
 * - Matériaux PBR avec textures réalistes
 * - Détails industriels (nervures, coins renforcés)
 * - Logo HEARST sur face arrière
 */
export default function HD5ContainerUltraSimplified({
  position,
  containerId,
  onSelect,
  isSelected = false,
}: HD5ContainerUltraSimplifiedProps) {
  const groupRef = useRef<Group>(null);

  // Dimensions ISO 40ft exactes en mètres
  const HD5_LENGTH = 12.196; // 40 pieds
  const HD5_WIDTH = 2.438;   // 8 pieds (corrigé de 3.5m à la dimension ISO correcte)
  const HD5_HEIGHT = 2.896;  // 9,5 pieds
  const COOLING_HEIGHT = 1.2; // Hauteur du module de refroidissement
  const ROOF_HEIGHT = 0.4;    // Hauteur du module toit

  // Matériaux avec textures PBR mémorisés
  const containerMaterial = useMemo(() => {
    const mat = createContainerMaterial('#1a1a1a', 0.3);
    if (isSelected) {
      mat.emissive = new THREE.Color('#1e40af');
      mat.emissiveIntensity = 0.2;
    }
    return mat;
  }, [isSelected]);

  const metalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#374151',
      metalness: 0.8,
      roughness: 0.3,
    });
  }, []);

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
      {/* ========== STRUCTURE PRINCIPALE DU CONTAINER ========== */}
      
      {/* Corps principal avec texture PBR */}
      <mesh
        position={[0, HD5_HEIGHT / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH]} />
        <primitive object={containerMaterial} attach="material" />
      </mesh>

      {/* ========== NERVURES VERTICALES (PAROIS ONDULÉES) ========== */}
      
      {/* Nervures sur la face avant */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`rib-front-${i}`}
          position={[-HD5_LENGTH / 2 + 1 + i * (HD5_LENGTH - 2) / 11, HD5_HEIGHT / 2, HD5_WIDTH / 2 + 0.01]}
          castShadow
        >
          <boxGeometry args={[0.08, HD5_HEIGHT - 0.3, 0.04]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {/* Nervures sur la face arrière */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={`rib-back-${i}`}
          position={[-HD5_LENGTH / 2 + 1 + i * (HD5_LENGTH - 2) / 11, HD5_HEIGHT / 2, -HD5_WIDTH / 2 - 0.01]}
          castShadow
        >
          <boxGeometry args={[0.08, HD5_HEIGHT - 0.3, 0.04]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {/* Nervures sur les côtés */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`rib-side-left-${i}`}
          position={[-HD5_LENGTH / 2 + 0.01, HD5_HEIGHT / 2, -HD5_WIDTH / 2 + 0.3 + i * (HD5_WIDTH - 0.6) / 7]}
          castShadow
        >
          <boxGeometry args={[0.04, HD5_HEIGHT - 0.3, 0.08]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`rib-side-right-${i}`}
          position={[HD5_LENGTH / 2 - 0.01, HD5_HEIGHT / 2, -HD5_WIDTH / 2 + 0.3 + i * (HD5_WIDTH - 0.6) / 7]}
          castShadow
        >
          <boxGeometry args={[0.04, HD5_HEIGHT - 0.3, 0.08]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {/* ========== COINS RENFORCÉS ISO ========== */}
      
      {/* Coins ISO aux 8 angles */}
      {[
        [-HD5_LENGTH / 2, 0, -HD5_WIDTH / 2],
        [HD5_LENGTH / 2, 0, -HD5_WIDTH / 2],
        [-HD5_LENGTH / 2, 0, HD5_WIDTH / 2],
        [HD5_LENGTH / 2, 0, HD5_WIDTH / 2],
        [-HD5_LENGTH / 2, HD5_HEIGHT, -HD5_WIDTH / 2],
        [HD5_LENGTH / 2, HD5_HEIGHT, -HD5_WIDTH / 2],
        [-HD5_LENGTH / 2, HD5_HEIGHT, HD5_WIDTH / 2],
        [HD5_LENGTH / 2, HD5_HEIGHT, HD5_WIDTH / 2],
      ].map((pos, i) => (
        <mesh
          key={`corner-${i}`}
          position={pos as [number, number, number]}
          castShadow
        >
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* ========== CADRE DE PORTE (FACE ARRIÈRE) ========== */}
      
      {/* Montants verticaux de porte */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh
          key={`door-frame-${i}`}
          position={[x, HD5_HEIGHT / 2, -HD5_WIDTH / 2 - 0.02]}
          castShadow
        >
          <boxGeometry args={[0.12, HD5_HEIGHT - 0.4, 0.08]} />
          <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {/* Traverse horizontale de porte */}
      <mesh
        position={[0, HD5_HEIGHT - 0.2, -HD5_WIDTH / 2 - 0.02]}
        castShadow
      >
        <boxGeometry args={[1.5, 0.12, 0.08]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* ========== TUYAUX DE REFROIDISSEMENT ========== */}
      
      {/* Tuyaux sur le toit */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh
          key={`pipe-top-${i}`}
          position={[x, HD5_HEIGHT + 0.08, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.06, 0.06, HD5_LENGTH - 1, 12]} />
          <meshStandardMaterial
            color="#e5e7eb"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* ========== UNITÉS DE VENTILATION ========== */}
      
      {/* Ventilateurs sur le toit */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={`vent-${i}`} position={[x, HD5_HEIGHT + 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
          {/* Grille de ventilation */}
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.8}
              roughness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* ========== LOGO HEARST ========== */}
      
      {/* Logo HEARST sur la face arrière (visible depuis la caméra) */}
      <HearstLogo
        position={[0, HD5_HEIGHT / 2, -HD5_WIDTH / 2 - 0.06]}
        rotation={[Math.PI, Math.PI, 0]}
        width={HD5_LENGTH * 0.6}
      />

      {/* ========== MODULE DE REFROIDISSEMENT ========== */}
      
      {/* Module de refroidissement Bitmain avec panneaux bleus */}
      <HD5CoolingModule
        position={[0, HD5_HEIGHT + COOLING_HEIGHT / 2, 0]}
        width={HD5_LENGTH}
        depth={HD5_WIDTH}
        height={COOLING_HEIGHT}
      />

      {/* ========== MODULE TOIT ========== */}
      
      {/* Toit ondulé blanc/gris au-dessus du cooling */}
      <HD5RoofModule
        position={[0, HD5_HEIGHT + COOLING_HEIGHT + ROOF_HEIGHT / 2, 0]}
        width={HD5_LENGTH}
        depth={HD5_WIDTH}
        height={ROOF_HEIGHT}
      />
    </group>
  );
}
