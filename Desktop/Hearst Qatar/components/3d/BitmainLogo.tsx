import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { PlaneGeometry, TextureLoader } from 'three';
import * as THREE from 'three';

interface BitmainLogoProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width?: number;
}

/**
 * Composant logo BITMAIN avec texture chargée
 * Utilise useLoader pour charger la texture
 */
export default function BitmainLogo({
  position,
  rotation,
  width = 1.8,
}: BitmainLogoProps) {
  // Essayer de charger le logo Bitmain, sinon créer un logo texte
  let bitmainLogo: THREE.Texture | null = null;
  
  try {
    bitmainLogo = useLoader(TextureLoader, '/BITMAIN_LOGO.png');
  } catch (e) {
    // Si le logo n'existe pas, créer un logo texte dynamique
    bitmainLogo = null;
  }
  
  const logoHeight = useMemo(() => {
    if (bitmainLogo && bitmainLogo.image) {
      const img = bitmainLogo.image as HTMLImageElement | HTMLCanvasElement;
      if (img && typeof img.width === 'number' && typeof img.height === 'number' && img.width > 0) {
        return (width * img.height) / img.width;
      }
    }
    return 0.4; // Hauteur par défaut pour logo texte
  }, [bitmainLogo, width]);
  
  const logoGeometry = useMemo(() => new PlaneGeometry(width, logoHeight), [width, logoHeight]);

  // Si pas de texture, créer un logo texte avec Canvas
  const textTexture = useMemo(() => {
    if (bitmainLogo) return null; // Utiliser la texture si disponible
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fond transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Texte "BITMAIN" en blanc
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BITMAIN', canvas.width / 2, canvas.height / 2);
      
      // Créer la texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    return null;
  }, [bitmainLogo]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={logoGeometry}
    >
      <meshStandardMaterial
        map={bitmainLogo || textTexture}
        transparent
        opacity={bitmainLogo ? 1 : 0.9}
        side={THREE.FrontSide}
        depthWrite={true}
        depthTest={true}
        emissive={bitmainLogo ? '#000000' : '#ffffff'}
        emissiveIntensity={bitmainLogo ? 0 : 0.1}
      />
    </mesh>
  );
}
