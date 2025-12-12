import { useRef } from 'react';
import { Group } from 'three';
import { sceneData } from '../../data/splineSceneData';
import HD5ContainerUltraSimplified from './HD5ContainerUltraSimplified';
import Transformer3D from './Transformer3D';
import Switchgear3D from './Switchgear3D';
import PowerBlock3D from './PowerBlock3D';
import Substation120MW from './Substation120MW';

/**
 * Composant qui place automatiquement tous les objets procéduraux
 * aux positions exactes définies dans splineSceneData.ts
 * 
 * Utilise les composants procéduraux existants - AUCUN fichier GLB nécessaire !
 * Aucune configuration manuelle nécessaire - tout est automatique !
 */

interface AutoPlacedScene3DProps {
  onObjectClick?: (objectName: string) => void;
  selectedObject?: string | null;
}

/**
 * Scène 3D avec placement automatique de tous les objets procéduraux
 * Basé sur les données de splineSceneData.ts
 * 
 * Utilise les composants procéduraux existants - fonctionne immédiatement !
 */
export default function AutoPlacedScene3D({
  onObjectClick,
  selectedObject,
}: AutoPlacedScene3DProps) {
  const groupRef = useRef<Group>(null);

  // Debug: Vérifier que les données sont chargées
  if (typeof window !== 'undefined') {
    console.log('🔍 AutoPlacedScene3D - Données de la scène:', {
      substation: sceneData.substation,
      powerBlocksCount: sceneData.powerBlocks.length,
      totalTransformers: sceneData.powerBlocks.reduce((sum, pb) => sum + pb.transformers.length, 0),
      totalContainers: sceneData.powerBlocks.reduce((sum, pb) => 
        sum + pb.transformers.reduce((tSum, tr) => tSum + tr.containers.length, 0), 0),
      totalSwitchgears: sceneData.powerBlocks.reduce((sum, pb) => 
        sum + pb.transformers.reduce((tSum, tr) => tSum + tr.switchgears.length, 0), 0),
    });
  }

  // Log pour debug
  if (typeof window !== 'undefined') {
    console.log('🔍 AutoPlacedScene3D rendu - Power Blocks:', sceneData.powerBlocks.length);
  }

  return (
    <group ref={groupRef} name="AutoPlacedScene">
      {/* Cube de test GRAND et ROUGE - TOUJOURS VISIBLE */}
      <mesh position={[0, 20, 0]}>
        <boxGeometry args={[30, 30, 30]} />
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Axes helper GRAND pour voir l'orientation */}
      <axesHelper args={[100]} />

      {/* Substation 120 MW Ultra-Réaliste */}
      <Substation120MW
        position={[
          sceneData.substation.x,
          sceneData.substation.y,
          sceneData.substation.z,
        ]}
        onSelect={() => onObjectClick?.(sceneData.substation.name)}
        isSelected={selectedObject === sceneData.substation.name}
      />

      {/* Power Blocks et leurs composants */}
      {sceneData.powerBlocks.map((pb) => (
        <group key={pb.id} name={pb.id}>
          {/* Power Block 3D */}
          <PowerBlock3D
            position={[pb.position.x, pb.position.y, pb.position.z]}
            powerBlockId={pb.id}
            onSelect={() => onObjectClick?.(pb.id)}
            isSelected={selectedObject === pb.id}
          />

          {/* Transformateurs */}
          {pb.transformers.map((tr) => (
            <group key={tr.id} name={tr.id}>
              {/* Transformateur */}
              <Transformer3D
                position={[tr.position.x, tr.position.y, tr.position.z]}
                transformerId={tr.id}
                onSelect={() => onObjectClick?.(tr.id)}
                isSelected={selectedObject === tr.id}
              />

              {/* Containers HD5 */}
              {tr.containers.map((container) => (
                <HD5ContainerUltraSimplified
                  key={container.id}
                  position={[
                    container.position.x,
                    container.position.y,
                    container.position.z,
                  ]}
                  containerId={container.id}
                  onSelect={() => onObjectClick?.(container.id)}
                  isSelected={selectedObject === container.id}
                />
              ))}

              {/* Switchgears */}
              {tr.switchgears.map((switchgear) => (
                <Switchgear3D
                  key={switchgear.id}
                  position={[
                    switchgear.position.x,
                    switchgear.position.y,
                    switchgear.position.z,
                  ]}
                  switchgearId={switchgear.id}
                  onSelect={() => onObjectClick?.(switchgear.id)}
                  isSelected={selectedObject === switchgear.id}
                />
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
