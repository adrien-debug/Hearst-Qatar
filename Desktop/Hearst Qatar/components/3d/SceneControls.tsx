import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SceneControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  enablePan?: boolean;
  enableZoom?: boolean;
  enableRotate?: boolean;
}

/**
 * Composant de contrôles de caméra - Navigation libre sans restrictions
 */
export default function SceneControls({
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 1,
  maxDistance = Infinity,
  enablePan = true,
  enableZoom = true,
  enableRotate = true,
}: SceneControlsProps) {
  const controlsRef = useRef<any>(null);


  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 15, -100]} // Target centré sur la scène (entre containers au premier plan et substation au fond)
      enablePan={enablePan}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
      minDistance={minDistance}
      maxDistance={maxDistance}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      dampingFactor={0.15}
      enableDamping={true}
      makeDefault
    />
  );
}
