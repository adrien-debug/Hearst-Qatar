/**
 * Configuration pour la visualisation 3D hiérarchique
 * Basée sur la structure : Distribution Hub → Nœuds Hexagonaux → Modules Terminaux
 */

export const Hierarchical3DConfig = {
  // Configuration de la caméra
  camera: {
    position: [0, 50, 80] as [number, number, number],
    fov: 50,
    near: 0.1,
    far: 1000,
  },

  // Configuration des contrôles
  controls: {
    minDistance: 50,
    maxDistance: 500,
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    autoRotate: false,
    autoRotateSpeed: 0.5,
    dampingFactor: 0.05,
    enableDamping: true,
  },

  // Unité de Distribution Supérieure
  distributionHub: {
    position: [0, 40, 0] as [number, number, number],
    horizontalStructure: {
      length: 60, // Longueur du rail/bus principal
      width: 2,
      height: 1.5,
      color: '#374151', // Gris foncé
    },
    modules: {
      count: 5,
      width: 3,
      height: 2,
      depth: 1.5,
      spacing: 12, // Espacement entre modules
      color: '#86efac', // Vert clair
      borderColor: '#000000', // Noir
      centerColor: '#64748b', // Gris-bleu
    },
    centralConnector: {
      diameter: 0.8,
      length: 15,
      color: '#000000', // Noir
    },
    distributionLines: {
      count: 4,
      color: '#16a34a', // Vert foncé
      thickness: 0.3,
      curveHeight: 8, // Hauteur de la courbe
      horizontalLength: 25, // Longueur horizontale
    },
  },

  // Nœuds Hexagonaux Intermédiaires
  hexagonalNodes: {
    count: 4,
    radius: 3, // Rayon de l'hexagone
    height: 2,
    depth: 2,
    spacing: 30, // Espacement horizontal entre nœuds
    color: '#86efac', // Vert clair
    borderColor: '#000000', // Noir
    shadowColor: '#9ca3af', // Gris pour l'ombre
    lightningSymbol: {
      color: '#000000',
      size: 1.5,
    },
    yPosition: 25, // Position Y sous les lignes de distribution
  },

  // Modules Terminaux
  terminalModules: {
    columns: 4,
    rows: 4,
    pairsPerRow: 2, // 2 modules par rangée (gauche et droite)
    total: 32, // 4 colonnes × 4 rangées × 2 modules
    
    // Dimensions d'un module
    width: 2.5,
    height: 3,
    depth: 1.8,
    
    // Espacements
    verticalSpacing: 4, // Entre les rangées
    horizontalSpacing: 3, // Entre les paires (gauche-droite)
    columnSpacing: 25, // Entre les colonnes
    
    // Couleurs
    color: '#86efac', // Vert clair
    borderColor: '#000000', // Noir
    middleLineColor: '#374151', // Gris foncé pour la ligne médiane
    windowColor: '#000000', // Noir pour la fenêtre carrée
    
    // Fenêtre carrée supérieure
    window: {
      size: 0.3,
      position: { x: 0.8, y: 1.2, z: 0.01 }, // Coin supérieur droit relatif
    },
    
    // Ligne horizontale médiane
    middleLine: {
      width: 2,
      height: 0.05,
      position: { y: 0 }, // Au milieu en Y
    },
    
    // Position de départ (première colonne, première rangée)
    startPosition: {
      x: -37.5, // Centré autour de 0
      y: 5,
      z: 0,
    },
  },

  // Connecteurs Cylindriques
  cylindricalConnectors: {
    diameter: 0.4,
    length: 1.2,
    color: '#9ca3af', // Gris métallique
    position: {
      y: 1.5, // Au niveau du milieu des modules
    },
  },

  // Système de Connexions
  connections: {
    lineColor: '#000000', // Noir
    lineThickness: 0.05,
    verticalLineLength: 15, // Depuis les nœuds hexagonaux
    horizontalLineLength: 1.5, // Vers les modules
  },

  // Indicateurs d'État (Points Rouges)
  statusIndicators: {
    color: '#ef4444', // Rouge
    size: 0.15, // Rayon du cercle
    position: {
      x: 1.0, // Coin supérieur droit
      y: 1.3,
      z: 0.02,
    },
    // Mapping des modules avec indicateurs rouges selon l'image
    modulesWithIndicators: [
      // Colonne 1
      { column: 1, row: 2, pair: 'right' },
      { column: 1, row: 3, pair: 'left' },
      { column: 1, row: 4, pair: 'left' },
      // Colonne 4
      { column: 4, row: 3, pair: 'right' },
      { column: 4, row: 4, pair: 'left' },
      { column: 4, row: 4, pair: 'right' },
    ],
  },

  // États des modules
  status: {
    OK: {
      color: '#86efac',
      hasIndicator: false,
    },
    Warning: {
      color: '#fbbf24',
      hasIndicator: true,
    },
    Off: {
      color: '#9ca3af',
      hasIndicator: false,
    },
  },
};

export default Hierarchical3DConfig;
