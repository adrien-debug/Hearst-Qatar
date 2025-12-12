import { useRef } from 'react';
import { Group } from 'three';

interface GuardHouse3DProps {
  position: [number, number, number];
  rotation?: number;
}

/**
 * Poste de garde sécurisé avec guérite
 * Contrôle d'accès au site industriel
 */
export default function GuardHouse3D({
  position,
  rotation = 0,
}: GuardHouse3DProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* ==================== FONDATION ==================== */}
      
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.2, 3.5]} />
        <meshStandardMaterial
          color="#808080"
          metalness={0.0}
          roughness={0.9}
        />
      </mesh>

      {/* ==================== STRUCTURE PRINCIPALE ==================== */}
      
      {/* Murs extérieurs */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.8, 3]} />
        <meshStandardMaterial
          color="#D4D4D4"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Bande horizontale décorative (bleue) */}
      <mesh position={[0, 2.5, 1.51]}>
        <boxGeometry args={[3.1, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#2563EB"
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* ==================== FENÊTRES PANORAMIQUES ==================== */}
      
      {/* Fenêtre avant (grande) */}
      <mesh position={[0, 1.7, 1.51]} castShadow>
        <boxGeometry args={[2.4, 1.6, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Cadre de fenêtre */}
      <mesh position={[0, 1.7, 1.52]}>
        <boxGeometry args={[2.5, 1.7, 0.03]} />
        <meshStandardMaterial
          color="#4A4A4A"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Vitre avec reflets */}
      <mesh position={[0, 1.7, 1.53]}>
        <boxGeometry args={[2.35, 1.55, 0.01]} />
        <meshStandardMaterial
          color="#B0E0E6"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Fenêtre latérale gauche */}
      <mesh position={[-1.51, 1.7, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.4, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Fenêtre latérale droite */}
      <mesh position={[1.51, 1.7, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.4, 0.05]} />
        <meshStandardMaterial
          color="#87CEEB"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* ==================== PORTE D'ENTRÉE ==================== */}
      
      {/* Porte (côté arrière) */}
      <mesh position={[0.8, 1.2, -1.51]} castShadow>
        <boxGeometry args={[0.9, 2.2, 0.08]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Poignée */}
      <mesh position={[0.4, 1.2, -1.55]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 12]} />
        <meshStandardMaterial
          color="#C0C0C0"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Fenêtre de porte */}
      <mesh position={[0.8, 1.8, -1.52]}>
        <boxGeometry args={[0.4, 0.6, 0.02]} />
        <meshStandardMaterial
          color="#87CEEB"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* ==================== TOITURE PLATE ==================== */}
      
      {/* Toit principal */}
      <mesh position={[0, 2.95, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial
          color="#5A5A5A"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Bordure de toit (acrotère) */}
      <mesh position={[0, 3.05, 1.6]}>
        <boxGeometry args={[3.2, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#4A4A4A"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 3.05, -1.6]}>
        <boxGeometry args={[3.2, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#4A4A4A"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[1.6, 3.05, 0]}>
        <boxGeometry args={[0.1, 0.2, 3.2]} />
        <meshStandardMaterial
          color="#4A4A4A"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[-1.6, 3.05, 0]}>
        <boxGeometry args={[0.1, 0.2, 3.2]} />
        <meshStandardMaterial
          color="#4A4A4A"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* ==================== ÉQUIPEMENTS DE COMMUNICATION ==================== */}
      
      {/* Antenne radio */}
      <group position={[0.8, 3.2, 0.8]}>
        {/* Mât */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Antenne */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.01, 0.3, 8]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* LED clignotante (rouge) */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Lumière clignotante */}
        <pointLight
          position={[0, 1.5, 0]}
          intensity={0.5}
          distance={10}
          decay={2}
          color="#EF4444"
        />
      </group>

      {/* Parabole satellite */}
      <group position={[-0.8, 3.3, -0.8]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.1, 0.1, 24]} />
          <meshStandardMaterial
            color="#E0E0E0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Support */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Climatisation (unité extérieure) */}
      <mesh position={[1.51, 2.2, 0.8]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.25]} />
        <meshStandardMaterial
          color="#D0D0D0"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Grille de ventilation */}
      <mesh position={[1.52, 2.2, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.55, 0.45, 0.02]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* ==================== AMÉNAGEMENT INTÉRIEUR (visible) ==================== */}
      
      {/* Bureau / comptoir */}
      <mesh position={[0, 1, 0.5]} castShadow>
        <boxGeometry args={[2, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#6B4423"
          metalness={0.0}
          roughness={0.7}
        />
      </mesh>

      {/* Chaise de garde */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Dossier */}
        <mesh position={[0, 0.4, -0.2]} rotation={[Math.PI / 12, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Pied */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.1, 0.6, 12]} />
          <meshStandardMaterial
            color="#4A4A4A"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Écran de surveillance sur le bureau */}
      <mesh position={[0, 1.5, 0.5]} rotation={[-Math.PI / 12, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial
          color="#1A1A1A"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Écran actif (vert - caméras) */}
      <mesh position={[0, 1.5, 0.52]} rotation={[-Math.PI / 12, 0, 0]}>
        <boxGeometry args={[0.45, 0.3, 0.01]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ==================== ÉCLAIRAGE EXTÉRIEUR ==================== */}
      
      {/* Projecteur au-dessus de la porte */}
      <mesh position={[0.8, 2.5, -1.6]} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.12]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0.8, 2.45, -1.65]} rotation={[Math.PI / 3, 0, 0]}>
        <boxGeometry args={[0.18, 0.13, 0.02]} />
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFF8DC"
          emissiveIntensity={0.4}
        />
      </mesh>

      <spotLight
        position={[0.8, 2.5, -1.6]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={3}
        color="#FFF8DC"
        castShadow
      />

      {/* Éclairage intérieur (visible par les fenêtres) */}
      <pointLight
        position={[0, 2.2, 0]}
        intensity={2}
        distance={5}
        decay={2}
        color="#FFFACD"
      />

      {/* ==================== SIGNALÉTIQUE ==================== */}
      
      {/* Plaque "CONTRÔLE D'ACCÈS" */}
      <mesh position={[0, 2.7, 1.52]} castShadow>
        <boxGeometry args={[1.2, 0.25, 0.03]} />
        <meshStandardMaterial
          color="#2563EB"
          metalness={0.3}
          roughness={0.6}
          emissive="#2563EB"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 2.7, 1.54]}>
        <boxGeometry args={[1.15, 0.2, 0.005]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.7}
        />
      </mesh>

      {/* Pictogramme sécurité */}
      <mesh position={[-1.2, 1.5, 1.52]}>
        <boxGeometry args={[0.25, 0.25, 0.02]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#FBBF24"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ==================== BARRIÈRE DE CONTRÔLE ==================== */}
      
      {/* Support de barrière intégré */}
      <mesh position={[2.5, 0.5, 1]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 12]} />
        <meshStandardMaterial
          color="#FFAA00"
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Boîtier de commande */}
      <mesh position={[2.2, 1.2, 2]} castShadow>
        <boxGeometry args={[0.25, 0.4, 0.15]} />
        <meshStandardMaterial
          color="#3A3A3A"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Bouton d'urgence (rouge) */}
      <mesh position={[2.2, 1.3, 2.08]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#EF4444"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* LED de statut (verte) */}
      <mesh position={[2.2, 1.15, 2.08]}>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* ==================== ACCESSOIRES ==================== */}
      
      {/* Extincteur à côté de la porte */}
      <group position={[1.3, 0.6, -1.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial
            color="#EF4444"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* Tête de l'extincteur */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 0.1, 12]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Support mural */}
        <mesh position={[0, 0.3, -0.1]} castShadow>
          <boxGeometry args={[0.12, 0.7, 0.05]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Panneau d'affichage des consignes */}
      <mesh position={[-1.3, 1.8, -1.48]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.03]} />
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Cadre du panneau */}
      <mesh position={[-1.3, 1.8, -1.5]} castShadow>
        <boxGeometry args={[0.52, 0.72, 0.02]} />
        <meshStandardMaterial
          color="#1A1A1A"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

