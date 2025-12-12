import { useMemo, useRef, useEffect } from 'react';
import { DirectionalLight, AmbientLight, PointLight, HemisphereLight } from 'three';
import { useHelper } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { qualityManager } from '../../utils/qualityManager';

/**
 * Configuration d'éclairage désertique ultra-réaliste pour le site Qatar
 * Éclairage PBR avancé avec ombres haute qualité et réflexions
 */
export default function SceneLighting() {
  // Références pour les helpers de debug (optionnel)
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const { gl } = useThree();

  // Obtenir les paramètres de qualité
  const qualitySettings = useMemo(() => qualityManager.getSettings(), []);
  const shadowMapSize = qualitySettings.shadowMapSize;

  // Mettre à jour les shadow maps selon la qualité
  useEffect(() => {
    if (mainLightRef.current) {
      mainLightRef.current.shadow.mapSize.width = shadowMapSize;
      mainLightRef.current.shadow.mapSize.height = shadowMapSize;
      mainLightRef.current.shadow.map?.dispose();
      mainLightRef.current.shadow.needsUpdate = true;
    }
    if (fillLightRef.current) {
      fillLightRef.current.shadow.mapSize.width = Math.max(512, shadowMapSize / 2);
      fillLightRef.current.shadow.mapSize.height = Math.max(512, shadowMapSize / 2);
      fillLightRef.current.shadow.map?.dispose();
      fillLightRef.current.shadow.needsUpdate = true;
    }
  }, [shadowMapSize]);

  // Activer les helpers en développement (désactiver en production)
  // useHelper(mainLightRef, THREE.DirectionalLightHelper, 5, '#ff0000');

  return (
    <>
      {/* Lumière ambiante réduite pour plus de contraste */}
      <ambientLight intensity={0.25} color="#ffebcd" />
      
      {/* Lumière hémisphérique pour simulation ciel désertique réaliste */}
      <hemisphereLight
        args={["#fff5e6", "#d4a574", 0.8]}
      />
      
      {/* Lumière directionnelle principale (soleil intense du désert) - Ombres adaptatives */}
      <directionalLight
        ref={mainLightRef}
        position={[50, 100, 30]}
        intensity={3.5}
        color="#fff8dc"
        castShadow={true}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-near={0.1}
        shadow-camera-far={800}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      
      {/* Lumière directionnelle secondaire (remplissage chaud) - Ombres adaptatives */}
      <directionalLight
        ref={fillLightRef}
        position={[-30, 40, -20]}
        intensity={1.2}
        color="#ffe4b5"
        castShadow={true}
        shadow-mapSize-width={Math.max(512, shadowMapSize / 2)}
        shadow-mapSize-height={Math.max(512, shadowMapSize / 2)}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      
      {/* Lumière ponctuelle pour éclairage supplémentaire (ton chaud) */}
      <pointLight
        position={[0, 80, 0]}
        intensity={0.8}
        distance={400}
        decay={2}
        color="#fff8dc"
        castShadow={false}
      />
      
      {/* Lumière de remplissage pour réduire les ombres dures */}
      <directionalLight
        position={[20, 20, 20]}
        intensity={0.5}
        color="#fff5e6"
        castShadow={false}
      />
      
      {/* Lumière de rim (contour) pour séparer les objets du fond */}
      <directionalLight
        position={[-50, 20, -50]}
        intensity={0.3}
        color="#fff8dc"
        castShadow={false}
      />
    </>
  );
}
