import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface SecurityFenceProps {
  center: [number, number, number];
  width: number;
  depth: number;
  height?: number;
}

/**
 * Clôture de sécurité avec caméras de surveillance
 * Pour protéger la zone substation et power blocks
 */
export default function SecurityFence({
  center,
  width,
  depth,
  height = 3,
}: SecurityFenceProps) {
  const groupRef = useRef<Group>(null);

  // Calculer les coins de la clôture
  const halfWidth = width / 2;
  const halfDepth = depth / 2;

  // Nombre de poteaux sur chaque côté
  const postsPerSideWidth = Math.floor(width / 4);
  const postsPerSideDepth = Math.floor(depth / 4);

  return (
    <group ref={groupRef} position={center}>
      {/* ==================== POTEAUX DE CLÔTURE ==================== */}
      
      {/* Côté avant (Z négatif) */}
      {Array.from({ length: postsPerSideWidth }).map((_, i) => {
        const x = -halfWidth + (i * (width / (postsPerSideWidth - 1)));
        return (
          <group key={`post-front-${i}`} position={[x, 0, -halfDepth]}>
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, height, 12]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* Côté arrière (Z positif) */}
      {Array.from({ length: postsPerSideWidth }).map((_, i) => {
        const x = -halfWidth + (i * (width / (postsPerSideWidth - 1)));
        return (
          <group key={`post-back-${i}`} position={[x, 0, halfDepth]}>
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, height, 12]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* Côté gauche (X négatif) */}
      {Array.from({ length: postsPerSideDepth }).map((_, i) => {
        const z = -halfDepth + (i * (depth / (postsPerSideDepth - 1)));
        return (
          <group key={`post-left-${i}`} position={[-halfWidth, 0, z]}>
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, height, 12]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* Côté droit (X positif) */}
      {Array.from({ length: postsPerSideDepth }).map((_, i) => {
        const z = -halfDepth + (i * (depth / (postsPerSideDepth - 1)));
        return (
          <group key={`post-right-${i}`} position={[halfWidth, 0, z]}>
            <mesh position={[0, height / 2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, height, 12]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== BARRES HORIZONTALES ==================== */}
      
      {/* Barres horizontales - Côté avant */}
      {[1, 2].map((level) => (
        <mesh
          key={`bar-front-${level}`}
          position={[0, level * (height / 3), -halfDepth]}
          castShadow={false}
        >
          <boxGeometry args={[width, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Barres horizontales - Côté arrière */}
      {[1, 2].map((level) => (
        <mesh
          key={`bar-back-${level}`}
          position={[0, level * (height / 3), halfDepth]}
          castShadow={false}
        >
          <boxGeometry args={[width, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Barres horizontales - Côté gauche */}
      {[1, 2].map((level) => (
        <mesh
          key={`bar-left-${level}`}
          position={[-halfWidth, level * (height / 3), 0]}
          castShadow={false}
        >
          <boxGeometry args={[0.05, 0.05, depth]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Barres horizontales - Côté droit */}
      {[1, 2].map((level) => (
        <mesh
          key={`bar-right-${level}`}
          position={[halfWidth, level * (height / 3), 0]}
          castShadow={false}
        >
          <boxGeometry args={[0.05, 0.05, depth]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* ==================== GRILLAGE (MAILLAGE) ==================== */}
      
      {/* Grillage - Côté avant */}
      <mesh
        position={[0, height / 2, -halfDepth]}
        castShadow={false}
        receiveShadow={false}
      >
        <planeGeometry args={[width - 0.2, height - 0.2]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grillage - Côté arrière */}
      <mesh
        position={[0, height / 2, halfDepth]}
        rotation={[0, Math.PI, 0]}
        castShadow={false}
        receiveShadow={false}
      >
        <planeGeometry args={[width - 0.2, height - 0.2]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grillage - Côté gauche */}
      <mesh
        position={[-halfWidth, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow={false}
        receiveShadow={false}
      >
        <planeGeometry args={[depth - 0.2, height - 0.2]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grillage - Côté droit */}
      <mesh
        position={[halfWidth, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow={false}
        receiveShadow={false}
      >
        <planeGeometry args={[depth - 0.2, height - 0.2]} />
        <meshStandardMaterial
          color="#6b7280"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ==================== PORTAILS D'ENTRÉE ==================== */}
      
      {/* Portail principal (côté avant) */}
      <group position={[0, 0, -halfDepth]}>
        {/* Poteaux du portail */}
        {[-3, 3].map((x, i) => (
          <mesh key={`gate-post-${i}`} position={[x, height / 2, 0]} castShadow>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
        
        {/* Panneau du portail */}
        <mesh position={[0, height / 2, 0.15]} castShadow>
          <boxGeometry args={[6, height - 0.4, 0.1]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Panneau de signalisation */}
        <mesh position={[0, height + 0.5, 0]} castShadow>
          <boxGeometry args={[2, 0.6, 0.1]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* ==================== CAMÉRAS DE SURVEILLANCE ==================== */}
      
      {/* Caméras aux 4 coins */}
      {[
        { pos: [-halfWidth + 2, 0, -halfDepth + 2], rot: [-0.3, Math.PI / 4, 0] },
        { pos: [halfWidth - 2, 0, -halfDepth + 2], rot: [-0.3, -Math.PI / 4, 0] },
        { pos: [-halfWidth + 2, 0, halfDepth - 2], rot: [-0.3, (3 * Math.PI) / 4, 0] },
        { pos: [halfWidth - 2, 0, halfDepth - 2], rot: [-0.3, -(3 * Math.PI) / 4, 0] },
      ].map((camera, i) => (
        <group
          key={`camera-${i}`}
          position={camera.pos as [number, number, number]}
          rotation={camera.rot as [number, number, number]}
        >
          {/* Mât de la caméra */}
          <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 7, 12]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Base du mât */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.6, 12]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>

          {/* Support de caméra */}
          <mesh position={[0, 7.2, -0.3]} castShadow>
            <boxGeometry args={[0.2, 0.3, 0.4]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Corps de la caméra */}
          <mesh position={[0, 7.2, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.5, 16]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Lentille de la caméra */}
          <mesh position={[0, 7.2, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial
              color="#1e3a8a"
              metalness={0.9}
              roughness={0.1}
              emissive="#1e3a8a"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* LED indicateur (rouge) */}
          <mesh position={[0, 7.4, -0.5]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Boîtier électrique au pied du mât */}
          <mesh position={[0.3, 0.8, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== PANNEAUX D'AVERTISSEMENT ==================== */}
      
      {/* Panneaux "ZONE SÉCURISÉE" sur les côtés */}
      {[
        { pos: [0, 1.5, -halfDepth - 0.2], rot: [0, 0, 0] },
        { pos: [0, 1.5, halfDepth + 0.2], rot: [0, Math.PI, 0] },
        { pos: [-halfWidth - 0.2, 1.5, 0], rot: [0, Math.PI / 2, 0] },
        { pos: [halfWidth + 0.2, 1.5, 0], rot: [0, -Math.PI / 2, 0] },
      ].map((sign, i) => (
        <group
          key={`warning-sign-${i}`}
          position={sign.pos as [number, number, number]}
          rotation={sign.rot as [number, number, number]}
        >
          {/* Panneau */}
          <mesh castShadow>
            <boxGeometry args={[2, 1.2, 0.05]} />
            <meshStandardMaterial
              color="#fef3c7"
              metalness={0.2}
              roughness={0.7}
              emissive="#fbbf24"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Bordure rouge */}
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[2.05, 1.25, 0.02]} />
            <meshStandardMaterial
              color="#ef4444"
              metalness={0.3}
              roughness={0.6}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Symbole danger (triangle) */}
          <mesh position={[0, 0.3, 0.06]}>
            <coneGeometry args={[0.35, 0.6, 3]} />
            <meshStandardMaterial
              color="#ef4444"
              metalness={0.0}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== ÉCLAIRAGE DE SÉCURITÉ ==================== */}
      
      {/* Projecteurs aux coins pour éclairage nocturne */}
      {[
        [-halfWidth + 3, -halfDepth + 3],
        [halfWidth - 3, -halfDepth + 3],
        [-halfWidth + 3, halfDepth - 3],
        [halfWidth - 3, halfDepth - 3],
      ].map((pos, i) => (
        <group key={`light-${i}`} position={[pos[0], 0, pos[1]]}>
          {/* Poteau d'éclairage */}
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 8, 12]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>

          {/* Projecteur */}
          <mesh position={[0, 8.3, 0]} rotation={[Math.PI / 3, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.3, 0.4]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Zone lumineuse */}
          <mesh position={[0, 8.1, 0.3]} rotation={[Math.PI / 3, 0, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.05]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}


