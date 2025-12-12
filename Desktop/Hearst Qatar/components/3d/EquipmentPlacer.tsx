import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { EquipmentType } from './EquipmentPlacementPanel';
import * as THREE from 'three';
import HD5ContainerUltraSimplified from './HD5ContainerUltraSimplified';
import Transformer3D from './Transformer3D';
import Switchgear3D from './Switchgear3D';

interface PlacedEquipment {
  id: string;
  type: EquipmentType;
  position: [number, number, number];
}

interface EquipmentPlacerProps {
  placementMode: EquipmentType;
  placedEquipment: PlacedEquipment[];
  onPlaceEquipment: (type: EquipmentType, position: [number, number, number]) => void;
  onMouseMove?: (position: { x: number; y: number } | null) => void;
  alwaysRender?: boolean; // Pour toujours afficher les équipements placés
}

export default function EquipmentPlacer({
  placementMode,
  placedEquipment,
  onPlaceEquipment,
  onMouseMove,
  alwaysRender = false,
}: EquipmentPlacerProps) {
  const { raycaster, camera, scene, gl } = useThree();
  const groundRef = useRef<THREE.Mesh>(null);
  const previewRef = useRef<THREE.Group>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Gérer le mouvement de la souris - avec throttle pour éviter les surcharges
  useEffect(() => {
    let lastCall = 0;
    const throttleDelay = 100; // 10 fois par seconde max

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastCall < throttleDelay) return;
      lastCall = now;

      mousePosition.current = { x: event.clientX, y: event.clientY };
      // Ne pas appeler onMouseMove à chaque mouvement pour éviter les re-renders
      // onMouseMove sera appelé seulement quand nécessaire
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl]);

  // Gérer les clics pour placer les équipements
  useEffect(() => {
    if (placementMode === 'none') return;

    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Intersecter avec le sol (plan Y=0)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      if (intersection) {
        onPlaceEquipment(placementMode, [intersection.x, 0, intersection.z]);
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [placementMode, raycaster, camera, gl, onPlaceEquipment]);

  // Afficher un aperçu de l'équipement à placer - avec limitation de fréquence
  const lastUpdateRef = useRef(0);
  useFrame((state, delta) => {
    if (placementMode === 'none' || !previewRef.current) return;

    // Limiter les mises à jour à 10 fois par seconde max
    const now = Date.now();
    if (now - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = now;

    try {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((mousePosition.current.x - rect.left) / rect.width) * 2 - 1;
      const y = -((mousePosition.current.y - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      const hasIntersection = raycaster.ray.intersectPlane(plane, intersection);

      if (hasIntersection && previewRef.current) {
        previewRef.current.position.set(intersection.x, 0, intersection.z);
        previewRef.current.visible = true;
      } else if (previewRef.current) {
        previewRef.current.visible = false;
      }
    } catch (e) {
      // Ignorer les erreurs de calcul
      console.warn('Erreur dans useFrame EquipmentPlacer:', e);
    }
  });

  // Rendu de l'aperçu - formes simples avec les mêmes dimensions que les vrais composants
  const renderPreview = () => {
    if (placementMode === 'none') return null;

    return (
      <group ref={previewRef} visible={false}>
        {placementMode === 'container' && (
          <mesh>
            <boxGeometry args={[12.196, 2.896, 2.438]} />
            <meshStandardMaterial
              color="#8AFD81"
              transparent
              opacity={0.5}
              emissive="#8AFD81"
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
        {placementMode === 'transformer' && (
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 2.5, 16]} />
            <meshStandardMaterial
              color="#8AFD81"
              transparent
              opacity={0.5}
              emissive="#8AFD81"
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
        {placementMode === 'switchgear' && (
          <mesh>
            <boxGeometry args={[2.5, 1.5, 2]} />
            <meshStandardMaterial
              color="#8AFD81"
              transparent
              opacity={0.5}
              emissive="#8AFD81"
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
        {placementMode === 'generator' && (
          <mesh>
            <boxGeometry args={[3, 2, 2]} />
            <meshStandardMaterial
              color="#8AFD81"
              transparent
              opacity={0.5}
              emissive="#8AFD81"
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
        {placementMode === 'gravel' && (
          <mesh>
            <planeGeometry args={[5, 5]} />
            <meshStandardMaterial
              color="#8AFD81"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    );
  };

  // Rendu des équipements placés
  const renderPlacedEquipment = () => {
    return placedEquipment.map((equipment) => {
      switch (equipment.type) {
        case 'container':
          return (
            <group key={equipment.id} position={equipment.position}>
              <HD5ContainerUltraSimplified
                position={[0, 0, 0]}
                containerId={equipment.id}
                onSelect={() => {}}
                isSelected={false}
              />
            </group>
          );
        case 'transformer':
          return (
            <group key={equipment.id} position={equipment.position}>
              <Transformer3D
                position={[0, 0, 0]}
                transformerId={equipment.id}
                onSelect={() => {}}
                isSelected={false}
              />
            </group>
          );
        case 'switchgear':
          return (
            <group key={equipment.id} position={equipment.position}>
              <Switchgear3D
                position={[0, 0, 0]}
                switchgearId={equipment.id}
                onSelect={() => {}}
                isSelected={false}
              />
            </group>
          );
        case 'generator':
          return (
            <mesh key={equipment.id} position={equipment.position}>
              <boxGeometry args={[3, 2, 2]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
            </mesh>
          );
        case 'gravel':
          return (
            <mesh key={equipment.id} position={equipment.position} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[5, 5]} />
              <meshStandardMaterial
                color="#9ca3af"
                roughness={0.9}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      {/* Sol invisible pour les intersections - seulement en mode placement */}
      {placementMode !== 'none' && (
        <mesh ref={groundRef} position={[0, 0, 0]} visible={false}>
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Aperçu de l'équipement à placer - seulement en mode placement */}
      {placementMode !== 'none' && renderPreview()}

      {/* Équipements placés - toujours affichés si alwaysRender est true, sinon seulement en mode placement */}
      {(alwaysRender || placementMode !== 'none') && renderPlacedEquipment()}
    </>
  );
}

