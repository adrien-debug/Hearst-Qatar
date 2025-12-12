import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface HD5RoofModuleProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height?: number;
}

/**
 * Module toit Bitmain Antspace HD5
 * - Toit ondulé blanc/gris clair
 * - Nervures horizontales (effet tôle ondulée)
 * - Ouvertures latérales pour ventilation
 * - Coins ISO renforcés (continuité du container)
 */
export default function HD5RoofModule({
  position,
  width,
  depth,
  height = 0.4,
}: HD5RoofModuleProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== TOIT PRINCIPAL ==================== */}
      
      {/* Structure principale du toit */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#f3f4f6"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* ==================== NERVURES HORIZONTALES (TÔLE ONDULÉE) ==================== */}
      
      {/* Nervures sur le dessus */}
      {Array.from({ length: 20 }).map((_, i) => {
        const z = -depth / 2 + (i * (depth / 19));
        return (
          <mesh
            key={`roof-rib-top-${i}`}
            position={[0, height + 0.01, z]}
            castShadow
          >
            <boxGeometry args={[width - 0.1, 0.03, 0.08]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {/* Nervures sur les côtés (effet ondulation) */}
      {Array.from({ length: 20 }).map((_, i) => {
        const z = -depth / 2 + (i * (depth / 19));
        // Côté gauche
        return (
          <mesh
            key={`roof-rib-side-left-${i}`}
            position={[-width / 2 + 0.02, height / 2, z]}
            castShadow
          >
            <boxGeometry args={[0.04, height - 0.05, 0.08]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {Array.from({ length: 20 }).map((_, i) => {
        const z = -depth / 2 + (i * (depth / 19));
        // Côté droit
        return (
          <mesh
            key={`roof-rib-side-right-${i}`}
            position={[width / 2 - 0.02, height / 2, z]}
            castShadow
          >
            <boxGeometry args={[0.04, height - 0.05, 0.08]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {/* ==================== COINS ISO RENFORCÉS ==================== */}
      
      {/* Coins aux 4 angles (continuité du container) */}
      {[
        [-width / 2, height, -depth / 2],
        [width / 2, height, -depth / 2],
        [-width / 2, height, depth / 2],
        [width / 2, height, depth / 2],
      ].map((pos, i) => (
        <mesh key={`corner-iso-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Coins aux 4 angles du bas */}
      {[
        [-width / 2, 0, -depth / 2],
        [width / 2, 0, -depth / 2],
        [-width / 2, 0, depth / 2],
        [width / 2, 0, depth / 2],
      ].map((pos, i) => (
        <mesh key={`corner-iso-bottom-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* ==================== OUVERTURES DE VENTILATION LATÉRALES ==================== */}
      
      {/* Grilles de ventilation sur les côtés */}
      {/* Côté avant gauche */}
      <group position={[-width / 2 + 1, height / 2, depth / 2 - 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-fl-${i}`}
            position={[-0.35 + i * 0.18, 0, 0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Côté avant droit */}
      <group position={[width / 2 - 1, height / 2, depth / 2 - 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-fr-${i}`}
            position={[-0.35 + i * 0.18, 0, 0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Côté arrière gauche */}
      <group position={[-width / 2 + 1, height / 2, -depth / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-bl-${i}`}
            position={[-0.35 + i * 0.18, 0, -0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Côté arrière droit */}
      <group position={[width / 2 - 1, height / 2, -depth / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-br-${i}`}
            position={[-0.35 + i * 0.18, 0, -0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* ==================== BANDES DE RENFORT ==================== */}
      
      {/* Bandes métalliques de renfort sur les bords */}
      {/* Bord avant */}
      <mesh position={[0, height / 2, depth / 2 - 0.05]} castShadow>
        <boxGeometry args={[width, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bord arrière */}
      <mesh position={[0, height / 2, -depth / 2 + 0.05]} castShadow>
        <boxGeometry args={[width, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bord gauche */}
      <mesh position={[-width / 2 + 0.05, height / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.15, depth]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bord droit */}
      <mesh position={[width / 2 - 0.05, height / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.15, depth]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* ==================== EXTRACTEURS D'AIR (ROOF VENTS) ==================== */}
      
      {/* Petits extracteurs d'air sur le toit */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={`roof-vent-${i}`} position={[x, height + 0.05, 0]}>
          {/* Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
          {/* Capot */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <coneGeometry args={[0.2, 0.12, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== MARQUAGE ET IDENTIFICATION ==================== */}
      
      {/* Plaque d'identification sur le côté */}
      <mesh position={[-width / 2 + 0.5, height / 2, depth / 2 - 0.02]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {/* Texte simulé (petite plaque blanche) */}
      <mesh position={[-width / 2 + 0.5, height / 2, depth / 2 - 0.01]}>
        <boxGeometry args={[0.55, 0.1, 0.005]} />
        <meshStandardMaterial
          color="#f9fafb"
          emissive="#f9fafb"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ==================== SUPPORTS DE LEVAGE ==================== */}
      
      {/* Anneaux de levage aux 4 coins du toit */}
      {[
        [-width / 2 + 0.5, height + 0.02, -depth / 2 + 0.5],
        [width / 2 - 0.5, height + 0.02, -depth / 2 + 0.5],
        [-width / 2 + 0.5, height + 0.02, depth / 2 - 0.5],
        [width / 2 - 0.5, height + 0.02, depth / 2 - 0.5],
      ].map((pos, i) => (
        <mesh
          key={`lifting-ring-${i}`}
          position={pos as [number, number, number]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.08, 0.02, 12, 24]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}


