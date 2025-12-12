import { useRef, useMemo } from 'react';
import { Mesh, Group } from 'three';
import * as THREE from 'three';
import { createAdvancedMetalMaterial, createConcreteMaterial } from '../../utils/materialHelpers';

interface PowerBlock3DProps {
  position: [number, number, number];
  powerBlockId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Power Block industriel réaliste de 25 MW
 * Structure métallique avec panneaux électriques et équipements
 * 
 * Dimensions ajustées par rapport au container HD5 (12.196m × 2.438m × 2.896m) :
 * - Longueur : 18m (≈1.5× le container)
 * - Largeur : 6m (≈2.5× le container)
 * - Hauteur : 5m (≈1.7× le container)
 * 
 * Ces dimensions sont réalistes pour un power block de 25 MW contenant
 * transformateurs, switchgears et équipements de distribution électrique.
 */
export default function PowerBlock3D({ 
  position, 
  powerBlockId, 
  onSelect,
  isSelected = false 
}: PowerBlock3DProps) {
  const groupRef = useRef<Group>(null);

  // Matériaux mémorisés pour de meilleures performances
  const concreteMaterial = useMemo(() => createConcreteMaterial(), []);
  const metalMaterial = useMemo(() => createAdvancedMetalMaterial('#4b5563', 0.7, 0.35), []);
  const darkMetalMaterial = useMemo(() => createAdvancedMetalMaterial('#374151', 0.8, 0.3), []);
  const selectedMaterial = useMemo(() => {
    const mat = createAdvancedMetalMaterial('#4a9eff', 0.7, 0.35);
    mat.emissive = new THREE.Color('#1e40af');
    mat.emissiveIntensity = 0.3;
    return mat;
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(powerBlockId);
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position} 
      name={powerBlockId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Socle en béton avec texture réaliste - Dimensionné par rapport au container HD5 (12.196m) */}
      {/* Power Block 25 MW : ~18m × ~6m × ~5m (1.5x container en longueur, 2.5x en largeur, 1.7x en hauteur) */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[20, 0.6, 7]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Structure principale du Power Block avec matériau amélioré */}
      {/* Dimensions ajustées : 18m (longueur) × 5m (hauteur) × 6m (profondeur) */}
      <mesh 
        position={[0, 2.8, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[18, 5, 6]} />
        <primitive object={isSelected ? selectedMaterial : metalMaterial} attach="material" />
      </mesh>
      
      {/* Panneaux électriques latéraux (avec détails) */}
      <mesh position={[9, 2.8, 0]} castShadow>
        <boxGeometry args={[0.3, 4.5, 5.5]} />
        <primitive object={darkMetalMaterial} attach="material" />
      </mesh>
      
      <mesh position={[-9, 2.8, 0]} castShadow>
        <boxGeometry args={[0.3, 4.5, 5.5]} />
        <primitive object={darkMetalMaterial} attach="material" />
      </mesh>
      
      {/* Vis de fixation sur les panneaux latéraux - Ajustées pour nouvelle échelle */}
      {Array.from({ length: 10 }).map((_, i) => {
        const yPos = 0.5 + (i % 5) * 1;
        const zPos = (i < 5 ? 1 : -1) * 2.75;
        return (
          <mesh
            key={`screw-left-${i}`}
            position={[9.16, yPos, zPos]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        );
      })}
      
      {Array.from({ length: 10 }).map((_, i) => {
        const yPos = 0.5 + (i % 5) * 1;
        const zPos = (i < 5 ? 1 : -1) * 2.75;
        return (
          <mesh
            key={`screw-right-${i}`}
            position={[-9.16, yPos, zPos]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        );
      })}

      {/* Panneaux avant et arrière avec détails - Ajustés pour nouvelle échelle */}
      <mesh position={[0, 2.8, 3]} castShadow>
        <boxGeometry args={[18, 4.5, 0.3]} />
        <primitive object={darkMetalMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 2.8, -3]} castShadow>
        <boxGeometry args={[18, 4.5, 0.3]} />
        <primitive object={darkMetalMaterial} attach="material" />
      </mesh>
      
      {/* Panneaux de contrôle avec écrans LED - Ajustés pour nouvelle échelle */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={`control-panel-${i}`} position={[-6.5 + i * 4.3, 5.3, 3.06]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.5, 0.1]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Écran LED */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[2, 1, 0.05]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Grilles de ventilation (côtés) - Ajustées pour nouvelle échelle */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`vent-left-${i}`}
          position={[9.16, 1.5 + i * 1, 0]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.8, 0.8]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.8}
            roughness={0.2}
            opacity={0.6}
            transparent
          />
        </mesh>
      ))}

      {/* Disjoncteurs principaux (en haut) - Ajustés pour nouvelle échelle */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`breaker-${i}`}
          position={[-6.5 + i * 4.3, 5.5, 0]}
          castShadow
        >
          <boxGeometry args={[2, 0.5, 1.5]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Câbles de sortie (vers les transformateurs) avec isolation - Ajustés pour nouvelle échelle */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`cable-${i}`} position={[-7.5 + i * 3, 0.5, -3.5]}>
          {/* Câble principal */}
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Isolation extérieure */}
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 1, 16]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
          {/* Connecteur métallique en bas */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.2, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
      
      {/* Câbles de connexion entre panneaux - Ajustés pour nouvelle échelle */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`internal-cable-${i}`}
          position={[-5.5 + i * 5.5, 4.5, 0]}
          castShadow
        >
          <boxGeometry args={[3, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

