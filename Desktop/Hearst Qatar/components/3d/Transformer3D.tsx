import { useRef, useMemo } from 'react';
import { Mesh, Group } from 'three';
import * as THREE from 'three';
import { createAdvancedMetalMaterial, createConcreteMaterial } from '../../utils/materialHelpers';

interface Transformer3DProps {
  position: [number, number, number];
  transformerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Transformateur industriel réaliste de 3,5 MW
 * Cuve principale avec radiateurs, bushings HT/BT, matériaux PBR
 * 
 * Dimensions ajustées par rapport aux autres éléments :
 * - Container HD5 : 12.196m × 2.438m × 2.896m
 * - Power Block 25 MW : 18m × 6m × 5m
 * - Transformateur 3,5 MW : ~3m × ~2.5m × ~2.5m
 * 
 * Un transformateur de 3,5 MW est plus petit qu'un container mais plus grand
 * qu'un équipement standard. Dimensions réalistes pour un transformateur 3,5 MVA.
 */
export default function Transformer3D({ 
  position, 
  transformerId, 
  onSelect,
  isSelected = false 
}: Transformer3DProps) {
  const groupRef = useRef<Group>(null);

  // Matériaux mémorisés pour de meilleures performances
  const concreteMaterial = useMemo(() => createConcreteMaterial(), []);
  const transformerBodyMaterial = useMemo(() => {
    const mat = createAdvancedMetalMaterial('#059669', 0.2, 0.5);
    if (isSelected) {
      mat.emissive = new THREE.Color('#047857');
      mat.emissiveIntensity = 0.2;
    }
    return mat;
  }, [isSelected]);
  const metalBandMaterial = useMemo(() => createAdvancedMetalMaterial('#374151', 0.7, 0.3), []);
  const radiatorMaterial = useMemo(() => createAdvancedMetalMaterial('#6b7280', 0.7, 0.4), []);
  const finMaterial = useMemo(() => createAdvancedMetalMaterial('#94a3b8', 0.8, 0.3), []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(transformerId);
    }
  };

  return (
    <group 
      ref={groupRef} 
      position={position}
      name={transformerId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Socle en béton renforcé avec texture réaliste - Ajusté pour 3,5 MW */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.5, 0.6, 3]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>
      
      {/* Vis de fixation du socle - Ajustées pour nouvelle échelle */}
      {([
        [-1.4, 0.3, -1.1],
        [1.4, 0.3, -1.1],
        [-1.4, 0.3, 1.1],
        [1.4, 0.3, 1.1],
      ] as const).map((pos, i) => (
        <mesh key={`foundation-bolt-${i}`} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Cuve principale (acier peint vert industriel) avec matériau amélioré - Ajustée pour 3,5 MW */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.5, 2.5]} />
        <primitive object={transformerBodyMaterial} attach="material" />
      </mesh>
      
      {/* Bandes de renfort horizontales (plusieurs) - Ajustées pour nouvelle échelle */}
      {[0.8, 1.6, 2.4].map((yPos, i) => (
        <mesh key={`band-${i}`} position={[0, yPos, 1.26]} castShadow>
          <boxGeometry args={[3.1, 0.3, 0.1]} />
          <primitive object={metalBandMaterial} attach="material" />
        </mesh>
      ))}
      
      {/* Vis de fixation des bandes - Ajustées pour nouvelle échelle */}
      {[0.8, 1.6, 2.4].map((yPos, i) => (
        <group key={`band-screws-${i}`}>
          {[-1.4, 1.4].map((xPos, j) => (
            <mesh
              key={`screw-${i}-${j}`}
              position={[xPos, yPos, 1.31]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
              <meshStandardMaterial
                color="#1f2937"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Radiateurs verticaux (5 radiateurs avec ailettes détaillées) - Ajustés pour 3,5 MW */}
      {Array.from({ length: 5 }).map((_, i) => {
        const xPos = -1.2 + i * 0.6;
        return (
          <group key={`radiator-${i}`} position={[xPos, 1.6, 1.3]}>
            {/* Structure principale du radiateur */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 2.2, 0.15]} />
              <primitive object={radiatorMaterial} attach="material" />
            </mesh>
            {/* Ailettes de refroidissement (plus nombreuses et détaillées) */}
            {Array.from({ length: 10 }).map((_, j) => (
              <mesh
                key={`fin-${j}`}
                position={[0, -1.1 + j * 0.22, 0.08]}
                castShadow
              >
                <boxGeometry args={[0.25, 0.02, 0.1]} />
                <primitive object={finMaterial} attach="material" />
              </mesh>
            ))}
            {/* Tubes de connexion en haut et en bas */}
            <mesh position={[0, 1.15, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, -1.15, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
              <meshStandardMaterial
                color="#4b5563"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Bushings HT (3 en haut - haute tension) - Ajustés pour nouvelle échelle */}
      {[0, 1, 2].map((i) => (
        <group key={`bushing-ht-${i}`} position={[-1 + i * 1, 2.9, 0]}>
          {/* Isolateur principal */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.0}
              roughness={0.1}
            />
          </mesh>
          {/* Capuchon métallique */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.15, 0.12, 16]} />
            <meshStandardMaterial 
              color="#fbbf24" 
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Bushings BT (3 sur le côté - basse tension) - Ajustés pour nouvelle échelle */}
      {[0, 1, 2].map((i) => (
        <group key={`bushing-bt-${i}`} position={[1.6, 0.3 + i * 0.8, 0]}>
          {/* Isolateur */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.35, 16]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.0}
              roughness={0.1}
            />
          </mesh>
          {/* Capuchon */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.08, 16]} />
            <meshStandardMaterial 
              color="#6b7280" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Indicateur de niveau d'huile - Ajusté pour nouvelle échelle */}
      <mesh position={[-1.6, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Plaque d'identification avec détails - Ajustée pour nouvelle échelle */}
      <group position={[0, 0.5, 1.26]}>
        <mesh castShadow>
          <boxGeometry args={[1, 0.3, 0.05]} />
          <meshStandardMaterial 
            color="#1f2937" 
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
        {/* Bordure de la plaque */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.1, 0.4, 0.02]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Vis de fixation de la plaque */}
        {[-0.5, 0.5].map((xPos, i) => (
          <mesh key={`plate-screw-${i}`} position={[xPos, 0, 0.06]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
      
      {/* Câbles de connexion HT - Ajustés pour nouvelle échelle */}
      {[0, 1, 2].map((i) => (
        <group key={`ht-cable-${i}`} position={[-1 + i * 1, 2.9, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.25, 16]} />
            <meshStandardMaterial
              color="#1f2937"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Isolation du câble */}
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
            <meshStandardMaterial
              color="#374151"
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

