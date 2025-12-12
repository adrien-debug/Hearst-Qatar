import * as THREE from 'three';
import { textureCache, getOptimalTextureSize } from './textureCache';
import { multiOctaveNoise } from './textureHelpers';
import { progressiveTextureLoader } from './progressiveTextureLoader';
import { createBlackMetalTexture, createMetalNormalMap, createMetalRoughnessMap } from './textureHelpers';

/**
 * Utilitaires pour créer des matériaux PBR réalistes avec textures procédurales
 */

/**
 * Fonction helper pour assigner une texture de manière sécurisée
 * Ne assigne jamais null, seulement undefined ou une texture valide
 */
export function safeAssignTexture(
  material: THREE.MeshStandardMaterial,
  property: 'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'emissiveMap',
  texture: THREE.Texture | null | undefined
): void {
  if (texture === null) {
    // Ne jamais assigner null, utiliser undefined à la place
    (material as any)[property] = undefined;
  } else if (texture !== undefined) {
    (material as any)[property] = texture;
  }
  // Si texture est undefined, ne rien faire (laisser la valeur par défaut)
}

/**
 * Nettoie un matériau pour s'assurer qu'il n'a pas de textures null
 * Cette fonction doit être appelée après la création du matériau
 */
export function sanitizeMaterial(material: THREE.MeshStandardMaterial): void {
  const textureProperties: Array<'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'emissiveMap'> = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
  ];

  textureProperties.forEach(prop => {
    const texture = (material as any)[prop];
    if (texture === null) {
      (material as any)[prop] = undefined;
    }
  });

  // S'assurer que needsUpdate est à true si des textures ont été modifiées
  material.needsUpdate = true;
}

/**
 * Crée une texture procédurale pour simuler de la rouille/usure
 */
