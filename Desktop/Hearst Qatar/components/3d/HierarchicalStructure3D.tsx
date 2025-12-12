import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import DistributionHub3D from './DistributionHub3D';
import HexagonalNode3D from './HexagonalNode3D';
import TerminalModule3D from './TerminalModule3D';
import CylindricalConnector3D from './CylindricalConnector3D';
import { HierarchicalStructure } from '../../data/hierarchicalStructure';
import { Hierarchical3DConfig } from '../../config/hierarchical3d.config';

interface HierarchicalStructure3DProps {
  structure: HierarchicalStructure;
  onObjectClick?: (objectName: string) => void;
  selectedObject?: string | null;
}

export default function HierarchicalStructure3D({
  structure,
  onObjectClick,
  selectedObject,
}: HierarchicalStructure3DProps) {
  const groupRef = useRef<Group>(null);
  const connectionConfig = Hierarchical3DConfig.connections;

  // Créer les lignes verticales depuis les nœuds hexagonaux vers les connecteurs
  const createVerticalConnections = () => {
    const lines: JSX.Element[] = [];
    
    structure.nodes.forEach((node) => {
      // Trouver tous les connecteurs de cette colonne
      const columnConnectors = structure.connectors.filter(
        (connector) => connector.column === node.column
      );

      columnConnectors.forEach((connector) => {
        const startY = node.position[1] - Hierarchical3DConfig.hexagonalNodes.height / 2;
        const endY = connector.position[1] + Hierarchical3DConfig.cylindricalConnectors.length / 2;
        const x = node.position[0];
        const z = 0;

        // Créer la ligne verticale
        const points = [
          new THREE.Vector3(x, startY, z),
          new THREE.Vector3(x, endY, z),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        lines.push(
          <primitive 
            key={`vertical-${node.id}-${connector.id}`} 
            object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
              color: connectionConfig.lineColor,
              linewidth: connectionConfig.lineThickness * 10,
            }))} 
          />
        );
      });
    });

    return lines;
  };

  return (
    <group ref={groupRef}>
      {/* Unité de Distribution Supérieure */}
      <DistributionHub3D
        position={structure.distributionHub.position}
        modules={structure.distributionHub.modules}
        onSelect={onObjectClick}
        selectedObject={selectedObject}
      />

      {/* Nœuds Hexagonaux Intermédiaires */}
      {structure.nodes.map((node) => (
        <HexagonalNode3D
          key={node.id}
          node={node}
          onSelect={onObjectClick}
          selectedObject={selectedObject}
        />
      ))}

      {/* Lignes verticales depuis les nœuds vers les connecteurs */}
      {createVerticalConnections()}

      {/* Modules Terminaux */}
      {structure.terminalModules.map((module) => (
        <TerminalModule3D
          key={module.id}
          module={module}
          onSelect={onObjectClick}
          selectedObject={selectedObject}
        />
      ))}

      {/* Connecteurs Cylindriques */}
      {structure.connectors.map((connector) => {
        // Trouver les modules connectés
        const leftModule = structure.terminalModules.find(
          (m) => m.id === connector.connectedModules[0]
        );
        const rightModule = structure.terminalModules.find(
          (m) => m.id === connector.connectedModules[1]
        );

        if (!leftModule || !rightModule) return null;

        return (
          <CylindricalConnector3D
            key={connector.id}
            connector={connector}
            leftModule={leftModule}
            rightModule={rightModule}
            onSelect={onObjectClick}
            selectedObject={selectedObject}
          />
        );
      })}
    </group>
  );
}
