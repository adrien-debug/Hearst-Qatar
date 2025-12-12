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
 * Reproduction EXACTE de l'image de référence (Hacc04fba02a344bca1af38f08d8ec8b1s.jpg)
 * - 12 ventilateurs circulaires noirs sur le dessus
 * - Panneaux radiateurs en V s'ouvrant sur les CÔTÉS (gauche/droite)
 * - Structure ouverte avec châssis gris/blanc
 * - Équipements verts (pompes) en bas
 * - Tuyaux bleus et jaunes
 * - Même hauteur que le container (2.896m)
 */
export default function HD5CoolingModule({
  position,
  width,
  depth,
  height = 2.896, // Même hauteur que le container
}: HD5CoolingModuleProps) {
  const groupRef = useRef<Group>(null);

  // V INVERSÉ : sommet À RAS DU SOL (Y=0) du module de refroidissement, s'ouvre vers le HAUT
  // Les panneaux courent sur toute la LONGUEUR (X = width = 12.196m)
  // Le V s'ouvre dans la LARGEUR (Z = depth = 2.438m) et monte jusqu'en haut
  // Les deux plaques partent du même point et ne se croisent pas
  const vAngle = Math.atan((depth / 2 - 0.3) / height); // Angle calculé pour atteindre les bords en haut
  const panelLength = height / Math.cos(vAngle); // Longueur du panneau du sol au bord haut

  // Position du centre des panneaux (partent du sol, montent vers le haut)
  const centerY = height / 2; // Centre en hauteur
  const centerZ_offset = (depth / 2 - 0.3) / 2; // Distance Z depuis le centre

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== STRUCTURE CHÂSSIS OUVERT ==================== */}
      
      {/* Cadre supérieur (noir) */}
      <mesh position={[0, height - 0.1, 0]} castShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Cadre inférieur (noir) */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Poteaux verticaux aux 4 coins (noir) */}
      {[
        [-width / 2 + 0.1, height / 2, -depth / 2 + 0.1],
        [width / 2 - 0.1, height / 2, -depth / 2 + 0.1],
        [-width / 2 + 0.1, height / 2, depth / 2 - 0.1],
        [width / 2 - 0.1, height / 2, depth / 2 - 0.1],
      ].map((pos, i) => (
        <mesh key={`corner-post-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, height - 0.4, 0.15]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Barres horizontales latérales (structure) */}
      {[
        // Avant
        [0, height / 2, -depth / 2 + 0.05, [width - 0.4, 0.08, 0.08]],
        // Arrière
        [0, height / 2, depth / 2 - 0.05, [width - 0.4, 0.08, 0.08]],
        // Gauche
        [-width / 2 + 0.05, height / 2, 0, [0.08, 0.08, depth - 0.4]],
        // Droite
        [width / 2 - 0.05, height / 2, 0, [0.08, 0.08, depth - 0.4]],
      ].map((bar, i) => (
        <mesh
          key={`h-bar-${i}`}
          position={[bar[0], bar[1], bar[2]] as [number, number, number]}
          castShadow
        >
          <boxGeometry args={bar[3] as [number, number, number]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* ==================== PANNEAUX RADIATEURS EN V INVERSÉ (GRIS MÉTALLIQUE) ==================== */}
      {/* V INVERSÉ : Sommet à ras du SOL du module (Y=0), les 2 plaques s'ouvrent vers le HAUT */}
      {/* Les panneaux courent sur toute la LONGUEUR (X = 12.196m) */}
      {/* Point de départ commun au sol (0, 0, 0), puis divergent vers (0, height, ±depth/2) */}
      {/* Les deux plaques ne se croisent pas - elles partent du même point et montent en s'écartant */}

      {/* Panneau AVANT du V - part du sol (Y=0, Z=0), monte vers (Y=height, Z=depth/2) */}
      <mesh
        position={[0, centerY, centerZ_offset]}
        rotation={[vAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width - 0.6, 0.08, panelLength]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Grille/ailettes sur panneau AVANT (gris métallique) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const t = i / 15;
        const finY = t * height;
        const finZ = t * (depth / 2 - 0.3);
        
        return (
          <mesh
            key={`fin-front-${i}`}
            position={[0, finY, finZ]}
            rotation={[vAngle, 0, 0]}
            castShadow
          >
            <boxGeometry args={[width - 0.7, 0.02, 0.05]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* Panneau ARRIÈRE du V - part du sol (Y=0, Z=0), monte vers (Y=height, Z=-depth/2) */}
      <mesh
        position={[0, centerY, -centerZ_offset]}
        rotation={[-vAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width - 0.6, 0.08, panelLength]} />
        <meshStandardMaterial
          color="#9ca3af"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Grille/ailettes sur panneau ARRIÈRE (gris métallique) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const t = i / 15;
        const finY = t * height;
        const finZ = -t * (depth / 2 - 0.3);
        
        return (
          <mesh
            key={`fin-back-${i}`}
            position={[0, finY, finZ]}
            rotation={[-vAngle, 0, 0]}
            castShadow
          >
            <boxGeometry args={[width - 0.7, 0.02, 0.05]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* ==================== VENTILATEURS CIRCULAIRES SUR LE DESSUS ==================== */}
      {/* 12 ventilateurs (2 rangées de 6) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 6); // 0 ou 1
        const col = i % 6; // 0 à 5
        
        const fanX = -width / 2 + 1 + col * ((width - 2) / 5);
        const fanZ = -depth / 2 + 0.6 + row * (depth - 1.2);
        const fanRadius = 0.35;
        
        return (
          <group key={`fan-${i}`} position={[fanX, height, fanZ]}>
            {/* Corps du ventilateur (noir) */}
            <mesh castShadow>
              <cylinderGeometry args={[fanRadius, fanRadius, 0.15, 32]} />
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.4}
                roughness={0.6}
              />
            </mesh>
            
            {/* Grille du ventilateur */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[fanRadius - 0.05, fanRadius - 0.05, 0.02, 32]} />
              <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.6}
                roughness={0.4}
                wireframe={true}
              />
            </mesh>
            
            {/* Centre du ventilateur */}
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* ==================== ÉQUIPEMENTS EN BAS (POMPES VERTES) ==================== */}
      {/* 3 pompes vertes */}
      {[
        [-width / 3, 0.4, 0],
        [0, 0.4, 0],
        [width / 3, 0.4, 0],
      ].map((pos, i) => (
        <group key={`pump-${i}`} position={pos as [number, number, number]}>
          {/* Corps de la pompe (vert) */}
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#22c55e"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          
          {/* Moteur cylindrique */}
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
            <meshStandardMaterial
              color="#16a34a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ==================== TUYAUX (BLEUS ET JAUNES) ==================== */}
      {/* Tuyau principal bleu */}
      <mesh position={[0, 0.6, -depth / 3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, width - 1, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Tuyaux jaunes (connexions) */}
      {[-1, 0, 1].map((offset, i) => (
        <mesh
          key={`yellow-pipe-${i}`}
          position={[offset * width / 4, 0.8, depth / 4]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.04, 0.04, 0.6, 12]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ==================== SUPPORTS ET CONNEXIONS ==================== */}
      {/* Barres de support verticales (connectent le V au châssis) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = -width / 2 + 1 + i * ((width - 2) / 7);
        return (
          <mesh
            key={`v-support-${i}`}
            position={[x, height / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, height - 0.4, 12]} />
            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}
