/**
 * Structure de données pour la hiérarchie 3D
 * Distribution Hub → Nœuds Hexagonaux → Modules Terminaux
 */

import { Hierarchical3DConfig } from '../config/hierarchical3d.config';

export type ModuleStatus = 'OK' | 'Warning' | 'Off';
export type ModulePair = 'left' | 'right';

export interface DistributionHubModule {
  id: string;
  position: [number, number, number];
  status: ModuleStatus;
  index: number; // 0-4
}

export interface HexagonalNode {
  id: string;
  position: [number, number, number];
  status: ModuleStatus;
  column: number; // 1-4
}

export interface TerminalModule {
  id: string;
  position: [number, number, number];
  status: ModuleStatus;
  column: number; // 1-4
  row: number; // 1-4
  pair: ModulePair;
  hasRedIndicator: boolean;
}

export interface CylindricalConnector {
  id: string;
  position: [number, number, number];
  connectedModules: [string, string]; // IDs des modules connectés
  column: number;
  row: number;
}

export interface HierarchicalStructure {
  distributionHub: {
    position: [number, number, number];
    modules: DistributionHubModule[];
  };
  nodes: HexagonalNode[];
  terminalModules: TerminalModule[];
  connectors: CylindricalConnector[];
}

/**
 * Génère la structure hiérarchique complète
 */
export function buildHierarchicalStructure(): HierarchicalStructure {
  const config = Hierarchical3DConfig;
  
  // 1. Distribution Hub avec 5 modules
  const hubModules: DistributionHubModule[] = [];
  const hubStartX = -(config.distributionHub.modules.count - 1) * config.distributionHub.modules.spacing / 2;
  
  for (let i = 0; i < config.distributionHub.modules.count; i++) {
    hubModules.push({
      id: `HUB_MODULE_${i + 1}`,
      position: [
        hubStartX + i * config.distributionHub.modules.spacing,
        config.distributionHub.position[1],
        config.distributionHub.position[2],
      ],
      status: 'OK',
      index: i,
    });
  }

  // 2. Nœuds hexagonaux (4)
  const nodes: HexagonalNode[] = [];
  const nodeStartX = -(config.hexagonalNodes.count - 1) * config.hexagonalNodes.spacing / 2;
  
  for (let col = 1; col <= config.hexagonalNodes.count; col++) {
    nodes.push({
      id: `NODE_${col}`,
      position: [
        nodeStartX + (col - 1) * config.hexagonalNodes.spacing,
        config.hexagonalNodes.yPosition,
        0,
      ],
      status: 'OK',
      column: col,
    });
  }

  // 3. Modules terminaux (32 modules : 4 colonnes × 4 rangées × 2 modules)
  const terminalModules: TerminalModule[] = [];
  const startX = config.terminalModules.startPosition.x;
  const startY = config.terminalModules.startPosition.y;
  
  // Vérifier si un module a un indicateur rouge
  const hasIndicator = (column: number, row: number, pair: ModulePair): boolean => {
    return config.statusIndicators.modulesWithIndicators.some(
      (ind) => ind.column === column && ind.row === row && ind.pair === pair
    );
  };

  for (let col = 1; col <= config.terminalModules.columns; col++) {
    const colX = startX + (col - 1) * config.terminalModules.columnSpacing;
    
    for (let row = 1; row <= config.terminalModules.rows; row++) {
      const rowY = startY - (row - 1) * config.terminalModules.verticalSpacing;
      
      // Module gauche
      terminalModules.push({
        id: `MODULE_C${col}_R${row}_L`,
        position: [
          colX - config.terminalModules.horizontalSpacing / 2,
          rowY,
          0,
        ],
        status: hasIndicator(col, row, 'left') ? 'Warning' : 'OK',
        column: col,
        row: row,
        pair: 'left',
        hasRedIndicator: hasIndicator(col, row, 'left'),
      });

      // Module droite
      terminalModules.push({
        id: `MODULE_C${col}_R${row}_R`,
        position: [
          colX + config.terminalModules.horizontalSpacing / 2,
          rowY,
          0,
        ],
        status: hasIndicator(col, row, 'right') ? 'Warning' : 'OK',
        column: col,
        row: row,
        pair: 'right',
        hasRedIndicator: hasIndicator(col, row, 'right'),
      });
    }
  }

  // 4. Connecteurs cylindriques (entre chaque paire de modules)
  const connectors: CylindricalConnector[] = [];
  
  for (let col = 1; col <= config.terminalModules.columns; col++) {
    const colX = startX + (col - 1) * config.terminalModules.columnSpacing;
    
    for (let row = 1; row <= config.terminalModules.rows; row++) {
      const rowY = startY - (row - 1) * config.terminalModules.verticalSpacing;
      
      connectors.push({
        id: `CONNECTOR_C${col}_R${row}`,
        position: [
          colX,
          rowY + config.cylindricalConnectors.position.y,
          0,
        ],
        connectedModules: [
          `MODULE_C${col}_R${row}_L`,
          `MODULE_C${col}_R${row}_R`,
        ],
        column: col,
        row: row,
      });
    }
  }

  return {
    distributionHub: {
      position: config.distributionHub.position,
      modules: hubModules,
    },
    nodes: nodes,
    terminalModules: terminalModules,
    connectors: connectors,
  };
}

/**
 * Obtient le statut d'un module par son ID
 */
export function getModuleStatus(moduleId: string, structure: HierarchicalStructure): ModuleStatus {
  // Chercher dans les modules terminaux
  const terminalModule = structure.terminalModules.find((m) => m.id === moduleId);
  if (terminalModule) return terminalModule.status;

  // Chercher dans les nœuds
  const node = structure.nodes.find((n) => n.id === moduleId);
  if (node) return node.status;

  // Chercher dans les modules du hub
  const hubModule = structure.distributionHub.modules.find((m) => m.id === moduleId);
  if (hubModule) return hubModule.status;

  return 'OK';
}

/**
 * Met à jour le statut d'un module
 */
export function updateModuleStatus(
  moduleId: string,
  status: ModuleStatus,
  structure: HierarchicalStructure
): HierarchicalStructure {
  const updated = { ...structure };

  // Mettre à jour dans les modules terminaux
  const terminalIndex = updated.terminalModules.findIndex((m) => m.id === moduleId);
  if (terminalIndex !== -1) {
    updated.terminalModules[terminalIndex] = {
      ...updated.terminalModules[terminalIndex],
      status,
      hasRedIndicator: status === 'Warning',
    };
    return updated;
  }

  // Mettre à jour dans les nœuds
  const nodeIndex = updated.nodes.findIndex((n) => n.id === moduleId);
  if (nodeIndex !== -1) {
    updated.nodes[nodeIndex] = {
      ...updated.nodes[nodeIndex],
      status,
    };
    return updated;
  }

  // Mettre à jour dans les modules du hub
  const hubIndex = updated.distributionHub.modules.findIndex((m) => m.id === moduleId);
  if (hubIndex !== -1) {
    updated.distributionHub.modules[hubIndex] = {
      ...updated.distributionHub.modules[hubIndex],
      status,
    };
    return updated;
  }

  return updated;
}
