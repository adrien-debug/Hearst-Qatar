import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface Parking3DProps {
  position: [number, number, number];
  width?: number;
  depth?: number;
  rows?: number;
  spotsPerRow?: number;
}

/**
 * Parking professionnel avec places délimitées et éclairage
 * 40 places : 4 handicapés + 2 VIP + 34 standard
 */
export default function Parking3D({
  position,
  width = 30,
  depth = 20,
  rows = 2,
  spotsPerRow = 20,
}: Parking3DProps) {
  const groupRef = useRef<Group>(null);

  const spotWidth = 2.5;
  const spotDepth = 5;
  const centralAlleyWidth = 5;

  // Créer une place de parking
  const createParkingSpot = (
    spotPosition: [number, number, number],
    rotation: number,
    type: 'standard' | 'handicapped' | 'vip' = 'standard'
  ) => {
    const color = type === 'handicapped' ? '#3B82F6' : type === 'vip' ? '#8B5CF6' : '#FFFFFF';
    
    return (
      <group position={spotPosition} rotation={[0, rotation, 0]}>
        {/* Lignes de délimitation */}
        {/* Ligne gauche */}
        <mesh position={[-spotWidth / 2, 0.01, 0]}>
          <boxGeometry args={[0.08, 0.005, spotDepth]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Ligne droite */}
        <mesh position={[spotWidth / 2, 0.01, 0]}>
          <boxGeometry args={[0.08, 0.005, spotDepth]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Ligne fond */}
        <mesh position={[0, 0.01, spotDepth / 2]}>
          <boxGeometry args={[spotWidth, 0.005, 0.08]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Symbole handicapé */}
        {type === 'handicapped' && (
          <>
            {/* Cercle (roue) */}
            <mesh position={[0, 0.015, spotDepth / 4]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.4, 32]} />
              <meshStandardMaterial
                color="#3B82F6"
                emissive="#3B82F6"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Silhouette */}
            <mesh position={[0, 0.015, spotDepth / 4 + 0.3]}>
              <circleGeometry args={[0.2, 32]} />
              <meshStandardMaterial
                color="#3B82F6"
                emissive="#3B82F6"
                emissiveIntensity={0.3}
              />
            </mesh>
          </>
        )}

        {/* Symbole VIP */}
        {type === 'vip' && (
          <mesh position={[0, 0.015, spotDepth / 4]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 0.6]} />
            <meshStandardMaterial
              color="#8B5CF6"
              emissive="#8B5CF6"
              emissiveIntensity={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>
        )}
      </group>
    );
  };

  // Créer un lampadaire
  const createStreetLight = (lightPosition: [number, number, number]) => (
    <group position={lightPosition}>
      {/* Poteau */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 8, 12]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 0.5, 12]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Tête du lampadaire */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.12, 0.4, 12]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Bras d'extension */}
      <mesh position={[0.5, 7.7, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Luminaire LED */}
      <mesh position={[1, 8, 0]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Zone lumineuse */}
      <mesh position={[1, 7.8, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.05]} />
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFF8DC"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Lumière ponctuelle */}
      <pointLight
        position={[1, 8, 0]}
        intensity={3}
        distance={30}
        decay={2}
        color="#FFF8DC"
        castShadow
      />
    </group>
  );

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== SOL DU PARKING (ASPHALTE) ==================== */}
      
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width, 0.15, depth]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* Texture asphalte (petites variations) */}
      {Array.from({ length: 20 }).map((_, i) => {
        const randomX = (Math.random() - 0.5) * width * 0.9;
        const randomZ = (Math.random() - 0.5) * depth * 0.9;
        const randomSize = 0.3 + Math.random() * 0.5;
        return (
          <mesh
            key={`asphalt-texture-${i}`}
            position={[randomX, 0.08, randomZ]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <boxGeometry args={[randomSize, 0.01, randomSize]} />
            <meshStandardMaterial
              color={new THREE.Color(0.15 + Math.random() * 0.05, 0.15 + Math.random() * 0.05, 0.15 + Math.random() * 0.05)}
              roughness={0.95}
            />
          </mesh>
        );
      })}

      {/* ==================== ALLÉE CENTRALE ==================== */}
      
      {/* Marquage central */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[centralAlleyWidth, 0.002, depth - 1]} />
        <meshStandardMaterial
          color="#4A4A4A"
          roughness={0.85}
        />
      </mesh>

      {/* Flèches de circulation */}
      {[-depth / 4, depth / 4].map((z, i) => (
        <mesh key={`arrow-${i}`} position={[0, 0.085, z]} rotation={[-Math.PI / 2, 0, i === 0 ? Math.PI : 0]}>
          <coneGeometry args={[0.3, 0.8, 3]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* ==================== PLACES DE PARKING - RANGÉE GAUCHE ==================== */}
      
      {/* 2 places VIP (avant) */}
      {[0, 1].map((i) => {
        const z = -depth / 2 + 1 + i * spotDepth;
        const x = -centralAlleyWidth / 2 - spotWidth / 2;
        return createParkingSpot([x, 0, z], Math.PI / 2, 'vip');
      })}

      {/* 2 places handicapés */}
      {[2, 3].map((i) => {
        const z = -depth / 2 + 1 + i * spotDepth;
        const x = -centralAlleyWidth / 2 - spotWidth / 2;
        return createParkingSpot([x, 0, z], Math.PI / 2, 'handicapped');
      })}

      {/* 16 places standard */}
      {Array.from({ length: 16 }).map((_, i) => {
        const actualIndex = i + 4;
        if (actualIndex >= spotsPerRow) return null;
        const z = -depth / 2 + 1 + actualIndex * (depth / spotsPerRow);
        const x = -centralAlleyWidth / 2 - spotWidth / 2;
        return createParkingSpot([x, 0, z], Math.PI / 2, 'standard');
      })}

      {/* ==================== PLACES DE PARKING - RANGÉE DROITE ==================== */}
      
      {/* 2 places handicapés */}
      {[0, 1].map((i) => {
        const z = -depth / 2 + 1 + i * spotDepth;
        const x = centralAlleyWidth / 2 + spotWidth / 2;
        return createParkingSpot([x, 0, z], -Math.PI / 2, 'handicapped');
      })}

      {/* 18 places standard */}
      {Array.from({ length: 18 }).map((_, i) => {
        const actualIndex = i + 2;
        if (actualIndex >= spotsPerRow) return null;
        const z = -depth / 2 + 1 + actualIndex * (depth / spotsPerRow);
        const x = centralAlleyWidth / 2 + spotWidth / 2;
        return createParkingSpot([x, 0, z], -Math.PI / 2, 'standard');
      })}

      {/* ==================== BORDURES DU PARKING ==================== */}
      
      {/* Bordure avant */}
      <mesh position={[0, 0.1, -depth / 2]} castShadow>
        <boxGeometry args={[width, 0.2, 0.3]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Bordure arrière */}
      <mesh position={[0, 0.1, depth / 2]} castShadow>
        <boxGeometry args={[width, 0.2, 0.3]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Bordure gauche */}
      <mesh position={[-width / 2, 0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, depth]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Bordure droite */}
      <mesh position={[width / 2, 0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, depth]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* ==================== LAMPADAIRES ==================== */}
      
      {/* 3 lampadaires côté gauche */}
      {[0, 1, 2].map((i) => {
        const z = -depth / 3 + i * (depth / 2);
        return createStreetLight([-width / 2 - 1.5, 0, z]);
      })}

      {/* 3 lampadaires côté droit */}
      {[0, 1, 2].map((i) => {
        const z = -depth / 3 + i * (depth / 2);
        return createStreetLight([width / 2 + 1.5, 0, z]);
      })}

      {/* ==================== PANNEAUX DE SIGNALISATION ==================== */}
      
      {/* Panneau "PARKING" à l'entrée */}
      <group position={[0, 0, -depth / 2 - 1.5]}>
        {/* Poteau */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 3, 12]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Panneau */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[2, 1, 0.05]} />
          <meshStandardMaterial
            color="#2563EB"
            metalness={0.2}
            roughness={0.6}
            emissive="#2563EB"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Bordure blanche */}
        <mesh position={[0, 3, 0.03]}>
          <boxGeometry args={[1.9, 0.9, 0.01]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* Panneau "VITESSE LIMITÉE 10 km/h" */}
      <group position={[-width / 2 + 2, 0, -depth / 2 + 1]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 3, 12]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Panneau circulaire */}
        <mesh position={[0, 3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial
            color="#EF4444"
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        {/* Cercle blanc intérieur */}
        <mesh position={[0, 3, 0.03]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* ==================== ZONE RÉSERVÉE (marquage au sol) ==================== */}
      
      {/* Texte "RÉSERVÉ VIP" */}
      <mesh position={[-centralAlleyWidth / 2 - spotWidth / 2, 0.085, -depth / 2 + 3]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <boxGeometry args={[2, 0.5, 0.001]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ==================== POUBELLES ET MOBILIER ==================== */}
      
      {/* 2 poubelles */}
      {[0, 1].map((i) => (
        <group key={`bin-${i}`} position={[width / 2 - 1, 0, -depth / 2 + 2 + i * 5]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 1, 12]} />
            <meshStandardMaterial
              color="#2A2A2A"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          {/* Couvercle */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.28, 0.1, 12]} />
            <meshStandardMaterial
              color="#1A1A1A"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Banc */}
      <group position={[-width / 2 + 1.5, 0, depth / 2 - 2]}>
        {/* Assise */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 0.08, 0.4]} />
          <meshStandardMaterial
            color="#6B4423"
            metalness={0.0}
            roughness={0.8}
          />
        </mesh>
        {/* Dossier */}
        <mesh position={[0, 0.8, -0.15]} rotation={[Math.PI / 12, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 0.5, 0.08]} />
          <meshStandardMaterial
            color="#6B4423"
            metalness={0.0}
            roughness={0.8}
          />
        </mesh>
        {/* Pieds */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={`leg-${i}`} position={[x, 0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial
              color="#2A2A2A"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

