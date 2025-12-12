import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface ConcreteWall3DProps {
  center?: [number, number, number];
  width: number;
  depth: number;
  height?: number;
  thickness?: number;
  gatePosition?: 'front' | 'back' | 'left' | 'right';
  gateWidth?: number;
}

/**
 * Mur d'enceinte en béton armé pour sécuriser le site industriel
 * Texture béton gris clair avec aspect industriel professionnel
 */
export default function ConcreteWall3D({
  center = [0, 0, 0],
  width,
  depth,
  height = 4,
  thickness = 0.3,
  gatePosition = 'front',
  gateWidth = 8,
}: ConcreteWall3DProps) {
  const groupRef = useRef<Group>(null);

  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const halfHeight = height / 2;

  // Matériau béton
  const concreteMaterial = (
    <meshStandardMaterial
      color="#C5C5C5"
      metalness={0.05}
      roughness={0.85}
    />
  );

  // Créer un effet de panneaux de béton (joints tous les 3m)
  const createWallPanels = (
    wallLength: number,
    position: [number, number, number],
    rotation: [number, number, number],
    isHorizontal: boolean
  ) => {
    const panelWidth = 3; // Panneaux de 3m
    const numPanels = Math.floor(wallLength / panelWidth);
    const panels = [];

    for (let i = 0; i < numPanels; i++) {
      const offset = -wallLength / 2 + i * panelWidth + panelWidth / 2;
      const panelPosition: [number, number, number] = isHorizontal
        ? [position[0] + offset, position[1], position[2]]
        : [position[0], position[1], position[2] + offset];

      panels.push(
        <group key={`panel-${i}`} position={panelPosition} rotation={rotation}>
          {/* Panneau principal */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[panelWidth, height, thickness]} />
            {concreteMaterial}
          </mesh>

          {/* Joint vertical (ligne sombre entre panneaux) */}
          {i < numPanels - 1 && (
            <mesh position={[panelWidth / 2, 0, thickness / 2 + 0.01]}>
              <boxGeometry args={[0.02, height, 0.05]} />
              <meshStandardMaterial color="#808080" roughness={0.9} />
            </mesh>
          )}

          {/* Texture béton - lignes horizontales (coffrages) */}
          {[height / 4, 0, -height / 4].map((yOffset, idx) => (
            <mesh
              key={`texture-h-${idx}`}
              position={[0, yOffset, thickness / 2 + 0.005]}
            >
              <boxGeometry args={[panelWidth - 0.1, 0.015, 0.01]} />
              <meshStandardMaterial color="#A0A0A0" roughness={0.95} />
            </mesh>
          ))}
        </group>
      );
    }

    return panels;
  };

  // Créer des poteaux de renfort aux coins
  const createCornerPillar = (position: [number, number, number]) => (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[thickness * 1.5, height, thickness * 1.5]} />
      <meshStandardMaterial color="#B0B0B0" metalness={0.05} roughness={0.8} />
    </mesh>
  );

  // Lampadaires LED pour éclairage périmétrique
  const createStreetLight = (position: [number, number, number], rotation: number = 0) => (
    <group key={`light-${position.join('-')}`} position={position} rotation={[0, rotation, 0]}>
      {/* Poteau métallique */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 5, 12]} />
        <meshStandardMaterial color="#4A4A4A" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Base du poteau */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 12]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Bras d'extension */}
      <mesh position={[0.4, 4.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#4A4A4A" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Projecteur LED */}
      <mesh position={[0.8, 5, 0]} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.25]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Zone lumineuse LED */}
      <mesh position={[0.8, 4.85, 0.15]} rotation={[Math.PI / 3, 0, 0]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFF8DC"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Lumière ponctuelle */}
      <pointLight
        position={[0.8, 5, 0]}
        intensity={2}
        distance={25}
        decay={2}
        color="#FFF8DC"
      />
    </group>
  );

  return (
    <group ref={groupRef} position={center}>
      {/* ==================== MUR AVANT (côté Z négatif) ==================== */}
      {gatePosition === 'front' ? (
        <>
          {/* Section gauche du mur (avant portail) */}
          {createWallPanels(
            halfWidth - gateWidth / 2,
            [-halfWidth / 2 - gateWidth / 4, halfHeight, -halfDepth],
            [0, 0, 0],
            true
          )}
          {/* Section droite du mur (avant portail) */}
          {createWallPanels(
            halfWidth - gateWidth / 2,
            [halfWidth / 2 + gateWidth / 4, halfHeight, -halfDepth],
            [0, 0, 0],
            true
          )}
          {/* Poteaux de portail renforcés */}
          {[-gateWidth / 2, gateWidth / 2].map((x, i) => (
            <mesh key={`gate-pillar-${i}`} position={[x, halfHeight, -halfDepth]} castShadow>
              <boxGeometry args={[0.5, height + 0.5, thickness * 2]} />
              <meshStandardMaterial color="#B0B0B0" metalness={0.1} roughness={0.8} />
            </mesh>
          ))}
        </>
      ) : (
        createWallPanels(width, [0, halfHeight, -halfDepth], [0, 0, 0], true)
      )}

      {/* ==================== MUR ARRIÈRE (côté Z positif) ==================== */}
      {gatePosition === 'back' ? (
        <>
          {createWallPanels(
            halfWidth - gateWidth / 2,
            [-halfWidth / 2 - gateWidth / 4, halfHeight, halfDepth],
            [0, Math.PI, 0],
            true
          )}
          {createWallPanels(
            halfWidth - gateWidth / 2,
            [halfWidth / 2 + gateWidth / 4, halfHeight, halfDepth],
            [0, Math.PI, 0],
            true
          )}
          {[-gateWidth / 2, gateWidth / 2].map((x, i) => (
            <mesh key={`gate-pillar-back-${i}`} position={[x, halfHeight, halfDepth]} castShadow>
              <boxGeometry args={[0.5, height + 0.5, thickness * 2]} />
              <meshStandardMaterial color="#B0B0B0" metalness={0.1} roughness={0.8} />
            </mesh>
          ))}
        </>
      ) : (
        createWallPanels(width, [0, halfHeight, halfDepth], [0, Math.PI, 0], true)
      )}

      {/* ==================== MUR GAUCHE (côté X négatif) ==================== */}
      {gatePosition === 'left' ? (
        <>
          {createWallPanels(
            halfDepth - gateWidth / 2,
            [-halfWidth, halfHeight, -halfDepth / 2 - gateWidth / 4],
            [0, Math.PI / 2, 0],
            false
          )}
          {createWallPanels(
            halfDepth - gateWidth / 2,
            [-halfWidth, halfHeight, halfDepth / 2 + gateWidth / 4],
            [0, Math.PI / 2, 0],
            false
          )}
        </>
      ) : (
        createWallPanels(depth, [-halfWidth, halfHeight, 0], [0, Math.PI / 2, 0], false)
      )}

      {/* ==================== MUR DROIT (côté X positif) ==================== */}
      {gatePosition === 'right' ? (
        <>
          {createWallPanels(
            halfDepth - gateWidth / 2,
            [halfWidth, halfHeight, -halfDepth / 2 - gateWidth / 4],
            [0, -Math.PI / 2, 0],
            false
          )}
          {createWallPanels(
            halfDepth - gateWidth / 2,
            [halfWidth, halfHeight, halfDepth / 2 + gateWidth / 4],
            [0, -Math.PI / 2, 0],
            false
          )}
        </>
      ) : (
        createWallPanels(depth, [halfWidth, halfHeight, 0], [0, -Math.PI / 2, 0], false)
      )}

      {/* ==================== POTEAUX D'ANGLE RENFORCÉS ==================== */}
      {createCornerPillar([-halfWidth, halfHeight, -halfDepth])}
      {createCornerPillar([halfWidth, halfHeight, -halfDepth])}
      {createCornerPillar([-halfWidth, halfHeight, halfDepth])}
      {createCornerPillar([halfWidth, halfHeight, halfDepth])}

      {/* ==================== ÉCLAIRAGE PÉRIMÉTRIQUE ==================== */}
      {/* Mur avant - 5 lampadaires */}
      {Array.from({ length: 5 }).map((_, i) => {
        const spacing = width / 6;
        const x = -halfWidth + spacing * (i + 1);
        return createStreetLight([x, 0, -halfDepth - 1.5], 0);
      })}

      {/* Mur arrière - 5 lampadaires */}
      {Array.from({ length: 5 }).map((_, i) => {
        const spacing = width / 6;
        const x = -halfWidth + spacing * (i + 1);
        return createStreetLight([x, 0, halfDepth + 1.5], Math.PI);
      })}

      {/* Mur gauche - 4 lampadaires */}
      {Array.from({ length: 4 }).map((_, i) => {
        const spacing = depth / 5;
        const z = -halfDepth + spacing * (i + 1);
        return createStreetLight([-halfWidth - 1.5, 0, z], Math.PI / 2);
      })}

      {/* Mur droit - 4 lampadaires */}
      {Array.from({ length: 4 }).map((_, i) => {
        const spacing = depth / 5;
        const z = -halfDepth + spacing * (i + 1);
        return createStreetLight([halfWidth + 1.5, 0, z], -Math.PI / 2);
      })}

      {/* ==================== FONDATION (base du mur) ==================== */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[width + 2, 0.3, depth + 2]} />
        <meshStandardMaterial color="#909090" metalness={0.0} roughness={0.95} />
      </mesh>

      {/* ==================== COURONNEMENT (sommet du mur) ==================== */}
      {/* Avant */}
      <mesh position={[0, height, -halfDepth]} castShadow>
        <boxGeometry args={[width, 0.2, thickness + 0.1]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Arrière */}
      <mesh position={[0, height, halfDepth]} castShadow>
        <boxGeometry args={[width, 0.2, thickness + 0.1]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Gauche */}
      <mesh position={[-halfWidth, height, 0]} castShadow>
        <boxGeometry args={[thickness + 0.1, 0.2, depth]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Droit */}
      <mesh position={[halfWidth, height, 0]} castShadow>
        <boxGeometry args={[thickness + 0.1, 0.2, depth]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}

