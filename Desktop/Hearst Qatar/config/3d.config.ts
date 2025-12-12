/**
 * Configuration pour la visualisation 3D
 */

export const Scene3DConfig = {
  // Configuration de la caméra
  camera: {
    position: [0, 100, 150] as [number, number, number],
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

  // Configuration de l'éclairage
  lighting: {
    ambient: {
      intensity: 0.5,
      color: '#ffffff',
    },
    directional: {
      main: {
        position: [10, 10, 5] as [number, number, number],
        intensity: 1,
        castShadow: true,
        shadowMapSize: 2048,
      },
      fill: {
        position: [-10, 5, -5] as [number, number, number],
        intensity: 0.3,
        color: '#ffffff',
      },
    },
    point: {
      position: [0, 50, 0] as [number, number, number],
      intensity: 0.5,
      distance: 200,
      decay: 2,
    },
  },

  // Configuration de la grille
  grid: {
    size: 200,
    divisions: 20,
    colorCenterLine: '#666666',
    colorGrid: '#333333',
  },

  // Configuration des axes
  axes: {
    size: 50,
  },

  // Configuration de l'environnement
  environment: {
    preset: 'sunset' as 'sunset' | 'city' | 'park' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'dawn' | 'night' | 'lobby',
  },

  // Configuration des performances
  performance: {
    maxTriangles: 500000,
    maxTextureSize: 2048,
    enableFrustumCulling: true,
    enableInstancing: true,
  },

  // Positions des éléments (en mètres)
  layout: {
    substation: {
      position: [0, 20, 0] as [number, number, number],
      dimensions: [40, 30, 15] as [number, number, number],
    },
    powerBlocks: {
      positions: [
        [-60, -40, 0],
        [-20, -40, 0],
        [20, -40, 0],
        [60, -40, 0],
      ] as Array<[number, number, number]>,
      dimensions: [15, 8, 10] as [number, number, number],
    },
    transformers: {
      yPositions: [-60, -80, -100, -120, -140, -160],
      dimensions: [4, 3, 5] as [number, number, number],
      spacing: 20,
    },
    switchgears: {
      offset: [5, 0, 0] as [number, number, number],
      dimensions: [2, 2, 1.5] as [number, number, number],
    },
    hd5Containers: {
      dimensions: [12.196, 2.438, 2.896] as [number, number, number],
      offsets: [-2, 2] as [number, number], // Offset X pour HD5_A et HD5_B
    },
    // Infrastructure VRD (Voirie et Réseaux Divers)
    vrd: {
      // Mur d'enceinte en béton
      concreteWall: {
        center: [0, 0, -37.5] as [number, number, number],
        width: 220, // X: -110m à +110m
        depth: 95,  // Z: -85m à +10m
        height: 4,
        thickness: 0.3,
        gatePosition: 'front' as 'front' | 'back' | 'left' | 'right',
        gateWidth: 8,
      },
      // Portail d'entrée coulissant
      entranceGate: {
        position: [0, 0, 10] as [number, number, number],
        width: 8,
        height: 4,
        isOpen: false,
      },
      // Poste de garde
      guardHouse: {
        position: [5, 0, 10] as [number, number, number],
        rotation: 0,
      },
      // Parking professionnel
      parking: {
        position: [-100, 0, -20] as [number, number, number],
        width: 30,
        depth: 20,
        rows: 2,
        spotsPerRow: 20,
      },
      // Routes
      roads: {
        // Route externe (de la substation au portail)
        external: {
          position: [0, 0, 35] as [number, number, number],
          length: 50,
          width: 7,
          orientation: 'vertical' as 'horizontal' | 'vertical',
          material: 'asphalt' as 'asphalt' | 'concrete',
          showCenterLine: true,
          showEdgeLines: true,
        },
        // Route interne (du portail à l'intérieur du site)
        internal: {
          position: [0, 0, -37.5] as [number, number, number],
          length: 95,
          width: 6,
          orientation: 'vertical' as 'horizontal' | 'vertical',
          material: 'concrete' as 'asphalt' | 'concrete',
          showCenterLine: false,
          showEdgeLines: false,
        },
        // Route vers le parking
        parkingAccess: {
          position: [-85, 0, -20] as [number, number, number],
          length: 15,
          width: 5,
          orientation: 'horizontal' as 'horizontal' | 'vertical',
          material: 'asphalt' as 'asphalt' | 'concrete',
          showCenterLine: false,
          showEdgeLines: false,
        },
      },
      // Signalétique
      signage: [
        {
          position: [0, 0, 12] as [number, number, number],
          type: 'entrance' as 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation',
          direction: 'straight' as 'left' | 'right' | 'straight',
          text: 'ZONE INDUSTRIELLE - 200 MW',
        },
        {
          position: [8, 0, 5] as [number, number, number],
          type: 'speed' as 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation',
          direction: 'straight' as 'left' | 'right' | 'straight',
          text: '30 km/h',
        },
        {
          position: [-8, 0, 0] as [number, number, number],
          type: 'direction' as 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation',
          direction: 'left' as 'left' | 'right' | 'straight',
          text: 'Parking',
        },
        {
          position: [8, 0, 0] as [number, number, number],
          type: 'direction' as 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation',
          direction: 'right' as 'left' | 'right' | 'straight',
          text: 'Maintenance',
        },
        {
          position: [-110, 0, -40] as [number, number, number],
          type: 'safety' as 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation',
          direction: 'straight' as 'left' | 'right' | 'straight',
          text: 'DANGER HAUTE TENSION',
        },
        {
          position: [110, 0, -40] as [number, number, number],
          type: 'evacuation' as 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation',
          direction: 'straight' as 'left' | 'right' | 'straight',
          text: 'SORTIE DE SECOURS',
        },
      ],
    },
  },
};

export default Scene3DConfig;
