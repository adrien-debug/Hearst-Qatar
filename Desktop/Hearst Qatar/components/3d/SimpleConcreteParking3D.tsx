import { useRef } from 'react';
import { Group } from 'three';

interface SimpleConcreteParkingProps {
  position: [number, number, number];
  width?: number;
  depth?: number;
  spotsCount?: number;
}

/**
 * Parking simple en béton au sol avec marquage de places
 */
export default function SimpleConcreteParking3D({
  position,
  width = 30,
  depth = 15,
  spotsCount = 30,
}: SimpleConcreteParkingProps) {
  const groupRef = useRef<Group>(null);

  const spotWidth = 2.5;
  const spotDepth = 5;
  const rows = 2; // 2 rangées
  const spotsPerRow = Math.floor(spotsCount / rows);

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== DALLE DE BÉTON ==================== */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#BDBDBD"
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>

      {/* Texture béton (légères variations) */}
      {Array.from({ length: 30 }).map((_, i) => {
        const randomX = (Math.random() - 0.5) * width * 0.9;
        const randomZ = (Math.random() - 0.5) * depth * 0.9;
        const randomSize = 0.4 + Math.random() * 0.6;
        return (
          <mesh
            key={`concrete-texture-${i}`}
            position={[randomX, 0.11, randomZ]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <boxGeometry args={[randomSize, 0.01, randomSize]} />
            <meshStandardMaterial
              color="#B0B0B0"
              roughness={0.9}
            />
          </mesh>
        );
      })}

      {/* ==================== MARQUAGE AU SOL - RANGÉE HAUT ==================== */}
      {Array.from({ length: spotsPerRow }).map((_, i) => {
        const x = -width / 2 + (i + 1) * (width / (spotsPerRow + 1));
        const z = -depth / 4;

        return (
          <group key={`spot-top-${i}`} position={[x, 0.11, z]}>
            {/* Ligne gauche */}
            <mesh position={[-spotWidth / 2, 0, 0]}>
              <boxGeometry args={[0.1, 0.005, spotDepth]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Ligne droite */}
            <mesh position={[spotWidth / 2, 0, 0]}>
              <boxGeometry args={[0.1, 0.005, spotDepth]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Ligne fond */}
            <mesh position={[0, 0, spotDepth / 2]}>
              <boxGeometry args={[spotWidth, 0.005, 0.1]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Numéro de place */}
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.5, 0.5]} />
              <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== MARQUAGE AU SOL - RANGÉE BAS ==================== */}
      {Array.from({ length: spotsPerRow }).map((_, i) => {
        const x = -width / 2 + (i + 1) * (width / (spotsPerRow + 1));
        const z = depth / 4;

        return (
          <group key={`spot-bottom-${i}`} position={[x, 0.11, z]} rotation={[0, Math.PI, 0]}>
            {/* Ligne gauche */}
            <mesh position={[-spotWidth / 2, 0, 0]}>
              <boxGeometry args={[0.1, 0.005, spotDepth]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Ligne droite */}
            <mesh position={[spotWidth / 2, 0, 0]}>
              <boxGeometry args={[0.1, 0.005, spotDepth]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Ligne fond */}
            <mesh position={[0, 0, spotDepth / 2]}>
              <boxGeometry args={[spotWidth, 0.005, 0.1]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Numéro de place */}
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.5, 0.5]} />
              <meshStandardMaterial
                color="#FFFFFF"
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== LIGNE CENTRALE (allée) ==================== */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[width * 0.95, 0.002, 0.15]} />
        <meshStandardMaterial
          color="#FFEB3B"
          emissive="#FFEB3B"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* ==================== BORDURES ==================== */}
      
      {/* Bordure avant */}
      <mesh position={[0, 0.15, -depth / 2]} castShadow>
        <boxGeometry args={[width, 0.3, 0.2]} />
        <meshStandardMaterial
          color="#808080"
          roughness={0.8}
        />
      </mesh>

      {/* Bordure arrière */}
      <mesh position={[0, 0.15, depth / 2]} castShadow>
        <boxGeometry args={[width, 0.3, 0.2]} />
        <meshStandardMaterial
          color="#808080"
          roughness={0.8}
        />
      </mesh>

      {/* Bordure gauche */}
      <mesh position={[-width / 2, 0.15, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, depth]} />
        <meshStandardMaterial
          color="#808080"
          roughness={0.8}
        />
      </mesh>

      {/* Bordure droite */}
      <mesh position={[width / 2, 0.15, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, depth]} />
        <meshStandardMaterial
          color="#808080"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}


