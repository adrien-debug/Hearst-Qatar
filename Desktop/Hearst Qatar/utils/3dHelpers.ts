/**
 * Utilitaires pour la visualisation 3D
 */

export interface Object3DInfo {
  id: string;
  name: string;
  type: 'substation' | 'powerblock' | 'transformer' | 'switchgear' | 'container' | 'generator' | 'hub' | 'node' | 'module' | 'connector';
  position: { x: number; y: number; z: number };
  capacity?: number;
  status?: 'OK' | 'Warning' | 'Off';
}

/**
 * Extrait le type d'objet depuis son nom/ID
 */
export function getObjectType(objectName: string): Object3DInfo['type'] {
  // Nouvelle structure hiérarchique
  if (objectName.startsWith('HUB_MODULE_')) return 'hub';
  if (objectName.startsWith('NODE_')) return 'node';
  if (objectName.startsWith('MODULE_C')) return 'module';
  if (objectName.startsWith('CONNECTOR_')) return 'connector';
  
  // Ancienne structure (pour compatibilité)
  if (objectName.includes('Substation')) return 'substation';
  if (objectName.includes('PowerBlock') || objectName.includes('PB')) return 'powerblock';
  if (objectName.includes('Transformer') || objectName.includes('TR')) return 'transformer';
  if (objectName.includes('SG')) return 'switchgear';
  if (objectName.includes('Generator') || objectName.includes('GEN')) return 'generator';
  if (objectName.includes('HD5')) return 'container';
  return 'container';
}

/**
 * Extrait les informations d'un objet depuis son ID
 */
export function parseObjectId(objectId: string): {
  powerBlock?: number;
  transformer?: number;
  container?: 'A' | 'B' | 'L' | 'R';
  switchgear?: number;
  generator?: number;
} {
  const result: any = {};
  
  // PB1_TR01_HD5_A
  const pbMatch = objectId.match(/PB(\d+)/);
  if (pbMatch) result.powerBlock = parseInt(pbMatch[1]);
  
  // TR01 ou Transformer_01
  const trMatch = objectId.match(/TR(\d+)|Transformer[_\s](\d+)/);
  if (trMatch) result.transformer = parseInt(trMatch[1] || trMatch[2]);
  
  // HD5_A, HD5_B, HD5_L, HD5_R
  const hd5Match = objectId.match(/HD5[_\s]([ABLR])/);
  if (hd5Match) result.container = hd5Match[1] as 'A' | 'B' | 'L' | 'R';
  
  // SG_01
  const sgMatch = objectId.match(/SG[_\s](\d+)/);
  if (sgMatch) result.switchgear = parseInt(sgMatch[1]);
  
  // Generator_01 ou GEN01
  const genMatch = objectId.match(/Generator[_\s](\d+)|GEN(\d+)/);
  if (genMatch) result.generator = parseInt(genMatch[1] || genMatch[2]);
  
  return result;
}

/**
 * Calcule la position 3D d'un élément selon le layout
 */
export function getObjectPosition(
  powerBlock: number,
  transformer?: number
): { x: number; y: number; z: number } {
  const pbX = [-60, -20, 20, 60][powerBlock - 1] || 0;
  
  if (transformer !== undefined) {
    const trY = [-60, -80, -100, -120, -140, -160][transformer - 1] || 0;
    return { x: pbX, y: trY, z: 0 };
  }
  
  return { x: pbX, y: -40, z: 0 };
}

/**
 * Obtient le nom d'affichage lisible depuis un ID technique
 */
export function getDisplayName(objectId: string): string {
  // Nouvelle structure hiérarchique
  if (objectId.startsWith('HUB_MODULE_')) {
    const num = objectId.split('_')[2];
    return `Module Hub ${num}`;
  }
  if (objectId.startsWith('NODE_')) {
    const num = objectId.split('_')[1];
    return `Nœud Hexagonal ${num}`;
  }
  if (objectId.startsWith('MODULE_C')) {
    const parts = objectId.split('_');
    const col = parts[1].replace('C', '');
    const row = parts[2].replace('R', '');
    const pair = parts[3] === 'L' ? 'Gauche' : 'Droite';
    return `Module C${col} R${row} (${pair})`;
  }
  if (objectId.startsWith('CONNECTOR_')) {
    const parts = objectId.split('_');
    const col = parts[1].replace('C', '');
    const row = parts[2].replace('R', '');
    return `Connecteur C${col} R${row}`;
  }
  
  // Ancienne structure (pour compatibilité)
  const parsed = parseObjectId(objectId);
  
  if (objectId.includes('Substation')) {
    return 'Substation 200 MW';
  }
  
  if (parsed.generator) {
    if (parsed.container) {
      const side = parsed.container === 'L' ? 'Gauche' : parsed.container === 'R' ? 'Droite' : parsed.container;
      return `Container HD5 Gen${parsed.generator}-${side}`;
    }
    return `Générateur ${parsed.generator}`;
  }
  
  if (parsed.powerBlock) {
    if (parsed.transformer) {
      if (parsed.container) {
        return `Container HD5 ${parsed.powerBlock}-${parsed.transformer}-${parsed.container}`;
      }
      if (parsed.switchgear) {
        return `Switchgear ${parsed.powerBlock}-${parsed.transformer}`;
      }
      return `Transformateur ${parsed.powerBlock}-${parsed.transformer}`;
    }
    return `Power Block ${parsed.powerBlock}`;
  }
  
  return objectId;
}

/**
 * Obtient la couleur selon le statut
 */
export function getStatusColor(status: 'OK' | 'Warning' | 'Off'): string {
  switch (status) {
    case 'OK':
      return '#10b981'; // Vert
    case 'Warning':
      return '#f59e0b'; // Orange
    case 'Off':
      return '#ef4444'; // Rouge
    default:
      return '#6b7280'; // Gris
  }
}
