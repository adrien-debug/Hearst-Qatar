import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import { Hierarchical3DConfig } from '../../config/hierarchical3d.config';
import { DistributionHubModule } from '../../data/hierarchicalStructure';

interface DistributionHub3DProps {
  position: [number, number, number];
  modules: DistributionHubModule[];
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
}

export default function DistributionHub3D({
  position,
  modules,
  onSelect,
  selectedObject,
}: DistributionHub3DProps) {
  const groupRef = useRef<Group>(null);
  const config = Hierarchical3DConfig.distributionHub;

  const handleClick = (moduleId: string) => {
    if (onSelect) {
      onSelect(moduleId);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Structure horizontale principale (rail/bus gris foncé) */}
      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[config.horizontalStructure.length, config.horizontalStructure.height, config.horizontalStructure.width]} />
        <meshStandardMaterial
          color={config.horizontalStructure.color}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* 5 modules rectangulaires montés sur la structure */}
      {modules.map((module) => {
        const isSelected = selectedObject === module.id;
        return (
          <group key={module.id}>
            <mesh
              position={module.position}
              castShadow
              receiveShadow
              onClick={() => handleClick(module.id)}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'default'}
            >
              <boxGeometry args={[config.modules.width, config.modules.height, config.modules.depth]} />
              <meshStandardMaterial
                color={isSelected ? '#4a9eff' : config.modules.color}
                metalness={0.3}
                roughness={0.6}
                emissive={isSelected ? '#1e40af' : '#000000'}
                emissiveIntensity={isSelected ? 0.2 : 0}
              />
            </mesh>

            {/* Bordure noire */}
            <mesh position={[module.position[0], module.position[1], module.position[2] + config.modules.depth / 2 + 0.01]}>
              <boxGeometry args={[config.modules.width + 0.1, config.modules.height + 0.1, 0.05]} />
              <meshStandardMaterial color={config.modules.borderColor} />
            </mesh>

            {/* Centre gris-bleu */}
            <mesh position={[module.position[0], module.position[1], module.position[2] + 0.01]}>
              <boxGeometry args={[config.modules.width * 0.6, config.modules.height * 0.6, 0.02]} />
              <meshStandardMaterial
                color={config.modules.centerColor}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* Connecteur vertical central (noir épais) */}
      <mesh
        position={[0, -config.centralConnector.length / 2, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            config.centralConnector.diameter / 2,
            config.centralConnector.diameter / 2,
            config.centralConnector.length,
            16,
          ]}
        />
        <meshStandardMaterial
          color={config.centralConnector.color}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* 4 lignes de distribution courbes (vert foncé) */}
      {Array.from({ length: config.distributionLines.count }).map((_, i) => {
        const nodeStartX = -(Hierarchical3DConfig.hexagonalNodes.count - 1) * Hierarchical3DConfig.hexagonalNodes.spacing / 2;
        const targetX = nodeStartX + i * Hierarchical3DConfig.hexagonalNodes.spacing;
        const curveHeight = config.distributionLines.curveHeight;

        // Créer une courbe de Bézier pour la ligne
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, -config.centralConnector.length, 0), // Point de départ (bas du connecteur central)
          new THREE.Vector3(targetX / 2, -config.centralConnector.length - curveHeight, 0), // Point de contrôle (milieu avec courbe)
          new THREE.Vector3(targetX, -config.centralConnector.length, 0) // Point d'arrivée (nœud hexagonal)
        );

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive key={`distribution-line-${i}`} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: config.distributionLines.color,
            linewidth: config.distributionLines.thickness * 10,
          }))} />
        );
      })}
    </group>
  );
}
