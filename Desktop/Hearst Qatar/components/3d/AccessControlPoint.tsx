import { useRef, useState, useEffect } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface AccessControlPointProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Point de contrôle d'accès sécurisé
 * - Guérite de contrôle
 * - Barrière levante
 * - Panneaux de signalisation
 * - Éclairage de sécurité
 * - Caméras de surveillance
 * - Zone de stationnement
 */
export default function AccessControlPoint({
  position,
  rotation = [0, 0, 0],
}: AccessControlPointProps) {
  const groupRef = useRef<Group>(null);
  const [barrierOpen, setBarrierOpen] = useState(false);

  // Animation de la barrière (ouvre/ferme automatiquement)
  useEffect(() => {
    const interval = setInterval(() => {
      setBarrierOpen(prev => !prev);
    }, 8000); // Change toutes les 8 secondes
    return () => clearInterval(interval);
  }, []);

  const barrierAngle = barrierOpen ? -Math.PI / 2 : 0;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ==================== GUÉRITE DE CONTRÔLE ==================== */}
      
      {/* Structure principale (3m × 3m × 2.8m) */}
      <group position={[-4, 0, 0]}>
        {/* Corps de la guérite */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 2.8, 3]} />
          <meshStandardMaterial
            color="#e5e7eb"
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>

        {/* Toit */}
        <mesh position={[0, 2.9, 0]} castShadow>
          <boxGeometry args={[3.2, 0.2, 3.2]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Fenêtre avant */}
        <mesh position={[1.51, 1.8, 0]} castShadow>
          <boxGeometry args={[0.02, 1.2, 2]} />
          <meshStandardMaterial
            color="#1e3a8a"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Porte latérale */}
        <mesh position={[0, 1.2, -1.51]} castShadow>
          <boxGeometry args={[1, 2.4, 0.1]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>

        {/* Panneau de contrôle extérieur */}
        <mesh position={[1.6, 1.2, -0.8]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.4]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* LED indicateur (vert = ouvert) */}
        <mesh position={[1.65, 1.5, -0.8]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={barrierOpen ? "#10b981" : "#ef4444"}
            emissive={barrierOpen ? "#10b981" : "#ef4444"}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Climatisation sur le toit */}
        <mesh position={[0, 3.2, 0.5]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* ==================== BARRIÈRE LEVANTE ==================== */}
      
      <group position={[2, 0, 0]}>
        {/* Poteau de support gauche */}
        <mesh position={[0, 1.5, -3]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Barre de la barrière (5m de long) */}
        <group position={[0, 2.8, -3]} rotation={[0, 0, barrierAngle]}>
          <mesh position={[0, 0, 2.5]} castShadow>
            <boxGeometry args={[0.15, 0.15, 5]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>

          {/* Bandes rouges réfléchissantes */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={`stripe-${i}`} position={[0, 0, i]} castShadow>
              <boxGeometry args={[0.16, 0.16, 0.3]} />
              <meshStandardMaterial
                color="#ef4444"
                metalness={0.8}
                roughness={0.2}
                emissive="#ef4444"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* Contrepoids */}
        <mesh position={[0, 2.5, -3.3]} castShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial
            color="#4b5563"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* ==================== PANNEAUX DE SIGNALISATION ==================== */}
      
      {/* Panneau "ARRÊT / STOP" */}
      <group position={[2, 0, -5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 12]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.05]} />
          <meshStandardMaterial
            color="#ef4444"
            metalness={0.2}
            roughness={0.6}
            emissive="#ef4444"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Panneau directionnel */}
      <group position={[-8, 0, -3]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 12]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* ==================== CAMÉRAS DE SURVEILLANCE ==================== */}
      
      {/* Caméra 1 - sur la guérite */}
      <group position={[-4, 3.2, 0]}>
        <mesh position={[0, 0.3, 1.6]} rotation={[Math.PI / 6, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.25, 0.3]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, 0.35, 1.75]} rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial
            color="#1e3a8a"
            metalness={0.9}
            roughness={0.1}
            emissive="#1e3a8a"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Caméra 2 - sur poteau */}
      <group position={[2, 0, 2]}>
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 6, 12]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, 6.2, -0.3]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.25, 0.3]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ==================== ÉCLAIRAGE DE SÉCURITÉ ==================== */}
      
      {/* Projecteur sur la guérite */}
      <group position={[-4, 3.2, 1.6]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.25]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, -0.15, 0.15]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.02]} />
          <meshStandardMaterial
            color="#fef3c7"
            emissive="#fef3c7"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* ==================== ZONE DE STATIONNEMENT ==================== */}
      
      {/* Marquage au sol */}
      <mesh position={[-10, 0.01, 0]} receiveShadow>
        <boxGeometry args={[8, 0.02, 5]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Lignes de stationnement */}
      {[-1.5, 1.5].map((z, i) => (
        <mesh key={`parking-line-${i}`} position={[-10, 0.02, z]} receiveShadow>
          <boxGeometry args={[7.5, 0.01, 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.0}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Panneau "PARKING VISITEURS" */}
      <group position={[-14, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 12]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 0.05]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* ==================== ÉLÉMENTS DE SÉCURITÉ ADDITIONNELS ==================== */}
      
      {/* Plots de sécurité */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={`bollard-${i}`} position={[x, 0.4, 4]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Bandes de ralentissement */}
      <mesh position={[0, 0.05, -6]} receiveShadow castShadow>
        <boxGeometry args={[8, 0.1, 0.4]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

