import { useRef, useMemo, memo } from 'react';
import { Group } from 'three';
import Substation200MW from './Substation200MW';
import PowerBlock3D from './PowerBlock3D';
import Transformer3D from './Transformer3D';
import Switchgear3D from './Switchgear3D';
import HD5ContainerFinal3D from './HD5ContainerFinal3D';
import HD5ContainerMinimal from './HD5ContainerMinimal';
import HD5ContainerInstancedMinimal from './HD5ContainerInstancedMinimal';
import TransformerInstanced from './TransformerInstanced';
import SwitchgearInstanced from './SwitchgearInstanced';
import ConcreteWall3D from './ConcreteWall3D';
import { qualityManager } from '../../utils/qualityManager';

interface SubstationSystem3DProps {
  onObjectClick?: (objectName: string) => void;
  selectedObject?: string | null;
}

/**
 * Composant principal qui construit toute la scène industrielle depuis zéro
 * Hiérarchie stricte : SubstationSystem > Substation > PowerBlocks > Transformers > Switchgears > HD5
 */
function SubstationSystem3D({
  onObjectClick,
  selectedObject,
}: SubstationSystem3DProps) {
  // #region agent log - Hypothèse E: SubstationSystem3D rendu
  (() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubstationSystem3D.tsx:18','message':'Hypothèse E - SubstationSystem3D fonction appelée','data':{selectedObject:selectedObject,hasOnObjectClick:!!onObjectClick},timestamp:Date.now(),sessionId:'debug-session',runId:'blank-page-debug',hypothesisId:'E'})}).catch(()=>{});
    }
    return null;
  })();
  // #endregion
  
  const groupRef = useRef<Group>(null);

  // Positions exactes selon le cahier des charges - mémorisées pour éviter les recréations
  // Espacements augmentés pour aérer les quatre sections
  const SUBSTATION_POSITION: [number, number, number] = useMemo(() => [0, 0.5, 0], []); // Y=0.5m au-dessus du sol
  
  // Espacement entre la substation et les power blocks
  const SUBSTATION_POWER_BLOCK_SPACING = 15; // Espacement en profondeur (Z) entre substation et power blocks
  
  // Espacement horizontal réduit pour rapprocher les sections
  // Container HD5 : longueur = 12.196m, largeur = 2.438m
  // Espacement optimisé pour meilleure symétrie et compacité
  const POWER_BLOCK_SPACING = 50; // Espacement en largeur (X) entre les Power Blocks (réduit de 80m à 50m)
  const POWER_BLOCK_START_X = -75; // Position de départ (PB1) ajustée pour centrer avec nouvel espacement (4 Power Blocks × 50m = 200m total, centré à 0)
  const POWER_BLOCK_START_Z = -20 - SUBSTATION_POWER_BLOCK_SPACING; // Position Z avec espacement depuis la substation
  
  const POWER_BLOCK_POSITIONS: Array<[number, number, number]> = useMemo(() => [
    [POWER_BLOCK_START_X, 0.5, POWER_BLOCK_START_Z],  // PB1 - Y=0.5m (au-dessus du sol pour éviter z-fighting), Z avec espacement
    [POWER_BLOCK_START_X + POWER_BLOCK_SPACING, 0.5, POWER_BLOCK_START_Z],  // PB2
    [POWER_BLOCK_START_X + POWER_BLOCK_SPACING * 2, 0.5, POWER_BLOCK_START_Z],   // PB3
    [POWER_BLOCK_START_X + POWER_BLOCK_SPACING * 3, 0.5, POWER_BLOCK_START_Z],   // PB4
  ], []);

  // Fonction pour calculer les positions des transformateurs
  // Espacement vertical (Z) réduit pour rapprocher les containers en ligne
  // Container HD5 : longueur = 12.196m, espacement optimisé pour compacité
  const TRANSFORMER_VERTICAL_SPACING = 20; // Écartement en profondeur (Z) entre transformateurs (réduit de 30m à 20m)
  const TRANSFORMER_OFFSET_FROM_PB = 20; // Distance entre power block et premier transformateur
  const TRANSFORMER_START_Z = POWER_BLOCK_START_Z - TRANSFORMER_OFFSET_FROM_PB; // Position Z de départ relative au power block
  
  const getTransformerPosition = (pbIndex: number, trIndex: number): [number, number, number] => {
    const pbX = POWER_BLOCK_POSITIONS[pbIndex][0];
    const trZ = TRANSFORMER_START_Z - (trIndex * TRANSFORMER_VERTICAL_SPACING); // Écartement en profondeur réduit
    return [pbX, 0.3, trZ]; // Y=0.3m (au-dessus du sol pour éviter z-fighting)
  };

  // Fonction pour calculer les positions des switchgears
  // Offset latéral pour positionner symétriquement de chaque côté du transformateur
  const SWITCHGEAR_OFFSET = 4.5; // Distance latérale depuis le transformateur
  const getSwitchgearPosition = (pbIndex: number, trIndex: number, side: 'left' | 'right'): [number, number, number] => {
    const trPos = getTransformerPosition(pbIndex, trIndex);
    const offsetX = side === 'left' ? -SWITCHGEAR_OFFSET : SWITCHGEAR_OFFSET; // ±4.5m sur X (latéral) - symétrique
    return [trPos[0] + offsetX, trPos[1], trPos[2]];
  };

  // Fonction pour calculer les positions des containers HD5
  // Containers avec espacement augmenté par rapport aux transformateurs
  // Switchgears sont à ±4.5m du transformateur (SWITCHGEAR_OFFSET défini ci-dessus)
  // Containers positionnés à ±12m du transformateur pour plus d'espace et meilleure visibilité
  const CONTAINER_SWITCHGEAR_MARGIN = 7.5; // Marge augmentée entre container et switchgear
  const CONTAINER_OFFSET_FROM_TRANSFORMER = SWITCHGEAR_OFFSET + CONTAINER_SWITCHGEAR_MARGIN; // ~12m du transformateur (augmenté de 8m)
  const HD5_LENGTH = 12.196; // Longueur du container HD5
  const HD5_HALF_LENGTH = HD5_LENGTH / 2; // ~6.1m
  
  const getHD5Position = (pbIndex: number, trIndex: number, side: 'A' | 'B'): [number, number, number] => {
    const trPos = getTransformerPosition(pbIndex, trIndex);
    // Containers positionnés avec espacement augmenté par rapport aux transformateurs
    const offsetX = side === 'A' ? -CONTAINER_OFFSET_FROM_TRANSFORMER : CONTAINER_OFFSET_FROM_TRANSFORMER; // ±12m latéralement (sur X)
    return [trPos[0] + offsetX, trPos[1], trPos[2]]; // Y reste à 0.3m (au-dessus du sol)
  };

  // #region agent log - Hypothèse E: Avant retour du JSX
  (() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SubstationSystem3D.tsx:83','message':'Hypothèse E - Avant retour JSX, calcul positions','data':{powerBlockCount:4,transformerCount:6,containerCount:48},timestamp:Date.now(),sessionId:'debug-session',runId:'blank-page-debug',hypothesisId:'E'})}).catch(()=>{});
    }
    return null;
  })();
  // #endregion
  
  // OPTIMISATION MAXIMALE : TOUJOURS utiliser l'instancing minimal
  const useInstancing = true; // FORCER l'instancing pour +500% de performances
  const useSimplified = true; // Toujours utiliser la version ultra-simplifiée
  
  // Préparer les instances pour l'instancing
  const containerInstances = useMemo(() => {
    return POWER_BLOCK_POSITIONS.flatMap((pbPos, pbIndex) => {
      const pbNum = pbIndex + 1;
      return Array.from({ length: 6 }).flatMap((_, trIndex) => {
        const trNum = trIndex + 1;
        return [
          {
            id: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`,
            position: getHD5Position(pbIndex, trIndex, 'A'),
            isSelected: selectedObject === `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`,
          },
          {
            id: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`,
            position: getHD5Position(pbIndex, trIndex, 'B'),
            isSelected: selectedObject === `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`,
          },
        ];
      });
    });
  }, [selectedObject]);
  
  const transformerInstances = useMemo(() => {
    return POWER_BLOCK_POSITIONS.flatMap((pbPos, pbIndex) => {
      const pbNum = pbIndex + 1;
      return Array.from({ length: 6 }).map((_, trIndex) => {
        const trNum = trIndex + 1;
        const trPos = getTransformerPosition(pbIndex, trIndex);
        return {
          id: `PB${pbNum}_Transformer_${trNum.toString().padStart(2, '0')}`,
          position: trPos,
          isSelected: selectedObject === `PB${pbNum}_Transformer_${trNum.toString().padStart(2, '0')}`,
        };
      });
    });
  }, [selectedObject]);
  
  const switchgearInstances = useMemo(() => {
    return POWER_BLOCK_POSITIONS.flatMap((pbPos, pbIndex) => {
      const pbNum = pbIndex + 1;
      return Array.from({ length: 6 }).flatMap((_, trIndex) => {
        const trNum = trIndex + 1;
        return [
          {
            id: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`,
            position: getSwitchgearPosition(pbIndex, trIndex, 'left'),
            isSelected: selectedObject === `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`,
          },
          {
            id: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`,
            position: getSwitchgearPosition(pbIndex, trIndex, 'right'),
            isSelected: selectedObject === `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`,
          },
        ];
      });
    });
  }, [selectedObject]);
  
  // Calcul des limites pour le mur périphérique
  // Containers HD5 : ±12m des transformateurs
  // Transformateurs : le plus éloigné est à TRANSFORMER_START_Z - (5 * TRANSFORMER_VERTICAL_SPACING)
  const WALL_MARGIN = 20; // Marge de sécurité de 20m de chaque côté
  const X_MIN = POWER_BLOCK_START_X - CONTAINER_OFFSET_FROM_TRANSFORMER - WALL_MARGIN; // -87 - 20 = -107
  const X_MAX = POWER_BLOCK_START_X + (POWER_BLOCK_SPACING * 3) + CONTAINER_OFFSET_FROM_TRANSFORMER + WALL_MARGIN; // 75 + 12 + 20 = 107
  const Z_MIN = TRANSFORMER_START_Z - (5 * TRANSFORMER_VERTICAL_SPACING) - WALL_MARGIN; // -155 - 20 = -175
  const Z_MAX = SUBSTATION_POSITION[2] + WALL_MARGIN; // 0 + 20 = 20
  const WALL_WIDTH = X_MAX - X_MIN; // 214m
  const WALL_DEPTH = Z_MAX - Z_MIN; // 195m
  const WALL_CENTER: [number, number, number] = [(X_MIN + X_MAX) / 2, 0, (Z_MIN + Z_MAX) / 2]; // [0, 0, -77.5]
  
  return (
    <group ref={groupRef} name="SubstationSystem">
      {/* ========== MUR PÉRIPHÉRIQUE - Entoure tous les éléments ========== */}
      <ConcreteWall3D
        center={WALL_CENTER}
        width={WALL_WIDTH}
        depth={WALL_DEPTH}
        height={4}
        thickness={0.3}
        gatePosition="front"
        gateWidth={8}
      />
      
      {/* ========== ORDRE DE RENDU : CONTAINERS D'ABORD (dernière ligne, les plus bas) ========== */}
      
      {/* ========== TOUS LES CONTAINERS HD5 - VERSION INSTANCIÉE MINIMALE (OPTIMISATION MAXIMALE) ========== */}
      {useInstancing ? (
        <HD5ContainerInstancedMinimal
          instances={containerInstances}
          onSelect={onObjectClick}
          selectedObject={selectedObject}
        />
      ) : (
        // Fallback : Version non-instanciée mais minimale
        POWER_BLOCK_POSITIONS.flatMap((pbPos, pbIndex) => {
          const pbNum = pbIndex + 1;
          return Array.from({ length: 6 }).map((_, trIndex) => {
            const trNum = trIndex + 1;
            return (
              <group key={`Containers_PB${pbNum}_TR${trNum}`}>
                <HD5ContainerMinimal
                  position={getHD5Position(pbIndex, trIndex, 'A')}
                  containerId={`PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`}
                  onSelect={onObjectClick}
                  isSelected={selectedObject === `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`}
                />
                <HD5ContainerMinimal
                  position={getHD5Position(pbIndex, trIndex, 'B')}
                  containerId={`PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`}
                  onSelect={onObjectClick}
                  isSelected={selectedObject === `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`}
                />
              </group>
            );
          });
        })
      )}

      {/* ========== POWER BLOCKS (rendus après les containers) ========== */}
      {POWER_BLOCK_POSITIONS.map((pbPos, pbIndex) => {
        const pbNum = pbIndex + 1;
        return (
          <group key={`PowerBlock_${pbNum}`} name={`PowerBlock_${pbNum}`}>
            <PowerBlock3D
              position={pbPos}
              powerBlockId={`PowerBlock_${pbNum}`}
              onSelect={onObjectClick}
              isSelected={selectedObject === `PowerBlock_${pbNum}`}
            />

            {/* ========== TRANSFORMATEURS (6 par Power Block) - VERSION INSTANCIÉE ========== */}
            {useInstancing ? null : (
              // Version non-instanciée (fallback)
              Array.from({ length: 6 }).map((_, trIndex) => {
                const trNum = trIndex + 1;
                const trPos = getTransformerPosition(pbIndex, trIndex);
                const transformerId = `PB${pbNum}_Transformer_${trNum.toString().padStart(2, '0')}`;

                return (
                  <group key={transformerId} name={transformerId}>
                    <Transformer3D
                      position={trPos}
                      transformerId={transformerId}
                      onSelect={onObjectClick}
                      isSelected={selectedObject === transformerId}
                    />

                    {/* ========== SWITCHGEARS (2 par transformateur - symétriques) ========== */}
                    <Switchgear3D
                      position={getSwitchgearPosition(pbIndex, trIndex, 'left')}
                      switchgearId={`PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`}
                      onSelect={onObjectClick}
                      isSelected={selectedObject === `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`}
                    />
                    <Switchgear3D
                      position={getSwitchgearPosition(pbIndex, trIndex, 'right')}
                      switchgearId={`PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`}
                      onSelect={onObjectClick}
                      isSelected={selectedObject === `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`}
                    />
                  </group>
                );
              })
            )}
          </group>
        );
      })}

      {/* ========== TRANSFORMATEURS INSTANCIÉS (si instancing activé) ========== */}
      {useInstancing && (
        <TransformerInstanced
          instances={transformerInstances}
          onSelect={onObjectClick}
          selectedObject={selectedObject}
        />
      )}

      {/* ========== SWITCHGEARS INSTANCIÉS (si instancing activé) ========== */}
      {useInstancing && (
        <SwitchgearInstanced
          instances={switchgearInstances}
          onSelect={onObjectClick}
          selectedObject={selectedObject}
        />
      )}

      {/* ========== SUBSTATION 200 MW (rendue en dernier) ========== */}
      <Substation200MW
        position={SUBSTATION_POSITION}
        onSelect={onObjectClick}
        isSelected={selectedObject === 'Substation_200MW'}
      />
    </group>
  );
}

// Mémoriser le composant pour éviter les re-renders inutiles
export default memo(SubstationSystem3D);

