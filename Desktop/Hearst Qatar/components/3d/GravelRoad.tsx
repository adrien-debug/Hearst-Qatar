import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface GravelRoadProps {
  position: [number, number, number];
  length: number;
  width: number;
  orientation?: 'horizontal' | 'vertical'; // horizontal = le long de X, vertical = le long de Z
}

/**
 * Route en gravier tassé
 * Texture gravier gris clair avec effet granuleux
 * Pour circulation entre les conteneurs et équipements
 */
export default function GravelRoad({
  position,
  length,
  width,
  orientation = 'horizontal',
}: GravelRoadProps) {
  const groupRef = useRef<Group>(null);

  // Dimensions selon l'orientation
  const roadWidth = orientation === 'horizontal' ? length : width;
  const roadDepth = orientation === 'horizontal' ? width : length;

  return (
    <group ref={groupRef} position={position}>
      {/* Surface de la route en gravier */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[roadWidth, 0.1, roadDepth]} />
        <meshStandardMaterial
          color="#b0b0b0"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Texture granuleuse procédurale (petites variations) */}
      {Array.from({ length: Math.floor(roadWidth / 2) }).map((_, i) => {
        return Array.from({ length: Math.floor(roadDepth / 2) }).map((_, j) => {
          const offsetX = -roadWidth / 2 + i * 2 + 1;
          const offsetZ = -roadDepth / 2 + j * 2 + 1;
          const randomHeight = Math.random() * 0.02;
          const randomColor = 0.1 + Math.random() * 0.1; // Variation de gris
          
          return (
            <mesh
              key={`gravel-${i}-${j}`}
              position={[
                offsetX + (Math.random() - 0.5) * 0.5,
                0.06 + randomHeight,
                offsetZ + (Math.random() - 0.5) * 0.5
              ]}
              rotation={[0, Math.random() * Math.PI, 0]}
            >
              <boxGeometry args={[0.3 + Math.random() * 0.2, 0.01, 0.3 + Math.random() * 0.2]} />
              <meshStandardMaterial
                color={new THREE.Color(randomColor, randomColor, randomColor).addScalar(0.6)}
                metalness={0.05}
                roughness={0.95}
              />
            </mesh>
          );
        });
      })}

      {/* Bordures de route (délimitation) */}
      {/* Bordure gauche */}
      <mesh position={[-roadWidth / 2, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.05, roadDepth]} />
        <meshStandardMaterial
          color="#8a8a8a"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Bordure droite */}
      <mesh position={[roadWidth / 2, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.05, roadDepth]} />
        <meshStandardMaterial
          color="#8a8a8a"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Marquages au sol - ligne centrale (optionnel, peut être enlevé si trop chargé) */}
      {orientation === 'horizontal' && roadWidth > 10 && (
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[roadWidth * 0.9, 0.005, 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.0}
            roughness={0.8}
            opacity={0.7}
            transparent
          />
        </mesh>
      )}
    </group>
  );
}

