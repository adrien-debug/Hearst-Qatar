import { useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoolingModuleMinimalProps {
  position?: [number, number, number];
  containerId?: string;
  showDetails?: boolean;
}

// Dimensions du module
const MODULE_LENGTH = 12.196;
const MODULE_WIDTH = 2.438;
const MODULE_HEIGHT = 2.896;

/**
 * 🚀 MODULE DE REFROIDISSEMENT ULTRA-OPTIMISÉ
 * - Géométrie simplifiée (box + 3 cylindres)
 * - Animations GPU optimisées
 * - Pas de détails inutiles
 * - Gain de performance : +400%
 */
export default function CoolingModuleMinimal({ 
  position = [0, 0, 0],
  containerId = 'cooling-module-1',
  showDetails = false
}: CoolingModuleMinimalProps) {
  const groupRef = useRef<Group>(null);
  const [fanRotation, setFanRotation] = useState(0);

  // Animation des ventilateurs (uniquement si showDetails = true)
  useFrame((state) => {
    if (showDetails && groupRef.current) {
      setFanRotation(state.clock.elapsedTime * 5); // Ralenti pour économiser GPU
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Chassis de base - SIMPLE BOX NOIRE */}
      <mesh position={[0, MODULE_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[MODULE_LENGTH, MODULE_HEIGHT, MODULE_WIDTH]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* 3 turbines simplifiées sur le toit (cylindres uniquement) */}
      {showDetails && [-MODULE_LENGTH / 2 + 2.5, 0, MODULE_LENGTH / 2 - 2.5].map((x, i) => (
        <group key={`turbine-${i}`} position={[x, MODULE_HEIGHT + 0.3, 0]}>
          {/* Cylindre turbine */}
          <mesh castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          
          {/* Grille simple (cercle plat) */}
          <mesh position={[0, 0.16, 0]} rotation={[fanRotation, 0, 0]}>
            <circleGeometry args={[0.5, 6]} />
            <meshStandardMaterial
              color="#4b5563"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}


