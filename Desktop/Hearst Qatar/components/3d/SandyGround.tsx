import { useRef, useMemo, useEffect } from 'react';
import { Mesh, PlaneGeometry } from 'three';
import * as THREE from 'three';
import { createCompactSandTexture } from '../../utils/textureHelpers';
import { getOptimalTextureSize } from '../../utils/textureCache';
import { progressiveTextureLoader } from '../../utils/progressiveTextureLoader';
import { safeAssignTexture } from '../../utils/materialHelpers';

interface SandyGroundProps {
  size?: number;
  position?: [number, number, number];
}

/**
 * Composant sol sablonneux ULTRA-RÉALISTE pour le site Qatar
 * Sol sable compacté beige avec textures haute résolution
 */
export default function SandyGround({ 
  size = 500, 
  position = [0, 0, 0] 
}: SandyGroundProps) {
  const meshRef = useRef<Mesh>(null);

  // Créer la géométrie simple et plate pour le sol (sans déformations pour éviter les problèmes de visibilité)
  const geometry = useMemo(() => {
    const segments = 20; // Subdivisions pour un sol lisse
    const geo = new PlaneGeometry(size, size, segments, segments);
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  // Matériau avec texture optimisée et cache
  const material = useMemo(() => {
    let textureSize = 512;
    try {
      if (typeof window !== 'undefined') {
        textureSize = getOptimalTextureSize();
      }
    } catch (e) {
      // Utiliser valeur par défaut
    }
    
    const mat = new THREE.MeshStandardMaterial({
      color: "#D4A574",
      roughness: 0.9,
      metalness: 0.0,
      flatShading: false,
      side: THREE.DoubleSide,
      depthWrite: true,
      depthTest: true,
      wireframe: false,
      emissive: "#E8C99A",
      emissiveIntensity: 0.15,
    });

    // Charger texture de sable de manière progressive (haute priorité car visible immédiatement)
    if (typeof window !== 'undefined') {
      progressiveTextureLoader.loadProgressive(
        () => createCompactSandTexture(256) || new THREE.Texture(),
        () => createCompactSandTexture(textureSize) || new THREE.Texture(),
        `sand_ground_${textureSize}`,
        { priority: 'high', lowResSize: 256, highResSize: textureSize }
      ).then((texture) => {
        if (texture && texture.image) {
          safeAssignTexture(mat, 'map', texture);
          mat.needsUpdate = true;
        }
      }).catch(() => {
        // Ignorer les erreurs
      });
    }

    return mat;
  }, []);

  
  return (
    <>
      {/* Sol principal - PlaneGeometry horizontal */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position[0], 0, position[2]]}
        receiveShadow
        castShadow={false}
        visible={true}
        frustumCulled={false}
      >
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* Sol de secours avec BoxGeometry pour avoir une épaisseur visible si le plan ne fonctionne pas */}
      <mesh
        position={[position[0], -0.1, position[2]]}
        rotation={[0, 0, 0]}
        receiveShadow
        castShadow={false}
        visible={true}
      >
        <boxGeometry args={[size, 0.2, size]} />
        <primitive object={material} attach="material" />
      </mesh>
    </>
  );
}
