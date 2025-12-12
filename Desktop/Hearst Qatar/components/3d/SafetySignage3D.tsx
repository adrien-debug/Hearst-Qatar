import { useRef } from 'react';
import { Group } from 'three';

interface SafetySignage3DProps {
  position: [number, number, number];
  type: 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation';
  direction?: 'left' | 'right' | 'straight';
  text?: string;
}

/**
 * Signalétique de sécurité et directionnelle pour le site industriel
 * Panneaux conformes aux normes de sécurité
 */
export default function SafetySignage3D({
  position,
  type,
  direction = 'straight',
  text = '',
}: SafetySignage3DProps) {
  const groupRef = useRef<Group>(null);

  // Fonction pour créer le poteau de support
  const createPole = () => (
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 3, 12]} />
      <meshStandardMaterial
        color="#4A4A4A"
        metalness={0.7}
        roughness={0.4}
      />
    </mesh>
  );

  // Base du poteau
  const createBase = () => (
    <mesh position={[0, 0.15, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.2, 0.3, 12]} />
      <meshStandardMaterial
        color="#2A2A2A"
        metalness={0.6}
        roughness={0.5}
      />
    </mesh>
  );

  return (
    <group ref={groupRef} position={position}>
      {createPole()}
      {createBase()}

      {/* ==================== PANNEAU D'ENTRÉE ==================== */}
      {type === 'entrance' && (
        <group position={[0, 3, 0]}>
          {/* Support */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[4, 0.05, 0.05]} />
            <meshStandardMaterial
              color="#4A4A4A"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Panneau principal - grand format */}
          <mesh castShadow>
            <boxGeometry args={[4, 1.2, 0.08]} />
            <meshStandardMaterial
              color="#1E40AF"
              metalness={0.2}
              roughness={0.6}
              emissive="#1E40AF"
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Bordure blanche */}
          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[3.9, 1.1, 0.01]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>

          {/* Bande supérieure rouge */}
          <mesh position={[0, 0.5, 0.05]}>
            <boxGeometry args={[3.85, 0.2, 0.005]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Zone de texte "ZONE INDUSTRIELLE - 200 MW" */}
          <mesh position={[0, 0.1, 0.05]}>
            <boxGeometry args={[3.6, 0.5, 0.005]} />
            <meshStandardMaterial
              color="#1A1A1A"
              roughness={0.8}
            />
          </mesh>

          {/* Symbole éclair (danger électrique) */}
          <mesh position={[-1.5, 0.1, 0.055]} rotation={[0, 0, Math.PI / 6]}>
            <coneGeometry args={[0.15, 0.5, 3]} />
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#FBBF24"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Bande inférieure - coordonnées */}
          <mesh position={[0, -0.4, 0.05]}>
            <boxGeometry args={[3.6, 0.15, 0.005]} />
            <meshStandardMaterial
              color="#6B7280"
              roughness={0.7}
            />
          </mesh>

          {/* Éclairage du panneau */}
          <spotLight
            position={[0, 1.5, 0.5]}
            angle={Math.PI / 3}
            penumbra={0.5}
            intensity={3}
            color="#FFFFFF"
            castShadow
          />
        </group>
      )}

      {/* ==================== PANNEAU LIMITATION VITESSE ==================== */}
      {type === 'speed' && (
        <group position={[0, 3, 0]}>
          {/* Panneau circulaire rouge */}
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
            <meshStandardMaterial
              color="#EF4444"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>

          {/* Cercle blanc intérieur */}
          <mesh position={[0, 0, 0.03]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>

          {/* Chiffre "30" */}
          <mesh position={[0, 0, 0.04]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.005]} />
            <meshStandardMaterial
              color="#1A1A1A"
              roughness={0.8}
            />
          </mesh>

          {/* LED clignotante (avertissement) */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#FBBF24"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      )}

      {/* ==================== PANNEAU DIRECTIONNEL ==================== */}
      {type === 'direction' && (
        <group position={[0, 3, 0]}>
          {/* Panneau rectangulaire bleu */}
          <mesh rotation={[0, direction === 'left' ? Math.PI / 6 : direction === 'right' ? -Math.PI / 6 : 0, 0]} castShadow>
            <boxGeometry args={[2, 0.6, 0.06]} />
            <meshStandardMaterial
              color="#2563EB"
              metalness={0.2}
              roughness={0.6}
              emissive="#2563EB"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Bordure blanche */}
          <mesh position={[0, 0, 0.035]} rotation={[0, direction === 'left' ? Math.PI / 6 : direction === 'right' ? -Math.PI / 6 : 0, 0]}>
            <boxGeometry args={[1.9, 0.5, 0.01]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>

          {/* Flèche directionnelle */}
          <group position={[direction === 'left' ? -0.5 : direction === 'right' ? 0.5 : 0, 0, 0.04]} rotation={[0, direction === 'left' ? Math.PI / 2 : direction === 'right' ? -Math.PI / 2 : 0, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.15, 0.3, 3]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>
            {/* Tige de la flèche */}
            <mesh position={[0, 0, -0.2]}>
              <boxGeometry args={[0.05, 0.01, 0.3]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>
          </group>

          {/* Texte (simplifié) */}
          <mesh position={[direction === 'left' ? 0.3 : direction === 'right' ? -0.3 : 0, 0, 0.04]} rotation={[0, direction === 'left' ? Math.PI / 6 : direction === 'right' ? -Math.PI / 6 : 0, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.005]} />
            <meshStandardMaterial
              color="#1A1A1A"
              roughness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* ==================== PANNEAU DE SÉCURITÉ ==================== */}
      {type === 'safety' && (
        <group position={[0, 3, 0]}>
          {/* Panneau triangulaire jaune (danger) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.5, 0.02, 3]} />
            <meshStandardMaterial
              color="#FBBF24"
              metalness={0.1}
              roughness={0.7}
              emissive="#FBBF24"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Bordure rouge */}
          <mesh position={[0, 0, 0.015]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.05, 8, 3]} />
            <meshStandardMaterial
              color="#EF4444"
              roughness={0.7}
            />
          </mesh>

          {/* Symbole danger (!) */}
          <group position={[0, 0, 0.03]}>
            {/* Barre verticale */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.08, 0.35, 0.01]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>
            {/* Point */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[0.08, 0.08, 0.01]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>
          </group>

          {/* Texte de sécurité */}
          <mesh position={[0, -0.7, 0]}>
            <boxGeometry args={[1.2, 0.25, 0.04]} />
            <meshStandardMaterial
              color="#EF4444"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>

          <mesh position={[0, -0.7, 0.025]}>
            <boxGeometry args={[1.1, 0.18, 0.005]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>
        </group>
      )}

      {/* ==================== PANNEAU ÉVACUATION ==================== */}
      {type === 'evacuation' && (
        <group position={[0, 3, 0]}>
          {/* Panneau rectangulaire vert */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.8, 0.06]} />
            <meshStandardMaterial
              color="#10B981"
              metalness={0.2}
              roughness={0.6}
              emissive="#10B981"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Bordure blanche */}
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[1.4, 0.7, 0.01]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>

          {/* Pictogramme sortie de secours (silhouette + flèche) */}
          <group position={[0, 0, 0.04]}>
            {/* Silhouette qui court */}
            <mesh position={[-0.3, 0.1, 0]}>
              <boxGeometry args={[0.2, 0.35, 0.005]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>

            {/* Flèche de sortie */}
            <mesh position={[0.3, 0.1, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.12, 0.25, 3]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>

            {/* Porte */}
            <mesh position={[0.5, 0.1, 0]}>
              <boxGeometry args={[0.15, 0.35, 0.005]} />
              <meshStandardMaterial
                color="#1A1A1A"
                roughness={0.8}
              />
            </mesh>
          </group>

          {/* Texte "SORTIE" */}
          <mesh position={[0, -0.25, 0.04]}>
            <boxGeometry args={[0.8, 0.12, 0.005]} />
            <meshStandardMaterial
              color="#1A1A1A"
              roughness={0.8}
            />
          </mesh>

          {/* Éclairage d'urgence (LED verte) */}
          <pointLight
            position={[0, 0, 0.2]}
            intensity={1.5}
            distance={8}
            decay={2}
            color="#10B981"
          />

          {/* LED indicatrice */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* ==================== RÉFLECTEURS (bandes réfléchissantes) ==================== */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.3, 12]} />
        <meshStandardMaterial
          color="#FBBF24"
          metalness={0.6}
          roughness={0.3}
          emissive="#FBBF24"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.3, 12]} />
        <meshStandardMaterial
          color="#FBBF24"
          metalness={0.6}
          roughness={0.3}
          emissive="#FBBF24"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

