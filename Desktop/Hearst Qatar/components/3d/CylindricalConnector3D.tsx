import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import { Hierarchical3DConfig } from '../../config/hierarchical3d.config';
import { CylindricalConnector, TerminalModule } from '../../data/hierarchicalStructure';

interface CylindricalConnector3DProps {
  connector: CylindricalConnector;
  leftModule: TerminalModule;
  rightModule: TerminalModule;
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

export default function CylindricalConnector3D({
  connector,
  leftModule,
  rightModule,
  onSelect,
  selectedObject,
}: CylindricalConnector3DProps) {
  const groupRef = useRef<Group>(null);
  const config = Hierarchical3DConfig.cylindricalConnectors;
  const connectionConfig = Hierarchical3DConfig.connections;
  const isSelected = selectedObject === connector.id;

  const handleClick = () => {
    if (onSelect) {
      onSelect(connector.id);
    }
  };

  // Position du connecteur (au centre entre les deux modules)
  const connectorX = connector.position[0];
  const connectorY = connector.position[1];
  const connectorZ = connector.position[2];

  // Positions des modules
  const leftX = leftModule.position[0];
  const rightX = rightModule.position[0];
  const moduleY = leftModule.position[1];
  const moduleZ = leftModule.position[2];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ligne verticale noire fine descendant vers le connecteur */}
      {/* Cette ligne part du nœud hexagonal au-dessus (à implémenter dans le composant parent) */}
      
      {/* Connecteur cylindrique gris métallique */}
      <mesh
        position={[connectorX, connectorY, connectorZ]}
        castShadow
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <cylinderGeometry
          args={[
            config.diameter / 2,
            config.diameter / 2,
            config.length,
            16,
          ]}
        />
        <meshStandardMaterial
          color={isSelected ? '#4a9eff' : config.color}
          metalness={0.8}
          roughness={0.2}
          emissive={isSelected ? '#1e40af' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Ligne horizontale noire fine vers le module gauche */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              connectorX, connectorY, connectorZ,
              leftX, connectorY, connectorZ,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={connectionConfig.lineColor}
          linewidth={connectionConfig.lineThickness * 10}
        />
      </line>

      {/* Ligne horizontale noire fine vers le module droit */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              connectorX, connectorY, connectorZ,
              rightX, connectorY, connectorZ,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={connectionConfig.lineColor}
          linewidth={connectionConfig.lineThickness * 10}
        />
      </line>
    </group>
  );
}
