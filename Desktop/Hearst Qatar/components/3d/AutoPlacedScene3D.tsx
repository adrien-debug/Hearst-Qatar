import { useRef } from 'react';
import { Group } from 'three';
import { sceneData } from '../../data/splineSceneData';
import HD5ContainerUltraSimplified from './HD5ContainerUltraSimplified';
import Transformer3D from './Transformer3D';
import Switchgear3D from './Switchgear3D';
import PowerBlock3D from './PowerBlock3D';
import Substation120MW from './Substation120MW';
import SecurityFence from './SecurityFence';
import GravelRoad from './GravelRoad';
import AccessControlPoint from './AccessControlPoint';
import IndustrialBuilding from './IndustrialBuilding';
import SimpleConcreteParking3D from './SimpleConcreteParking3D';

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
      {/* Clôture de sécurité autour de la zone substation + power blocks */}
      <SecurityFence
        center={[0, 0, 50]}
        width={280}
        depth={80}
        height={3.5}
      />

      {/* ==================== POINT D'ACCÈS SÉCURISÉ ==================== */}
      
      {/* Point de contrôle à l'entrée principale (côté avant, centre) */}
      <AccessControlPoint
        position={[0, 0, 10]}
        rotation={[0, 0, 0]}
      />

      {/* ==================== ROUTES EN GRAVIER ==================== */}
      
      {/* Route centrale Nord-Sud (entre les power blocks) */}
      <GravelRoad
        position={[0, 0, -30]}
        length={140}
        width={5}
        orientation="vertical"
      />

      {/* Routes transversales Est-Ouest (entre les rangées de conteneurs) */}
      {/* 4 routes pour 4 lignes de transformateurs (reculées de la substation) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <GravelRoad
          key={`road-ew-${i}`}
          position={[0, 0, -15 - i * 20]}
          length={180}
          width={4}
          orientation="horizontal"
        />
      ))}

      {/* Routes d'accès aux power blocks */}
      {[-75, -25, 25, 75].map((x, i) => (
        <GravelRoad
          key={`road-pb-access-${i}`}
          position={[x, 0, 35]}
          length={15}
          width={4}
          orientation="vertical"
        />
      ))}

      {/* Routes verticales entre les sections */}
      {/* Route entre Section 1 et Section 2 */}
      <GravelRoad
        position={[-50, 0, -45]}
        length={80}
        width={4}
        orientation="vertical"
      />

      {/* Route entre Section 3 et Section 4 */}
      <GravelRoad
        position={[50, 0, -45]}
        length={80}
        width={4}
        orientation="vertical"
      />

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

      {/* ==================== BÂTIMENTS INDUSTRIELS FACE À FACE ==================== */}
      
      {/* BÂTIMENT NOIR - PERSONNEL (Ne pas toucher) */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <IndustrialBuilding
          position={[-45, 0, -110]}
          type="personnel"
          onSelect={onObjectClick}
          isSelected={selectedObject === 'building-personnel'}
        />
      </group>

      {/* PARKING EN BÉTON - DEVANT BÂTIMENT PERSONNEL */}
      <SimpleConcreteParking3D
        position={[-100, 0, 30]}
        width={30}
        depth={15}
        spotsCount={30}
      />

      {/* BÂTIMENT ROUGE - MAINTENANCE (En miroir, face à face avec Personnel) */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <IndustrialBuilding
          position={[-45, 0, 110]}
          type="maintenance"
          onSelect={onObjectClick}
          isSelected={selectedObject === 'building-maintenance'}
        />
      </group>
    </group>
  );
}
