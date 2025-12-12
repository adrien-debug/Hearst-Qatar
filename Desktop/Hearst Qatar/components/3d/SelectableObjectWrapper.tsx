import { useRef, useEffect } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface SelectableObjectWrapperProps {
  id: string;
  position: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
  color?: string;
  onObjectRef?: (ref: any) => void;
  children: React.ReactNode;
}

/**
 * Wrapper pour rendre n'importe quel objet sélectionnable et éditable
 */
export default function SelectableObjectWrapper({
  id,
  position,
  rotation = 0,
  scale = [1, 1, 1],
  color,
  onObjectRef,
  children,
}: SelectableObjectWrapperProps) {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.selectableId = id;
      groupRef.current.name = id; // Ajouter aussi le name pour la compatibilité avec DeleteTool3D
      groupRef.current.userData.type = id.includes('Substation') ? 'substation' :
                                       id.startsWith('PowerBlock') ? 'powerblock' :
                                       id.startsWith('PB') && id.includes('_TR') ? 'transformer' :
                                       id.includes('HD5') ? 'container' :
                                       id.includes('SG') ? 'switchgear' : 'other';
      
      if (onObjectRef) {
        onObjectRef(groupRef);
      }
    }
  }, [id, onObjectRef]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.y = rotation;
      groupRef.current.scale.set(...scale);
    }
  }, [position, rotation, scale]);

  // Appliquer la couleur aux matériaux enfants si fournie
  useEffect(() => {
    if (groupRef.current && color) {
      const colorHex = parseInt(color.replace('#', ''), 16);
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = Array.isArray(child.material) ? child.material[0] : child.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color.setHex(colorHex);
          }
        }
      });
    }
  }, [color]);

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