export function createRustTexture(size: number = 512): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Fond métallique
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#4a5568');
  gradient.addColorStop(0.5, '#2d3748');
  gradient.addColorStop(1, '#1a202c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Ajouter des taches de rouille
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 30 + 10;
    
    const rustGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    rustGradient.addColorStop(0, `rgba(139, 69, 19, ${Math.random() * 0.5 + 0.3})`);
    rustGradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
    
    ctx.fillStyle = rustGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ajouter des rayures/égratignures
  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`;
    ctx.lineWidth = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.lineTo(Math.random() * size, Math.random() * size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * Crée une texture procédurale pour simuler du béton
 */
export function createConcreteTexture(size: number = 512): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Fond béton
  const baseColor = '#9ca3af';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Ajouter de la texture granulaire
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.max(0, Math.min(255, parseInt(baseColor.slice(1, 3), 16) + noise));
    data[i + 1] = Math.max(0, Math.min(255, parseInt(baseColor.slice(3, 5), 16) + noise));
    data[i + 2] = Math.max(0, Math.min(255, parseInt(baseColor.slice(5, 7), 16) + noise));
  }

  ctx.putImageData(imageData, 0, 0);

  // Ajouter des fissures subtiles
  for (let i = 0; i < 10; i++) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.2 + 0.1})`;
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.lineTo(Math.random() * size, Math.random() * size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Crée une texture procédurale ULTRA-RÉALISTE pour simuler de la peinture industrielle
 */
export function createIndustrialPaintTexture(
  baseColor: string = '#4b5563',
  size: number = 1024
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Parser la couleur de base
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  // Utiliser bruit multi-octave pour variations réalistes (importé en haut du fichier)
  
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave pour texture de peinture pulvérisée
      const fineNoise = multiOctaveNoise(x / 30, y / 30, 5) * 20;
      const coarseNoise = multiOctaveNoise(x / 150, y / 150, 3) * 10;
      
      // Variations de couleur (effet de pulvérisation)
      const sprayVariation = Math.sin(x / 80) * Math.cos(y / 80) * 5;
      
      data[index] = Math.max(0, Math.min(255, r + fineNoise + coarseNoise + sprayVariation));
      data[index + 1] = Math.max(0, Math.min(255, g + fineNoise + coarseNoise + sprayVariation));
      data[index + 2] = Math.max(0, Math.min(255, b + fineNoise + coarseNoise + sprayVariation));
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Ajouter des reflets subtils (gradient de lumière)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `rgba(255, 255, 255, 0.08)`);
  gradient.addColorStop(0.3, `rgba(255, 255, 255, 0.03)`);
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.7, `rgba(0, 0, 0, 0.03)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, 0.08)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Ajouter des taches de peinture (effet de pulvérisation)
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 5 + Math.random() * 15;
    const alpha = 0.1 + Math.random() * 0.2;
    
    const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    spotGradient.addColorStop(0, `rgba(${r + 10}, ${g + 10}, ${b + 10}, ${alpha})`);
    spotGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une texture de normal map procédurale pour ajouter de la profondeur
 */
export function createNormalMap(size: number = 512): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Normal map standard (bleu/violet)
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      // Normal map : R = X, G = Y, B = Z (normalisé)
      data[index] = 128; // X normalisé
      data[index + 1] = 128; // Y normalisé
      data[index + 2] = 255; // Z normalisé (face vers la caméra)
      data[index + 3] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Crée un matériau métallique PBR avancé - ULTRA-RÉALISTE avec textures haute résolution
 * Utilise le chargement progressif pour éviter les blocages
 */
export function createAdvancedMetalMaterial(
  color: string = '#4b5563',
  metalness: number = 0.8,
  roughness: number = 0.3,
  withRust: boolean = false
): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: metalness,
    roughness: roughness,
    envMapIntensity: 1.4, // Reflets plus prononcés pour réalisme
    side: THREE.DoubleSide,
  });

  // Charger les textures de manière progressive (basse résolution d'abord, puis haute)
  if (typeof window !== 'undefined') {
    const textureSize = getOptimalTextureSize();
    
    // Charger texture de base (basse résolution immédiatement)
    progressiveTextureLoader.loadProgressive(
      () => createBlackMetalTexture(256) || new THREE.Texture(),
      () => createBlackMetalTexture(textureSize) || new THREE.Texture(),
      `metal_${color}_${textureSize}`,
      { priority: 'medium', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'map', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs de chargement
    });

    // Charger normal map
    progressiveTextureLoader.loadProgressive(
      () => createMetalNormalMap(256) || new THREE.Texture(),
      () => createMetalNormalMap(textureSize) || new THREE.Texture(),
      `metal_normal_${textureSize}`,
      { priority: 'low', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'normalMap', texture);
        material.normalScale.set(1, 1);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs
    });

    // Charger roughness map
    progressiveTextureLoader.loadProgressive(
      () => createMetalRoughnessMap(256) || new THREE.Texture(),
      () => createMetalRoughnessMap(textureSize) || new THREE.Texture(),
      `metal_roughness_${textureSize}`,
      { priority: 'low', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'roughnessMap', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs
    });
  }

  return material;
}

/**
 * Crée un matériau béton PBR ULTRA-RÉALISTE avec textures haute résolution
 * Utilise le chargement progressif
 */
export function createConcreteMaterial(): THREE.MeshStandardMaterial {
  let textureSize = 512;
  try {
    if (typeof window !== 'undefined') {
      textureSize = getOptimalTextureSize();
    }
  } catch (e) {
    // Utiliser valeur par défaut
  }
  
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.0,
    roughness: 0.9,
    color: '#9ca3af',
  });

  // Charger texture de béton de manière progressive
  if (typeof window !== 'undefined') {
    const { createConcreteTexture } = require('./textureHelpers');
    
    progressiveTextureLoader.loadProgressive(
      () => createConcreteTexture(256) || new THREE.Texture(),
      () => createConcreteTexture(textureSize) || new THREE.Texture(),
      `concrete_${textureSize}`,
      { priority: 'medium', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'map', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs
    });
  }

  return material;
}

/**
 * Crée un matériau de container industriel avec usure - ULTRA-RÉALISTE
 * Utilise le chargement progressif
 */
export function createContainerMaterial(
  baseColor: string = '#1a1a1a',
  wearLevel: number = 0.3 // 0 = neuf, 1 = très usé
): THREE.MeshStandardMaterial {
  let textureSize = 512;
  try {
    if (typeof window !== 'undefined') {
      textureSize = getOptimalTextureSize();
    }
  } catch (e) {
    // Utiliser valeur par défaut
  }
  
  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.3 + wearLevel * 0.15,
    roughness: 0.85 - wearLevel * 0.15, // Peinture industrielle matte
    envMapIntensity: 0.5,
    side: THREE.DoubleSide,
  });

  // Charger texture de container de manière progressive
  if (typeof window !== 'undefined') {
    const { createBlackMetalTexture, createMetalNormalMap, createMetalRoughnessMap } = require('./textureHelpers');
    
    // Texture de base
    progressiveTextureLoader.loadProgressive(
      () => createBlackMetalTexture(256) || new THREE.Texture(),
      () => createBlackMetalTexture(textureSize) || new THREE.Texture(),
      `container_${baseColor}_${textureSize}`,
      { priority: 'medium', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'map', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {});

    // Normal map (chargée en arrière-plan)
    progressiveTextureLoader.loadProgressive(
      () => createMetalNormalMap(256) || new THREE.Texture(),
      () => createMetalNormalMap(textureSize) || new THREE.Texture(),
      `container_normal_${textureSize}`,
      { priority: 'low', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'normalMap', texture);
        material.normalScale.set(1, 1);
        material.needsUpdate = true;
      }
    }).catch(() => {});
  }

  if (wearLevel > 0.2) {
    material.roughness = 0.6 + wearLevel * 0.25;
  }

  return material;
}

/**
 * Crée un matériau ultra-réaliste pour les radiateurs en V - ALUMINIUM ANODISÉ BRILLANT
 */
export function createRadiatorMaterial(): THREE.MeshStandardMaterial {
  let textureSize = 512;
  try {
    if (typeof window !== 'undefined') {
      textureSize = getOptimalTextureSize();
    }
  } catch (e) {
    // Utiliser valeur par défaut
  }
  
  const material = new THREE.MeshStandardMaterial({
    color: '#e8e8e8', // Aluminium clair anodisé
    metalness: 0.95, // Métallique très brillant
    roughness: 0.15, // Surface très lisse et réfléchissante
    envMapIntensity: 1.8, // Reflets environnement très prononcés
    side: THREE.DoubleSide,
  });

  // Textures désactivées temporairement pour éviter les blocages
  // TODO: Réactiver de manière asynchrone après le premier rendu

  return material;
}

