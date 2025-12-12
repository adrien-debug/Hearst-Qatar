import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene3DConfig } from '../../config/3d.config';
import AutoPlacedScene3D from './AutoPlacedScene3D';
import SceneLighting from './Lighting';
import SandyGround from './SandyGround';
import EnvironmentHDRI from './EnvironmentHDRI';
import AnimatedCameraController from './AnimatedCameraController';
import SceneControls from './SceneControls';
import WebGLErrorBoundary from './ErrorBoundary';
import IntroOverlay from './IntroOverlay';
import * as THREE from 'three';

/**
 * Composant wrapper pour la scène 3D de la page Overview
 * Affiche une animation automatique de caméra en boucle
 */
export default function Overview3DScene() {
  const [show3D, setShow3D] = useState(false);

  const handleFadeComplete = () => {
    setShow3D(true);
  };

  return (
    <WebGLErrorBoundary
      fallback={
        <div className="w-full h-[400px] bg-[#f8f9fa] rounded-[8px] flex items-center justify-center">
          <p className="text-[#64748b] text-sm">
            Visualisation 3D non disponible
          </p>
        </div>
      }
    >
      <div className="relative w-full h-[400px] rounded-[8px] overflow-hidden bg-gray-900">
        {/* Overlay d'introduction avec logo Hearst et Qatar */}
        {!show3D && <IntroOverlay onFadeComplete={handleFadeComplete} />}
        
        {/* Scène 3D - chargée en arrière-plan, visible après le fondu */}
        <div className={show3D ? 'opacity-100' : 'opacity-0 pointer-events-none'} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <Canvas
          camera={{
            position: [0, 100, -250], // Position initiale vue d'ensemble montrant les logos Hearst
            fov: Scene3DConfig.camera.fov,
            near: 0.1,
            far: 2000,
          }}
          shadows={true}
          style={{ width: '100%', height: '100%', display: 'block' }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.3,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
          frameloop="always" // Animation continue
        >
          {/* Contrôleur de caméra animé */}
          <AnimatedCameraController />

          {/* Éclairage optimisé */}
          <SceneLighting />

          {/* Sol sablonneux */}
          <SandyGround size={1000} position={[0, 0, 0]} />

          {/* Scène avec placement automatique (comme substation-3d-auto) */}
          <Suspense fallback={null}>
            <AutoPlacedScene3D />
          </Suspense>

          {/* Environnement HDRI */}
          <EnvironmentHDRI />

          {/* Contrôles désactivés pour l'animation automatique */}
          <SceneControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Canvas>
        </div>
      </div>
    </WebGLErrorBoundary>
  );
}

