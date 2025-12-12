import { useRef } from 'react';
import { Group } from 'three';
import * as THREE from 'three';

interface AsphaltRoad3DProps {
  position: [number, number, number];
  length: number;
  width: number;
  orientation?: 'horizontal' | 'vertical'; // horizontal = le long de X, vertical = le long de Z
  material?: 'asphalt' | 'concrete';
  showCenterLine?: boolean;
  showEdgeLines?: boolean;
}

/**
 * Route en asphalte ou béton avec marquage au sol
 * Pour la circulation routière externe et interne du site
 */
export default function AsphaltRoad3D({
  position,
  length,
  width,
  orientation = 'vertical',
  material = 'asphalt',
  showCenterLine = true,
  showEdgeLines = false,
}: AsphaltRoad3DProps) {
  const groupRef = useRef<Group>(null);

  // Dimensions selon l'orientation
  const roadWidth = orientation === 'horizontal' ? length : width;
  const roadDepth = orientation === 'horizontal' ? width : length;

  // Couleurs selon le matériau
  const baseColor = material === 'asphalt' ? '#2A2A2A' : '#808080';
  const roughness = material === 'asphalt' ? 0.9 : 0.85;

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== SURFACE DE LA ROUTE ==================== */}
      
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[roadWidth, 0.1, roadDepth]} />
        <meshStandardMaterial
          color={baseColor}
          metalness={0.0}
          roughness={roughness}
        />
      </mesh>

      {/* ==================== TEXTURE PROCÉDURALE ==================== */}
      
      {/* Asphalte : texture granuleuse */}
      {material === 'asphalt' && Array.from({ length: Math.floor(roadWidth / 3) }).map((_, i) => {
        return Array.from({ length: Math.floor(roadDepth / 3) }).map((_, j) => {
          const offsetX = -roadWidth / 2 + i * 3 + 1.5;
          const offsetZ = -roadDepth / 2 + j * 3 + 1.5;
          const randomHeight = Math.random() * 0.015;
          const randomGray = 0.1 + Math.random() * 0.05;
          
          return (
            <mesh
              key={`asphalt-grain-${i}-${j}`}
              position={[
                offsetX + (Math.random() - 0.5) * 0.8,
                0.06 + randomHeight,
                offsetZ + (Math.random() - 0.5) * 0.8
              ]}
              rotation={[0, Math.random() * Math.PI, 0]}
            >
              <boxGeometry args={[
                0.4 + Math.random() * 0.3,
                0.005,
                0.4 + Math.random() * 0.3
              ]} />
              <meshStandardMaterial
                color={new THREE.Color(randomGray, randomGray, randomGray)}
                metalness={0.0}
                roughness={0.95}
              />
            </mesh>
          );
        });
      })}

      {/* Béton : dalles avec joints */}
      {material === 'concrete' && (
        <>
          {/* Joints horizontaux (tous les 4m) */}
          {Array.from({ length: Math.floor(roadDepth / 4) }).map((_, i) => {
            const z = -roadDepth / 2 + i * 4;
            return (
              <mesh key={`joint-h-${i}`} position={[0, 0.055, z]}>
                <boxGeometry args={[roadWidth, 0.01, 0.03]} />
                <meshStandardMaterial
                  color="#5A5A5A"
                  roughness={0.9}
                />
              </mesh>
            );
          })}

          {/* Joints verticaux (tous les 4m si route assez large) */}
          {roadWidth > 5 && Array.from({ length: Math.floor(roadWidth / 4) }).map((_, i) => {
            const x = -roadWidth / 2 + i * 4;
            return (
              <mesh key={`joint-v-${i}`} position={[x, 0.055, 0]}>
                <boxGeometry args={[0.03, 0.01, roadDepth]} />
                <meshStandardMaterial
                  color="#5A5A5A"
                  roughness={0.9}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* ==================== MARQUAGE AU SOL ==================== */}
      
      {/* Ligne centrale blanche (si route à 2 voies) */}
      {showCenterLine && width >= 6 && orientation === 'vertical' && (
        <>
          {/* Ligne discontinue */}
          {Array.from({ length: Math.floor(roadDepth / 8) }).map((_, i) => (
            <mesh key={`center-line-${i}`} position={[0, 0.065, -roadDepth / 2 + i * 8 + 2]}>
              <boxGeometry args={[0.12, 0.002, 4]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.1}
                roughness={0.8}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Ligne centrale pour route horizontale */}
      {showCenterLine && width >= 6 && orientation === 'horizontal' && (
        <>
          {Array.from({ length: Math.floor(roadWidth / 8) }).map((_, i) => (
            <mesh key={`center-line-h-${i}`} position={[-roadWidth / 2 + i * 8 + 2, 0.065, 0]}>
              <boxGeometry args={[4, 0.002, 0.12]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.1}
                roughness={0.8}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Lignes de bord blanches */}
      {showEdgeLines && (
        <>
          {/* Ligne gauche */}
          <mesh position={[-roadWidth / 2 + 0.2, 0.065, 0]}>
            <boxGeometry args={[0.1, 0.002, roadDepth * 0.95]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.1}
              roughness={0.8}
            />
          </mesh>

          {/* Ligne droite */}
          <mesh position={[roadWidth / 2 - 0.2, 0.065, 0]}>
            <boxGeometry args={[0.1, 0.002, roadDepth * 0.95]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={0.1}
              roughness={0.8}
            />
          </mesh>
        </>
      )}

      {/* ==================== BORDURES ==================== */}
      
      {/* Bordure gauche */}
      <mesh position={[-roadWidth / 2, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.16, roadDepth]} />
        <meshStandardMaterial
          color="#6A6A6A"
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>

      {/* Bordure droite */}
      <mesh position={[roadWidth / 2, 0.08, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.16, roadDepth]} />
        <meshStandardMaterial
          color="#6A6A6A"
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>

      {/* ==================== ACCOTEMENTS (bandes latérales) ==================== */}
      
      {/* Accotement gauche */}
      <mesh position={[-roadWidth / 2 - 0.5, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1, 0.04, roadDepth + 1]} />
        <meshStandardMaterial
          color="#7A7A7A"
          metalness={0.0}
          roughness={0.95}
        />
      </mesh>

      {/* Accotement droit */}
      <mesh position={[roadWidth / 2 + 0.5, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1, 0.04, roadDepth + 1]} />
        <meshStandardMaterial
          color="#7A7A7A"
          metalness={0.0}
          roughness={0.95}
        />
      </mesh>

      {/* ==================== FISSURES ET USURE (détails réalistes) ==================== */}
      
      {material === 'asphalt' && (
        <>
          {/* Quelques fissures aléatoires */}
          {Array.from({ length: 3 }).map((_, i) => {
            const randomX = (Math.random() - 0.5) * roadWidth * 0.7;
            const randomZ = (Math.random() - 0.5) * roadDepth * 0.7;
            const randomRotation = Math.random() * Math.PI;
            const crackLength = 1 + Math.random() * 2;
            
            return (
              <mesh
                key={`crack-${i}`}
                position={[randomX, 0.055, randomZ]}
                rotation={[0, randomRotation, 0]}
              >
                <boxGeometry args={[0.02, 0.001, crackLength]} />
                <meshStandardMaterial
                  color="#1A1A1A"
                  roughness={0.95}
                />
              </mesh>
            );
          })}

          {/* Taches d'huile */}
          {Array.from({ length: 2 }).map((_, i) => {
            const randomX = (Math.random() - 0.5) * roadWidth * 0.6;
            const randomZ = (Math.random() - 0.5) * roadDepth * 0.6;
            
            return (
              <mesh
                key={`oil-stain-${i}`}
                position={[randomX, 0.056, randomZ]}
                rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
              >
                <circleGeometry args={[0.3 + Math.random() * 0.3, 16]} />
                <meshStandardMaterial
                  color="#0A0A0A"
                  metalness={0.3}
                  roughness={0.6}
                  transparent
                  opacity={0.4}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* ==================== PASSAGE PIÉTON (si à une extrémité) ==================== */}
      
      {material === 'asphalt' && roadDepth > 20 && (
        <group position={[0, 0.065, roadDepth / 2 - 2]}>
          {/* Bandes blanches du passage piéton */}
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={`zebra-${i}`} position={[-roadWidth / 2 + 0.5 + i * (roadWidth / 8), 0, 0]}>
              <boxGeometry args={[roadWidth / 9, 0.002, 2.5]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.15}
                roughness={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ==================== PANNEAUX ROUTIERS ==================== */}
      
      {/* Panneau limitation de vitesse (30 km/h) */}
      {roadDepth > 30 && (
        <group position={[roadWidth / 2 + 2, 0, roadDepth / 4]}>
          {/* Poteau */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 3, 12]} />
            <meshStandardMaterial
              color="#4A4A4A"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>

          {/* Panneau circulaire rouge */}
          <mesh position={[0, 3, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.04, 32]} />
            <meshStandardMaterial
              color="#EF4444"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>

          {/* Cercle blanc intérieur */}
          <mesh position={[0, 3, 0.025]} rotation={[0, -Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.01, 32]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>

          {/* Chiffre "30" simplifié (rectangle) */}
          <mesh position={[0, 3, 0.03]} rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[0.25, 0.15, 0.005]} />
            <meshStandardMaterial
              color="#1A1A1A"
              roughness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Panneau directionnel */}
      {roadDepth > 40 && (
        <group position={[-roadWidth / 2 - 2, 0, -roadDepth / 4]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 3, 12]} />
            <meshStandardMaterial
              color="#4A4A4A"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>

          {/* Flèche directionnelle */}
          <mesh position={[0, 3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <boxGeometry args={[1.5, 0.5, 0.04]} />
            <meshStandardMaterial
              color="#2563EB"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>

          {/* Flèche (triangle) */}
          <mesh position={[0.8, 3, 0.03]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.15, 0.3, 3]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.7}
            />
          </mesh>
        </group>
      )}

      {/* ==================== ÉCLAIRAGE ROUTIER (si route longue) ==================== */}
      
      {roadDepth > 30 && Array.from({ length: Math.floor(roadDepth / 25) }).map((_, i) => {
        const z = -roadDepth / 2 + (i + 1) * 25;
        
        return (
          <group key={`street-light-${i}`} position={[roadWidth / 2 + 1.5, 0, z]}>
            {/* Poteau */}
            <mesh position={[0, 4, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 8, 12]} />
              <meshStandardMaterial
                color="#3A3A3A"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>

            {/* Luminaire */}
            <mesh position={[0, 8, 0]} castShadow>
              <boxGeometry args={[0.3, 0.2, 0.3]} />
              <meshStandardMaterial
                color="#2A2A2A"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Zone lumineuse */}
            <mesh position={[0, 7.85, 0]}>
              <boxGeometry args={[0.25, 0.15, 0.25]} />
              <meshStandardMaterial
                color="#FFF8DC"
                emissive="#FFF8DC"
                emissiveIntensity={0.4}
              />
            </mesh>

            {/* Lumière ponctuelle */}
            <pointLight
              position={[0, 8, 0]}
              intensity={2.5}
              distance={30}
              decay={2}
              color="#FFF8DC"
            />
          </group>
        );
      })}
    </group>
  );
}


