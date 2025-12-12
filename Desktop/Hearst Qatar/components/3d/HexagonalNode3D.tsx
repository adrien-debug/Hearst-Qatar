import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import { Hierarchical3DConfig } from '../../config/hierarchical3d.config';
import { HexagonalNode } from '../../data/hierarchicalStructure';

interface HexagonalNode3DProps {
  node: HexagonalNode;
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

export default function HexagonalNode3D({
  node,
  onSelect,
  selectedObject,
}: HexagonalNode3DProps) {
  const groupRef = useRef<Group>(null);
  const config = Hierarchical3DConfig.hexagonalNodes;
  const isSelected = selectedObject === node.id;

  const handleClick = () => {
    if (onSelect) {
      onSelect(node.id);
    }
  };

  // Créer la géométrie hexagonale
  const shape = new THREE.Shape();
  const radius = config.radius;
  
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();

  const extrudeSettings = {
    depth: config.depth,
    bevelEnabled: false,
  };

  return (
    <group
      ref={groupRef}
      position={node.position}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      {/* Hexagone principal */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={isSelected ? '#4a9eff' : config.color}
          metalness={0.3}
          roughness={0.6}
          emissive={isSelected ? '#1e40af' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Contour noir */}
      <line>
        <edgesGeometry args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]} />
        <lineBasicMaterial color={config.borderColor} linewidth={2} />
      </line>

      {/* Ombre grise (légèrement décalée) */}
      <mesh position={[0.1, -0.1, -0.05]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={config.shadowColor}
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Symbole d'éclair noir */}
      <group position={[0, 0, config.depth / 2 + 0.01]}>
        {/* Éclair stylisé */}
        <mesh>
          <shapeGeometry args={[createLightningShape(config.lightningSymbol.size)]} />
          <meshStandardMaterial
            color={config.lightningSymbol.color}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Crée la forme d'un éclair
 */
function createLightningShape(size: number): THREE.Shape {
  const shape = new THREE.Shape();
  const scale = size;
  
  // Forme d'éclair simplifiée
  shape.moveTo(0, scale * 0.5);
  shape.lineTo(-scale * 0.3, scale * 0.2);
  shape.lineTo(-scale * 0.1, scale * 0.1);
  shape.lineTo(scale * 0.1, -scale * 0.1);
  shape.lineTo(scale * 0.3, -scale * 0.2);
  shape.lineTo(0, -scale * 0.5);
  shape.lineTo(-scale * 0.2, -scale * 0.3);
  shape.lineTo(-scale * 0.1, -scale * 0.1);
  shape.lineTo(scale * 0.1, scale * 0.1);
  shape.lineTo(scale * 0.2, scale * 0.3);
  shape.closePath();
  
  return shape;
}
