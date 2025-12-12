import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import { Hierarchical3DConfig } from '../../config/hierarchical3d.config';
import { TerminalModule } from '../../data/hierarchicalStructure';

interface TerminalModule3DProps {
  module: TerminalModule;
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

export default function TerminalModule3D({
  module,
  onSelect,
  selectedObject,
}: TerminalModule3DProps) {
  const groupRef = useRef<Group>(null);
  const config = Hierarchical3DConfig.terminalModules;
  const statusConfig = Hierarchical3DConfig.status[module.status];
  const statusIndicatorsConfig = Hierarchical3DConfig.statusIndicators;
  const isSelected = selectedObject === module.id;

  const handleClick = () => {
    if (onSelect) {
      onSelect(module.id);
    }
  };

  // Couleur du module selon le statut
  const moduleColor = isSelected ? '#4a9eff' : statusConfig.color;

  return (
    <group
      ref={groupRef}
      position={module.position}
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      {/* Module rectangulaire principal */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[config.width, config.height, config.depth]} />
        <meshStandardMaterial
          color={moduleColor}
          metalness={0.3}
          roughness={0.6}
          emissive={isSelected ? '#1e40af' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Contour noir */}
      <line>
        <edgesGeometry args={[new THREE.BoxGeometry(config.width, config.height, config.depth)]} />
        <lineBasicMaterial color={config.borderColor} linewidth={2} />
      </line>

      {/* Ligne horizontale gris foncé au milieu */}
      <mesh position={[0, config.middleLine.position.y, config.depth / 2 + 0.01]}>
        <boxGeometry args={[config.middleLine.width, config.middleLine.height, 0.05]} />
        <meshStandardMaterial color={config.middleLineColor} />
      </mesh>

      {/* Petite fenêtre carrée noire dans la partie supérieure */}
      <mesh
        position={[
          config.window.position.x,
          config.height / 2 - config.window.position.y,
          config.depth / 2 + config.window.position.z,
        ]}
      >
        <boxGeometry args={[config.window.size, config.window.size, 0.05]} />
        <meshStandardMaterial color={config.windowColor} />
      </mesh>

      {/* Indicateur d'état (point rouge) si nécessaire */}
      {module.hasRedIndicator && (
        <mesh
          position={[
            statusIndicatorsConfig.position.x,
            config.height / 2 - statusIndicatorsConfig.position.y,
            config.depth / 2 + statusIndicatorsConfig.position.z,
          ]}
        >
          <sphereGeometry
            args={[
              statusIndicatorsConfig.size,
              16,
              16,
            ]}
          />
          <meshStandardMaterial
            color={statusIndicatorsConfig.color}
            emissive={statusIndicatorsConfig.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}
