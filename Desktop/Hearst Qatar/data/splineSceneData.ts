/**
 * Données de configuration pour la scène Spline
 * 
 * Ce fichier contient toutes les positions exactes des objets
 * pour faciliter la création de la scène dans Spline
 */

export interface ObjectPosition {
  x: number;
  y: number;
  z: number;
  name: string;
  type: 'substation' | 'powerblock' | 'transformer' | 'switchgear' | 'container';
}

export interface PowerBlockData {
  id: string;
  position: ObjectPosition;
  transformers: TransformerData[];
}

export interface TransformerData {
  id: string;
  position: ObjectPosition;
  containers: ContainerData[];
  switchgears: SwitchgearData[];
}

export interface ContainerData {
  id: string;
  position: ObjectPosition;
  side: 'A' | 'B';
}

export interface SwitchgearData {
  id: string;
  position: ObjectPosition;
  side: 'L' | 'R';
}

// Configuration principale
export const SUBSTATION_POSITION: ObjectPosition = {
  x: 0,
  y: 0.5,
  z: 60, // Éloignée vers l'arrière (était à 0)
  name: 'Substation_200MW',
  type: 'substation',
};

// Espacements
export const POWER_BLOCK_SPACING = 50; // Espacement horizontal entre Power Blocks
export const POWER_BLOCK_START_X = -75; // Position X du premier Power Block
export const POWER_BLOCK_START_Z = 35; // Position Z des Power Blocks (éloignés vers l'arrière, était à -35)
export const TRANSFORMER_VERTICAL_SPACING = 20; // Espacement vertical entre transformateurs
export const TRANSFORMER_START_Z = 15; // Position Z du premier transformateur (était à -55)
export const SWITCHGEAR_OFFSET = 4.5; // Distance latérale depuis le transformateur
export const CONTAINER_OFFSET = 12; // Distance latérale depuis le transformateur

// Dimensions (en mètres)
export const DIMENSIONS = {
  substation: { width: 40, height: 30, depth: 15 },
  powerBlock: { width: 15, height: 8, depth: 10 },
  transformer: { width: 4, height: 3, depth: 5 },
  switchgear: { width: 2, height: 2, depth: 3 },
  containerHD5: { width: 12.196, height: 2.438, depth: 2.896 },
};

/**
 * Génère toutes les positions pour un Power Block
 */
export function generatePowerBlockData(pbIndex: number): PowerBlockData {
  const pbNum = pbIndex + 1;
  const pbX = POWER_BLOCK_START_X + (pbIndex * POWER_BLOCK_SPACING);
  
  const transformers: TransformerData[] = [];
  
  for (let trIndex = 0; trIndex < 6; trIndex++) {
    const trNum = trIndex + 1;
    const trZ = TRANSFORMER_START_Z - (trIndex * TRANSFORMER_VERTICAL_SPACING);
    
    const transformerId = `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_Transformer`;
    const transformerPosition: ObjectPosition = {
      x: pbX,
      y: 0.3,
      z: trZ,
      name: transformerId,
      type: 'transformer',
    };
    
    // Containers
    const containers: ContainerData[] = [
      {
        id: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`,
        position: {
          x: pbX - CONTAINER_OFFSET,
          y: 0.3,
          z: trZ,
          name: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`,
          type: 'container',
        },
        side: 'A',
      },
      {
        id: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`,
        position: {
          x: pbX + CONTAINER_OFFSET,
          y: 0.3,
          z: trZ,
          name: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`,
          type: 'container',
        },
        side: 'B',
      },
    ];
    
    // Switchgears
    const switchgears: SwitchgearData[] = [
      {
        id: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`,
        position: {
          x: pbX - SWITCHGEAR_OFFSET,
          y: 0.3,
          z: trZ,
          name: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`,
          type: 'switchgear',
        },
        side: 'L',
      },
      {
        id: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`,
        position: {
          x: pbX + SWITCHGEAR_OFFSET,
          y: 0.3,
          z: trZ,
          name: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`,
          type: 'switchgear',
        },
        side: 'R',
      },
    ];
    
    transformers.push({
      id: transformerId,
      position: transformerPosition,
      containers,
      switchgears,
    });
  }
  
  return {
    id: `PowerBlock_${pbNum}`,
    position: {
      x: pbX,
      y: 0.5,
      z: POWER_BLOCK_START_Z,
      name: `PowerBlock_${pbNum}`,
      type: 'powerblock',
    },
    transformers,
  };
}

/**
 * Génère toutes les données de la scène complète
 */
export function generateCompleteSceneData() {
  const powerBlocks: PowerBlockData[] = [];
  
  for (let i = 0; i < 4; i++) {
    powerBlocks.push(generatePowerBlockData(i));
  }
  
  return {
    substation: SUBSTATION_POSITION,
    powerBlocks,
  };
}

/**
 * Exporte toutes les positions au format JSON pour import dans Spline
 */
export function exportPositionsToJSON() {
  const sceneData = generateCompleteSceneData();
  const allObjects: ObjectPosition[] = [sceneData.substation];
  
  sceneData.powerBlocks.forEach((pb) => {
    allObjects.push(pb.position);
    pb.transformers.forEach((tr) => {
      allObjects.push(tr.position);
      tr.containers.forEach((container) => {
        allObjects.push(container.position);
      });
      tr.switchgears.forEach((switchgear) => {
        allObjects.push(switchgear.position);
      });
    });
  });
  
  return JSON.stringify(allObjects, null, 2);
}

/**
 * Liste tous les noms d'objets pour configuration des interactions dans Spline
 */
export function getAllObjectNames(): string[] {
  const sceneData = generateCompleteSceneData();
  const names: string[] = [sceneData.substation.name];
  
  sceneData.powerBlocks.forEach((pb) => {
    names.push(pb.id);
    pb.transformers.forEach((tr) => {
      names.push(tr.id);
      tr.containers.forEach((container) => {
        names.push(container.id);
      });
      tr.switchgears.forEach((switchgear) => {
        names.push(switchgear.id);
      });
    });
  });
  
  return names;
}

// Export des données pour utilisation dans d'autres fichiers
export const sceneData = generateCompleteSceneData();
export const allObjectNames = getAllObjectNames();
export const positionsJSON = exportPositionsToJSON();
