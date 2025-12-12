import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface HD5CoolingModuleProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height?: number;
}

/**
 * Module de refroidissement Bitmain Antspace HD5
 * - Architecture OUVERTE (transparente)
 * - Radiateurs en V visibles à travers
 * - Même hauteur que le container (2.896m)
 * - Châssis métallique blanc/gris
 * - Grilles d'évacuation noires sur le dessus
 * - Ventilateur circulaire latéral
 */
export default function HD5CoolingModule({
  position,
  width,
  depth,
  height = 2.896, // Même hauteur que le container
}: HD5CoolingModuleProps) {
  const groupRef = useRef<Group>(null);

  const numRadiators = 8; // Nombre de radiateurs en V
  const radiatorSpacing = (width - 1) / numRadiators;
  const vAngle = Math.PI / 6; // Angle des radiateurs en V (30 degrés)

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== STRUCTURE OUVERTE - CHÂSSIS SEULEMENT ==================== */}
      
      {/* Cadre supérieur (blanc/gris) */}
      <mesh position={[0, height - 0.1, 0]} castShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Cadre inférieur */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Poteaux verticaux aux coins (structure ouverte) */}
      {[
        [-width / 2 + 0.1, height / 2, -depth / 2 + 0.1],
        [width / 2 - 0.1, height / 2, -depth / 2 + 0.1],
        [-width / 2 + 0.1, height / 2, depth / 2 - 0.1],
        [width / 2 - 0.1, height / 2, depth / 2 - 0.1],
      ].map((pos, i) => (
        <mesh key={`corner-post-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, height - 0.4, 0.15]} />
          <meshStandardMaterial
            color="#f3f4f6"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* ==================== RADIATEURS EN V (VISIBLES À TRAVERS) ==================== */}
      
      {/* Radiateurs disposés en V - côté gauche incliné */}
      {Array.from({ length: numRadiators }).map((_, i) => {
        const x = -width / 2 + 0.5 + (i * radiatorSpacing);
        return (
          <group key={`radiator-v-left-${i}`} position={[x, height / 2, 0]}>
            {/* Panneau radiateur gauche du V (incliné vers l'intérieur) */}
            <mesh
              position={[-0.15, 0, 0]}
              rotation={[0, vAngle, 0]}
              castShadow
            >
              <boxGeometry args={[0.08, height - 0.6, 0.6]} />
              <meshStandardMaterial
                color="#0ea5e9"
                metalness={0.7}
                roughness={0.3}
                emissive="#0ea5e9"
                emissiveIntensity={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Ailettes/lamelles sur le radiateur gauche */}
            {Array.from({ length: 12 }).map((_, j) => (
              <mesh
                key={`fin-left-${j}`}
                position={[-0.15, -height / 2 + 0.4 + j * ((height - 0.8) / 11), 0]}
                rotation={[0, vAngle, 0]}
                castShadow
              >
                <boxGeometry args={[0.02, 0.03, 0.6]} />
                <meshStandardMaterial
                  color="#1e40af"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Radiateurs disposés en V - côté droit incliné */}
      {Array.from({ length: numRadiators }).map((_, i) => {
        const x = -width / 2 + 0.5 + (i * radiatorSpacing);
        return (
          <group key={`radiator-v-right-${i}`} position={[x, height / 2, 0]}>
            {/* Panneau radiateur droit du V (incliné vers l'intérieur) */}
            <mesh
              position={[0.15, 0, 0]}
              rotation={[0, -vAngle, 0]}
              castShadow
            >
              <boxGeometry args={[0.08, height - 0.6, 0.6]} />
              <meshStandardMaterial
                color="#0ea5e9"
                metalness={0.7}
                roughness={0.3}
                emissive="#0ea5e9"
                emissiveIntensity={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Ailettes/lamelles sur le radiateur droit */}
            {Array.from({ length: 12 }).map((_, j) => (
              <mesh
                key={`fin-right-${j}`}
                position={[0.15, -height / 2 + 0.4 + j * ((height - 0.8) / 11), 0]}
                rotation={[0, -vAngle, 0]}
                castShadow
              >
                <boxGeometry args={[0.02, 0.03, 0.6]} />
                <meshStandardMaterial
                  color="#1e40af"
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Barres de connexion entre radiateurs en V (structure) */}
      {Array.from({ length: numRadiators }).map((_, i) => {
        const x = -width / 2 + 0.5 + (i * radiatorSpacing);
        return (
          <mesh
            key={`v-connector-${i}`}
            position={[x, height / 2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* ==================== GRILLES D'ÉVACUATION (TOP) ==================== */}
      
      {/* Grille noire principale sur le dessus */}
      <mesh position={[0, height + 0.05, 0]} castShadow={false} receiveShadow>
        <boxGeometry args={[width - 0.2, 0.1, depth - 0.2]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Lamelles horizontales d'évacuation */}
      {Array.from({ length: 16 }).map((_, i) => {
        const z = -depth / 2 + 0.2 + (i * (depth - 0.4) / 15);
        return (
          <mesh
            key={`louver-${i}`}
            position={[0, height + 0.06, z]}
            castShadow
          >
            <boxGeometry args={[width - 0.4, 0.02, 0.08]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        );
      })}

      {/* ==================== VENTILATEUR LATÉRAL (CÔTÉ DROIT) ==================== */}
      
      <group position={[width / 2 - 0.1, height / 2, 0]}>
        {/* Boîtier du ventilateur */}
        <mesh position={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 1]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Ventilateur circulaire */}
        <mesh position={[0.31, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Grille de protection */}
        <mesh position={[0.35, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.45, 0.02, 16, 32]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Barres de la grille (croix) */}
        <mesh position={[0.35, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.04, 0.9, 0.02]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.35, 0, 0]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <boxGeometry args={[0.04, 0.9, 0.02]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Pales du ventilateur (simplifiées - 4 pales) */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={`blade-${i}`}
              position={[0.32, 0, 0]}
              rotation={[angle, Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.35, 0.08, 0.01]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* ==================== TUYAUX DE CONNEXION ==================== */}
      
      {/* Tuyau d'entrée (côté gauche, bas) */}
      <mesh
        position={[-width / 2 + 0.5, 0.2, -depth / 2 + 0.3]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Connexion coude */}
      <mesh
        position={[-width / 2 + 0.2, 0.2, -depth / 2 + 0.3]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Tuyau de sortie (côté gauche, haut) */}
      <mesh
        position={[-width / 2 + 0.5, height - 0.3, -depth / 2 + 0.3]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Connexion coude haut */}
      <mesh
        position={[-width / 2 + 0.2, height - 0.3, -depth / 2 + 0.3]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* ==================== SUPPORTS DE FIXATION ==================== */}
      
      {/* Supports aux 4 coins pour fixer au container */}
      {[
        [-width / 2 + 0.3, 0, -depth / 2 + 0.3],
        [width / 2 - 0.3, 0, -depth / 2 + 0.3],
        [-width / 2 + 0.3, 0, depth / 2 - 0.3],
        [width / 2 - 0.3, 0, depth / 2 - 0.3],
      ].map((pos, i) => (
        <mesh key={`support-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ==================== PANNEAU D'ACCÈS ==================== */}
      
      {/* Petit panneau d'accès sur le côté gauche */}
      <group position={[-width / 2 + 0.1, height / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.6, 0.4]} />
          <meshStandardMaterial
            color="#e5e7eb"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
        {/* Poignée */}
        <mesh position={[0.04, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ==================== PLAQUE SIGNALÉTIQUE ==================== */}
      
      {/* Plaque "BITMAIN" sur l'avant */}
      <mesh position={[0, height - 0.15, depth / 2 - 0.15]} castShadow>
        <boxGeometry args={[1.5, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Texte "ANTSPACE HD5" (simulé avec petite boîte) */}
      <mesh position={[0, height - 0.15, depth / 2 - 0.14]}>
        <boxGeometry args={[1.4, 0.15, 0.005]} />
        <meshStandardMaterial
          color="#f9fafb"
          emissive="#f9fafb"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

