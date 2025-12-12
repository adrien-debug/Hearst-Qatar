import { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createAdvancedMetalMaterial } from '../../utils/materialHelpers';

interface SwitchgearInstance {
  id: string;
  position: [number, number, number];
  isSelected?: boolean;
}

interface SwitchgearInstancedProps {
  instances: SwitchgearInstance[];
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

// Dimensions du switchgear
const SWITCHGEAR_WIDTH = 2;
const SWITCHGEAR_HEIGHT = 2;
const SWITCHGEAR_DEPTH = 1.5;

/**
 * Version instanciée des switchgears pour réduire les draw calls
 * 24 switchgears → 1 draw call au lieu de 24
 */
export default function SwitchgearInstanced({
  instances,
  onSelect,
  selectedObject,
}: SwitchgearInstancedProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useMemo(() => new Object3D(), []);
  const { raycaster, camera, gl } = useThree();

  // Matériau gris industriel
  const switchgearMaterial = useMemo(() => {
    return createAdvancedMetalMaterial('#9ca3af', 0.5, 0.6);
  }, []);

  // Mettre à jour les matrices de transformation
  useEffect(() => {
    if (!meshRef.current) return;

    instances.forEach((instance, i) => {
      tempObject.position.set(...instance.position);
      tempObject.position.y += SWITCHGEAR_HEIGHT / 2;
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [instances, selectedObject, tempObject]);

  // Gérer les clics
  useEffect(() => {
    if (!onSelect) return;

    const handleClick = (event: MouseEvent) => {
      if (!meshRef.current) return;

      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current);
      
      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        const instanceId = intersects[0].instanceId;
        if (instances[instanceId]) {
          onSelect(instances[instanceId].id);
        }
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [instances, onSelect, raycaster, camera, gl]);

  const geometry = useMemo(() => {
    return new THREE.BoxGeometry(SWITCHGEAR_WIDTH, SWITCHGEAR_HEIGHT, SWITCHGEAR_DEPTH);
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, switchgearMaterial, instances.length]}
      castShadow
      receiveShadow
    />
  );
}
