import { useMemo, useState, useEffect } from 'react';
import { PlaneGeometry } from 'three';
import * as THREE from 'three';
import { texturePreloader } from '../../utils/texturePreloader';

interface HearstLogoProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width?: number;
}

/**
 * Composant logo HEARST avec texture préchargée depuis le cache global
 * Utilise texturePreloader pour éviter de charger la même texture 48 fois
 */
export default function HearstLogo({
  position,
  rotation,
  width = 1.8,
}: HearstLogoProps) {
  const [hearstLogo, setHearstLogo] = useState<THREE.Texture | null>(null);
  
  // Charger la texture depuis le cache global
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Essayer d'obtenir depuis le cache
    const cachedTexture = texturePreloader.getTexture('/HEARST_LOGO.png');
    
    if (cachedTexture) {
      // Texture déjà en cache
      console.log('✅ Logo HEARST chargé depuis le cache');
      setHearstLogo(cachedTexture);
    } else {
      // Charger la texture (sera mis en cache automatiquement)
      console.log('⏳ Chargement du logo HEARST...');
      texturePreloader.loadTexture('/HEARST_LOGO.png').then(texture => {
        console.log('✅ Logo HEARST chargé avec succès');
        setHearstLogo(texture);
      }).catch(error => {
        console.error('❌ Erreur de chargement du logo HEARST:', error);
      });
    }
  }, []);
  
  const logoHeight = useMemo(() => {
    if (hearstLogo && hearstLogo.image) {
      return (width * hearstLogo.image.height) / hearstLogo.image.width;
    }
    return width * 0.25; // Ratio par défaut
  }, [hearstLogo, width]);
  
  const logoGeometry = useMemo(() => new PlaneGeometry(width, logoHeight), [width, logoHeight]);

  // Si la texture n'est pas encore chargée, ne rien rendre
  if (!hearstLogo) {
    return null;
  }

  // Configurer la texture pour une meilleure visibilité
  hearstLogo.flipY = false;
  hearstLogo.needsUpdate = true;

  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={logoGeometry}
      renderOrder={999}
    >
      <meshBasicMaterial
        map={hearstLogo}
        transparent={true}
        opacity={1}
        side={THREE.DoubleSide}
        depthWrite={true}
        depthTest={true}
        toneMapped={false}
      />
    </mesh>
  );
}

