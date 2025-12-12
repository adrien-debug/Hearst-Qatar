import * as THREE from 'three';
import { CanvasTexture, RepeatWrapping } from 'three';

/**
 * Utilitaires pour créer des textures procédurales ULTRA-RÉALISTES
 * Résolution adaptative selon les performances du système
 */

/**
 * Fonction utilitaire pour générer du bruit Perlin simplifié (plus réaliste que random)
 */
function perlinNoise(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Génère un bruit multi-octave pour plus de réalisme
 * Exporté pour utilisation dans d'autres modules
 */
export function multiOctaveNoise(x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += perlinNoise(x * frequency, y * frequency, i) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value / maxValue;
}

/**
 * Crée une texture de métal noir mat avec des détails ULTRA-RÉALISTES
 */
export function createBlackMetalTexture(size: number = 1024): THREE.Texture | undefined {
  // Vérifier que nous sommes dans le navigateur
  if (typeof document === 'undefined') {
    // Retourner undefined si côté serveur (Three.js gère mieux undefined que null)
    return undefined;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base noir mat avec légère variation
  const baseColor = { r: 26, g: 26, b: 26 };
  ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
  ctx.fillRect(0, 0, size, size);

  // Ajouter des variations subtiles avec bruit multi-octave (rayures, usure)
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave pour variations réalistes
      const noise = multiOctaveNoise(x / 100, y / 100, 4);
      const variation = (noise - 0.5) * 15;
      
      // Rayures verticales subtiles (effet de fabrication)
      const scratchNoise = Math.sin(x / 50) * 0.1;
      
      // Usure aux bords
      const edgeWear = Math.min(
        Math.min(x, size - x) / (size * 0.1),
        Math.min(y, size - y) / (size * 0.1)
      );
      const wearVariation = (1 - edgeWear) * 8;
      
      data[index] = Math.max(0, Math.min(255, baseColor.r + variation + scratchNoise * 5 + wearVariation));
      data[index + 1] = Math.max(0, Math.min(255, baseColor.g + variation + scratchNoise * 5 + wearVariation));
      data[index + 2] = Math.max(0, Math.min(255, baseColor.b + variation + scratchNoise * 5 + wearVariation));
      data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des rayures de fabrication plus prononcées
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size;
    const width = 1 + Math.random() * 3;
    const intensity = 0.05 + Math.random() * 0.15;
    
    const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, `rgba(60, 60, 60, ${intensity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, width, size);
  }

  // Ajouter des taches d'usure et de patine
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 20 + Math.random() * 80;
    const alpha = 0.1 + Math.random() * 0.2;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(40, 40, 40, ${alpha})`);
    gradient.addColorStop(0.7, `rgba(20, 20, 20, ${alpha * 0.5})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 16; // Filtrage anisotropique maximum
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une texture de métal vert industriel avec patine ULTRA-RÉALISTE
 */
export function createGreenMetalTexture(size: number = 1024): THREE.Texture | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base vert industriel avec variations
  const baseColor = { r: 5, g: 150, b: 105 };
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave pour variations réalistes
      const noise = multiOctaveNoise(x / 80, y / 80, 5);
      const variation = (noise - 0.5) * 20;
      
      // Patine progressive (plus prononcée en bas)
      const patinaFactor = (size - y) / size * 15;
      
      // Variations de peinture (effet de pulvérisation)
      const sprayNoise = multiOctaveNoise(x / 200, y / 200, 3) * 10;
      
      data[index] = Math.max(0, Math.min(255, baseColor.r + variation - patinaFactor + sprayNoise));
      data[index + 1] = Math.max(0, Math.min(255, baseColor.g + variation - patinaFactor * 0.5 + sprayNoise));
      data[index + 2] = Math.max(0, Math.min(255, baseColor.b + variation - patinaFactor * 0.3 + sprayNoise));
      data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter de la patine (zones plus sombres) - plus réaliste
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 40 + Math.random() * 120;
    const alpha = 0.2 + Math.random() * 0.4;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(4, 100, 70, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(2, 60, 45, ${alpha * 0.7})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ajouter des reflets métalliques plus réalistes
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * size;
    const width = 3 + Math.random() * 12;
    const height = size;
    const intensity = 0.15 + Math.random() * 0.25;
    
    const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.3, `rgba(20, 200, 140, ${intensity})`);
    gradient.addColorStop(0.7, `rgba(20, 200, 140, ${intensity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, width, height);
  }

  // Ajouter des éclats de lumière (highlights)
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 5 + Math.random() * 15;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`);
    gradient.addColorStop(0.5, `rgba(50, 200, 150, ${0.2})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une texture de métal gris industriel ULTRA-RÉALISTE avec tôles et rivets
 */
export function createGrayMetalTexture(size: number = 1024): THREE.Texture | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base gris industriel avec variations
  const baseColor = { r: 75, g: 85, b: 99 };
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave
      const noise = multiOctaveNoise(x / 60, y / 60, 4);
      const variation = (noise - 0.5) * 25;
      
      data[index] = Math.max(0, Math.min(255, baseColor.r + variation));
      data[index + 1] = Math.max(0, Math.min(255, baseColor.g + variation));
      data[index + 2] = Math.max(0, Math.min(255, baseColor.b + variation));
      data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des panneaux métalliques (effet de tôle) - plus réaliste
  const panelCount = 12;
  for (let i = 0; i < panelCount; i++) {
    const y = (i / panelCount) * size;
    const height = size / panelCount;
    
    // Gradient plus subtil et réaliste
    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, 'rgba(70, 80, 94, 0.8)');
    gradient.addColorStop(0.3, 'rgba(110, 120, 135, 0.9)');
    gradient.addColorStop(0.5, 'rgba(115, 125, 140, 1)');
    gradient.addColorStop(0.7, 'rgba(110, 120, 135, 0.9)');
    gradient.addColorStop(1, 'rgba(70, 80, 94, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, size, height);
    
    // Ligne de séparation entre panneaux (soudure/rivetage)
    ctx.strokeStyle = 'rgba(50, 60, 75, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + height);
    ctx.lineTo(size, y + height);
    ctx.stroke();
  }

  // Ajouter des rivets/points de fixation - plus nombreux et détaillés
  const rivetSpacing = size / 20;
  for (let y = rivetSpacing / 2; y < size; y += rivetSpacing) {
    for (let x = rivetSpacing / 2; x < size; x += rivetSpacing) {
      // Variation aléatoire pour ne pas être trop régulier
      if (Math.random() > 0.3) continue;
      
      const radius = 3 + Math.random() * 2;
      
      // Ombre du rivet
      ctx.fillStyle = 'rgba(20, 25, 35, 0.8)';
      ctx.beginPath();
      ctx.arc(x + 1, y + 1, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Corps du rivet
      const rivetGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      rivetGradient.addColorStop(0, 'rgba(40, 50, 60, 1)');
      rivetGradient.addColorStop(0.6, 'rgba(25, 35, 45, 1)');
      rivetGradient.addColorStop(1, 'rgba(15, 20, 30, 1)');
      
      ctx.fillStyle = rivetGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Reflet sur le rivet (highlight)
      const highlightGradient = ctx.createRadialGradient(
        x - radius * 0.3, 
        y - radius * 0.3, 
        0, 
        x - radius * 0.3, 
        y - radius * 0.3, 
        radius * 0.5
      );
      highlightGradient.addColorStop(0, 'rgba(180, 190, 200, 0.8)');
      highlightGradient.addColorStop(1, 'rgba(180, 190, 200, 0)');
      
      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ajouter des rayures et usure
  for (let i = 0; i < 30; i++) {
    const x1 = Math.random() * size;
    const y1 = Math.random() * size;
    const x2 = x1 + (Math.random() - 0.5) * 200;
    const y2 = y1 + (Math.random() - 0.5) * 200;
    
    ctx.strokeStyle = `rgba(50, 60, 75, ${0.2 + Math.random() * 0.3})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une texture de béton ULTRA-RÉALISTE avec grain, fissures et usure
 */
export function createConcreteTexture(size: number = 1024): THREE.Texture | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base béton gris avec variations
  const baseColor = { r: 156, g: 163, b: 175 };
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave pour grain réaliste
      const fineNoise = multiOctaveNoise(x / 20, y / 20, 6) * 40;
      const coarseNoise = multiOctaveNoise(x / 100, y / 100, 3) * 20;
      
      // Variations de couleur (agrégats de différentes tailles)
      const aggregateVariation = Math.sin(x / 15) * Math.cos(y / 15) * 8;
      
      data[index] = Math.max(0, Math.min(255, baseColor.r + fineNoise + coarseNoise + aggregateVariation));
      data[index + 1] = Math.max(0, Math.min(255, baseColor.g + fineNoise + coarseNoise + aggregateVariation));
      data[index + 2] = Math.max(0, Math.min(255, baseColor.b + fineNoise + coarseNoise + aggregateVariation));
      data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des agrégats plus gros (cailloux)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 2 + Math.random() * 8;
    const brightness = 0.8 + Math.random() * 0.4;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${Math.floor(baseColor.r * brightness)}, ${Math.floor(baseColor.g * brightness)}, ${Math.floor(baseColor.b * brightness)}, 1)`);
    gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ajouter des fissures réalistes (réseau de fissures)
  for (let i = 0; i < 25; i++) {
    const x1 = Math.random() * size;
    const y1 = Math.random() * size;
    const length = 50 + Math.random() * 200;
    const angle = Math.random() * Math.PI * 2;
    const x2 = x1 + Math.cos(angle) * length;
    const y2 = y1 + Math.sin(angle) * length;
    
    // Fissure principale
    ctx.strokeStyle = `rgba(55, 65, 81, ${0.4 + Math.random() * 0.3})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Branches de fissures
    if (Math.random() > 0.5) {
      const branchLength = length * (0.3 + Math.random() * 0.3);
      const branchAngle = angle + (Math.random() - 0.5) * Math.PI / 3;
      const x3 = x2 + Math.cos(branchAngle) * branchLength;
      const y3 = y2 + Math.sin(branchAngle) * branchLength;
      
      ctx.strokeStyle = `rgba(55, 65, 81, ${0.2 + Math.random() * 0.2})`;
      ctx.lineWidth = 0.5 + Math.random();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    }
  }

  // Ajouter des taches d'humidité/patine
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 30 + Math.random() * 100;
    const alpha = 0.15 + Math.random() * 0.25;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(100, 110, 120, ${alpha})`);
    gradient.addColorStop(1, 'rgba(156, 163, 175, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une texture de sable compacté ULTRA-RÉALISTE avec grain fin et variations
 */
export function createCompactSandTexture(size: number = 1024): THREE.Texture | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base sable beige avec variations réalistes
  const baseColor = { r: 212, g: 165, b: 116 };
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave pour grain réaliste (plusieurs tailles de grains)
      const fineGrain = multiOctaveNoise(x / 10, y / 10, 7) * 25; // Grains très fins
      const mediumGrain = multiOctaveNoise(x / 30, y / 30, 4) * 15; // Grains moyens
      const coarseGrain = multiOctaveNoise(x / 80, y / 80, 3) * 10; // Variations de couleur
      
      // Variations de compactage (zones plus denses = plus sombres)
      const compaction = Math.sin(x / 50) * Math.cos(y / 50) * 5;
      
      data[index] = Math.max(0, Math.min(255, baseColor.r + fineGrain + mediumGrain + coarseGrain + compaction));
      data[index + 1] = Math.max(0, Math.min(255, baseColor.g + fineGrain + mediumGrain + coarseGrain + compaction));
      data[index + 2] = Math.max(0, Math.min(255, baseColor.b + fineGrain + mediumGrain + coarseGrain + compaction));
      data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des variations de couleur (zones plus claires/sombres) - plus réalistes
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 30 + Math.random() * 100;
    const alpha = 0.15 + Math.random() * 0.35;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    if (Math.random() > 0.5) {
      // Zone plus claire (sable sec)
      gradient.addColorStop(0, `rgba(240, 210, 170, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(232, 190, 140, ${alpha * 0.7})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      // Zone plus sombre (sable humide ou compacté)
      gradient.addColorStop(0, `rgba(180, 140, 90, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(160, 120, 80, ${alpha * 0.7})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ajouter des traces de passage (zones roulées)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const width = 50 + Math.random() * 150;
    const height = 20 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const gradient = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    gradient.addColorStop(0, 'rgba(160, 120, 80, 0.3)');
    gradient.addColorStop(0.5, 'rgba(140, 100, 70, 0.5)');
    gradient.addColorStop(1, 'rgba(160, 120, 80, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  }

  // Ajouter des petits cailloux/grains plus gros
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 1 + Math.random() * 3;
    const brightness = 0.7 + Math.random() * 0.6;
    
    ctx.fillStyle = `rgba(${Math.floor(baseColor.r * brightness)}, ${Math.floor(baseColor.g * brightness)}, ${Math.floor(baseColor.b * brightness)}, 0.8)`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une normal map ULTRA-RÉALISTE pour le métal (détails de surface, rayures, usure)
 */
export function createMetalNormalMap(size: number = 1024): THREE.Texture | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base normal map (neutre - bleu/violet standard)
  // Normal map: R = X normalisé (128 = plat), G = Y normalisé (128 = plat), B = Z normalisé (255 = vers la caméra)
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  // Initialiser avec normal plat (face vers la caméra)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128;     // R (X normalisé)
    data[i + 1] = 128; // G (Y normalisé)
    data[i + 2] = 255; // B (Z normalisé - vers la caméra)
    data[i + 3] = 255; // Alpha
  }
  
  // Ajouter des détails de surface avec bruit multi-octave
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit pour variations de profondeur
      const noise = multiOctaveNoise(x / 50, y / 50, 5);
      const depth = (noise - 0.5) * 30; // Variation de profondeur
      
      // Rayures verticales (effet de fabrication)
      const scratchDepth = Math.sin(x / 30) * 15;
      
      // Calculer les normales (simplifié)
      const normalX = 128 + depth * 0.3 + scratchDepth * 0.2;
      const normalY = 128 + depth * 0.3;
      const normalZ = 255 - Math.abs(depth) * 0.5 - Math.abs(scratchDepth) * 0.3;
      
      data[index] = Math.max(0, Math.min(255, normalX));
      data[index + 1] = Math.max(0, Math.min(255, normalY));
      data[index + 2] = Math.max(128, Math.min(255, normalZ));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des rayures de fabrication plus prononcées
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const width = 1 + Math.random() * 2;
    const depth = 20 + Math.random() * 40; // Profondeur de la rayure
    
    // Rayure en creux (normal pointant vers l'intérieur)
    const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, `rgba(128, 128, ${255 - depth}, 1)`);
    gradient.addColorStop(0.5, `rgba(128, 128, ${255 - depth * 1.5}, 1)`);
    gradient.addColorStop(1, `rgba(128, 128, ${255 - depth}, 1)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, width, size);
  }

  // Ajouter des bosses et creux (usure)
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 10 + Math.random() * 30;
    const isBump = Math.random() > 0.5;
    const intensity = 20 + Math.random() * 40;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    if (isBump) {
      // Bosse (normal pointant vers l'extérieur)
      gradient.addColorStop(0, `rgba(128, 128, ${255 + intensity}, 1)`);
      gradient.addColorStop(0.7, `rgba(128, 128, ${255 + intensity * 0.5}, 1)`);
      gradient.addColorStop(1, `rgba(128, 128, 255, 1)`);
    } else {
      // Creux (normal pointant vers l'intérieur)
      gradient.addColorStop(0, `rgba(128, 128, ${255 - intensity}, 1)`);
      gradient.addColorStop(0.7, `rgba(128, 128, ${255 - intensity * 0.5}, 1)`);
      gradient.addColorStop(1, `rgba(128, 128, 255, 1)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crée une roughness map ULTRA-RÉALISTE pour le métal (variations de brillance)
 */
export function createMetalRoughnessMap(size: number = 1024): THREE.Texture | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base roughness (0.6-0.7 pour métal mat industriel)
  // Roughness map: 0 = très lisse/brillant (noir), 255 = très rugueux/mat (blanc)
  const baseRoughness = 0.65;
  const grayValue = Math.floor(baseRoughness * 255);
  
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      
      // Bruit multi-octave pour variations réalistes
      const noise = multiOctaveNoise(x / 60, y / 60, 4);
      const variation = (noise - 0.5) * 40;
      
      // Zones plus lisses (rayures polies)
      const polishFactor = Math.abs(Math.sin(x / 40)) * 20;
      
      // Zones plus rugueuses (usure, patine)
      const wearFactor = multiOctaveNoise(x / 150, y / 150, 3) * 15;
      
      const value = Math.max(100, Math.min(220, grayValue + variation - polishFactor + wearFactor));
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);

  // Ajouter des zones polies (rayures brillantes)
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const width = 2 + Math.random() * 4;
    const smoothness = 30 + Math.random() * 40; // Réduction de roughness (plus lisse)
    
    const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
    gradient.addColorStop(0, `rgba(${grayValue - smoothness}, ${grayValue - smoothness}, ${grayValue - smoothness}, 1)`);
    gradient.addColorStop(0.5, `rgba(${grayValue - smoothness * 1.2}, ${grayValue - smoothness * 1.2}, ${grayValue - smoothness * 1.2}, 1)`);
    gradient.addColorStop(1, `rgba(${grayValue - smoothness}, ${grayValue - smoothness}, ${grayValue - smoothness}, 1)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, 0, width, size);
  }

  // Ajouter des zones rugueuses (patine, oxydation)
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 20 + Math.random() * 60;
    const roughness = 20 + Math.random() * 40; // Augmentation de roughness
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${Math.min(255, grayValue + roughness)}, ${Math.min(255, grayValue + roughness)}, ${Math.min(255, grayValue + roughness)}, 1)`);
    gradient.addColorStop(0.7, `rgba(${Math.min(255, grayValue + roughness * 0.7)}, ${Math.min(255, grayValue + roughness * 0.7)}, ${Math.min(255, grayValue + roughness * 0.7)}, 1)`);
    gradient.addColorStop(1, `rgba(${grayValue}, ${grayValue}, ${grayValue}, 1)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
