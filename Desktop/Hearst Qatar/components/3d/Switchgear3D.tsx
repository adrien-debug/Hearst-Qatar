import { useRef } from 'react';
import { Group, Mesh } from 'three';
import * as THREE from 'three';

interface Switchgear3DProps {
  position: [number, number, number];
  switchgearId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Switchgear / Coffret disjoncteur industriel
 * Dimensions réalistes avec matériaux PBR métalliques
 */
export default function Switchgear3D({
  position,
  switchgearId,
  onSelect,
  isSelected = false,
}: Switchgear3DProps) {
  const groupRef = useRef<Group>(null);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(switchgearId);
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      name={switchgearId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Socle en béton */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.4, 2]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.0}
          roughness={0.7}
        />
      </mesh>

      {/* Structure principale du coffret */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 1.5]} />
        <meshStandardMaterial
          color={isSelected ? '#4a9eff' : '#4b5563'}
          metalness={0.6}
          roughness={0.4}
          emissive={isSelected ? '#1e40af' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Portes avant (2 portes) */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh
          key={`door-${i}`}
          position={[x, 1.5, 0.76]}
          castShadow
        >
          <boxGeometry args={[0.9, 2.3, 0.05]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Poignées de portes */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh
          key={`handle-${i}`}
          position={[x, 1.5, 0.82]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.03, 0.15, 16]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Indicateurs LED (3 LED en haut) */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh
          key={`led-${i}`}
          position={[x, 2.6, 0.76]}
        >
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial
            color={i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : '#ef4444'}
            emissive={i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : '#ef4444'}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Panneaux latéraux avec grilles de ventilation */}
      {[-1, 1].map((z, i) => (
        <group key={`side-${i}`} position={[0, 1.5, z]}>
          <mesh castShadow>
            <boxGeometry args={[2, 2.5, 0.1]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          {/* Grilles de ventilation */}
          {Array.from({ length: 6 }).map((_, j) => (
            <mesh
              key={`vent-${i}-${j}`}
              position={[-0.8 + (j * 0.32), 0.5 - (j % 3) * 0.8, 0.06]}
            >
              <boxGeometry args={[0.25, 0.25, 0.02]} />
              <meshStandardMaterial
                color="#1f2937"
                metalness={0.8}
                roughness={0.2}
                opacity={0.6}
                transparent
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Câbles de connexion (sortie supérieure) */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
