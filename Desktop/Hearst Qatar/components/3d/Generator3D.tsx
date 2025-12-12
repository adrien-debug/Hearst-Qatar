import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface Generator3DProps {
  position: [number, number, number];
  generatorId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

// Dimensions d'un générateur (approximatives)
const GENERATOR_LENGTH = 8; // m
const GENERATOR_WIDTH = 3;  // m
const GENERATOR_HEIGHT = 4; // m

export default function Generator3D({ 
  position, 
  generatorId, 
  onSelect,
  isSelected = false 
}: Generator3DProps) {
  const groupRef = useRef<Group>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(generatorId);
    }
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Structure principale du générateur */}
      <mesh position={[0, GENERATOR_HEIGHT/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[GENERATOR_LENGTH, GENERATOR_HEIGHT, GENERATOR_WIDTH]} />
        <meshStandardMaterial 
          color={isSelected ? '#e0e0e0' : '#4b5563'} 
          metalness={0.6}
          roughness={0.4}
          emissive={isSelected ? '#3b82f6' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Panneaux latéraux avec détails */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh 
          key={`side-panel-${i}`}
          position={[-GENERATOR_LENGTH/2 + 0.1 + i * 2, GENERATOR_HEIGHT/2, GENERATOR_WIDTH/2 + 0.01]} 
          castShadow
        >
          <boxGeometry args={[1.8, GENERATOR_HEIGHT * 0.9, 0.05]} />
          <meshStandardMaterial 
            color="#374151" 
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Grilles de ventilation sur les côtés */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh 
          key={`vent-${i}`}
          position={[-GENERATOR_LENGTH/2 + 0.5 + i * 1.2, GENERATOR_HEIGHT/2 + 0.5, GENERATOR_WIDTH/2 + 0.02]}
          castShadow
        >
          <boxGeometry args={[0.8, 0.6, 0.03]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.6}
            roughness={0.3}
            opacity={0.7}
            transparent
          />
        </mesh>
      ))}

      {/* Panneau de contrôle avant */}
      <mesh position={[0, GENERATOR_HEIGHT/2, -GENERATOR_WIDTH/2 - 0.01]} castShadow>
        <boxGeometry args={[GENERATOR_LENGTH * 0.6, GENERATOR_HEIGHT * 0.4, 0.1]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Indicateurs LED */}
      {[0, 1, 2].map((i) => (
        <mesh 
          key={`led-${i}`}
          position={[-GENERATOR_LENGTH/2 + 0.3 + i * 0.5, GENERATOR_HEIGHT - 0.2, GENERATOR_WIDTH/2 + 0.03]}
        >
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial 
            color={isSelected ? '#3b82f6' : '#10b981'} 
            emissive={isSelected ? '#3b82f6' : '#10b981'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Tuyaux de refroidissement sur le dessus */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh 
          key={`cooling-pipe-${i}`}
          position={[-GENERATOR_LENGTH/3 + i * (GENERATOR_LENGTH/3), GENERATOR_HEIGHT + 0.1, 0]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, GENERATOR_WIDTH * 0.8, 16]} />
          <meshStandardMaterial 
            color="#64748b" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Base/support du générateur */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[GENERATOR_LENGTH + 0.2, 0.2, GENERATOR_WIDTH + 0.2]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}
