import { useRef, useMemo, useEffect } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createAdvancedMetalMaterial } from '../../utils/materialHelpers';

interface TransformerInstance {
  id: string;
  position: [number, number, number];
  isSelected?: boolean;
}

interface TransformerInstancedProps {
  instances: TransformerInstance[];
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

// Dimensions approximatives du transformateur
const TRANSFORMER_WIDTH = 3;
const TRANSFORMER_HEIGHT = 2.5;
const TRANSFORMER_DEPTH = 2.5;

/**
 * Version instanciée des transformateurs pour réduire les draw calls
 * 24 transformateurs → 1 draw call au lieu de 24
 */
export default function TransformerInstanced({
  instances,
  onSelect,
  selectedObject,
}: TransformerInstancedProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useMemo(() => new Object3D(), []);
  const { raycaster, camera, gl } = useThree();

  // Matériau vert industriel
  const transformerMaterial = useMemo(() => {
    return createAdvancedMetalMaterial('#059669', 0.2, 0.5);
  }, []);

  // Mettre à jour les matrices de transformation
  useEffect(() => {
    if (!meshRef.current) return;

    instances.forEach((instance, i) => {
      tempObject.position.set(...instance.position);
      tempObject.position.y += TRANSFORMER_HEIGHT / 2;
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
    return new THREE.BoxGeometry(TRANSFORMER_WIDTH, TRANSFORMER_HEIGHT, TRANSFORMER_DEPTH);
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, transformerMaterial, instances.length]}
      castShadow
      receiveShadow
    />
  );
}
