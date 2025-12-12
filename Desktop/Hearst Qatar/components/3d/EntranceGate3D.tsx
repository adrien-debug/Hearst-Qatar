import { useRef, useState } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface EntranceGate3DProps {
  position: [number, number, number];
  width?: number;
  height?: number;
  isOpen?: boolean;
}

/**
 * Portail d'entrée coulissant motorisé avec guérite de sécurité
 * Pour contrôler l'accès au site industriel
 */
export default function EntranceGate3D({
  position,
  width = 8,
  height = 4,
  isOpen = false,
}: EntranceGate3DProps) {
  const groupRef = useRef<Group>(null);
  const [open] = useState(isOpen);

  // Offset du portail si ouvert
  const gateOffset = open ? width : 0;

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== POTEAUX PRINCIPAUX DU PORTAIL ==================== */}
      
      {/* Poteau gauche */}
      <mesh position={[-width / 2 - 0.25, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, height + 0.5, 0.5]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Poteau droit */}
      <mesh position={[width / 2 + 0.25, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, height + 0.5, 0.5]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* ==================== PORTAIL COULISSANT ==================== */}
      
      <group position={[gateOffset, 0, 0]}>
        {/* Cadre métallique principal */}
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, 0.1]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>

        {/* Barres horizontales de renfort */}
        {[1, 2, 3].map((level) => (
          <mesh
            key={`horizontal-bar-${level}`}
            position={[0, (level * height) / 4, 0.1]}
            castShadow
          >
            <boxGeometry args={[width - 0.4, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#2A2A2A"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Barres verticales de renfort */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vertical-bar-${i}`}
            position={[-width / 2 + 0.5 + i * (width / 5), height / 2, 0.1]}
            castShadow
          >
            <boxGeometry args={[0.06, height - 0.3, 0.06]} />
            <meshStandardMaterial
              color="#2A2A2A"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Panneaux en tôle perforée (effet de sécurité) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh
            key={`panel-${i}`}
            position={[-width / 2 + 1 + i * 2, height / 2, -0.05]}
            castShadow
          >
            <boxGeometry args={[1.8, height - 0.8, 0.02]} />
            <meshStandardMaterial
              color="#5A5A5A"
              metalness={0.6}
              roughness={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* Rail inférieur */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[width, 0.15, 0.2]} />
          <meshStandardMaterial
            color="#3A3A3A"
            metalness={0.7}
            roughness={0.5}
          />
        </mesh>

        {/* Roues de guidage */}
        {[-width / 3, 0, width / 3].map((x, i) => (
          <mesh
            key={`wheel-${i}`}
            position={[x, 0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
            <meshStandardMaterial
              color="#1A1A1A"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ==================== RAIL AU SOL ==================== */}
      
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width * 2.5, 0.04, 0.15]} />
        <meshStandardMaterial
          color="#5A5A5A"
          metalness={0.7}
          roughness={0.5}
        />
      </mesh>

      {/* ==================== MOTEUR ET MÉCANISME ==================== */}
      
      {/* Boîtier moteur (côté gauche) */}
      <mesh position={[-width / 2 - 1, 0.6, -0.5]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial
          color="#6A6A6A"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {/* Panneau de contrôle */}
      <mesh position={[-width / 2 - 1, 1, -0.3]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* LED indicateur (vert) */}
      <mesh position={[-width / 2 - 1, 1.1, -0.27]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* ==================== BARRIÈRE LEVANTE ==================== */}
      
      {/* Poteau de barrière */}
      <mesh position={[0, 1, 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 2, 12]} />
        <meshStandardMaterial
          color="#FFAA00"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Bras de barrière (fermé) */}
      <group position={[0, 2, 2]} rotation={[0, 0, open ? -Math.PI / 2 : 0]}>
        <mesh position={[width / 2, 0, 0]} castShadow>
          <boxGeometry args={[width, 0.12, 0.12]} />
          <meshStandardMaterial
            color="#FFAA00"
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>

        {/* Bandes réfléchissantes rouges et blanches */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={`stripe-${i}`}
            position={[-width / 2 + i * (width / 6) + width / 12, 0, 0.07]}
          >
            <boxGeometry args={[width / 12 - 0.1, 0.11, 0.02]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#FF0000" : "#FFFFFF"}
              emissive={i % 2 === 0 ? "#FF0000" : "#FFFFFF"}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}

        {/* Contrepoids */}
        <mesh position={[-width / 2 - 0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#2A2A2A"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Feu clignotant orange sur barrière */}
      <mesh position={[0, 2.3, 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 12]} />
        <meshStandardMaterial
          color="#FF6600"
          emissive="#FF6600"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Lumière clignotante */}
      <pointLight
        position={[0, 2.3, 2]}
        intensity={1}
        distance={10}
        decay={2}
        color="#FF6600"
      />

      {/* ==================== PANNEAU "ACCÈS CONTRÔLÉ" ==================== */}
      
      <group position={[0, height + 0.8, 0]}>
        {/* Support du panneau */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[3.5, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>

        {/* Panneau principal */}
        <mesh castShadow>
          <boxGeometry args={[3, 0.8, 0.1]} />
          <meshStandardMaterial
            color="#EF4444"
            metalness={0.2}
            roughness={0.6}
            emissive="#EF4444"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Bordure blanche */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[2.9, 0.7, 0.02]} />
          <meshStandardMaterial
            color="#FFFFFF"
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>

        {/* Éclairage du panneau */}
        <spotLight
          position={[0, 1, 0.5]}
          angle={Math.PI / 4}
          penumbra={0.5}
          intensity={2}
          color="#FFFFFF"
          target-position={[0, 0, 0]}
        />
      </group>

      {/* ==================== CAMÉRAS DE SURVEILLANCE ==================== */}
      
      {/* Caméra côté gauche */}
      <group position={[-width / 2 - 0.5, height - 0.5, 0.5]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.3, 16]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Lentille */}
        <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial
            color="#1e3a8a"
            metalness={0.9}
            roughness={0.1}
            emissive="#1e3a8a"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Caméra côté droit */}
      <group position={[width / 2 + 0.5, height - 0.5, 0.5]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.3, 16]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial
            color="#1e3a8a"
            metalness={0.9}
            roughness={0.1}
            emissive="#1e3a8a"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* ==================== INTERPHONE ==================== */}
      
      <mesh position={[-width / 2 - 1.5, 1.4, 1.5]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.08]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Écran de l'interphone */}
      <mesh position={[-width / 2 - 1.5, 1.5, 1.54]}>
        <boxGeometry args={[0.12, 0.15, 0.01]} />
        <meshStandardMaterial
          color="#0A0A0A"
          emissive="#00FF00"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Boutons */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`button-${i}`}
          position={[-width / 2 - 1.5, 1.25 - i * 0.08, 1.54]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
          <meshStandardMaterial
            color="#666666"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ==================== FONDATION ==================== */}
      
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[width + 4, 0.2, 4]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

